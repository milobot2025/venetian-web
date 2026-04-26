# Configuración de permisos públicos en Strapi

Este directorio contiene scripts para habilitar acceso público a los content types `producto` y `category` en Strapi v5.

## Problema

Los endpoints `/api/productos` y `/api/categorias` devuelven 403/401 porque el rol **Public** no tiene permisos para las acciones `find` y `findOne`.

## Solución

El script `scripts/setup-permissions-v2.js` actualiza los permisos del rol **Public** usando:

1. **API token full‑access** (si está disponible y tiene permisos suficientes)
2. **Login de administrador** (fallback)

## Requisitos

- Node.js 18+ (fetch global)
- Strapi v5 ejecutándose en `http://localhost:1338` (o la URL definida en `STRAPI_URL`)
- Credenciales de admin: `admin@venetian.com` / `Admin123` (pueden cambiarse con variables de entorno)

## Uso

### 1. Asegurar que Strapi esté en ejecución

```bash
cd web-marca/strapi
npm run develop
```

En otra terminal, ejecutar el script:

```bash
cd web-marca/strapi
node scripts/setup-permissions-v2.js
```

### 2. Usar variables de entorno (opcional)

```bash
export STRAPI_URL=http://localhost:1338
export STRAPI_ADMIN_EMAIL=admin@example.com
export STRAPI_ADMIN_PASSWORD=otraclave
node scripts/setup-permissions-v2.js
```

### 3. Opción experimental: modificar la base de datos directamente

Si la API no funciona (por ejemplo, las rutas `/admin/*` devuelven HTML), puedes intentar modificar la base de datos SQLite directamente:

```bash
node scripts/setup-permissions-v2.js --use-db
```

**Nota:** Esta funcionalidad es experimental y puede no funcionar. Se recomienda usar la API.

## Estructura del script

- `fetchWithTimeout` – fetch con timeout
- `testConnection` – prueba conexión a Strapi
- `getApiToken` – lee `api_token.json`
- `adminLogin` – obtiene JWT via `/admin/login`
- `fetchRoles` – intenta múltiples endpoints (`/admin/users-permissions/roles`, `/admin/api/...`, `/api/...`)
- `updateRolePermissions` – actualiza el rol con los nuevos permisos
- `updatePermissionsViaDatabase` – (no implementado completamente) modifica `up_permissions`

## Si el script falla

### Error: "No se puede conectar a http://localhost:1338"

- Verifica que Strapi esté corriendo: `curl -f http://localhost:1338/api/productos` (debe devolver 401/403, no 404).
- Revisa los logs en `strapi.out` y `strapi.err`.

### Error: "Login falló"

- Comprueba las credenciales de admin en `.env` o variables de entorno.
- Puedes resetear la contraseña con:
  ```bash
  npx strapi admin:reset-password --email admin@venetian.com --password Admin123
  ```

### Error: "No se pudo obtener roles"

- El token utilizado no tiene permisos para gestionar roles.
- Intenta usar el login de administrador (el script lo hará automáticamente si el API token falla).
- Si las rutas `/admin/*` devuelven HTML, puede que el token JWT no sea válido. Asegúrate de que el login haya funcionado.

### Solución manual con SQL

Si todo lo anterior falla, puedes ejecutar estos comandos SQL directamente en la base de datos `.tmp/data.db`:

```sql
-- Conectar a la base de datos (necesitas sqlite3 instalado)
sqlite3 .tmp/data.db

-- Insertar permisos para el rol Public (id 2)
-- Ajusta los valores de 'action' y 'subject' según el esquema real de Strapi v5.
-- La siguiente consulta es un ejemplo y puede necesitar ajustes.
INSERT INTO up_permissions (action, subject, role_id)
VALUES 
  ('find', 'api::producto.producto', 2),
  ('findOne', 'api::producto.producto', 2),
  ('find', 'api::category.category', 2),
  ('findOne', 'api::category.category', 2);
```

Para conocer el esquema exacto de la tabla `up_permissions`, ejecuta:

```sql
PRAGMA table_info(up_permissions);
```

## Archivos relevantes

- `api_token.json` – token full‑access (si existe)
- `.env` – configuración de Strapi (puerto, credenciales)
- `permissions.json` – dump actual de permisos (solo referencia)

## Notas

- Los permisos se aplican únicamente al rol **Public** (ID 2).
- Solo se habilitan `find` (listar) y `findOne` (obtener por id).
- Los cambios son persistentes; no se revertirán al reiniciar Strapi.
- Después de configurar los permisos, las peticiones a `/api/productos` y `/api/categorias` deben devolver datos (si existen).

## Soporte

Si encuentras problemas, revisa los logs de Strapi y asegúrate de que la versión sea compatible (Strapi v5.40.0).