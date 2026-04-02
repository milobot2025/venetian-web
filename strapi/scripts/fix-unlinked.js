const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

/**
 * Script para corregir productos sin relación con categorías
 * Busca productos sin entrada en productos_category_lnk y los vincula
 */

async function fixUnlinkedProducts() {
  try {
    console.log('🔍 Buscando productos sin relación con categorías...');
    
    // 1. Conectar a la base de datos SQLite de Strapi
    const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
    
    if (!fs.existsSync(dbPath)) {
      console.error(`❌ Base de datos no encontrada: ${dbPath}`);
      return;
    }
    
    const db = new Database(dbPath);
    
    // 2. Buscar productos sin relación en productos_category_lnk
    const unlinkedProducts = db.prepare(`
      SELECT p.id, p.category_name, p.sku, p.title
      FROM productos p
      LEFT JOIN productos_category_lnk pcl ON p.id = pcl.product_id
      WHERE pcl.product_id IS NULL
      AND p.category_name IS NOT NULL
      AND p.category_name != ''
    `).all();
    
    console.log(`📊 Productos sin relación encontrados: ${unlinkedProducts.length}`);
    
    if (unlinkedProducts.length === 0) {
      console.log('✅ Todos los productos ya tienen relación con categorías');
      db.close();
      return;
    }
    
    // 3. Procesar cada producto sin relación
    let linkedCount = 0;
    let categoryNotFoundCount = 0;
    
    for (const product of unlinkedProducts) {
      console.log(`\n🔧 Procesando: ${product.sku} - ${product.title}`);
      console.log(`   Categoría en producto: "${product.category_name}"`);
      
      // Buscar categoría por nombre
      const category = db.prepare(`
        SELECT id FROM categories 
        WHERE name = ? COLLATE NOCASE
        LIMIT 1
      `).get(product.category_name);
      
      if (!category) {
        console.log(`   ⚠️  Categoría no encontrada, omitiendo...`);
        categoryNotFoundCount++;
        continue;
      }
      
      console.log(`   ✅ Categoría encontrada: ID ${category.id}`);
      
      // Insertar relación en productos_category_lnk
      try {
        // Determinar el próximo category_order para esta categoría
        const maxOrder = db.prepare(`
          SELECT MAX(category_order) as max_order 
          FROM productos_category_lnk 
          WHERE category_id = ?
        `).get(category.id);
        
        const nextOrder = (maxOrder.max_order || 0) + 1;
        
        // Insertar relación
        const insertStmt = db.prepare(`
          INSERT INTO productos_category_lnk (product_id, category_id, category_order)
          VALUES (?, ?, ?)
        `);
        
        insertStmt.run(product.id, category.id, nextOrder);
        
        console.log(`   🔗 Relación creada: producto_id=${product.id}, category_id=${category.id}, order=${nextOrder}`);
        linkedCount++;
        
      } catch (error) {
        console.log(`   ❌ Error al crear relación: ${error.message}`);
      }
    }
    
    // 4. Cerrar conexión y mostrar resultados
    db.close();
    
    console.log('\n📋 Resumen de corrección:');
    console.log(`✅ Productos vinculados: ${linkedCount}`);
    console.log(`⚠️  Categorías no encontradas: ${categoryNotFoundCount}`);
    console.log(`📊 Total procesados: ${unlinkedProducts.length}`);
    
  } catch (error) {
    console.error('❌ Error en fix-unlinked:', error.message);
    process.exit(1);
  }
}

// Ejecutar script
if (require.main === module) {
  fixUnlinkedProducts();
}

module.exports = fixUnlinkedProducts;
