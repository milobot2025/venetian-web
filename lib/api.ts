import { Media } from '../types';
import dump from './products-dump.json';
import imageManifest from './product-images.json';

const IMAGE_MANIFEST = imageManifest as Record<string, string[]>;

interface DumpProduct {
  id: string;
  documentId: string;
  title: string;
  subtitulo?: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  modelo: string;
  categoryName: string;
  featured: boolean;
}

interface DumpCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

const PRODUCTOS = (dump.productos as DumpProduct[]) || [];
const CATEGORIAS = (dump.categorias as DumpCategory[]) || [];

export interface Product {
  id: string;
  documentId: string;
  title: string;
  subtitulo?: string;
  slug?: string;
  description: string;
  price: number;
  categoryName: string;
  sku: string;
  rating?: number;
  specifications?: Record<string, string>;
  featured?: boolean;
  image?: Media;
  images?: Media[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
}

function imagesFor(sku: string): Media[] {
  const paths = IMAGE_MANIFEST[sku];
  if (!paths || !paths.length) return [];
  return paths.map((p, i) => ({
    id: `${sku}-${i}`,
    name: p.split('/').pop() || '',
    url: p,
  }));
}

function toProduct(p: DumpProduct): Product {
  const imgs = imagesFor(p.sku);
  return {
    id: p.id,
    documentId: p.documentId,
    title: p.title,
    subtitulo: p.subtitulo,
    slug: p.slug,
    description: p.description,
    price: p.price,
    categoryName: p.categoryName,
    sku: p.sku,
    rating: 4.5,
    image: imgs[0],
    images: imgs,
    specifications: {},
    featured: p.featured,
  };
}

export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
}): Promise<{ data: Product[]; meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } } }> {
  let list = PRODUCTOS.slice();

  if (params?.category) {
    const cat = params.category.replace(/-/g, ' ').toLowerCase();
    list = list.filter(p => p.categoryName?.toLowerCase() === cat);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.subtitulo?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.modelo?.toLowerCase().includes(q)
    );
  }
  if (params?.featured !== undefined) {
    list = list.filter(p => p.featured === params.featured);
  }
  if (params?.minPrice !== undefined) list = list.filter(p => p.price >= params.minPrice!);
  if (params?.maxPrice !== undefined) list = list.filter(p => p.price <= params.maxPrice!);

  if (params?.sort === 'price_asc') list.sort((a, b) => a.price - b.price);
  else if (params?.sort === 'price_desc') list.sort((a, b) => b.price - a.price);
  else if (params?.sort === 'name_asc') list.sort((a, b) => a.title.localeCompare(b.title));
  else if (params?.sort === 'name_desc') list.sort((a, b) => b.title.localeCompare(a.title));

  const page = params?.page || 1;
  const pageSize = params?.pageSize || 12;
  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const slice = list.slice(start, start + pageSize);

  return {
    data: slice.map(toProduct),
    meta: { pagination: { page, pageSize, pageCount, total } },
  };
}

export async function fetchProduct(identifier: string): Promise<Product> {
  const id = identifier.toLowerCase();
  const found = PRODUCTOS.find(p =>
    p.slug?.toLowerCase() === id ||
    p.sku?.toLowerCase() === id ||
    p.documentId?.toLowerCase() === id
  );
  if (!found) throw new Error(`Producto "${identifier}" no encontrado`);
  return toProduct(found);
}

export async function fetchCategories(): Promise<Category[]> {
  return CATEGORIAS.filter(c => c.productCount > 0).sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchFeaturedProducts(count: number = 6): Promise<Product[]> {
  return PRODUCTOS.filter(p => p.featured).slice(0, count).map(toProduct);
}
