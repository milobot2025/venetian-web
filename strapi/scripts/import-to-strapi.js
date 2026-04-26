const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DATA_FILE = path.join(__dirname, 'products-data.json');
const BASE_URL = 'http://localhost:1338';

// Token de API full-access (leído de api_key.txt si existe)
let STRAPI_TOKEN = '18e181fbf220277d26e872965cea63e51a199360448fa391246b948238907d18b5752d182b26690b233b497d5631fc1b8a04d059a3d8f65838aad1b6c23491188881c2a7f09b9a4402ed554476d9f174f1cef7848a571739b8b0469537530bfa2761283842492e78f39c0db40f7492cd9411a1967114ed05484b730e96d1eef6';
const tokenFile = path.join(__dirname, '..', 'api_key.txt');
if (fs.existsSync(tokenFile)) {
    STRAPI_TOKEN = fs.readFileSync(tokenFile, 'utf8').trim();
}

// Función para esperar que Strapi esté listo
async function waitForStrapi(maxAttempts = 60, interval = 3000) {
    console.log('⏳ Esperando que Strapi esté listo...');
    for (let i = 1; i <= maxAttempts; i++) {
        try {
            const res = await fetch(`${BASE_URL}/admin/init`);
            if (res.ok) {
                console.log('✅ Strapi está listo');
                return true;
            }
        } catch (err) {
            // ignore
        }
        if (i % 5 === 0) {
            console.log(`   Intento ${i}/${maxAttempts}...`);
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error('Strapi no responde después de ' + maxAttempts + ' intentos');
}

// Iniciar Strapi si no está corriendo
async function ensureStrapiRunning() {
    try {
        const res = await fetch(`${BASE_URL}/admin/init`);
        if (res.ok) {
            console.log('✅ Strapi ya está corriendo');
            return;
        }
    } catch (err) {
        console.log('🔧 Strapi no detectado, intentando iniciar...');
    }
    
    console.log('🚀 Iniciando Strapi...');
    const logFile = path.join(__dirname, 'strapi-start.log');
    const strapiProcess = spawn('npm', ['run', 'develop'], {
        cwd: path.join(__dirname, '..'),
        detached: true,
        shell: true,
        stdio: ['ignore', fs.openSync(logFile, 'w'), fs.openSync(logFile, 'w')]
    });
    strapiProcess.unref();
    console.log(`   Proceso iniciado, logs en ${logFile}`);
    await waitForStrapi();
}

// Crear categorías si no existen
async function createOrGetCategories(rubros) {
    console.log(`📂 Procesando ${rubros.length} categorías...`);
    const categoryMap = {};
    
    for (const rubro of rubros) {
        // Verificar si ya existe
        const existingRes = await fetch(`${BASE_URL}/api/categories?filters[slug][$eq]=${rubro.slug}`, {
            headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
        });
        
        if (!existingRes.ok) {
            console.error(`   ❌ Error consultando categoría "${rubro.name}":`, await existingRes.text());
            continue;
        }
        
        const existing = await existingRes.json();
        
        if (existing.data && existing.data.length > 0) {
            categoryMap[rubro.name] = existing.data[0].id;
            console.log(`   ✅ Categoría "${rubro.name}" ya existe (ID: ${existing.data[0].id})`);
            continue;
        }
        
        // Crear nueva categoría
        const newCat = {
            data: {
                name: rubro.name,
                slug: rubro.slug,
                description: rubro.description,
            }
        };
        
        const createRes = await fetch(`${BASE_URL}/api/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_TOKEN}`
            },
            body: JSON.stringify(newCat),
        });
        
        if (!createRes.ok) {
            console.error(`   ❌ Error creando categoría "${rubro.name}":`, await createRes.text());
            continue;
        }
        
        const created = await createRes.json();
        categoryMap[rubro.name] = created.data.id;
        console.log(`   ✅ Categoría "${rubro.name}" creada (ID: ${created.data.id})`);
    }
    
    return categoryMap;
}

// Importar productos
async function importProducts(products, categoryMap) {
    console.log(`📦 Importando ${products.length} productos...`);
    
    let success = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const [index, product] of products.entries()) {
        // Verificar si ya existe (por slug)
        const existingRes = await fetch(`${BASE_URL}/api/productos?filters[slug][$eq]=${product.slug}`, {
            headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
        });
        
        if (!existingRes.ok) {
            console.error(`   ❌ Error consultando producto "${product.title}":`, await existingRes.text());
            errors++;
            continue;
        }
        
        const existing = await existingRes.json();
        
        if (existing.data && existing.data.length > 0) {
            console.log(`   ⏩ Producto "${product.title}" ya existe, omitiendo`);
            skipped++;
            continue;
        }
        
        // Preparar datos para Strapi
        const productData = {
            data: {
                title: product.title,
                slug: product.slug,
                description: product.description,
                price: parseFloat(product.price) || 0,
                stock: product.stock,
                featured: false,
                // category: product.rubro ? categoryMap[product.rubro] : null, // Comentado temporalmente por error 400
                categoryName: product.rubro,
                sku: product.sku,
                modelo: product.modelo,
            }
        };
        
        // Crear producto
        try {
            const createRes = await fetch(`${BASE_URL}/api/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${STRAPI_TOKEN}`
                },
                body: JSON.stringify(productData),
            });
            
            if (!createRes.ok) {
                const errorText = await createRes.text();
                console.error(`   ❌ Error creando producto "${product.title}":`, errorText);
                errors++;
                continue;
            }
            
            success++;
            if (success % 20 === 0) {
                console.log(`   Progreso: ${success}/${products.length}`);
            }
        } catch (err) {
            console.error(`   ❌ Error de red para "${product.title}":`, err.message);
            errors++;
        }
    }
    
    console.log(`\n📊 Resultado:`);
    console.log(`   ✅ Creados: ${success}`);
    console.log(`   ⏭️  Omitidos (ya existían): ${skipped}`);
    console.log(`   ❌ Errores: ${errors}`);
}

async function main() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            throw new Error(`Archivo de datos no encontrado: ${DATA_FILE}`);
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
        
        console.log('🚀 Iniciando importación a Strapi');
        console.log(`   Productos: ${data.meta.total}`);
        
        await ensureStrapiRunning();
        
        const categoryMap = await createOrGetCategories(data.rubros);
        await importProducts(data.products, categoryMap);
        
        console.log('\n🎉 Importación completada');
    } catch (error) {
        console.error('❌ Error crítico:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}