'use client';

import { ShoppingCart, Eye, Star, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/lib/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-all duration-300 hover:border-blue-800/50 hover:shadow-2xl hover:shadow-blue-900/30">
      {/* Badge de categoría */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center rounded-full bg-gray-900/90 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur">
          {product.categoryName}
        </span>
      </div>
      {product.featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 px-3 py-1 text-xs font-bold text-white">
            ⭐ Destacado
          </span>
        </div>
      )}

      {/* Imagen del producto */}
      <Link href={`/producto/${product.documentId}`} className="aspect-square w-full overflow-hidden bg-white relative block">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={product.title}
            fill
            className="object-contain object-center p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-700 to-blue-800 mb-2">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-gray-500">Imagen no disponible</p>
            </div>
          </div>
        )}
        {/* Overlay de acciones — solo desktop hover */}
        <div className="absolute inset-0 hidden sm:flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
          <span
            className="rounded-full bg-gray-800 p-3 text-white hover:bg-gray-700 transition-transform hover:scale-110"
            title="Ver detalles"
          >
            <Eye className="h-5 w-5" />
          </span>
        </div>
        {/* Botón "Ver" para mobile — siempre visible */}
        <div className="absolute top-2 right-2 sm:hidden">
          <span className="rounded-full bg-black/70 p-2 text-white backdrop-blur inline-flex">
            <Eye className="h-4 w-4" />
          </span>
        </div>
      </Link>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white leading-tight">
            <Link href={`/producto/${product.documentId}`} className="hover:text-blue-500">
              {product.subtitulo || product.title}
            </Link>
          </h3>
          {product.subtitulo && (
            <p className="text-xs text-gray-500 mt-0.5">{product.title}</p>
          )}
          <p className="mt-1 text-sm text-gray-400 line-clamp-2">{product.description}</p>
        </div>

        {/* SKU + Acción */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
          <Link
            href={`/producto/${product.documentId}`}
            className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-90 text-center transition-all"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
