'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::producto.producto', ({ strapi }) => {
  const productService = strapi.service('api::producto.producto');
  const baseController = createCoreController('api::producto.producto');

  return {
    ...baseController,
    async findFeatured(ctx) {
      try {
        const { query } = ctx;
        const { results, pagination } = await productService.find({
          ...query,
          filters: {
            ...query.filters,
            featured: true,
          },
        });
        return { data: results, meta: { pagination } };
      } catch (error) {
        ctx.throw(500, error);
      }
    },

    async findByCategory(ctx) {
      try {
        const { categoriaId } = ctx.params;
        if (!categoriaId) {
          return ctx.badRequest('categoriaId es requerido');
        }
        const { query } = ctx;
        const { results, pagination } = await productService.find({
          ...query,
          filters: {
            ...query.filters,
            category: categoriaId,
          },
        });
        return { data: results, meta: { pagination } };
      } catch (error) {
        ctx.throw(500, error);
      }
    },
  };
});
