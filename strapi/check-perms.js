const Database = require('better-sqlite3');
const db = new Database('.tmp/data.db', { readonly: true });

console.log('up_roles:');
const roles = db.prepare('SELECT * FROM up_roles').all();
roles.forEach(r => console.log(r));

console.log('\nup_permissions:');
const perms = db.prepare('SELECT * FROM up_permissions').all();
perms.forEach(p => console.log(p));

console.log('\nEjemplo de permiso:');
if (perms.length) {
    const p = perms[0];
    console.log('id:', p.id);
    console.log('action:', p.action);
    console.log('subject:', p.subject);
    console.log('properties:', p.properties);
    console.log('conditions:', p.conditions);
    console.log('role_id:', p.role_id);
}

db.close();