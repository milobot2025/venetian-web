'use strict';

/**
 * import-images.js
 * Sube imágenes desde carpetas locales a Strapi y las linkea a productos.
 * Estructura: G:/Mi unidad/Novedades 2026/{Categoría}/{NombreModelo o SKU}/img.jpg
 *
 * Uso: node scripts/import-images.js
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1338';
const API_TOKEN   = '1ff1955f6d127f1a904ad3cd95e84e97be7c64ebd498c369dfbb0ffcceaa9af0ec12a19bd8985da51e81d3cf05a54bf3562ccd4ebf5b33f76b434d79cef1ae8c266e453d8eba5b0f0d369d2804dae2e5495434b7953930ce22717a70047e10a552c4563cd660ca7ed7c6b647c6eeebcc2f4af3c0ed6ef6755e898ba58';
const IMAGES_ROOT = 'G:/Mi unidad/Novedades 2026';

const headers = { 'Authorization': `Bearer ${API_TOKEN}` };

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\-_]+/g, '');
}

function isSkuLike(name) {
  return /^\d{10,}$/.test(name.trim());
}

async function getAllProducts() {
  const all = [];
  let page = 1;
  while (true) {
    const r = await fetch(`${STRAPI_URL}/api/productos?fields[0]=documentId&fields[1]=sku&fields[2]=modelo&fields[3]=title&pagination[page]=${page}&pagination[pageSize]=100`, { headers });
    const j = await r.json();
    all.push(...j.data);
    if (page >= j.meta.pagination.pageCount) break;
    page++;
  }
  return all;
}

async function uploadImage(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  const form = new globalThis.FormData();
  form.append('files', new Blob([fileBuffer], { type: mimeType }), fileName);
  const r = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API_TOKEN}` },
    body: form,
  });
  if (!r.ok) throw new Error(`Upload failed ${r.status}: ${await r.text()}`);
  const json = await r.json();
  return json[0];
}

async function updateProductImages(documentId, imageId, imageIds) {
  const r = await fetch(`${STRAPI_URL}/api/productos/${documentId}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { image: imageId, images: imageIds } }),
  });
  if (!r.ok) throw new Error(`Update failed ${r.status}: ${await r.text()}`);
}

async function main() {
  console.log('📦 Cargando productos desde Strapi...');
  const products = await getAllProducts();
  console.log(`   ${products.length} productos cargados`);

  // Índices para búsqueda rápida
  const bySku   = {};
  const byModelo = {};
  for (const p of products) {
    if (p.sku)    bySku[p.sku.trim()]         = p;
    if (p.modelo) byModelo[norm(p.modelo)]    = p;
    if (p.title)  byModelo[norm(p.title)]     = p;
  }

  let matched = 0, skipped = 0, errors = 0;

  // Recorrer estructura de carpetas
  const categories = fs.readdirSync(IMAGES_ROOT).filter(d =>
    fs.statSync(path.join(IMAGES_ROOT, d)).isDirectory()
  );

  for (const cat of categories) {
    const catPath = path.join(IMAGES_ROOT, cat);
    const modelFolders = fs.readdirSync(catPath).filter(d =>
      fs.statSync(path.join(catPath, d)).isDirectory()
    );

    for (const folder of modelFolders) {
      const folderPath = path.join(catPath, folder);

      // Buscar producto
      let product = null;
      if (isSkuLike(folder)) {
        product = bySku[folder.trim()];
      } else {
        product = byModelo[norm(folder)];
        // Intento parcial: buscar si el folder está contenido en algún modelo
        if (!product) {
          const nf = norm(folder);
          for (const [key, p] of Object.entries(byModelo)) {
            if (key.includes(nf) || nf.includes(key)) { product = p; break; }
          }
        }
      }

      if (!product) {
        console.log(`⚠️  Sin match: "${cat}/${folder}"`);
        skipped++;
        continue;
      }

      // Listar imágenes
      const images = fs.readdirSync(folderPath).filter(f =>
        /\.(jpg|jpeg|png|webp)$/i.test(f)
      ).sort();

      if (images.length === 0) { skipped++; continue; }

      console.log(`📸 ${folder} → ${product.modelo || product.title} (${images.length} imgs)`);

      try {
        const uploadedIds = [];
        for (const img of images) {
          const uploaded = await uploadImage(path.join(folderPath, img));
          uploadedIds.push(uploaded.id);
        }
        await updateProductImages(product.documentId, uploadedIds[0], uploadedIds);
        matched++;
      } catch (err) {
        console.error(`   ❌ Error: ${err.message}`);
        errors++;
      }
    }
  }

  console.log(`\n✅ Completado: ${matched} productos con imágenes | ${skipped} sin match | ${errors} errores`);
}

main().catch(console.error);
