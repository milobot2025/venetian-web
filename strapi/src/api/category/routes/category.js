'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/categories',
      handler: 'category.find',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/categories/:id',
      handler: 'category.findOne',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/categories',
      handler: 'category.create',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/categories/:id',
      handler: 'category.update',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/categories/:id',
      handler: 'category.delete',
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};