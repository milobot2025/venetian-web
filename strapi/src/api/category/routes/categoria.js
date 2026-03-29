'use strict';

/**
 * categoria router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

console.log('CATEGORIA ROUTES LOADING');

module.exports = createCoreRouter('api::category.category');