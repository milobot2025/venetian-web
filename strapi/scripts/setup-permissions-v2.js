#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1338';
const API_TOKEN_PATH = path.join(__dirname, '..', 'api_token.json');
const DB_PATH = path.join(__dirname, '..', '.tmp', 'data.db');

// Credenciales de admin (pueden sobrescribirse con variables de entorno)
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'admin@venetian.com';
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'Admin123';

// Content types a habilitar
const CONTENT_TYPES = [
  'api::producto.producto',
  'api::category.category',
];
const ALLOWED_ACTIONS = ['find', 'findOne'];

// --- Utilidades -------------------------------------------------------------
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function testConnection(token = null) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/productos`, { headers });
    return res.status !== 404 && res.status !== 401 && res.status !== 403;
  } catch {
    return false;
  }
}

// --- API token --------------------------------------------------------------
function getApiToken() {
  if (fs.existsSync(API_TOKEN_PATH)) {
    const content = fs.readFileSync(API_TOKEN_PATH, 'utf8');
    const data = JSON.parse(content);
    return data.data?.accessKey;
  }
  return null;
}

// --- Login admin ------------------------------------------------------------
async function adminLogin() {
  console.log('🔐 Iniciando sesión como administrador...');
  const res = await fetchWithTimeout(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login falló: ${res.status} ${text}`);
  }
  const { data } = await res.json();
  return data.token;
}

// --- Rutas alternativas para la API de roles --------------------------------
async function fetchRoles(token) {
  console.log('📋 Obteniendo roles...');
  const endpoints = [
    `${BASE_URL}/admin/users-permissions/roles`,
    `${BASE_URL}/admin/api/users-permissions/roles`,
    `${BASE_URL}/api/users-permissions/roles`,
  ];
  for (const url of endpoints) {
    const res = await fetchWithTimeout(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      console.log(`✅ Roles obtenidos desde ${url}`);
      return await res.json();
    }
  }
  throw new Error('No se pudo obtener roles desde ningún endpoint conocido.');
}

async function updateRolePermissions(token, roleId, permissions) {
  console.log(`🔧 Actualizando permisos del rol ID ${roleId}...`);
  const endpoints = [
    `${BASE_URL}/admin/users-permissions/roles/${roleId}`,
    `${BASE_URL}/admin/api/users-permissions/roles/${roleId}`,
    `${BASE_URL}/api/users-permissions/roles/${roleId}`,
  ];
  for (const url of endpoints) {
    const res = await fetchWithTimeout(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...permissions }),
    });
    if (res.ok) {
      console.log(`✅ Permisos actualizados via ${url}`);
      return res;
    }
  }
  throw new Error('No se pudo actualizar el rol desde ningún endpoint.');
}

// --- Modificación directa de base de datos (SQLite) -------------------------
function updatePermissionsViaDatabase() {
  console.log('🗃️ Intentando modificar permisos directamente en la base de datos...');
  try {
    const Database = require('better-sqlite3');
    const db = new Database(DB_PATH);
    
    // Obtener el rol Public (id 2)
    const publicRole = db.prepare('SELECT id FROM up_roles WHERE name = ?').get('Public');
    if (!publicRole) {
      db.close();
      throw new Error('Rol Public no encontrado en up_roles.');
    }
    const roleId = publicRole.id;
    console.log(`👥 Rol Public encontrado (ID: ${roleId})`);
    
    // Para cada content type y acción, insertar o actualizar en up_permissions
    // NOTA: En Strapi v5 la estructura de permisos puede ser diferente.
    // Este es un enfoque experimental y puede no funcionar.
    // Se recomienda usar la API cuando sea posible.
    console.log('⚠️  Esta funcionalidad es experimental y puede no funcionar.');
    console.log('   Se recomienda usar la API (opción por defecto).');
    
    // Ejemplo de inserción (ajustar según esquema real)
    // db.prepare(`INSERT INTO up_permissions (action, subject, role_id) VALUES (?, ?, ?)`)
    //   .run('find', 'api::producto.producto', roleId);
    
    db.close();
    throw new Error('La modificación directa de base de datos no está implementada completamente.\n' +
                    'Por favor, usa la API (asegúrate de que Strapi esté ejecutándose).');
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error('better-sqlite3 no está instalado. Ejecuta `npm install better-sqlite3` en el directorio de Strapi.');
    }
    throw err;
  }
}

