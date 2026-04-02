'use client';

import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/CartContext';

export default function SideCart() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    totalPrice,
    totalItems 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md">
          <div className="flex h-full flex-col bg-gray-900 shadow-2xl border-l border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Tu Carrito
                {totalItems > 0 && (
                  <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium">
                    {totalItems}
                  </span>
                )}
              </h2>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsCartOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="rounded-full bg-gray-800 p-6 mb-4">
                    <ShoppingBag className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white">El carrito está vacío</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Añade algunos productos de nuestro catálogo para comenzar una cotización.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-8 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {cart.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-800 bg-black relative">
                        {item.images && item.images[0] ? (
                          <Image
                            src={item.images[0].url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-600">
                            <ShoppingBag className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium text-white">
                          <h3 className="line-clamp-1">
                            <Link href={`/producto/${item.id}`} onClick={() => setIsCartOpen(false)}>
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 uppercase tracking-wider">{item.sku}</p>
                        
                        <div className="flex flex-1 items-end justify-between text-sm mt-2">
                          <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-700 text-gray-400 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 text-white font-medium min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-700 text-gray-400 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="font-medium text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-800 px-6 py-6 bg-gray-900/50">
                <div className="flex justify-between text-base font-medium text-white mb-4">
                  <p>Total Estimado</p>
                  <p className="text-2xl font-bold">${totalPrice.toLocaleString()}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-400 mb-6 italic">
                  * El precio final será confirmado en la cotización.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/contacto"
                    onClick={() => setIsCartOpen(false)}
                    className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-blue-500 transition-colors w-full"
                  >
                    Finalizar Cotización
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-gray-700 px-6 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors w-full"
                  >
                    Seguir Comprando
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
