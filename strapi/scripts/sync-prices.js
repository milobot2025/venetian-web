const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

/**
 * Script para sincronizar precios y stock desde un archivo JSON externo
 * Formato esperado: { "modelo1": { "sku": "ABC123", "precio": 1000, "stock": "En stock" }, ... }
 */

async function syncPrices() {
  try {
    console.log('🔄 Iniciando sincronización de precios y stock...');
    
    // 1. Leer archivo JSON externo
    const jsonPath = 'C:/Users/User/milobot/data/products_venetian.json';
    
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ Archivo no encontrado: ${jsonPath}`);
      return;
    }
    
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`📊 Productos en JSON: ${Object.keys(jsonData).length}`);
    
    // 2. Conectar a la base de datos SQLite de Strapi
    const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
    
    if (!fs.existsSync(dbPath)) {
      console.error(`❌ Base de datos no encontrada: ${dbPath}`);
      return;
    }
    
    const db = new Database(dbPath);
    
    // 3. Preparar statement para actualizar productos
    const updateStmt = db.prepare(`
      UPDATE productos 
      SET price = ?, stock = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE sku = ?
    `);
    
    // 4. Procesar cada producto del JSON
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const [model, productData] of Object.entries(jsonData)) {
      const { sku, precio, stock } = productData;
      
      if (!sku) {
        console.warn(`⚠️  Modelo "${model}" sin SKU, omitiendo...`);
        continue;
      }
      
      // Verificar si el producto existe
      const productExists = db.prepare(
        'SELECT COUNT(*) as count FROM productos WHERE sku = ?'
      ).get(sku);
      
      if (productExists.count === 0) {
        console.warn(`⚠️  SKU "${sku}" no encontrado en base de datos`);
        notFoundCount++;
        continue;
      }
      
      // Actualizar producto
      const result = updateStmt.run(precio, stock, sku);
      
      if (result.changes > 0) {
        updatedCount++;
        console.log(`✅ Actualizado: ${sku} - Precio: ${precio}, Stock: ${stock}`);
      }
    }
    
    // 5. Cerrar conexión y mostrar resultados
    db.close();
    
    console.log('\n📋 Resumen de sincronización:');
    console.log(`✅ Productos actualizados: ${updatedCount}`);
    console.log(`⚠️  SKUs no encontrados: ${notFoundCount}`);
    console.log(`📊 Total procesados: ${Object.keys(jsonData).length}`);
    
  } catch (error) {
    console.error('❌ Error en sync-prices:', error.message);
    process.exit(1);
  }
}

// Ejecutar script
if (require.main === module) {
  syncPrices();
}

module.exports = syncPrices;
