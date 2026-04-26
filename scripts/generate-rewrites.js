const fs = require('fs');
const path = require('path');

async function generateRewrites() {
  try {
    const dataPath = path.join(__dirname, '..', 'public', 'products-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    const rewrites = data.products
      .filter(product => product.sku && product.slug)
      .map(product => ({
        source: `/producto/${product.sku}`,
        destination: `/producto/${product.slug}`,
        permanent: true
      }));
    
    const outputPath = path.join(__dirname, '..', 'public', 'sku-rewrites.json');
    fs.writeFileSync(outputPath, JSON.stringify(rewrites, null, 2));
    
    console.log(`✅ Generados ${rewrites.length} rewrites de SKU → slug`);
    console.log(`📁 Archivo: ${outputPath}`);
    
    // También generar un mapa para uso en runtime (opcional)
    const skuToSlugMap = {};
    data.products.forEach(product => {
      if (product.sku && product.slug) {
        skuToSlugMap[product.sku] = product.slug;
      }
    });
    
    const mapPath = path.join(__dirname, '..', 'public', 'sku-to-slug-map.json');
    fs.writeFileSync(mapPath, JSON.stringify(skuToSlugMap, null, 2));
    console.log(`🗺️  Mapa SKU→slug generado: ${mapPath}`);
    
  } catch (error) {
    console.error('❌ Error generando rewrites:', error);
    process.exit(1);
  }
}

generateRewrites();