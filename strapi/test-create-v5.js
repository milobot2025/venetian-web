const strapi = require('@strapi/strapi');

async function test() {
  // In Strapi v5, the factory is a bit different if using the default export
  const instance = await strapi.createStrapi({ distDir: './dist' }).load();
  try {
    const cat = await instance.db.query('api::category.category').findOne({ where: { name: 'linga' } });
    if (!cat) {
      console.log('Category not found');
      return;
    }
    console.log('Found category:', cat);

    const prod = await instance.documents('api::producto.producto').create({
      data: {
        title: 'Test Product Internal V5',
        slug: 'test-product-internal-v5',
        category: cat.documentId,
      }
    });
    console.log('Created product internally:', prod);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

test();