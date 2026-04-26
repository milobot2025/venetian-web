const fs = require('fs');
const path = require('path');

// Configuración de Strapi
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

/**
 * Sube una imagen a Strapi y devuelve su ID
 */
async function uploadImage(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      console.error(`Archivo no encontrado: ${imagePath}`);
      return null;
    }

    const formData = new FormData();
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = path.basename(imagePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' }); // Ajustar tipo si es necesario
    
    formData.append('files', blob, fileName);

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: formData
    });

    const data = await response.json();
    if (data && data[0] && data[0].id) {
      console.log(`Imagen subida: ${fileName} (ID: ${data[0].id})`);
      return data[0].id;
    }
    return null;
  } catch (error) {
    console.error(`Error subiendo imagen ${imagePath}:`, error);
    return null;
  }
}

/**
 * Busca una categoría por nombre o la crea si no existe
 */
async function findOrCreateCategory(name) {
  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Buscar existente
    const response = await fetch(`${STRAPI_URL}/api/categories?filters[name][$eq]=${name}`, {
      headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
    });
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0].id;
    }

    // Crear nueva
    const createResponse = await fetch(`${STRAPI_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { name, slug }
      })
    });
    const newData = await createResponse.json();
    return newData.data.id;
  } catch (error) {
    console.error(`Error buscando/creando categoría ${name}:`, error);
    return null;
  }
}

async function checkSlugExists(slug) {
  const response = await fetch(`${STRAPI_URL}/api/productos?filters[slug][$eq]=${slug}`, {
    headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
  });
  const data = await response.json();
  return data.data && data.data.length > 0;
}

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 2;
  while (await checkSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

async function importProducts(products) {
  for (const productData of products) {
    try {
      console.log(`\n--- Procesando: ${productData.sku} ---`);
      
      // 1. Manejar Categoría
      if (productData.categoryName) {
        const categoryId = await findOrCreateCategory(productData.categoryName);
        if (categoryId) {
          productData.category = categoryId;
        }
      }

      // 2. Manejar Imagen Principal
      if (productData.localImagePath) {
        const imageId = await uploadImage(productData.localImagePath);
        if (imageId) {
          productData.image = imageId;
        }
      }

      // 3. Manejar Galería de Imágenes
      if (productData.localGalleryPaths && Array.isArray(productData.localGalleryPaths)) {
        const galleryIds = [];
        for (const imgPath of productData.localGalleryPaths) {
          const id = await uploadImage(imgPath);
          if (id) galleryIds.push(id);
        }
        productData.images = galleryIds;
      }

      // 4. Generar Slug Único
      if (!productData.slug) {
        const base = (productData.title || 'producto')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        productData.slug = await generateUniqueSlug(base);
      }

      // 5. Enviar a Strapi (POST para crear)
      const response = await fetch(`${STRAPI_URL}/api/productos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: productData })
      });

      const result = await response.json();
      if (result.error) {
        console.error(`Error al crear ${productData.sku}:`, result.error.message);
      } else {
        console.log(`OK: Creado ${productData.sku} ID: ${result.data.id}`);
      }
      
    } catch (error) {
      console.error(`Error fatal en producto ${productData.sku}:`, error);
    }
  }
}

// Ejemplo de ejecución
async function main() {
  if (!STRAPI_TOKEN) {
    console.error('ERROR: Define STRAPI_TOKEN en el entorno.');
    return;
  }

  const productsToImport = [
    {
      title: "Consola de Mezcla Pro",
      description: "Mezcladora digital de 16 canales",
      price: 125000,
      sku: "CON-001",
      modelo: "X16D",
      categoryName: "Audio Pro",
      featured: true,
      localImagePath: "./public/placeholder.jpg", // Cambiar por ruta real
      localGalleryPaths: []
    }
  ];

  console.log('Iniciando importación...');
  await importProducts(productsToImport);
  console.log('Finalizado.');
}

main().catch(console.error);
