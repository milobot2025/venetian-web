const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338/api';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export interface StrapiProduct {
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
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image?: number | { id: number; url: string };
  images?: number[] | Array<{ id: number; url: string }>;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

async function strapiFetch(endpoint: string, options?: RequestInit) {
  const url = `${STRAPI_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
    ...options?.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Strapi API error (${response.status}):`, errorText);
    throw new Error(`Strapi API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchProductsFromStrapi(): Promise<StrapiProduct[]> {
  try {
    const response: StrapiResponse<StrapiProduct[]> = await strapiFetch('/productos?populate=category');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // Si la respuesta es un objeto único (paginación), adaptar
    return response.data as StrapiProduct[];
  } catch (error) {
    console.error('Error fetching products from Strapi:', error);
    return [];
  }
}

export async function fetchCategoriesFromStrapi(): Promise<StrapiCategory[]> {
  try {
    const response: StrapiResponse<StrapiCategory[]> = await strapiFetch('/categories');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data as StrapiCategory[];
  } catch (error) {
    console.error('Error fetching categories from Strapi:', error);
    return [];
  }
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch(`${STRAPI_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Strapi upload error (${response.status}):`, errorText);
    throw new Error(`Strapi upload error: ${response.status}`);
  }

  return response.json();
}

export async function createProduct(product: Partial<StrapiProduct>) {
  const response = await strapiFetch('/productos', {
    method: 'POST',
    body: JSON.stringify({ data: product }),
  });
  return response;
}

export async function updateProduct(documentId: string, updates: Partial<StrapiProduct>) {
  const response = await strapiFetch(`/productos/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify({ data: updates }),
  });
  return response;
}

export async function deleteProduct(documentId: string) {
  const response = await strapiFetch(`/productos/${documentId}`, {
    method: 'DELETE',
  });
  return response;
}

export async function createCategory(category: Partial<StrapiCategory>) {
  const response = await strapiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify({ data: category }),
  });
  return response;
}

export async function updateCategory(documentId: string, updates: Partial<StrapiCategory>) {
  const response = await strapiFetch(`/categories/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify({ data: updates }),
  });
  return response;
}

export async function deleteCategory(documentId: string) {
  const response = await strapiFetch(`/categories/${documentId}`, {
    method: 'DELETE',
  });
  return response;
}