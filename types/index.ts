export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  rating?: number;
  imageUrl?: string;
  specifications?: Record<string, string>;
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