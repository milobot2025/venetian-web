import { Media } from '../types';

// Variables de entorno con valores por defecto para desarrollo
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338/api';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';

// Types matching the frontend expectations
export interface Product {
  id: string;
  documentId: string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  categoryName: string;
  sku: string;
  rating?: number;
  specifications?: Record<string, string>;
  featured?: boolean;
  image?: Media; // Single image
  images?: Media[]; // Gallery images
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
}

// Strapi internal types (simplified)
const STRAPI_BASE_URL = STRAPI_URL.replace(/\/api\/?$/, '');

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
  image?: {
    id: number;
    name: string;
    url: string;
    formats?: any;
  };
  images?: Array<{
    id: number;
    name: string;
    url: string;
    formats?: any;
  }>;
}

interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  productos?: {
    data: Array<any>; // Data array for relation
    meta: {
      pagination: {
        total: number;
      };
    };
  };
}

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Image mapping for products by category/model
// This function now only handles fallback images if no Strapi images are present.
function mapToProduct(product: StrapiProduct): Product {
  const mappedImages: Media[] = [];
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      if (img.url) {
        mappedImages.push({
          id: String(img.id),
          name: img.name || '',
          url: img.url.startsWith('http') ? img.url : `${STRAPI_BASE_URL}${img.url}`,
        });
      }
    });
  }

  let primaryImage: Media | undefined;
  if (product.image?.url) {
    primaryImage = {
      id: String(product.image.id),
      name: product.image.name || '',
      url: product.image.url.startsWith('http') ? product.image.url : `${STRAPI_BASE_URL}${product.image.url}`,
    };
  } else if (mappedImages.length > 0) {
    primaryImage = mappedImages[0];
  }

  return {
    id: product.id.toString(),
    documentId: product.documentId,
    title: product.title,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    categoryName: product.categoryName || product.category?.name || 'uncategorized',
    sku: product.sku || '',
    rating: 4.5,
    image: primaryImage,
    images: mappedImages,
    specifications: {},
    featured: product.featured,
  };
}

function mapToCategory(category: StrapiCategory): Category {
  return {
    id: category.slug,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    productCount: category.productos?.meta.pagination.total || 0,
  };
}

// Fetch helper
async function strapiFetch(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${STRAPI_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  }
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers, next: { revalidate: 3600 } });

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
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
}): Promise<{ data: Product[]; meta: any }> {
  try {
    const queryParams: Record<string, string> = {
      'populate[image]': '*',
      'populate[images]': '*',
      'populate[category]': '*'
    };
    
    if (params?.page) {
      queryParams['pagination[page]'] = params.page.toString();
    }
    if (params?.pageSize) {
      queryParams['pagination[pageSize]'] = params.pageSize.toString();
    }
    if (params?.category) {
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
    if (params?.minPrice !== undefined) {
      queryParams['filters[price][$gte]'] = params.minPrice.toString();
    }
    if (params?.maxPrice !== undefined) {
      queryParams['filters[price][$lte]'] = params.maxPrice.toString();
    }
    if (params?.sort === 'price_asc') {
      queryParams['sort'] = 'price:asc';
    } else if (params?.sort === 'price_desc') {
      queryParams['sort'] = 'price:desc';
    } else if (params?.sort === 'name_asc') {
      queryParams['sort'] = 'title:asc';
    } else if (params?.sort === 'name_desc') {
      queryParams['sort'] = 'title:desc';
    }

    const response: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos', queryParams);
    const products = Array.isArray(response.data) ? response.data : [response.data];
    return {
      data: products.map(mapToProduct),
      meta: response.meta
    };
  } catch (error) {
    console.error('Error fetching products from Strapi:', error);
    return { data: [], meta: {} };
  }
}

export async function fetchProduct(identifier: string): Promise<Product> {
  try {
    const populateParams = {
      'populate[image]': '*',
      'populate[images]': '*',
      'populate[category]': '*'
    };

    const response: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos', {
      ...populateParams,
      'filters[slug][$eq]': identifier,
    });
    let product: StrapiProduct | undefined;
    if (Array.isArray(response.data) && response.data.length > 0) {
      product = response.data[0];
    } else {
      const skuResponse: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos', {
        ...populateParams,
        'filters[sku][$eq]': identifier,
      });
      if (Array.isArray(skuResponse.data) && skuResponse.data.length > 0) {
        product = skuResponse.data[0];
      }
    }
    if (!product) throw new Error(`Producto con identificador "${identifier}" no encontrado`);
    return mapToProduct(product);
  } catch (error) {
    console.error('Error fetching product from Strapi:', error);
    throw error;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response: StrapiResponse<StrapiCategory[]> = await strapiFetch('/categories', {
      'populate[productos][count]': 'true'
    });
    const categories = Array.isArray(response.data) ? response.data : [response.data];
    return categories.map(mapToCategory);
  } catch (error) {
    console.error('Error fetching categories from Strapi:', error);
    return [];
  }
}

export async function fetchFeaturedProducts(count: number = 6): Promise<Product[]> {
  try {
    const response: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos', {
      'populate[image]': '*',
      'populate[images]': '*',
      'populate[category]': '*',
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
