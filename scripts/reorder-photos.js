'use strict';

const BASE = 'https://strapi-backend-production-35d0.up.railway.app';
const TOKEN = (process.env.STRAPI_API_TOKEN || '').trim();
if (!TOKEN) { console.error('FATAL: STRAPI_API_TOKEN env var required'); process.exit(1); }

// Reorder spec: docId → array of "visible photo positions" 1-based, in NEW order.
// Optional `delete` array to drop those positions.
const SPECS = [
  // 1. SL-101Z3: borrar fotos 1 y 3 → quedan [2,4]
  { sku: '1911071205382205', newOrder: [2, 4] },
  // 2. IG12 PRO: foto 6 → 1, resto en orden [6,1,2,3,4,5,7]
  { sku: '2602111508557258', newOrder: [6, 1, 2, 3, 4, 5, 7] },
  // 3. IG15 PRO: foto 2 → 1, foto 1 → 2  → [2,1,3,4,5,6,7]
  { sku: '2602111509222257', newOrder: [2, 1, 3, 4, 5, 6, 7] },
  // 4. FM-1200: foto 7 → 1, foto 1 → última, foto 2 → anteúltima → [7,3,4,5,6,8,2,1]
  { sku: '2602131117399018', newOrder: [7, 3, 4, 5, 6, 8, 2, 1] },
  // 5. HV-1500 PRO: foto 4 → 1 → [4,1,2,3]
  { sku: '2602131435391662', newOrder: [4, 1, 2, 3] },
  // 6. Z-3000: foto 4 → 1, foto 3 → 2 → [4,3,1,2]
  { sku: '2602131439542375', newOrder: [4, 3, 1, 2] },
  // 7. ZL-1000: foto 2 → 1 → [2,1,3,4,5,6]
  { sku: '2408161717398739', newOrder: [2, 1, 3, 4, 5, 6] },
];

async function fetchProduct(sku) {
  const url = `${BASE}/api/productos?populate=*&filters[sku][$eq]=${sku}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const j = await r.json();
  return j.data[0];
}

async function update(documentId, payload) {
  const r = await fetch(`${BASE}/api/productos/${documentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ data: payload }),
  });
  if (!r.ok) throw new Error(`update ${documentId} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

(async () => {
  for (const spec of SPECS) {
    const p = await fetchProduct(spec.sku);
    if (!p) { console.log('NOT FOUND', spec.sku); continue; }

    // Build visible array: [mainId, ...gallery without main]
    const mainId = p.image?.id;
    const galleryIds = (p.images || []).map(im => im.id);
    const galleryWithoutMain = galleryIds.filter(id => id !== mainId);
    const visible = mainId ? [mainId, ...galleryWithoutMain] : galleryIds;

    // Apply new order: pick positions (1-based)
    const newIds = spec.newOrder
      .map(pos => visible[pos - 1])
      .filter(x => x != null);

    if (newIds.length === 0) {
      console.log(spec.sku, 'EMPTY result, skip');
      continue;
    }

    console.log(`${spec.sku} ${p.title}`);
    console.log(`  before: [${visible.join(', ')}]`);
    console.log(`  after:  [${newIds.join(', ')}]`);

    await update(p.documentId, { image: newIds[0], images: newIds });
    console.log(`  ✅ updated`);
  }
})().catch(e => { console.error('FATAL', e); process.exit(1); });