// --- Flujo principal --------------------------------------------------------
async function main(options = {}) {
  console.log('🚀 Configurando permisos públicos en Strapi\n');
  
  const useDb = options.useDb;
  
  if (useDb) {
    return updatePermissionsViaDatabase();
  }
  
  // 1. Verificar que Strapi esté en línea
  console.log('🌐 Verificando conexión con Strapi...');
  if (!await testConnection()) {
    throw new Error(`No se puede conectar a ${BASE_URL}. Asegúrate de que Strapi esté ejecutándose.\n` +
                    '  Si prefieres modificar la base de datos directamente, usa el argumento --use-db.');
  }
  console.log('✅ Conexión exitosa');
  
  // 2. Obtener token (API token primero, luego admin)
  let token = getApiToken();
  let tokenType = 'API';
  if (token) {
    console.log('🔑 Token API encontrado');
    if (await testConnection(token)) {
      console.log('✅ Token API válido');
    } else {
      console.log('⚠️ Token API no tiene acceso a contenido, intentando login de administrador...');
      token = await adminLogin();
      tokenType = 'Admin JWT';
    }
  } else {
    console.log('🔑 No hay token API, usando login de administrador...');
    token = await adminLogin();
    tokenType = 'Admin JWT';
  }
  
  // 3. Obtener roles
  const rolesData = await fetchRoles(token);
  const publicRole = Array.isArray(rolesData) 
    ? rolesData.find(r => r.name === 'Public')
    : rolesData.data?.find(r => r.name === 'Public');
  if (!publicRole) {
    throw new Error('Rol "Public" no encontrado');
  }
  console.log(`👥 Rol Public encontrado (ID: ${publicRole.id})`);
  
  // 4. Construir nuevos permisos
  const existingPermissions = publicRole.permissions || {};
  const newPermissions = { ...existingPermissions };
  CONTENT_TYPES.forEach(ct => {
    if (!newPermissions[ct]) newPermissions[ct] = {};
    ALLOWED_ACTIONS.forEach(action => {
      newPermissions[ct][action] = { enabled: true, policy: '' };
    });
  });
  
  // 5. Actualizar rol
  const updatePayload = { ...publicRole, permissions: newPermissions };
  await updateRolePermissions(token, publicRole.id, updatePayload);
  
  console.log('\n✅ Permisos públicos configurados exitosamente');
  console.log('   Habilitados find/findOne para:');
  CONTENT_TYPES.forEach(ct => console.log(`   - ${ct}`));
  console.log(`\n📌 Token utilizado: ${tokenType}`);
  console.log(`🌐 URL: ${BASE_URL}`);
}

// --- Manejo de argumentos de línea de comandos ------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  for (const arg of args) {
    if (arg === '--use-db' || arg === '-d') {
      options.useDb = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg.startsWith('--url=')) {
      options.url = arg.substring(6);
    } else {
      console.error(`❌ Argumento desconocido: ${arg}`);
      printHelp();
      process.exit(1);
    }
  }
  return options;
}

function printHelp() {
  console.log(`
Uso: node scripts/setup-permissions-v2.js [OPCIONES]

Configura los permisos públicos en Strapi para los content types:
  - api::producto.producto
  - api::category.category

Habilita las acciones 'find' y 'findOne'.

Opciones:
  --use-db, -d    Intentar modificar la base de datos directamente (experimental)
  --url=URL       URL base de Strapi (por defecto: http://localhost:1338)
  --help, -h      Muestra este mensaje

Variables de entorno:
  STRAPI_URL              URL base de Strapi
  STRAPI_ADMIN_EMAIL      Email del administrador (por defecto: admin@venetian.com)
  STRAPI_ADMIN_PASSWORD   Contraseña del administrador (por defecto: Admin123)

Ejemplos:
  node scripts/setup-permissions-v2.js
  node scripts/setup-permissions-v2.js --url=http://localhost:1338
  node scripts/setup-permissions-v2.js --use-db
`);
}

// --- Punto de entrada -------------------------------------------------------
if (require.main === module) {
  const options = parseArgs();
  if (options.url) process.env.STRAPI_URL = options.url;
  
  main(options).catch(err => {
    console.error('\n❌ Error:', err.message);
    if (err.message.includes('better-sqlite3')) {
      console.error('\n💡 Solución: Instala better-sqlite3 ejecutando:');
      console.error('   cd web-marca/strapi && npm install better-sqlite3');
    }
    process.exit(1);
  });
}

module.exports = { main };