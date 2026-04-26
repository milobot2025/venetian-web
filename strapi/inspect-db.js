const Database = require('better-sqlite3');
const db = new Database('.tmp/data.db', { readonly: true });

console.log('Tablas:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(t => console.log(' -', t.name));

console.log('\nColumnas de strapi_roles:');
try {
    const cols = db.prepare('PRAGMA table_info(strapi_roles)').all();
    cols.forEach(c => console.log(` ${c.cid}: ${c.name} (${c.type})`));
} catch(e) { console.log(e.message); }

console.log('\nColumnas de strapi_permissions:');
try {
    const cols = db.prepare('PRAGMA table_info(strapi_permissions)').all();
    cols.forEach(c => console.log(` ${c.cid}: ${c.name} (${c.type})`));
} catch(e) { console.log(e.message); }

console.log('\nRoles:');
const roles = db.prepare('SELECT id, name, description FROM strapi_roles').all();
roles.forEach(r => console.log(` ${r.id}: ${r.name} - ${r.description}`));

console.log('\nPermisos del rol Public (id 2):');
const perms = db.prepare('SELECT id, action, subject, properties, conditions FROM strapi_permissions WHERE role_id = ?').all(2);
perms.forEach(p => console.log(` ${p.id}: ${p.action} ${p.subject} ${p.properties}`));

db.close();