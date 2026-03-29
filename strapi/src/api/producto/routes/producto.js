'use strict';

/**
 * producto router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    ...createCoreRouter('api::producto.producto').routes,
    {
      method: 'GET',
      path: '/productos/destacados',
      handler: 'producto.findFeatured',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/productos/categoria/:categoriaId',
      handler: 'producto.findByCategory',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
