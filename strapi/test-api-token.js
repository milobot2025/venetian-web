const BASE_URL = 'http://localhost:1338';
const API_TOKEN = '1ff1955f6d127f1a904ad3cd95e84e97be7c74dbf7e64ebd498c369dfbb0ffcceaa9af0ec12a19bd8985da51e81d3cf05a54bf3562ccd4ebf5b33f76b434d79cef1ae8c266e453d8eba5b0f0d369d2804dae2e5495434b7953930ce22717a70047e10a552c4563cd660ca7ed7c6b647c6eeebcc2f4af3c0ed6ef6755e898ba58';

async function test() {
    console.log('Testing API token with different endpoints...\n');

    // 1. Test content API (should work)
    console.log('1. Testing GET /api/productos with API token...');
    try {
        const res = await fetch(`${BASE_URL}/api/productos`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        console.log(`   Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            console.log('   Response:', await res.text());
        } else {
            const json = await res.json();
            console.log('   Success: got', json.data?.length || 0, 'items');
        }
    } catch (err) {
        console.log('   Error:', err.message);
    }

    // 2. Test admin roles endpoint (might fail)
    console.log('\n2. Testing GET /admin/users-permissions/roles with API token...');
    try {
        const res = await fetch(`${BASE_URL}/admin/users-permissions/roles`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        console.log(`   Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            const text = await res.text();
            console.log('   Response (first 200 chars):', text.substring(0, 200));
        } else {
            const json = await res.json();
            console.log('   Success:', json);
        }
    } catch (err) {
        console.log('   Error:', err.message);
    }

    // 3. Test API users-permissions endpoint (maybe /api/users-permissions/roles)
    console.log('\n3. Testing GET /api/users-permissions/roles with API token...');
    try {
        const res = await fetch(`${BASE_URL}/api/users-permissions/roles`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        console.log(`   Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            const text = await res.text();
            console.log('   Response (first 200 chars):', text.substring(0, 200));
        } else {
            const json = await res.json();
            console.log('   Success:', json);
        }
    } catch (err) {
        console.log('   Error:', err.message);
    }

    // 4. Test public endpoint without token (should 401/403)
    console.log('\n4. Testing GET /api/productos without token...');
    try {
        const res = await fetch(`${BASE_URL}/api/productos`);
        console.log(`   Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            console.log('   Expected error:', await res.text());
        }
    } catch (err) {
        console.log('   Error:', err.message);
    }
}

test().catch(err => console.error('Fatal:', err));