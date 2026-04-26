'use strict';

/**
 * import-images-direct.js
 * Copia imágenes a public/uploads y las inserta directo en SQLite.
 * No necesita Strapi corriendo.
 *
 * Uso: (desde strapi/) node scripts/import-images-direct.js
 */

const Database = require('better-sqlite3');
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const IMAGES_ROOT  = 'G:/Mi unidad/Novedades 2026';
const UPLOADS_DIR  = path.join(__dirname, '..', 'public', 'uploads');
const DB_PATH      = path.join(__dirname, '..', '.tmp', 'data.db');

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\-_]+/g, '');
}
function isSkuLike(name) { return /^\d{10,}$/.test(name.trim()); }
function slugify(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

// Asegurar carpeta uploads
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Cargar productos
const products = db.prepare('SELECT id, document_id, sku, modelo, title FROM productos').all();
console.log(`📦 ${products.length} productos en DB`);

const bySku    = {};
const byModelo = {};
for (const p of products) {
  if (p.sku)    bySku[p.sku.trim()]      = p;
  if (p.modelo) byModelo[norm(p.modelo)] = p;
  if (p.title)  byModelo[norm(p.title)]  = p;
}

// Obtener el max id actual de files
let fileId = (db.prepare('SELECT COALESCE(MAX(id),0) as m FROM files').get().m) + 1;
const now  = new Date().toISOString();

const insertFile = db.prepare(`
  INSERT INTO files (
    document_id, name, alternative_text, caption, width, height,
    formats, hash, ext, provider, size, url, mime,
    created_at, updated_at, published_at, created_by_id, updated_by_id,
    provider_metadata, folder_path, locale
  ) VALUES (
    ?, ?, '', '', NULL, NULL,
    NULL, ?, ?, 'local', ?, ?, ?,
    ?, ?, ?, NULL, NULL,
    NULL, '/', NULL
  )
`);

const insertRelation = db.prepare(`
  INSERT OR IGNORE INTO files_related_mph
    (file_id, related_id, related_type, field, "order")
  VALUES (?, ?, 'api::producto.producto', ?, ?)
`);

let matched = 0, skipped = 0;

const catFolders = fs.readdirSync(IMAGES_ROOT).filter(d =>
  fs.statSync(path.join(IMAGES_ROOT, d)).isDirectory()
);

for (const cat of catFolders) {
  const catPath = path.join(IMAGES_ROOT, cat);
  const modelFolders = fs.readdirSync(catPath).filter(d =>
    fs.statSync(path.join(catPath, d)).isDirectory()
  );

  for (const folder of modelFolders) {
    const folderPath = path.join(catPath, folder);

    let product = null;
    if (isSkuLike(folder)) {
      product = bySku[folder.trim()];
    } else {
      product = byModelo[norm(folder)];
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

    const imgFiles = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort();

    if (imgFiles.length === 0) { skipped++; continue; }

    console.log(`📸 ${folder} → ${product.modelo || product.title} (${imgFiles.length} imgs)`);

    const uploadedFileIds = [];

    db.transaction(() => {
      for (let i = 0; i < imgFiles.length; i++) {
        const imgFile  = imgFiles[i];
        const srcPath  = path.join(folderPath, imgFile);
        const ext      = path.extname(imgFile).toLowerCase();
        const baseName = path.basename(imgFile, ext);
        const hash     = slugify(baseName) + '_' + crypto.randomBytes(4).toString('hex');
        const destName = hash + ext;
        const destPath = path.join(UPLOADS_DIR, destName);
        const stats    = fs.statSync(srcPath);
        const mime     = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        const url      = `/uploads/${destName}`;
        const docId    = crypto.randomBytes(12).toString('hex');

        // Copiar imagen
        fs.copyFileSync(srcPath, destPath);

        // Insertar en files
        insertFile.run(
          docId, imgFile,
          hash, ext.replace('.', ''),
          Math.round(stats.size / 1024), url, mime,
          now, now, now
        );

        const currentFileId = fileId++;
        uploadedFileIds.push(currentFileId);

        // Relación con el producto
        // Campo 'image' para la primera, 'images' para todas
        if (i === 0) {
          insertRelation.run(currentFileId, product.id, 'image', 0);
        }
        insertRelation.run(currentFileId, product.id, 'images', i);
      }
    })();

    matched++;
  }
}

db.close();
console.log(`\n✅ ${matched} productos con imágenes | ${skipped} sin match`);
