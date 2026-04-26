/**
 * Upload product images to Railway Strapi and link them to products.
 * Uses parent folder name as product model name.
 * Run: node scripts/upload-images.js
 */
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const STRAPI_URL = 'https://strapi-backend-production-35d0.up.railway.app';
const API_TOKEN = 'b430d7dbda584ecc6b469fc1e68f5811097fab28d07dc3af21e966bf2c51b4f016daf99191f9d1409511d36167c2559d0fb7a22104177e9cdae17bcad85156b1a71d0cb8086be1dc2ca685f4b92b27e402827a8bff67501721bed818631fbf0a439ce48348295c2c9eb12d477d21535237860a0ce4c6dfa453d026b739d7aff0';
const IMAGES_DIR = 'G:/Mi unidad/Novedades 2026';

const headers = { Authorization: `Bearer ${API_TOKEN}` };

// Normalize a model name for fuzzy comparison: remove hyphens, spaces, underscores, lowercase
function normalize(str) {
  return str.toLowerCase().replace(/[-_\s]/g, '');
}

async function getAllProducts() {
  let all = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${STRAPI_URL}/api/productos?pagination[page]=${page}&pagination[pageSize]=100&populate=image`, { headers });
    const json = await res.json();
    const items = json.data || [];
    all = all.concat(items);
    if (items.length < 100) break;
    page++;
  }
  return all;
}

async function uploadFile(filePath) {
  const form = new FormData();
  form.append('files', fs.createReadStream(filePath), path.basename(filePath));
  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}`, ...form.getHeaders() },
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Upload failed (${res.status}): ${txt.slice(0, 200)}`);
  }
  const json = await res.json();
  return json[0];
}

async function linkImageToProduct(productDocumentId, imageId) {
  const res = await fetch(`${STRAPI_URL}/api/productos/${productDocumentId}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { image: imageId } }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Link failed (${res.status}): ${txt.slice(0, 200)}`);
  }
  return res.json();
}

function findProductForFolder(folderName, products) {
  const needle = normalize(folderName);

  let best = null;
  let bestScore = 0;

  for (const p of products) {
    const modelo = normalize(p.modelo || p.title || '');
    const sku = normalize(p.sku || '');

    if (modelo === needle || sku === needle) {
      return p;
    }

    // Partial match: one contains the other
    if (modelo.includes(needle) || needle.includes(modelo)) {
      if (modelo.length > 0) {
        const score = Math.min(modelo.length, needle.length) / Math.max(modelo.length, needle.length);
        if (score > bestScore) {
          bestScore = score;
          best = p;
        }
      }
    }
  }

  if (bestScore > 0.75) return best;
  return null;
}

function findImageFiles(dir) {
  const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
  const results = [];
  function walk(current, depth) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full, depth + 1);
      } else if (exts.has(path.extname(entry.name).toLowerCase())) {
        results.push(full);
      }
    }
  }
  walk(dir, 0);
  return results;
}

// Check if image file name is the "primary" one (no trailing number suffix)
function isPrimaryImage(filename) {
  const base = path.basename(filename, path.extname(filename)).trim();
  // If folder name === file base name, it's primary
  const folderName = path.basename(path.dirname(filename));
  return normalize(base) === normalize(folderName);
}

async function main() {
  console.log('Fetching products from Strapi...');
  const products = await getAllProducts();
  console.log(`Found ${products.length} products`);

  const imageFiles = findImageFiles(IMAGES_DIR);
  console.log(`Found ${imageFiles.length} image files\n`);

  let uploaded = 0;
  let linked = 0;
  let skipped = 0;
  let errors = 0;

  // Group files by their parent folder (= product model)
  const byFolder = {};
  for (const imgPath of imageFiles) {
    const folder = path.dirname(imgPath);
    if (!byFolder[folder]) byFolder[folder] = [];
    byFolder[folder].push(imgPath);
  }

  for (const [folder, files] of Object.entries(byFolder)) {
    const folderName = path.basename(folder);
    const product = findProductForFolder(folderName, products);

    if (!product) {
      console.log(`[SKIP] No product for folder: "${folderName}"`);
      skipped += files.length;
      continue;
    }

    const productModel = product.modelo || product.title;
    console.log(`\n[Folder] "${folderName}" → ${productModel} (doc: ${product.documentId})`);

    // Sort: primary first (file base matches folder name), then gallery
    files.sort((a, b) => {
      const aIsPrimary = isPrimaryImage(a) ? 0 : 1;
      const bIsPrimary = isPrimaryImage(b) ? 0 : 1;
      return aIsPrimary - bIsPrimary;
    });

    let primaryUploaded = false;

    for (const imgPath of files) {
      const filename = path.basename(imgPath);
      const isPrimary = isPrimaryImage(imgPath);

      // Skip if already has a real (recently uploaded) primary image (id > 200)
      if (isPrimary && product.image && product.image.id > 200) {
        console.log(`  [SKIP] ${filename} — already has real primary image (id=${product.image.id})`);
        skipped++;
        continue;
      }

      try {
        process.stdout.write(`  Uploading ${filename}...`);
        const file = await uploadFile(imgPath);
        uploaded++;
        process.stdout.write(` id=${file.id}`);

        if (isPrimary && !primaryUploaded) {
          await linkImageToProduct(product.documentId, file.id);
          linked++;
          primaryUploaded = true;
          process.stdout.write(` [PRIMARY LINKED]\n`);
        } else {
          process.stdout.write(` [gallery]\n`);
        }
      } catch (err) {
        errors++;
        console.log(`\n  [ERROR] ${filename}: ${err.message}`);
      }

      await new Promise(r => setTimeout(r, 150));
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Uploaded: ${uploaded}, Linked (primary): ${linked}, Skipped: ${skipped}, Errors: ${errors}`);
}

main().catch(console.error);
