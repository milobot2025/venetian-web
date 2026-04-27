'use strict';
// Genera public/product-images.json con mapping SKU → array de paths
// (ej: { "1911051155448117": ["/images/products/1911051155448117/0.jpg"] })

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public', 'images', 'products');
const OUT = path.join(__dirname, '..', 'public', 'product-images.json');
const OUT_LIB = path.join(__dirname, '..', 'lib', 'product-images.json');

const map = {};
for (const folder of fs.readdirSync(ROOT)) {
  const dir = path.join(ROOT, folder);
  if (!fs.statSync(dir).isDirectory()) continue;
  const files = fs.readdirSync(dir)
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => {
      const an = parseInt(a, 10), bn = parseInt(b, 10);
      if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
      return a.localeCompare(b);
    });
  if (!files.length) continue;
  // Use folder name as key (matches IDC/SKU when applicable)
  map[folder] = files.map(f => `/images/products/${folder}/${f}`);
}

fs.writeFileSync(OUT, JSON.stringify(map));
fs.writeFileSync(OUT_LIB, JSON.stringify(map));
console.log('Wrote', OUT, 'and', OUT_LIB);
console.log('Products with images:', Object.keys(map).length);
console.log('Total images:', Object.values(map).reduce((s, a) => s + a.length, 0));
