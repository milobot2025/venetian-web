const BASE_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@venetian.com';
const ADMIN_PASSWORD = 'Admin123';

async function list() {
    const loginRes = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const { data } = await loginRes.json();
    const token = data.token;
    console.log('Token obtained');
    const ctRes = await fetch(`${BASE_URL}/api/content-type-builder/content-types`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!ctRes.ok) {
        console.error('Failed to fetch content types', await ctRes.text());
        return;
    }
    const ctData = await ctRes.json();
    console.log('Content types:', JSON.stringify(ctData, null, 2));
}

list().catch(err => console.error(err));