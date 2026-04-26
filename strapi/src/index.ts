import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions(strapi);
  },
};

async function setPublicPermissions(strapi: Core.Strapi) {
  try {
    // Obtener rol Public (id=2 por defecto)
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' }, populate: ['permissions'] });

    if (!publicRole) {
      console.log('[bootstrap] Rol public no encontrado');
      return;
    }

    const publicActions = [
      'api::producto.producto.find',
      'api::producto.producto.findOne',
      'api::category.category.find',
      'api::category.category.findOne',
    ];

    // Obtener permisos ya linkeados al rol Public
    const existingActions = new Set(
      (publicRole.permissions || []).map((p: any) => p.action)
    );

    for (const action of publicActions) {
      if (existingActions.has(action)) continue;

      // Crear permiso y linkear al rol en un solo paso con sintaxis v5
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action,
          role: publicRole.id,
        },
      });

      // Insertar el link en la tabla junction directamente
      const perm = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action } });

      if (perm) {
        // Usar knex para insertar el link directamente
        const knex = strapi.db.connection;
        const exists = await knex('up_permissions_role_lnk')
          .where({ permission_id: perm.id, role_id: publicRole.id })
          .first();

        if (!exists) {
          const maxOrd = await knex('up_permissions_role_lnk')
            .where({ role_id: publicRole.id })
            .max('permission_ord as max')
            .first();
          await knex('up_permissions_role_lnk').insert({
            permission_id: perm.id,
            role_id: publicRole.id,
            permission_ord: (maxOrd?.max || 0) + 1,
          });
          console.log(`[bootstrap] ✅ Permiso público linkeado: ${action}`);
        }
      }
    }

    console.log('[bootstrap] Permisos públicos OK');
  } catch (err) {
    console.error('[bootstrap] Error:', (err as Error).message);
  }
}
