'use strict';

/**
 * migrate-to-postgres.js
 * Migra datos de SQLite local a PostgreSQL (Railway).
 * Las tablas ya fueron creadas por Strapi al arrancar.
 * Uso: DATABASE_URL="postgres://..." node scripts/migrate-to-postgres.js
 */

const Database = require('better-sqlite3');
const { Client } = require('pg');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '.tmp', 'data.db');
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no definida');
  process.exit(1);
}

// Convierte timestamp en milisegundos a Date ISO
function msToDate(ms) {
  if (!ms) return null;
  const n = Number(ms);
  if (isNaN(n) || n <= 0) return null;
  try { return new Date(n).toISOString(); } catch { return null; }
}

async function main() {
  const sqlite = new Database(DB_PATH);
  sqlite.pragma('journal_mode = WAL');

  const pg = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pg.connect();
  console.log('✅ Conectado a PostgreSQL\n');

  try {
    // ── 1. Verificar que las tablas existen (Strapi las creó) ─────────────────
    const tables = await pg.query(`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
      AND tablename IN ('categories','productos','files','files_related_mph','productos_category_lnk')
    `);
    console.log('Tablas encontradas en PG:', tables.rows.map(r => r.tablename).join(', '), '\n');

    // ── 2. Categorías ─────────────────────────────────────────────────────────
    const categories = sqlite.prepare('SELECT * FROM categories').all();
    console.log(`📂 Migrando ${categories.length} categorías...`);
    for (const c of categories) {
      await pg.query(
        `INSERT INTO categories (id,document_id,name,slug,description,created_at,updated_at,published_at,created_by_id,updated_by_id,locale)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (id) DO NOTHING`,
        [c.id, c.document_id, c.name, c.slug, c.description,
         msToDate(c.created_at), msToDate(c.updated_at), msToDate(c.published_at),
         c.created_by_id, c.updated_by_id, c.locale]
      );
    }
    // Reset sequence
    await pg.query(`SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1))`);
    console.log(`   ✅ ${categories.length} categorías\n`);

    // ── 3. Productos ──────────────────────────────────────────────────────────
    const productos = sqlite.prepare('SELECT * FROM productos').all();
    console.log(`📦 Migrando ${productos.length} productos...`);
    let i = 0;
    for (const p of productos) {
      await pg.query(
        `INSERT INTO productos (id,document_id,title,slug,description,price,stock,featured,sku,modelo,category_name,created_at,updated_at,published_at,created_by_id,updated_by_id,locale)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.document_id, p.title, p.slug, p.description, p.price, p.stock,
         p.featured ? true : false, p.sku, p.modelo, p.category_name,
         msToDate(p.created_at), msToDate(p.updated_at), msToDate(p.published_at),
         p.created_by_id, p.updated_by_id, p.locale]
      );
      if (++i % 100 === 0) console.log(`   ${i}/${productos.length}...`);
    }
    await pg.query(`SELECT setval('productos_id_seq', COALESCE((SELECT MAX(id) FROM productos), 1))`);
    console.log(`   ✅ ${productos.length} productos\n`);

    // ── 4. Files ──────────────────────────────────────────────────────────────
    const files = sqlite.prepare('SELECT * FROM files').all();
    console.log(`🖼️  Migrando ${files.length} archivos...`);
    for (const f of files) {
      await pg.query(
        `INSERT INTO files (id,document_id,name,alternative_text,caption,width,height,hash,ext,mime,size,url,provider,folder_path,created_at,updated_at,published_at,created_by_id,updated_by_id,locale)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
         ON CONFLICT (id) DO NOTHING`,
        [f.id, f.document_id, f.name, f.alternative_text, f.caption, f.width, f.height,
         f.hash, f.ext, f.mime, f.size, f.url, f.provider, f.folder_path,
         msToDate(f.created_at), msToDate(f.updated_at), msToDate(f.published_at),
         f.created_by_id, f.updated_by_id, f.locale]
      );
    }
    await pg.query(`SELECT setval('files_id_seq', COALESCE((SELECT MAX(id) FROM files), 1))`);
    console.log(`   ✅ ${files.length} archivos\n`);

    // ── 5. files_related_mph ──────────────────────────────────────────────────
    const relations = sqlite.prepare('SELECT * FROM files_related_mph').all();
    console.log(`🔗 Migrando ${relations.length} relaciones de archivos...`);
    for (const r of relations) {
      await pg.query(
        `INSERT INTO files_related_mph (id,file_id,related_id,related_type,field,"order")
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO NOTHING`,
        [r.id, r.file_id, r.related_id, r.related_type, r.field, r.order]
      );
    }
    await pg.query(`SELECT setval('files_related_mph_id_seq', COALESCE((SELECT MAX(id) FROM files_related_mph), 1))`);
    console.log(`   ✅ ${relations.length} relaciones\n`);

    // ── 6. productos_category_lnk ─────────────────────────────────────────────
    const catLinks = sqlite.prepare('SELECT * FROM productos_category_lnk').all();
    console.log(`🔗 Migrando ${catLinks.length} vínculos producto-categoría...`);
    for (const lnk of catLinks) {
      await pg.query(
        `INSERT INTO productos_category_lnk (id,producto_id,category_id,producto_ord)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (id) DO NOTHING`,
        [lnk.id, lnk.producto_id, lnk.category_id, lnk.producto_ord]
      );
    }
    await pg.query(`SELECT setval('productos_category_lnk_id_seq', COALESCE((SELECT MAX(id) FROM productos_category_lnk), 1))`);
    console.log(`   ✅ ${catLinks.length} vínculos\n`);

    console.log('🎉 Migración completada exitosamente.');
  } catch (err) {
    console.error('❌ Error durante migración:', err.message);
    throw err;
  } finally {
    sqlite.close();
    await pg.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
