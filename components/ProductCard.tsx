import { ShoppingCart, Eye, Star } from 'lucide-react';
import Link from 'next/link';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  rating?: number;
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-all hover:border-gray-700 hover:shadow-2xl hover:shadow-blue-900/10">
      {/* Badge de categoría */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center rounded-full bg-gray-900/90 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur">
          {product.category}
        </span>
      </div>

      {/* Imagen del producto */}
      <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black relative">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
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
        {/* Overlay de acciones */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
          <Link
            href={`/producto/${product.id}`}
            className="rounded-full bg-white p-3 text-gray-900 hover:bg-gray-200"
            title="Ver detalles"
          >
            <Eye className="h-5 w-5" />
          </Link>
          <button
            className="rounded-full bg-gradient-to-r from-blue-700 to-blue-800 p-3 text-white hover:opacity-90"
            title="Agregar al carrito"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">
            <Link href={`/producto/${product.id}`} className="hover:text-blue-500">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-gray-400 line-clamp-2">{product.description}</p>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <Star
                key={rating}
                className={`h-3 w-3 ${rating < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-500">{product.rating || 'N/A'}</span>
        </div>

        {/* Precio y SKU */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-white">{formattedPrice}</p>
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          </div>
          <button className="rounded-lg bg-gradient-to-r from-blue-700 to-blue-800 px-3 py-2 text-xs font-semibold text-white hover:opacity-90 flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            Cotizar
          </button>
        </div>
      </div>
    </div>
  );
}