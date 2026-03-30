// API client for static data (temporary) - will switch to Strapi later
const STATIC_DATA_URL = '/products-data.json';

// Static data types
export interface StaticProduct {
  sku: string;
  modelo: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  rubro: string;
  stock: string;
}

export interface StaticCategory {
  name: string;
  slug: string;
  description: string;
}

export interface StaticData {
  meta: {
    total: number;
    processed: number;
    skipped: number;
    rubrosCount: number;
  };
  products: StaticProduct[];
  rubros: StaticCategory[];
}

// Image mapping for products by category/model
function getProductImageUrl(product: StaticProduct): string {
  // SKU-specific images
  const skuImages: Record<string, string> = {
    '2602251754308114': '/images/products/2602251754308114.jpg',
    '2602251754334686': '/images/products/2602251754334686.jpg',
  };
  // Map for cabezal products (moving heads) - using realistic stage lighting images
  const cabezalImages: Record<string, string> = {
    'QUANTUM 60': 'https://images.unsplash.com/photo-1501959181532-7d2a3c064642?w=800&h=800&fit=crop&crop=center',
    'BEAMCORE 150': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop&crop=center',
    'BEAMCORE 150 KIT': 'https://images.unsplash.com/photo-1465799524660-91c7e1ab2c0f?w=800&h=800&fit=crop&crop=center',
    'X-PHOTON': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=800&fit=crop&crop=center',
    'VT-B100': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'VT-M0740': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop&crop=center',
    'VT-M1915R': 'https://images.unsplash.com/photo-1501959181532-7d2a3c064642?w=800&h=800&fit=crop&crop=center',
    'VT-M60': 'https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?w=800&h=800&fit=crop&crop=center',
    'VT-M70S': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop&crop=center',
    'VT-MH230N': 'https://images.unsplash.com/photo-1465799524660-91c7e1ab2c0f?w=800&h=800&fit=crop&crop=center',
    'VT-S30': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=800&fit=crop&crop=center',
    'VT-S35': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
  };

  // Other category images
  const categoryImages: Record<string, string> = {
    'microfono': 'https://images.unsplash.com/photo-1581600140688-8a1e9c4b16b5?w=800&h=800&fit=crop',
    'parlante techo': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    'amplificador': 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=800&fit=crop',
    'cable dmx': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop',
    'cable xlr': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop',
    'consola de audio': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop',
    'consola dmx': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=800&fit=crop',
    'maquina de humo': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop',
    'laser': 'https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=800&h=800&fit=crop',
    'microfono inalambrico': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=800&fit=crop',
    'manguera de sonido': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop',
    'ficha xlr': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop',
    'cable instrumento': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop',
    'soporte': 'https://images.unsplash.com/photo-1551632811-561732d76471?w=800&h=800&fit=crop',
    'par led': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop',
  };

  // Check for SKU-specific image first
  if (skuImages[product.sku]) {
    return skuImages[product.sku];
  }

  // Then check for specific model image
  if (cabezalImages[product.title]) {
    return cabezalImages[product.title];
  }

  // Then check for category image
  if (product.rubro && categoryImages[product.rubro]) {
    return categoryImages[product.rubro];
  }

  // Default placeholder for other products
  return '/images/products/placeholder.jpg';
}

// Mappers
export function mapToProduct(product: StaticProduct) {
  return {
    id: product.slug,  // Cambiar de product.sku a product.slug
    name: product.title,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    category: product.rubro || 'uncategorized',
    sku: product.sku || '',  // Mantener el SKU para referencia
    rating: 4.5,
    imageUrl: getProductImageUrl(product),
    specifications: {},
  };
}

export function mapToCategory(category: StaticCategory, productCount?: number) {
  return {
    id: category.slug,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    productCount: productCount || 0,
  };
}

// Load static data
let cachedData: StaticData | null = null;

async function loadStaticData(): Promise<StaticData> {
  // Determine environment safely
  const isServer = typeof window === 'undefined';
  const isDevelopment = 
    (isServer && process.env.NODE_ENV === 'development') || 
    (!isServer && (window as any).__DEV__ !== false); // Fallback for client
  
  // Reset cache if it's empty due to previous error
  if (cachedData && cachedData.products.length === 0) {
    cachedData = null;
  }
  
  // Return cached data if available (even in development, but allow bypass)
  if (cachedData && !isDevelopment) {
    return cachedData;
  }
  
  try {
    if (isServer) {
      // Server-side: read from filesystem
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'products-data.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      cachedData = JSON.parse(fileContent);
    } else {
      // Client-side: fetch from public URL
      const response = await fetch(STATIC_DATA_URL);
      if (!response.ok) {
        throw new Error(`Failed to load static data: ${response.status}`);
      }
      cachedData = await response.json();
    }
    return cachedData;
  } catch (error) {
    console.error('Error loading static data:', error);
    // Do not cache empty data on error to allow retry on next call
    // Return empty structure without caching
    return { 
      meta: { 
        total: 0, 
        processed: 0, 
        skipped: 0, 
        rubrosCount: 0 
      }, 
      products: [], 
      rubros: [] 
    };
  }
}

export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
}) {
  const data = await loadStaticData();
  let products = data.products;
  
  // Apply filters
  if (params?.category) {
    products = products.filter(p => p.rubro === params.category);
  }
  if (params?.search) {
    const query = params.search.toLowerCase();
    products = products.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query)
    );
  }
  if (params?.featured !== undefined) {
    // No featured field in static data, return first 6 as featured
    products = params.featured ? products.slice(0, 6) : products;
  }
  // Sort (default by title)
  if (params?.sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (params?.sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  }
  
  return products.map(mapToProduct);
}

// Buscar producto por SKU, slug o modelo (en ese orden)
export async function fetchProduct(identifier: string) {
  const data = await loadStaticData();
  
  // a. Buscar por SKU exacto
  let product = data.products.find(p => p.sku === identifier);
  
  // b. Si no encuentra, buscar por slug
  if (!product) {
    product = data.products.find(p => p.slug === identifier);
  }
  
  // c. Si aún no encuentra, buscar por modelo (case-insensitive)
  if (!product) {
    product = data.products.find(p => 
      p.modelo.toLowerCase() === identifier.toLowerCase()
    );
  }
  
  if (!product) {
    throw new Error(`Producto con identificador "${identifier}" no encontrado`);
  }
  
  return mapToProduct(product);
}

export async function fetchCategories() {
  const data = await loadStaticData();
  // Calculate product counts per category using the category name (rubro)
  const productCounts: Record<string, number> = {};
  data.products.forEach(p => {
    if (p.rubro) {
      productCounts[p.rubro] = (productCounts[p.rubro] || 0) + 1;
    }
  });
  
  // Map each category with its product count
  return data.rubros.map(rubro => 
    mapToCategory(rubro, productCounts[rubro.name] || 0)
  );
}

export async function fetchFeaturedProducts(count: number = 6) {
  const data = await loadStaticData();
  // Return first N products as featured
  return data.products.slice(0, count).map(mapToProduct);
}
