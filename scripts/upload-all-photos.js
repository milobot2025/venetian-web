'use strict';

/**
 * Sube TODAS las fotos locales de cada producto a Strapi en orden (0.jpg, 1.jpg, ...).
 * Setea image=primera, images=[todas en orden].
 * Idempotente: skip si Strapi ya tiene >= length(fotos_locales).
 *
 * Uso:
 *   STRAPI_API_TOKEN=... node scripts/upload-all-photos.js [--limit N] [--force]
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1338';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const BROCHURE_PATH = 'C:\\Users\\User\\milobot\\data\\venetian_brochure.json';

if (!API_TOKEN) { console.error('FATAL: set STRAPI_API_TOKEN'); process.exit(1); }

const args = process.argv.slice(2);
const LIMIT = (() => { const i = args.indexOf('--limit'); return i >= 0 ? parseInt(args[i + 1], 10) : null; })();
const FORCE = args.includes('--force');

async function fetchAllProductos(token) {
  const all = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    const res = await fetch(
      `${BASE_URL}/api/productos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=images`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(`fetch productos page ${page}: ${res.status}`);
    const json = await res.json();
    all.push(...json.data);
    if (all.length >= json.meta.pagination.total) break;
    page++;
  }
  return all;
}

async function uploadImage(token, filePath) {
  const buf = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const blob = new Blob([buf], { type: 'image/jpeg' });
  const fd = new FormData();
  fd.append('files', blob, filename);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
  });
  if (!res.ok) throw new Error(`upload fail (${res.status}): ${(await res.text()).slice(0, 200)}`);
  const arr = await res.json();
  return Array.isArray(arr) ? arr[0]?.id : null;
}

async function updateProducto(token, documentId, payload) {
  const res = await fetch(`${BASE_URL}/api/productos/${documentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok) throw new Error(`update fail (${res.status}): ${(await res.text()).slice(0, 250)}`);
  return res.json();
}

(async () => {
  const token = API_TOKEN;
  console.log('📚 Loading brochure...');
  const brochure = JSON.parse(fs.readFileSync(BROCHURE_PATH, 'utf8'));
  const bySku = new Map();
  for (const v of Object.values(brochure)) if (v.idc) bySku.set(String(v.idc).trim(), v);

  console.log('🛒 Fetching productos...');
  const productos = await fetchAllProductos(token);
  const items = LIMIT ? productos.slice(0, LIMIT) : productos;
  console.log(`🚀 Processing ${items.length}${FORCE ? ' [FORCE]' : ''}`);

  let processed = 0, uploadedTotal = 0, skipped = 0, errors = 0, missing = 0;

  for (let i = 0; i < items.length; i++) {
    const p = items[i];
    const sku = String(p.sku || '').trim();
    const b = bySku.get(sku);
    if (!b || !Array.isArray(b.fotos_locales) || !b.fotos_locales.length) continue;

    const localPaths = b.fotos_locales.filter(fp => {
      try { return fs.existsSync(fp); } catch { return false; }
    });
    if (!localPaths.length) { missing++; continue; }

    const currentCount = Array.isArray(p.images) ? p.images.length : 0;

    // Verificar que la primera imagen sea físicamente accesible (Railway puede haber borrado uploads).
    let firstImageOk = false;
    if (!FORCE && p.image?.url) {
      try {
        const fullUrl = p.image.url.startsWith('http') ? p.image.url : `${BASE_URL}${p.image.url}`;
        const head = await fetch(fullUrl, { method: 'HEAD' });
        firstImageOk = head.ok;
      } catch {}
    }

    if (!FORCE && firstImageOk && currentCount >= localPaths.length) { skipped++; continue; }

    try {
      const ids = [];
      for (const fp of localPaths) {
        const id = await uploadImage(token, fp);
        if (id) { ids.push(id); uploadedTotal++; }
      }
      if (!ids.length) continue;
      await updateProducto(token, p.documentId, { image: ids[0], images: ids });
      processed++;
      if ((i + 1) % 20 === 0 || i === items.length - 1) {
        console.log(`  [${i + 1}/${items.length}] processed=${processed} uploaded=${uploadedTotal} skipped=${skipped} errors=${errors}`);
      }
    } catch (e) {
      errors++;
      console.error(`  ❌ ${sku}:`, e.message);
    }
  }

  console.log('\n=== RESUMEN ===');
  console.log(`Processed (con upload): ${processed}`);
  console.log(`Skipped (ya completos): ${skipped}`);
  console.log(`Sin foto local: ${missing}`);
  console.log(`Imágenes subidas: ${uploadedTotal}`);
  console.log(`Errores: ${errors}`);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
