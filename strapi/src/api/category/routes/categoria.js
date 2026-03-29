'use strict';

/**
 * categoria router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// Para personalizar las rutas, consulta la documentación de Strapi:
// https://docs.strapi.io/dev-docs/backend-customization/routes

module.exports = createCoreRouter('api::category.category');
