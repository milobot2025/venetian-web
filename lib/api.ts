// API client for static data (temporary) - will switch to Strapi later
const USE_STATIC_DATA = true;
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
  };

  // Check for specific model image first
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
    id: product.sku,
    name: product.title,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    category: product.rubro || 'uncategorized',
    sku: product.sku || '',
    rating: 4.5,
    imageUrl: getProductImageUrl(product),
    specifications: {},
  };
}

export function mapToCategory(category: StaticCategory) {
  return {
    id: category.slug,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    productCount: 0, // calculated dynamically
  };
}

// Load static data
let cachedData: StaticData | null = null;

async function loadStaticData(): Promise<StaticData> {
  if (cachedData) return cachedData;
  try {
    const response = await fetch(STATIC_DATA_URL);
    if (!response.ok) throw new Error(`Failed to load static data: ${response.status}`);
    cachedData = await response.json();
    return cachedData;
  } catch (error) {
    console.error('Error loading static data:', error);
    // Return empty structure
    return { meta: { total: 0, processed: 0, skipped: 0, rubrosCount: 0 }, products: [], rubros: [] };
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

export async function fetchProduct(slug: string) {
  const data = await loadStaticData();
  const product = data.products.find(p => p.slug === slug);
  if (!product) {
    throw new Error('Product not found');
  }
  return mapToProduct(product);
}

export async function fetchCategories() {
  const data = await loadStaticData();
  // Calculate product counts per category
  const productCounts: Record<string, number> = {};
  data.products.forEach(p => {
    if (p.rubro) {
      productCounts[p.rubro] = (productCounts[p.rubro] || 0) + 1;
    }
  });
  
  return data.rubros.map(rubro => ({
    id: rubro.name, // Use the category name as ID for filtering
    name: rubro.name,
    slug: rubro.slug,
    description: rubro.description || '',
    productCount: productCounts[rubro.name] || 0,
  }));
}

export async function fetchFeaturedProducts() {
  const data = await loadStaticData();
  // Return first 6 products as featured
  return data.products.slice(0, 6).map(mapToProduct);
}