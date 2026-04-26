const strapi = require('@strapi/strapi');

async function test() {
  const app = await strapi({ distDir: './dist' }).load();
  try {
    const cat = await app.db.query('api::category.category').findOne({ where: { name: 'Test Category' } });
    if (!cat) {
      console.log('Category not found');
      return;
    }
    console.log('Found category:', cat);

    const prod = await app.service('api::producto.producto').create({
      data: {
        title: 'Test Product Internal',
        slug: 'test-product-internal',
        category: cat.id,
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