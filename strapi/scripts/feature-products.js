const { createStrapi } = require('@strapi/strapi');

async function feature() {
  console.log('⭐ Marcando productos destacados...');
  const instance = await createStrapi({ distDir: './dist' }).load();
  
  try {
    const products = await instance.documents('api::producto.producto').findMany({
      limit: 12, // Destacamos los primeros 12
      fields: ['documentId', 'title']
    });
    
    console.log(`📦 Procesando ${products.length} productos para destacar...`);
    let featured = 0;
    
    for (const prod of products) {
      await instance.documents('api::producto.producto').update({
        documentId: prod.documentId,
        data: {
          featured: true
        }
      });
      featured++;
    }
    
    console.log(`\n✅ ${featured} productos marcados como destacados.`);
  } catch (err) {
    console.error('❌ Error destacando:', err);
  } finally {
    process.exit(0);
  }
}

feature();