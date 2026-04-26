const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Rutas
const excelPath = path.join(__dirname, '../../../Venetian Marzo V2.xlsx');
const rubrosPath = path.join(__dirname, '../../../venetian web.json');
const outputPath = path.join(__dirname, 'products-data.json');

console.log('Leyendo Excel:', excelPath);
console.log('Leyendo rubros:', rubrosPath);

// Leer JSON de rubros
const rubrosRaw = fs.readFileSync(rubrosPath, 'utf8');
const rubrosMap = JSON.parse(rubrosRaw);

// Crear mapa SKU -> rubro
const skuToRubro = {};
Object.values(rubrosMap).forEach(item => {
    if (item.modelo && item.rubro) {
        // Nota: el JSON tiene IDs largos como claves, pero el item tiene modelo y rubro
        // El modelo en JSON parece ser el mismo que en Excel
        // Vamos a mapear por modelo (o SKU?) 
        // El Excel tiene columna SKU (ID numérico) y MODELO (código)
        // El JSON tiene modelo = código de modelo (ej: AC535)
        // Así que mapearemos por modelo
        skuToRubro[item.modelo] = item.rubro;
    }
});

console.log(`Mapeados ${Object.keys(skuToRubro).length} rubros por modelo`);

// Leer Excel
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Encontrar fila de encabezados (buscar fila que contenga 'SKU')
let headerRowIndex = -1;
let headerRow = [];
for (let i = 0; i < Math.min(20, data.length); i++) {
    if (data[i] && data[i].includes('SKU')) {
        headerRowIndex = i;
        headerRow = data[i];
        break;
    }
}
if (headerRowIndex === -1) {
    throw new Error('No se encontró fila de encabezados con SKU');
}
console.log('Encabezados en fila', headerRowIndex);
console.log('Columnas:', headerRow);

// Mapear índices de columnas
const colIndex = {};
headerRow.forEach((col, idx) => {
    if (col) colIndex[col.trim()] = idx;
});
console.log('Índices:', colIndex);

// Filas de datos empiezan después de headerRowIndex + 1 (hay una fila FILTRO)
const startRow = headerRowIndex + 2; // headerRowIndex es fila de SKU, siguiente fila es FILTRO, luego datos
const products = [];

// Contadores
let skipped = 0;
let processed = 0;

for (let i = startRow; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    // Obtener valores
    const sku = row[colIndex['SKU']];
    const modelo = row[colIndex['MODELO']];
    const descripcion = row[colIndex['DESCRIPCION']];
    const precioPublico = row[colIndex['PUBLICO IVA INCLUIDO']];
    const precioComercio = row[colIndex['COMERCIO ']]; // tiene espacio al final
    const stock = row[colIndex['STOCK']];
    
    // Validar
    if (!sku && !modelo) {
        skipped++;
        continue;
    }
    
    // Determinar precio: usar PUBLICO IVA INCLUIDO (precio final)
    let precio = precioPublico;
    if (typeof precio !== 'number' || precio <= 0) {
        // Si no hay precio público, intentar con precio comercio
        precio = precioComercio;
    }
    if (typeof precio !== 'number' || precio <= 0) {
        // Si aún no hay precio, omitir
        skipped++;
        continue;
    }
    
    // Determinar rubro
    let rubro = null;
    if (modelo && skuToRubro[modelo]) {
        rubro = skuToRubro[modelo];
    } else if (sku && skuToRubro[sku]) {
        rubro = skuToRubro[sku];
    } else {
        // Intentar buscar por coincidencia parcial
        const modeloUpper = modelo ? modelo.toUpperCase() : '';
        const foundKey = Object.keys(skuToRubro).find(key => 
            modeloUpper.includes(key.toUpperCase()) || key.toUpperCase().includes(modeloUpper)
        );
        if (foundKey) {
            rubro = skuToRubro[foundKey];
        }
    }
    
    // Limpiar descripción (puede tener saltos de línea)
    const descClean = typeof descripcion === 'string' ? descripcion.replace(/\n/g, ' ').trim() : '';
    
    // Crear slug (usar modelo o SKU)
    const slugBase = modelo || sku.toString();
    const slug = slugBase
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    
    products.push({
        sku: sku ? sku.toString() : null,
        modelo: modelo ? modelo.toString() : null,
        title: modelo ? modelo.toString() : `SKU ${sku}`,
        slug,
        description: descClean,
        price: Math.round(precio * 100) / 100, // dos decimales
        rubro,
        stock: stock ? stock.toString() : null,
        rawData: {
            precioPublico,
            precioComercio,
            rowIndex: i
        }
    });
    
    processed++;
}

console.log(`Procesados: ${processed}, Omitidos: ${skipped}`);
console.log(`Total productos listos: ${products.length}`);

// Agrupar rubros únicos
const rubrosUnicos = {};
products.forEach(p => {
    if (p.rubro) {
        rubrosUnicos[p.rubro] = (rubrosUnicos[p.rubro] || 0) + 1;
    }
});
console.log('\nRubros encontrados:');
Object.entries(rubrosUnicos).forEach(([rubro, count]) => {
    console.log(`  ${rubro}: ${count} productos`);
});

// Guardar datos
const outputData = {
    meta: {
        total: products.length,
        processed,
        skipped,
        rubrosCount: Object.keys(rubrosUnicos).length
    },
    products,
    rubros: Object.keys(rubrosUnicos).map(name => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Productos de ${name}`
    }))
};

fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
console.log(`\nDatos guardados en ${outputPath}`);

// Mostrar algunos ejemplos
console.log('\nEjemplos de productos:');
products.slice(0, 5).forEach(p => {
    console.log(`- ${p.modelo}: ${p.title} | $${p.price} | Rubro: ${p.rubro || 'N/A'}`);
});