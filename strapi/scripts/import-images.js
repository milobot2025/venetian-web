'use strict';

/**
 * import-images.js (Strapi internal API)
 * Sube imágenes desde carpetas locales a Strapi y las linkea a productos.
 * Estructura: {IMAGES_ROOT}/{Categoría}/{NombreModelo o SKU}/img.jpg
 *
 * Uso: node strapi/scripts/import-images.js
 */

const { createStrapi } = require('@strapi/strapi');
const fs   = require('fs');
const path = require('path');

const IMAGES_ROOT = 'G:/Mi unidad/Novedades 2026';

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\-_]+/g, '');
}

function isSkuLike(name) {
  return /^\d{10,}$/.test(name.trim());
}

async function main() {
  const instance = await createStrapi({ distDir: './dist' }).load();

  try {
    // Cargar todos los productos
    console.log('📦 Cargando productos...');
    const products = await instance.documents('api::producto.producto').findMany({
      limit: 10000,
      fields: ['documentId', 'sku', 'modelo', 'title'],
    });
    console.log(`   ${products.length} productos`);

    const bySku    = {};
    const byModelo = {};
    for (const p of products) {
      if (p.sku)    bySku[p.sku.trim()]      = p;
      if (p.modelo) byModelo[norm(p.modelo)] = p;
      if (p.title)  byModelo[norm(p.title)]  = p;
    }

    let matched = 0, skipped = 0, errors = 0;

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

        // Buscar producto por SKU o modelo
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

        try {
          const uploadedIds = [];

          for (const imgFile of imgFiles) {
            const imgPath = path.join(folderPath, imgFile);
            const stats   = fs.statSync(imgPath);
            const ext     = path.extname(imgFile).toLowerCase();
            const mime    = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

            const [uploaded] = await instance.plugins.upload.services.upload.upload({
              data: { fileInfo: { name: imgFile, caption: '', alternativeText: '' } },
              files: {
                filepath:         imgPath,
                originalFilename: imgFile,
                mimetype:         mime,
                size:             stats.size,
              },
            });

            uploadedIds.push(uploaded.id);
          }

          await instance.documents('api::producto.producto').update({
            documentId: product.documentId,
            data: {
              image:  uploadedIds[0],
              images: uploadedIds,
            },
          });

          matched++;
        } catch (err) {
          console.error(`   ❌ ${err.message}`);
          errors++;
        }
      }
    }

    console.log(`\n✅ ${matched} productos con imágenes | ${skipped} sin match | ${errors} errores`);
  } finally {
    process.exit(0);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
