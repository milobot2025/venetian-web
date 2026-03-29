'use strict';

async function setupPermissions() {
  const BASE_URL = 'http://localhost:1338';
  const ADMIN_EMAIL = 'admin@venetian.com';
  const ADMIN_PASSWORD = 'Admin123';

  console.log('🔐 Logging in as admin...');
  const loginRes = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!loginRes.ok) {
    const text = await loginRes.text();
    throw new Error(`Login failed: ${loginRes.status} ${text}`);
  }

  const { data } = await loginRes.json();
  const token = data.token;
  console.log('✅ Login successful');

  console.log('📋 Fetching roles...');
  const rolesRes = await fetch(`${BASE_URL}/admin/users-permissions/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!rolesRes.ok) {
    throw new Error(`Failed to fetch roles: ${rolesRes.status}`);
  }
  const rolesData = await rolesRes.json();
  const publicRole = rolesData.find(r => r.name === 'Public');
  if (!publicRole) {
    throw new Error('Public role not found');
  }
  console.log(`👥 Found Public role (ID: ${publicRole.id})`);

  // Content types to grant public access
  const contentTypes = [
    'api::producto.producto',
    'api::category.category',
  ];

  // Actions to allow (find = list, findOne = get by id)
  const allowedActions = ['find', 'findOne'];

  // Build new permissions array
  const newPermissions = {};
  contentTypes.forEach(ct => {
    newPermissions[ct] = {};
    allowedActions.forEach(action => {
      newPermissions[ct][action] = { enabled: true, policy: '' };
    });
  });

  // Merge with existing permissions (keep other content types unchanged)
  const existingPermissions = publicRole.permissions || {};
  const mergedPermissions = { ...existingPermissions };
  Object.keys(newPermissions).forEach(ct => {
    mergedPermissions[ct] = { ...mergedPermissions[ct], ...newPermissions[ct] };
  });

  console.log('🔧 Updating Public role permissions...');
  const updateRes = await fetch(`${BASE_URL}/admin/users-permissions/roles/${publicRole.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...publicRole,
      permissions: mergedPermissions,
    }),
  });

  if (!updateRes.ok) {
    const text = await updateRes.text();
    throw new Error(`Update failed: ${updateRes.status} ${text}`);
  }

  console.log('✅ Public permissions updated successfully');
  console.log('   Enabled find/findOne for:');
  contentTypes.forEach(ct => console.log(`   - ${ct}`));
}

// Run if script is called directly
if (require.main === module) {
  setupPermissions().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}

module.exports = setupPermissions;
