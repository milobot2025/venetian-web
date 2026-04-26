const fs = require('fs').promises;
const path = require('path');

// Configuración
const STRAPI_BASE_URL = 'http://localhost:1338/api';
const PRODUCTS_DATA_PATH = path.join(__dirname, '../public/products-data.json');
const TOKEN_PATH = path.join(__dirname, '../strapi/api_token.json');

// Cargar token desde api_token.json (formato: { "data": { "accessKey": "...", ... } })
async function loadToken() {
    try {
        const tokenData = await fs.readFile(TOKEN_PATH, 'utf8');
        const json = JSON.parse(tokenData);
        // El token está en json.data.accessKey
        const token = json.data?.accessKey;
        if (!token) {
            console.warn('⚠️  Token no encontrado, continuando sin autenticación');
            return null;
        }
        return token;
    } catch (error) {
        console.warn('⚠️  No se pudo cargar token, continuando sin autenticación:', error.message);
        return null;
    }
}

// Cargar datos de productos
async function loadProductsData() {
    try {
        const data = await fs.readFile(PRODUCTS_DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error cargando products-data.json:', error.message);
        process.exit(1);
    }
}

// Función para hacer requests a Strapi
async function strapiRequest(endpoint, method = 'GET', data = null, token) {
    const url = `${STRAPI_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Error ${response.status} en ${url}:`, errorText.substring(0, 200));
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`❌ Error de red en ${url}:`, error.message);
        return null;
    }
}

// Crear categoría si no existe, retornar ID
async function createCategory(categoryData, token) {
    const endpoint = '/categories';
    
    // Verificar si ya existe una categoría con este slug
    const checkResponse = await strapiRequest(`${endpoint}?filters[slug][$eq]=${encodeURIComponent(categoryData.slug)}`, 'GET', null, token);
    
    if (checkResponse && checkResponse.data && checkResponse.data.length > 0) {
        console.log(`⚠️  Categoría ya existe: ${categoryData.name} (${categoryData.slug})`);
        return checkResponse.data[0].id;
    }

    const response = await strapiRequest(endpoint, 'POST', { data: categoryData }, token);
    
    if (response && response.data) {
        console.log(`✅ Categoría creada: ${categoryData.name}`);
        return response.data.id;
    } else {
        console.log(`❌ Falló creación de categoría: ${categoryData.name}`);
        return null;
    }
}

// Función para generar slug único
async function generateUniqueSlug(baseSlug, token) {
    let slug = baseSlug;
    let suffix = 2;
    while (true) {
        const checkResponse = await strapiRequest(
            `/productos?filters[slug][$eq]=${encodeURIComponent(slug)}`,
            'GET',
            null,
            token
        );
        if (checkResponse && checkResponse.data && checkResponse.data.length > 0) {
            slug = `${baseSlug}-${suffix}`;
            suffix++;
        } else {
            break;
        }
    }
    return slug;
}

