#!/usr/bin/env node
/**
 * Genera valores seguros para las variables de entorno de Strapi en producción.
 * Uso: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

function generateAppKeys(count = 4) {
  return Array.from({ length: count }, () => generateSecret(32)).join(',');
}

console.log('# Secrets generados para Strapi producción');
console.log('# Copiar estas líneas al archivo .env.production o variables de entorno\n');
console.log(`APP_KEYS="${generateAppKeys()}"`);
console.log(`API_TOKEN_SALT="${generateSecret()}"`);
console.log(`ADMIN_JWT_SECRET="${generateSecret()}"`);
console.log(`TRANSFER_TOKEN_SALT="${generateSecret()}"`);
console.log(`JWT_SECRET="${generateSecret()}"`);
console.log(`ENCRYPTION_KEY="${generateSecret()}"`);