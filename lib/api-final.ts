// API client for Strapi backend
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338/api';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// Types matching the frontend expectations
export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  rating?: number;
  imageUrl?: string;
  specifications?: Record<string, string>;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
}

// Strapi internal types (simplified)
interface StrapiProduct {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: string;
  featured: boolean;
  sku: string;
  modelo: string;
  categoryName?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
}

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

// Image mapping for products by category/model (same as before)
function getProductImageUrl(product: StrapiProduct): string {
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
    'adaptador audio': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'amplificador': 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=800&fit=crop',
    'antipop': 'https://images.unsplash.com/photo-1581600140688-8a1e9c4b16b5?w=800&h=800&fit=crop',
    'auricular': 'https://images.unsplash.com/photo-1485579148751-308a0d0e6b5a?w=800&h=800&fit=crop&crop=center',
    'bafle': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    'cable dmx': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'cable instrumento': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'cable midi': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'cable minijack': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'cable rollo': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'cable speakon': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'cable trs': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'cable xlr': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'cabezal': 'https://images.unsplash.com/photo-1501959181532-7d2a3c064642?w=800&h=800&fit=crop&crop=center',
    'caja directa': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'consola de audio': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop',
    'consola dmx': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=800&fit=crop',
    'efecto de luces': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'ficha ethercon': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'ficha plug': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'ficha rca': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'ficha speakon': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'ficha xlr': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'lampara': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'laser': 'https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=800&h=800&fit=crop',
    'linga': 'https://images.unsplash.com/photo-1551632811-561732d76471?w=800&h=800&fit=crop&crop=center',
    'maquina de burbujas': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'maquina de espuma': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'maquina de humo': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'maquina de humo bajo': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'maquina de niebla': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'maquina de nieve': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'maquina de papeles': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'manguera de sonido': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'microfono': 'https://images.unsplash.com/photo-1581600140688-8a1e9c4b16b5?w=800&h=800&fit=crop',
    'microfono inalambrico': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=800&fit=crop',
    'morsa': 'https://images.unsplash.com/photo-1551632811-561732d76471?w=800&h=800&fit=crop&crop=center',
    'par led': 'https://images.unsplash.com/photo-1511984804822-e16ba72f5840?w=800&h=800&fit=crop&crop=center',
    'parlante techo': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    'soporte': 'https://images.unsplash.com/photo-1551632811-561732d76471?w=800&h=800&fit=crop&crop=center',
    'splitter dmx': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop&crop=center',
    'tester cables': 'https://images.unsplash.com/photo-1565689221354-0060dde4c0cd?w=800&h=800&fit=crop&crop=center',
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
  const categoryName = product.categoryName || product.category?.name;
  if (categoryName && categoryImages[categoryName]) {
    return categoryImages[categoryName];
  }

  // Default placeholder for other products
  return '/images/products/placeholder.jpg';
}

// Mappers
function mapToProduct(product: StrapiProduct): Product {
  return {
    id: product.slug,  // Use slug as ID for URLs
    name: product.title,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    category: product.categoryName || product.category?.name || 'uncategorized',
    sku: product.sku || '',
    rating: 4.5,
    imageUrl: getProductImageUrl(product),
    specifications: {},
    featured: product.featured,
  };
}

function mapToCategory(category: StrapiCategory, productCount: number = 0): Category {
  return {
    id: category.slug,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    productCount,
  };
}

// Fetch helper
async function strapiFetch(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${STRAPI_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  }
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Strapi API error (${response.status}) on ${url}:`, errorText);
    throw new Error(`Strapi API error: ${response.status}`);
  }

  return response.json();
}

// Public API functions
export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
}): Promise<Product[]> {
  try {
    const queryParams: Record<string, string> = {
      'populate': 'category',
    };
    if (params?.category) {
      // Filter by category slug
      queryParams['filters[category][slug][$eq]'] = params.category;
    }
    if (params?.search) {
      queryParams['filters[$or][0][title][$containsi]'] = params.search;
      queryParams['filters[$or][1][description][$containsi]'] = params.search;
      queryParams['filters[$or][2][sku][$containsi]'] = params.search;
    }
    if (params?.featured !== undefined) {
      queryParams['filters[featured][$eq]'] = params.featured.toString();
    }
    if (params?.sort === 'price_asc') {
      queryParams['sort'] = 'price:asc';
    } else if (params?.sort === 'price_desc') {
      queryParams['sort'] = 'price:desc';
    }

    const response: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos', queryParams);
    const products = Array.isArray(response.data) ? response.data : [response.data];
    return products.map(mapToProduct);
  } catch (error) {
    console.error('Error fetching products from Strapi:', error);
    // Fallback to empty array
    return [];
  }
}

export async function fetchProduct(identifier: string): Promise<Product> {
  try {
    // Try by slug first
    const response: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos', {
      'populate': 'category',
      'filters[slug][$eq]': identifier,
    });
    let product: StrapiProduct | undefined;
    if (Array.isArray(response.data) && response.data.length > 0) {
      product = response.data[0];
    } else {
      // Try by SKU
      const skuResponse: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos', {
        'populate': 'category',
        'filters[sku][$eq]': identifier,
      });
      if (Array.isArray(skuResponse.data) && skuResponse.data.length > 0) {
        product = skuResponse.data[0];
      }
    }
    if (!product) {
      throw new Error(`Producto con identificador "${identifier}" no encontrado`);
    }
    return mapToProduct(product);
  } catch (error) {
    console.error('Error fetching product from Strapi:', error);
    throw error;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response: StrapiResponse<StrapiCategory[]> = await strapiFetch('/categories');
    const categories = Array.isArray(response.data) ? response.data : [response.data];
    
    // Get product counts per category (could be optimized)
    const productCounts: Record<string, number> = {};
    const productsResponse: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos', { 'populate': 'category' });
    const products = Array.isArray(productsResponse.data) ? productsResponse.data : [];
    products.forEach(p => {
      if (p.category) {
        const catSlug = p.category.slug;
        productCounts[catSlug] = (productCounts[catSlug] || 0) + 1;
      }
    });

    return categories.map(cat => mapToCategory(cat, productCounts[cat.slug] || 0));
  } catch (error) {
    console.error('Error fetching categories from Strapi:', error);
    return [];
  }
}

export async function fetchFeaturedProducts(count: number = 6): Promise<Product[]> {
  try {
    const response: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos', {
      'populate': 'category',
      'filters[featured][$eq]': 'true',
      'pagination[limit]': count.toString(),
    });
    const products = Array.isArray(response.data) ? response.data : [response.data];
    return products.map(mapToProduct);
  } catch (error) {
    console.error('Error fetching featured products from Strapi:', error);
    return [];
  }
}
