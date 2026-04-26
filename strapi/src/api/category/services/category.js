'use strict';

/**
 * categoria service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::category.category');