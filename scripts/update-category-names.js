const fs = require('fs').promises;
const path = require('path');

const STRAPI_BASE_URL = 'http://localhost:1338/api';
const PRODUCTS_DATA_PATH = path.join(__dirname, '../public/products-data.json');
const TOKEN_PATH = path.join(__dirname, '../strapi/api_token.json');

async function loadToken() {
    try {
        const tokenData = await fs.readFile(TOKEN_PATH, 'utf8');
        const json = JSON.parse(tokenData);
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

async function loadProductsData() {
    try {
        const data = await fs.readFile(PRODUCTS_DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error cargando products-data.json:', error.message);
        process.exit(1);
    }
}

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

async function getProductBySlug(slug, token) {
    const response = await strapiRequest(`/productos?filters[slug][$eq]=${encodeURIComponent(slug)}`, 'GET', null, token);
    if (response && response.data && response.data.length > 0) {
        return response.data[0];
    }
    return null;
}

async function updateProductCategory(productId, categoryName, token) {
    const endpoint = `/productos/${productId}`;
    const data = {
        data: {
            categoryName
        }
    };
    const response = await strapiRequest(endpoint, 'PUT', data, token);
    return response !== null;
}

async function main() {
    console.log('🔄 Actualizando categorías en productos existentes...');
    
    const token = await loadToken();
    if (token) console.log('🔑 Token cargado');
    
    const productsData = await loadProductsData();
    console.log(`📊 ${productsData.products.length} productos en datos fuente`);
    
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const product of productsData.products) {
        const categoryName = product.rubro;
        if (!categoryName) {
            console.log(`⚠️  Producto ${product.title} sin rubro, saltando`);
            skipped++;
            continue;
        }
        
        // Buscar producto por slug
        const existing = await getProductBySlug(product.slug, token);
        if (!existing) {
            console.log(`⚠️  Producto ${product.title} no encontrado en Strapi`);
            skipped++;
            continue;
        }
        
        // Si ya tiene categoryName y coincide, saltar
        if (existing.categoryName === categoryName) {
            console.log(`✅ ${product.title} ya tiene categoría correcta`);
            skipped++;
            continue;
        }
        
        // Actualizar
        console.log(`✏️  Actualizando ${product.title} -> ${categoryName}`);
        const success = await updateProductCategory(existing.id, categoryName, token);
        if (success) {
            updated++;
        } else {
            errors++;
        }
        
        // Pausa
        await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    console.log('\n📊 Resumen:');
    console.log(`✅ ${updated} productos actualizados`);
    console.log(`⚠️  ${skipped} productos saltados`);
    console.log(`❌ ${errors} errores`);
}

if (require.main === module) {
    main().catch(error => {
        console.error('💥 Error fatal:', error);
        process.exit(1);
    });
}