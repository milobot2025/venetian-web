const axios = require('axios');
const cheerio = require('cheerio');

async function debug() {
    const url = 'https://www.mercadolibre.com.ar/venetian-vt-b100-cabezal-movil-beam-led-100w/p/MLA53396603';
    const { data: html } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const $ = cheerio.load(html);
    
    console.log('Total script tags:', $('script[type="application/ld+json"]').length);
    
    $('script[type="application/ld+json"]').each((i, el) => {
        console.log(`\n=== Script ${i} ===`);
        const text = $(el).text();
        console.log('Primeros 200 chars:', text.substring(0, 200));
        try {
            const data = JSON.parse(text);
            console.log('@type:', data['@type']);
            if (data['@type'] === 'Product') {
                console.log('¡Producto encontrado!');
                console.log('Nombre:', data.name);
                console.log('Imagen:', data.image);
            }
        } catch (err) {
            console.log('Error parseando JSON:', err.message);
        }
    });
}

debug().catch(console.error);