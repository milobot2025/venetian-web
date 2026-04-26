'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::producto.producto', ({ strapi }) => ({
  async findFeatured(ctx) {
    try {
      const results = await strapi.entityService.findMany('api::producto.producto', {
        ...ctx.query,
        filters: { ...ctx.query.filters, featured: true },
      });
      return { data: results };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async findByCategory(ctx) {
    try {
      const { categoriaId } = ctx.params;
      if (!categoriaId) return ctx.badRequest('categoriaId requerido');
      const results = await strapi.entityService.findMany('api::producto.producto', {
        ...ctx.query,
        filters: { ...ctx.query.filters, category: categoriaId },
      });
      return { data: results };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
