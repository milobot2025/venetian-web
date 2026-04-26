const http = require('http');

const URLS = [
  'http://localhost:3000/',
  'http://localhost:3000/catalogo',
  'http://localhost:3000/contacto',
  'http://localhost:1338/api/productos',
];

const CONCURRENT_REQUESTS = 10;
const TOTAL_REQUESTS = 50;

async function runTest(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({
          url,
          status: res.statusCode,
          duration,
          size: data.length
        });
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 'error',
        duration: Date.now() - start,
        error: err.message
      });
    });
  });
}

async function main() {
  console.log('🚀 Iniciando prueba de carga...');
  console.log(`Peticiones totales: ${TOTAL_REQUESTS}`);
  console.log(`Concurrencia: ${CONCURRENT_REQUESTS}`);
  
  const results = [];
  
  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENT_REQUESTS) {
    const batch = [];
    for (let j = 0; j < CONCURRENT_REQUESTS && (i + j) < TOTAL_REQUESTS; j++) {
      const url = URLS[Math.floor(Math.random() * URLS.length)];
      batch.push(runTest(url));
    }
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    process.stdout.write('.');
  }
  
  console.log('\n\n📊 Resultados:');
  
  const successful = results.filter(r => r.status === 200 || r.status === 304);
  const failed = results.filter(r => r.status !== 200 && r.status !== 304);
  
  const avgDuration = successful.reduce((acc, r) => acc + r.duration, 0) / successful.length;
  const maxDuration = Math.max(...results.map(r => r.duration));
  const minDuration = Math.min(...successful.map(r => r.duration));
  
  console.log(`✅ Exitosas: ${successful.length}`);
  console.log(`❌ Fallidas: ${failed.length}`);
  console.log(`⏱️  Tiempo promedio: ${avgDuration.toFixed(2)}ms`);
  console.log(`⏱️  Tiempo máximo: ${maxDuration}ms`);
  console.log(`⏱️  Tiempo mínimo: ${minDuration}ms`);
  
  // Guardar en MD
  const fs = require('fs');
  const report = `# Pruebas de Rendimiento

Fecha: ${new Date().toLocaleString()}
Configuración: ${TOTAL_REQUESTS} peticiones, concurrencia ${CONCURRENT_REQUESTS}

## Métricas
- **Peticiones Exitosas:** ${successful.length} / ${TOTAL_REQUESTS}
- **Peticiones Fallidas:** ${failed.length}
- **Tiempo de Respuesta Promedio:** ${avgDuration.toFixed(2)}ms
- **Tiempo de Respuesta Máximo:** ${maxDuration}ms
- **Tiempo de Respuesta Mínimo:** ${minDuration}ms

## Conclusión
${avgDuration < 200 ? 'Excelente rendimiento.' : avgDuration < 500 ? 'Rendimiento aceptable.' : 'Se recomienda optimización.'}
`;
  
  fs.writeFileSync('PRUEBAS_RENDIMIENTO.md', report);
  console.log('📝 Reporte guardado en PRUEBAS_RENDIMIENTO.md');
}

main();
