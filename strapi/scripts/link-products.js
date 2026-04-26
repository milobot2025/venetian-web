const { createStrapi } = require('@strapi/strapi');

async function link() {
  console.log('🔗 Iniciando vinculación de productos y categorías...');
  const instance = await createStrapi({ distDir: './dist' }).load();
  
  try {
    const products = await instance.documents('api::producto.producto').findMany({
      limit: -1,
      fields: ['id', 'documentId', 'categoryName', 'title']
    });
    
    const categories = await instance.documents('api::category.category').findMany({
      limit: -1,
      fields: ['id', 'documentId', 'name']
    });
    
    const catMap = {};
    categories.forEach(c => {
      catMap[c.name] = c.documentId;
    });
    
    console.log(`📦 Procesando ${products.length} productos...`);
    let linked = 0;
    
    for (const prod of products) {
      if (prod.categoryName && catMap[prod.categoryName]) {
        await instance.documents('api::producto.producto').update({
          documentId: prod.documentId,
          data: {
            category: catMap[prod.categoryName]
          }
        });
        linked++;
        if (linked % 50 === 0) console.log(`   Vínculos creados: ${linked}...`);
      }
    }
    
    console.log(`\n✅ Vinculación completada: ${linked} productos vinculados.`);
  } catch (err) {
    console.error('❌ Error vinculando:', err);
  } finally {
    process.exit(0);
  }
}

link();