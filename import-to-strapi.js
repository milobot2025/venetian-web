// Configuración de Strapi
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

// Función para verificar si un slug ya existe
async function checkSlugExists(slug) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/productos?filters[slug][$eq]=${slug}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data.data && data.data.length > 0;
  } catch (error) {
    console.error(`Error verificando slug ${slug}:`, error);
    return false;
  }
}

// Función para generar slug único con sufijo numérico
async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 2;
  
  while (await checkSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// Función para procesar cada producto con trim y slug único
async function processProduct(productData) {
  try {
    // 1. Trim de campos
    productData.title = productData.title?.trim() || '';
    productData.modelo = productData.modelo?.trim() || '';
    productData.description = productData.description?.trim() || '';
    productData.sku = productData.sku?.trim() || '';
    
    // 2. Generar slug base (si no existe)
    if (!productData.slug) {
      const baseSlug = productData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Validar que el slug no esté vacío después del trim
      let finalBaseSlug = baseSlug;
      if (!finalBaseSlug || finalBaseSlug.length === 0) {
        finalBaseSlug = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      
      // Limitar longitud del slug
      if (finalBaseSlug.length > 240) {
        finalBaseSlug = finalBaseSlug.substring(0, 240);
      }
      
      // 3. Verificar y generar slug único
      productData.slug = await generateUniqueSlug(finalBaseSlug);
    } else {
      // Si ya hay slug, igual aplica trim
      productData.slug = productData.slug.trim();
    }
    
    // 4. Continuar con la lógica existente de creación/actualización...
    // Esta función debe devolver el productData procesado
    return productData;
    
  } catch (error) {
    console.error(`Error procesando producto ${productData.sku}:`, error);
    throw error;
  }
}

// Función principal para importar productos
async function importProducts(products) {
  for (const productData of products) {
    try {
      // Procesar producto (trim y slug único)
      const processedProduct = await processProduct(productData);
      
      console.log(`Procesando producto: ${processedProduct.sku} con slug: ${processedProduct.slug}`);
      
      // Aquí iría la lógica existente para creación/actualización en Strapi
      // Por ejemplo:
      // const response = await fetch(`${STRAPI_URL}/api/productos`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${STRAPI_TOKEN}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ data: processedProduct })
      // });
      // 
      // const result = await response.json();
      // console.log('Producto creado/actualizado:', result);
      
    } catch (error) {
      console.error(`Error procesando producto ${productData.sku}:`, error);
    }
  }
}

// Exportar funciones si es necesario (para módulos ES)
// module.exports = { importProducts, processProduct };
