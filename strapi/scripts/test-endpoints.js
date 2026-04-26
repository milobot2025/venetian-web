const BASE_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@venetian.com';
const ADMIN_PASSWORD = 'Admin123';

async function test() {
    console.log('🔐 Logging in...');
    const loginRes = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    if (!loginRes.ok) {
        console.error('Login failed', await loginRes.text());
        return;
    }
    const { data } = await loginRes.json();
    const token = data.token;
    console.log('✅ Token obtained');

    // Test GET /api/categorias
    console.log('📋 Testing GET /api/categorias...');
    const getRes = await fetch(`${BASE_URL}/api/categorias`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`   Status: ${getRes.status} ${getRes.statusText}`);
    if (!getRes.ok) {
        console.log('   Response:', await getRes.text());
    } else {
        const json = await getRes.json();
        console.log('   Success:', json);
    }

    // Test POST /api/categorias
    console.log('📝 Testing POST /api/categorias...');
    const postRes = await fetch(`${BASE_URL}/api/categorias`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                name: 'Test Category',
                slug: 'test-category',
                description: 'Test',
            },
        }),
    });
    console.log(`   Status: ${postRes.status} ${postRes.statusText}`);
    if (!postRes.ok) {
        console.log('   Response:', await postRes.text());
    } else {
        const json = await postRes.json();
        console.log('   Success:', json);
    }

    // Test GET /api/productos
    console.log('📦 Testing GET /api/productos...');
    const getProd = await fetch(`${BASE_URL}/api/productos`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`   Status: ${getProd.status} ${getProd.statusText}`);
    if (!getProd.ok) {
        console.log('   Response:', await getProd.text());
    }
}

test().catch(err => console.error('Error:', err));