'use client';

import { ShoppingCart, Eye, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/lib/context/CartContext';

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const { addToCart } = useCart();

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-800 rounded-xl bg-gray-900/30">
        <p className="text-gray-400">No hay productos para mostrar en esta vista.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-xl bg-gray-900/30">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-gray-900/80 text-xs uppercase text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-4">Producto</th>
            <th scope="col" className="px-6 py-4">Categoría</th>
            <th scope="col" className="px-6 py-4">SKU</th>
            <th scope="col" className="px-6 py-4 text-right">Precio</th>
            <th scope="col" className="px-6 py-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-900/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
                    {product.image?.url ? (
                      <Image
                        src={product.image.url}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-600">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{product.title}</p>
                    <p className="truncate text-xs text-gray-500">{product.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                  {product.categoryName}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-gray-400">
                {product.sku}
              </td>
              <td className="px-6 py-4 text-right font-semibold text-white">
                ${product.price.toLocaleString('es-AR')}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <Link
                    href={`/producto/${product.documentId}`}
                    className="rounded-lg border border-gray-700 p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-white hover:opacity-90 transition-all"
                    title="Agregar al carrito"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                  <a
                    href={`https://wa.me/5491143730621?text=Hola! Consulto por: ${product.title} (SKU: ${product.sku})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-green-600/50 p-2 text-green-500 hover:bg-green-900/20 transition-colors"
                    title="Consultar por WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
