'use strict';

/**
 * Enriquece productos de Strapi con texto curado + foto local desde
 * C:\Users\User\milobot\data\venetian_brochure.json
 *
 * Match: sku (Strapi) <-> idc (brochure JSON)
 * Update: subtitulo, description, image (upload single)
 *
 * Uso:
 *   node scripts/enrich-products-from-brochure.js          # full
 *   node scripts/enrich-products-from-brochure.js --limit 5
 *   node scripts/enrich-products-from-brochure.js --skip-images
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1338';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const BROCHURE_PATH = 'C:\\Users\\User\\milobot\\data\\venetian_brochure.json';

if (!API_TOKEN) {
  console.error('FATAL: set STRAPI_API_TOKEN env var');
  process.exit(1);
}

const args = process.argv.slice(2);
const LIMIT = (() => {
  const i = args.indexOf('--limit');
  return i >= 0 ? parseInt(args[i + 1], 10) : null;
})();
const SKIP_IMAGES = args.includes('--skip-images');

async function fetchAllProductos(token) {
  const all = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    const res = await fetch(
      `${BASE_URL}/api/productos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=image`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(`fetch productos page ${page}: ${res.status}`);
    const json = await res.json();
    all.push(...json.data);
    const total = json.meta.pagination.total;
    if (all.length >= total) break;
    page++;
  }
  return all;
}

async function uploadImage(token, filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buf = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const blob = new Blob([buf], { type: 'image/jpeg' });
  const fd = new FormData();
  fd.append('files', blob, filename);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`upload fail (${res.status}): ${txt.slice(0, 200)}`);
  }
  const arr = await res.json();
  return Array.isArray(arr) ? arr[0]?.id : null;
}

async function updateProducto(token, documentId, payload) {
  const res = await fetch(`${BASE_URL}/api/productos/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: payload }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`update fail (${res.status}): ${txt.slice(0, 250)}`);
  }
  return res.json();
}

(async () => {
  const token = API_TOKEN;
  console.log('🔐 Using API token');

  console.log('📚 Loading brochure JSON...');
  const brochure = JSON.parse(fs.readFileSync(BROCHURE_PATH, 'utf8'));
  const brochureBySku = new Map();
  for (const v of Object.values(brochure)) {
    if (v.idc) brochureBySku.set(String(v.idc).trim(), v);
  }
  console.log(`📦 Brochure entries: ${brochureBySku.size}`);

  console.log('🛒 Fetching Strapi productos...');
  const productos = await fetchAllProductos(token);
  console.log(`📦 Strapi productos: ${productos.length}`);

  let matched = 0, updated = 0, uploaded = 0, errors = 0, noPhoto = 0;
  const items = LIMIT ? productos.slice(0, LIMIT) : productos;
  console.log(`🚀 Processing ${items.length} productos${LIMIT ? ` (LIMIT=${LIMIT})` : ''}${SKIP_IMAGES ? ' [skip-images]' : ''}`);

  for (let i = 0; i < items.length; i++) {
    const p = items[i];
    const sku = String(p.sku || '').trim();
    const b = brochureBySku.get(sku);
    if (!b) continue;
    matched++;

    try {
      const payload = {};
      if (b.subtitulo_llm) payload.subtitulo = b.subtitulo_llm;
      if (b.descripcion_larga_llm) payload.description = b.descripcion_larga_llm;

      if (!SKIP_IMAGES && !p.image && Array.isArray(b.fotos_locales) && b.fotos_locales.length) {
        const localPath = b.fotos_locales[0];
        if (fs.existsSync(localPath)) {
          const mediaId = await uploadImage(token, localPath);
          if (mediaId) {
            payload.image = mediaId;
            uploaded++;
          }
        } else {
          noPhoto++;
        }
      }

      if (Object.keys(payload).length) {
        await updateProducto(token, p.documentId, payload);
        updated++;
      }

      if ((i + 1) % 25 === 0 || i === items.length - 1) {
        console.log(`  [${i + 1}/${items.length}] matched=${matched} updated=${updated} uploaded=${uploaded} errors=${errors}`);
      }
    } catch (e) {
      errors++;
      console.error(`  ❌ ${sku} (${p.title}):`, e.message);
    }
  }

  console.log('\n=== RESUMEN ===');
  console.log(`Strapi productos: ${productos.length}`);
  console.log(`Procesados: ${items.length}`);
  console.log(`Matched (sku=idc): ${matched}`);
  console.log(`Updated: ${updated}`);
  console.log(`Imágenes subidas: ${uploaded}`);
  console.log(`Sin foto local: ${noPhoto}`);
  console.log(`Errores: ${errors}`);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
