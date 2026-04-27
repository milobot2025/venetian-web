'use strict';
// Dump completo de productos + categorías a lib/products-dump.json
// Frontend usará esto como fuente principal (independiente de Strapi en runtime).

const fs = require('fs');
const path = require('path');

const BASE = 'https://strapi-backend-production-35d0.up.railway.app/api';

async function fetchAllProducts() {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${BASE}/productos?pagination[page]=${page}&pagination[pageSize]=100&fields[0]=title&fields[1]=subtitulo&fields[2]=slug&fields[3]=description&fields[4]=price&fields[5]=stock&fields[6]=featured&fields[7]=sku&fields[8]=modelo&fields[9]=categoryName&fields[10]=documentId`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`fetch productos page ${page}: ${r.status}`);
    const j = await r.json();
    all.push(...j.data);
    if (all.length >= j.meta.pagination.total) break;
    page++;
  }
  return all;
}

async function fetchCategories() {
  const r = await fetch(`${BASE}/categories?pagination[pageSize]=100&sort=name:asc`);
  const j = await r.json();
  return j.data.map(c => ({ id: c.documentId, name: c.name, slug: c.slug, description: c.description || '' }));
}

(async () => {
  console.log('📦 Fetching productos...');
  const productos = await fetchAllProducts();
  console.log(`  ${productos.length} productos`);

  console.log('📁 Fetching categories...');
  const categorias = await fetchCategories();
  console.log(`  ${categorias.length} categorías`);

  // Compute productCount per category from productos
  const counts = {};
  productos.forEach(p => {
    const k = p.categoryName;
    if (k) counts[k] = (counts[k] || 0) + 1;
  });
  const categoriasWithCount = categorias.map(c => ({ ...c, productCount: counts[c.name] || 0 }));

  const dump = {
    generatedAt: new Date().toISOString(),
    totalProducts: productos.length,
    productos: productos.map(p => ({
      id: String(p.id),
      documentId: p.documentId,
      title: p.title,
      subtitulo: p.subtitulo,
      slug: p.slug,
      description: p.description || '',
      price: p.price,
      sku: p.sku || '',
      modelo: p.modelo || '',
      categoryName: p.categoryName || 'uncategorized',
      featured: !!p.featured,
    })),
    categorias: categoriasWithCount,
  };

  const out = path.join(__dirname, '..', 'lib', 'products-dump.json');
  fs.writeFileSync(out, JSON.stringify(dump));
  console.log('Wrote', out);
  console.log('Size:', Math.round(fs.statSync(out).size / 1024), 'KB');
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
