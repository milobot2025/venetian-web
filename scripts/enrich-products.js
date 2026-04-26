const fs = require('fs');
const path = require('path');
const { scrapeMercadoLibre } = require('./scrape-mercadolibre');

// Rutas
const productsDataPath = path.join(__dirname, '../strapi/scripts/products-data.json');
const mappingPath = path.join(__dirname, 'mapping.json');
const enrichedOutputPath = path.join(__dirname, '../strapi/scripts/products-data-enriched.json');
const frontendOutputPath = path.join(__dirname, '../public/products-data.json');

// Cargar datos existentes
console.log('Cargando productos desde', productsDataPath);
const rawData = fs.readFileSync(productsDataPath, 'utf8');
const data = JSON.parse(rawData);
const products = data.products;
console.log(`Total productos: ${products.length}`);

// Cargar mapeo modelo -> URL
console.log('Cargando mapeo desde', mappingPath);
let mapping = {};
if (fs.existsSync(mappingPath)) {
    const mappingRaw = fs.readFileSync(mappingPath, 'utf8');
    mapping = JSON.parse(mappingRaw);
    console.log(`Mapeo cargado: ${Object.keys(mapping).length} entradas`);
} else {
    console.log('⚠️  Archivo de mapeo no encontrado. Creando ejemplo...');
    mapping = {
        'VT-B100': 'https://www.mercadolibre.com.ar/venetian-vt-b100-cabezal-movil-beam-led-100w/p/MLA53396603'
    };
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
    console.log('Ejemplo guardado en', mappingPath);
}

// Función para encontrar producto por modelo (case-insensitive)
function findProductByModel(model) {
    const modelLower = model.toLowerCase().trim();
    return products.find(p => 
        p.modelo && p.modelo.toLowerCase().trim() === modelLower
    );
}

// Procesar cada entrada del mapeo
async function enrichProducts() {
    const enriched = [...products];
    const updatedModels = new Set();
    
    for (const [model, url] of Object.entries(mapping)) {
        console.log(`\n🔍 Procesando ${model} -> ${url}`);
        const product = findProductByModel(model);
        if (!product) {
            console.log(`⚠️  Producto con modelo "${model}" no encontrado en catálogo.`);
            continue;
        }
        
        if (updatedModels.has(product.modelo)) {
            console.log(`⏭️  Producto ${product.modelo} ya actualizado, saltando.`);
            continue;
        }
        
        try {
            console.log(`📦 Scraping ${url}`);
            const scrapedData = await scrapeMercadoLibre(url);
            
            // Actualizar producto
            product.fullDescription = scrapedData.description;
            product.images = scrapedData.imageUrls;
            product.externalUrl = url;
            product.priceML = scrapedData.price;
            product.brand = scrapedData.brand || product.brand;
            product.specifications = scrapedData.specifications;
            product.lastUpdated = new Date().toISOString();
            
            console.log(`✅ ${product.modelo} actualizado con ${scrapedData.imageUrls.length} imágenes`);
            updatedModels.add(product.modelo);
            
            // Esperar para no saturar
            await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
            console.error(`❌ Error scraping ${model}:`, error.message);
        }
    }
    
    console.log(`\n📊 Total productos actualizados: ${updatedModels.size}`);
    return enriched;
}

// Ejecutar enriquecimiento
(async () => {
    try {
        const enrichedProducts = await enrichProducts();
        
        // Crear objeto de datos enriquecido
        const enrichedData = {
            ...data,
            products: enrichedProducts,
            meta: {
                ...data.meta,
                enriched: new Date().toISOString(),
                enrichedCount: enrichedProducts.filter(p => p.images).length
            }
        };
        
        // Guardar en backend
        fs.writeFileSync(enrichedOutputPath, JSON.stringify(enrichedData, null, 2), 'utf8');
        console.log(`\n💾 Datos enriquecidos guardados en ${enrichedOutputPath}`);
        
        // Guardar en frontend (public/)
        fs.writeFileSync(frontendOutputPath, JSON.stringify(enrichedData, null, 2), 'utf8');
        console.log(`💾 Datos frontend actualizados en ${frontendOutputPath}`);
        
        // Mostrar resumen
        const withImages = enrichedProducts.filter(p => p.images && p.images.length > 0).length;
        const withFullDesc = enrichedProducts.filter(p => p.fullDescription).length;
        console.log(`\n🎯 Resumen:`);
        console.log(`   Productos con imágenes: ${withImages}`);
        console.log(`   Productos con descripción completa: ${withFullDesc}`);
        console.log(`   Total productos: ${enrichedProducts.length}`);
        
    } catch (error) {
        console.error('Error en enriquecimiento:', error);
        process.exit(1);
    }
})();