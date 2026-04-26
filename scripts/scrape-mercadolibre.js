const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Extrae datos de producto de MercadoLibre desde un URL
 * @param {string} url - URL de MercadoLibre
 * @returns {Promise<object>} Datos del producto
 */
async function scrapeMercadoLibre(url) {
    try {
        console.log(`Scraping ${url}`);
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            timeout: 10000,
        });

        const $ = cheerio.load(html);

        // Buscar JSON-LD de producto (schema.org/Product)
        let productData = null;
        let scriptCount = 0;
        $('script[type="application/ld+json"]').each((i, el) => {
            scriptCount++;
            try {
                const jsonText = $(el).text();
                const data = JSON.parse(jsonText);
                console.log(`Script ${i}: @type = ${data['@type']}`);
                if (data['@type'] === 'Product') {
                    productData = data;
                    console.log('✅ Producto encontrado');
                    return false; // stop iteration
                }
            } catch (err) {
                console.log(`Script ${i}: Error parseando JSON - ${err.message}`);
            }
        });
        console.log(`Total scripts: ${scriptCount}`);

        if (!productData) {
            throw new Error('No se encontró JSON-LD de producto');
        }

        // Extraer imágenes adicionales del carrusel
        const imageUrls = new Set();
        // Agregar la imagen principal
        if (productData.image) {
            imageUrls.add(productData.image);
        }
        // Buscar imágenes en el carrusel (thumbnails)
        $('.ui-pdp-gallery__figure img').each((i, el) => {
            const src = $(el).attr('src');
            if (src && src.startsWith('http')) {
                // Convertir thumbnail a imagen grande (remover parámetros de tamaño)
                const cleanUrl = src.replace(/\?.*$/, '').replace(/\/[^\/]+$/, (match) => {
                    // Si es thumbnail, intentar obtener la versión grande
                    if (src.includes('thumb')) {
                        return src.replace('/thumb/', '/');
                    }
                    return match;
                });
                imageUrls.add(cleanUrl);
            }
        });

        // Descripción detallada (puede estar en múltiples secciones)
        let detailedDescription = '';
        $('.ui-pdp-description__content').each((i, el) => {
            detailedDescription += $(el).text().trim() + '\n';
        });
        if (!detailedDescription.trim()) {
            // Fallback a description del JSON-LD
            detailedDescription = productData.description || '';
        }

        // Especificaciones técnicas (tabla)
        const specifications = {};
        $('.ui-pdp-specs__table tr').each((i, row) => {
            const key = $(row).find('th').text().trim();
            const value = $(row).find('td').text().trim();
            if (key && value) {
                specifications[key] = value;
            }
        });

        // Precio (del JSON-LD o de la página)
        let price = null;
        if (productData.offers && productData.offers.price) {
            price = productData.offers.price;
        } else {
            const priceText = $('.ui-pdp-price__part').first().text().trim();
            const match = priceText.match(/[\d.,]+/);
            if (match) {
                price = parseFloat(match[0].replace(/\./g, '').replace(',', '.'));
            }
        }

        // SKU y modelo
        const sku = productData.sku || productData.productID || '';
        const modelFromTitle = productData.name.match(/([A-Za-z0-9\-]+)/)?.[1] || '';

        return {
            url,
            sku,
            title: productData.name,
            brand: productData.brand || '',
            price,
            currency: productData.offers?.priceCurrency || 'ARS',
            description: detailedDescription.trim(),
            shortDescription: productData.description || '',
            imageUrls: Array.from(imageUrls),
            specifications,
            rawData: productData, // JSON-LD completo por si acaso
        };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        throw error;
    }
}

/**
 * Procesa una lista de URLs y guarda resultados en JSON
 * @param {Array<{modelo: string, url: string}>} items - Lista de modelos y URLs
 * @param {string} outputPath - Ruta para guardar JSON
 */
async function processUrls(items, outputPath) {
    const results = [];
    for (const item of items) {
        try {
            const data = await scrapeMercadoLibre(item.url);
            results.push({
                modelo: item.modelo,
                ...data,
            });
            console.log(`✅ ${item.modelo} procesado`);
            // Esperar 2 segundos entre requests para ser amable
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`❌ Error con ${item.modelo}:`, error.message);
            results.push({
                modelo: item.modelo,
                url: item.url,
                error: error.message,
            });
        }
    }

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`\n${results.length} resultados guardados en ${outputPath}`);
}

// Ejemplo de uso
if (require.main === module) {
    // Si se ejecuta directamente, prueba con el URL proporcionado
    const testUrl = 'https://www.mercadolibre.com.ar/venetian-vt-b100-cabezal-movil-beam-led-100w/p/MLA53396603';
    scrapeMercadoLibre(testUrl)
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            console.log('\n✅ Extracción exitosa');
        })
        .catch(err => {
            console.error('❌ Error:', err.message);
            process.exit(1);
        });
}

module.exports = { scrapeMercadoLibre, processUrls };