// Crear producto si no existe
async function createProduct(productData, token) {
    const endpoint = '/productos';
    
    // 1. Limpieza de campos
    productData.title = (productData.title || '').trim().replace(/\r?\n/g, ' ');
    productData.modelo = (productData.modelo || '').trim().replace(/\r?\n/g, ' ');
    productData.description = (productData.description || '').trim();
    productData.slug = (productData.slug || '').trim();
    
    // 2. Generar slug base si está vacío
    let baseSlug = productData.slug;
    if (!baseSlug) {
        baseSlug = (productData.title || '')
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    
    // 3. Asegurar slug único
    const uniqueSlug = await generateUniqueSlug(baseSlug, token);
    productData.slug = uniqueSlug;
    
    // 4. Verificar existencia (por si acaso)
    const checkResponse = await strapiRequest(
        `${endpoint}?filters[slug][$eq]=${encodeURIComponent(productData.slug)}`,
        'GET',
        null,
        token
    );
    
    if (checkResponse && checkResponse.data && checkResponse.data.length > 0) {
        console.log(`⚠️  Producto ya existe: ${productData.title} (${productData.slug})`);
        return false; // ya existe
    }

    // 5. Preparar datos del producto sin categoría (relación pendiente)
    const strapiProductData = {
        data: productData
    };

    const response = await strapiRequest(endpoint, 'POST', strapiProductData, token);
    
    if (response && response.data) {
        console.log(`✅ Producto creado: ${productData.title} (${productData.slug})`);
        return true;
    } else {
        console.log(`❌ Falló creación de producto: ${productData.title}`);
        return false;
    }
}

async function main() {
    console.log('🚀 Iniciando importación de datos a Strapi...');
    
    // Cargar token de autenticación
    const token = await loadToken();
    console.log('🔑 Token cargado correctamente');
    
    // Cargar datos de productos
    const productsData = await loadProductsData();
    console.log(`📊 Datos cargados: ${productsData.products.length} productos, ${productsData.rubros?.length || 0} categorías`);
    
    // Crear mapa de categorías para almacenar IDs generados (key: nombre de rubro)
    const categoryMap = new Map();
    
    // Paso 1: Crear categorías (rubros) si existen en rubros
    if (productsData.rubros && productsData.rubros.length > 0) {
        console.log('\n📁 Creando categorías...');
        for (const rubro of productsData.rubros) {
            const categoryData = {
                name: rubro.name,
                slug: rubro.slug,
                description: rubro.description || ''
            };
            
            const categoryId = await createCategory(categoryData, token);
            if (categoryId) {
                categoryMap.set(rubro.name, categoryId);
            }
            
            // Pequeña pausa para no sobrecargar el servidor
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    } else {
        // Si no hay rubros, extraer categorías únicas de los productos
        const uniqueRubros = [...new Set(productsData.products.map(p => p.rubro).filter(Boolean))];
        console.log(`\n📁 No hay rubros en JSON, creando ${uniqueRubros.length} categorías desde productos...`);
        for (const rubroName of uniqueRubros) {
            const slug = rubroName.toLowerCase().replace(/\s+/g, '-');
            const categoryData = {
                name: rubroName,
                slug: slug,
                description: `Categoría ${rubroName}`
            };
            
            const categoryId = await createCategory(categoryData, token);
            if (categoryId) {
                categoryMap.set(rubroName, categoryId);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // Paso 2: Crear productos
    console.log('\n📦 Creando productos...');
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
     const productsToImport = productsData.products;
     for (const product of productsToImport) {
        const categoryName = product.rubro;
        const categoryId = categoryMap.get(categoryName);
        // categoryId no se usa temporalmente debido a problemas de relación en Strapi
        
        // Preparar datos del producto para Strapi
        const productData = {
            title: product.title,
            slug: product.slug,
            description: product.description || '',
            price: product.price,
            stock: product.stock || 'available',
            sku: product.sku || '',
            modelo: product.modelo || '',
            featured: false,
            categoryName: categoryName || ''
        };
        
        const success = await createProduct(productData, token);
        
        if (success === true) {
            successCount++;
        } else if (success === false) {
            skipCount++; // Ya existía
        } else {
            errorCount++;
        }
        
        // Pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Resumen
    console.log('\n📊 Resumen de importación:');
    console.log(`✅ ${successCount} productos creados exitosamente`);
    console.log(`⚠️  ${skipCount} productos saltados (ya existían o sin categoría)`);
    console.log(`❌ ${errorCount} errores en creación`);
    console.log(`🗂️  ${categoryMap.size} categorías procesadas`);
    
    if (errorCount > 0) {
        console.log('\n💡 Algunos productos no pudieron crearse. Revisa los logs arriba.');
    } else {
        console.log('\n🎉 ¡Importación completada exitosamente!');
    }
}

// Ejecutar el script
if (require.main === module) {
    main().catch(error => {
        console.error('💥 Error fatal:', error);
        process.exit(1);
    });
}

module.exports = { main };