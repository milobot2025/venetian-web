export interface Media {
  id: string;
  name: string;
  url: string;
  // Add other fields from Strapi media object if needed, e.g., alternativeText, width, height
}

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

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  productInterest?: string;
}