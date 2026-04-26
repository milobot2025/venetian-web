// scripts/scrape-ml-descriptions.js
// Busca descripciones en MercadoLibre y las sube a Strapi
// Uso: node scripts/scrape-ml-descriptions.js

const fs = require('fs');

const STRAPI_URL = 'https://strapi-backend-production-35d0.up.railway.app/api/productos';
const STRAPI_TOKEN = 'b430d7dbda584ecc6b469fc1e68f5811097fab28d07dc3af21e966bf2c51b4f016daf99191f9d1409511d36167c2559d0fb7a22104177e9cdae17bcad85156b1a71d0cb8086be1dc2ca685f4b92b27e402827a8bff67501721bed818631fbf0a439ce48348295c2c9eb12d477d21535237860a0ce4c6dfa453d026b739d7aff0';
const ML_SEARCH = 'https://api.mercadolibre.com/sites/MLA/search?q=';
const ML_ITEM = 'https://api.mercadolibre.com/items/';
const LOG_FILE = 'scripts/ml-scrape-log.json';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getStrapiProducts() {
  const res = await fetch(`${STRAPI_URL}?pagination[pageSize]=500`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
  });
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function searchML(titulo) {
  // Busca "Venetian X-Photon" en lugar de solo el modelo
  const query = encodeURIComponent(`Venetian ${titulo}`);
  const res = await fetch(`${ML_SEARCH}${query}&limit=5`);
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.results?.length) return null;
  return json.results[0]?.id || null;
}

async function getMLDescription(itemId) {
  const res = await fetch(`${ML_ITEM}${itemId}/description`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.plain_text || null;
}

function clean(text) {
  if (!text) return '';
  return text
    .replace(/\n{3,}/g, '\n\n')           // colapsa saltos excesivos
    .replace(/•\s?|\*\s?/g, '')           // bullet points
    .replace(/mercadolibre|vendedor|comprá ahora|compra ahora/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 500);
}

async function updateStrapi(documentId, description) {
  const res = await fetch(`${STRAPI_URL}/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`
    },
    body: JSON.stringify({ data: { description } })
  });
  return res.ok;
}

async function main() {
  const log = fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')) : [];

  console.log('Obteniendo productos de Strapi...');
  const products = await getStrapiProducts();
  console.log(`Total: ${products.length} productos`);

  let updated = 0, skipped = 0, noMatch = 0, errors = 0;

  for (const p of products) {
    // Strapi v5: campos directamente en p (no p.attributes)
    const documentId = p.documentId;
    const modelo = p.title || p.modelo || '';
    const currentDesc = p.description || '';
    // Usamos la descripción como término de búsqueda (más semántica que el código interno)
    // Si no hay descripción, usamos "Venetian + modelo"
    const titulo = currentDesc.length > 5 ? `Venetian ${currentDesc}` : `Venetian ${modelo}`;

    if (currentDesc.length >= 80) {
      skipped++;
      continue;
    }

    console.log(`[→] ${titulo}`);

    try {
      await sleep(400);
      const mlId = await searchML(titulo);
      if (!mlId) {
        console.log(`  [sin match] ${titulo}`);
        noMatch++;
        continue;
      }

      await sleep(400);
      const raw = await getMLDescription(mlId);
      if (!raw || raw.trim().length < 30) {
        console.log(`  [desc vacía] ${mlId}`);
        noMatch++;
        continue;
      }

      const newDesc = clean(raw);
      const ok = await updateStrapi(documentId, newDesc);
      if (ok) {
        updated++;
        log.push({ documentId, titulo, anterior: currentDesc, nueva: newDesc, ml_id: mlId });
        console.log(`  [✓] actualizado`);
      } else {
        errors++;
        console.log(`  [error] no se pudo actualizar`);
      }
    } catch (e) {
      console.error(`  [error] ${e.message}`);
      errors++;
    }
  }

  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
  console.log(`\n--- Resumen ---`);
  console.log(`Actualizados: ${updated}`);
  console.log(`Ya tenían desc larga: ${skipped}`);
  console.log(`Sin match en ML: ${noMatch}`);
  console.log(`Errores: ${errors}`);
}

main().catch(console.error);
