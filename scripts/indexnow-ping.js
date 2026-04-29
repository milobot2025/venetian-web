'use strict';
// Notifica a Bing/Yandex via IndexNow que el sitio se actualizó.
// Ejecutado en cada deploy.

const fs = require('fs');
const path = require('path');

const SITE = 'https://venetian.com.ar';
const KEY = 'ad564655f760cd5b1db761c28c0cc9d6';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

async function ping() {
  // Toma URLs principales del sitemap (estáticas)
  const urls = [
    `${SITE}/`,
    `${SITE}/catalogo`,
    `${SITE}/contacto`,
    `${SITE}/donde-comprar`,
    `${SITE}/recursos`,
    `${SITE}/soporte`,
  ];

  // Bonus: agrega productos del dump si existe
  try {
    const dump = require(path.join(__dirname, '..', 'lib', 'products-dump.json'));
    if (Array.isArray(dump.productos)) {
      for (const p of dump.productos.slice(0, 100)) {
        urls.push(`${SITE}/producto/${p.documentId}`);
      }
    }
  } catch {}

  const body = { host: 'venetian.com.ar', key: KEY, keyLocation: KEY_LOCATION, urlList: urls };

  for (const endpoint of ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow', 'https://yandex.com/indexnow']) {
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      console.log(endpoint, '→', r.status);
    } catch (e) { console.log(endpoint, 'err', e.message); }
  }
}
ping();
