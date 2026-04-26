'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/lib/context/CartContext';

const categories = [
  { name: 'Audio Profesional', href: '/catalogo?categoria=audio' },
  { name: 'Iluminación', href: '/catalogo?categoria=iluminacion' },
  { name: 'Efectos Especiales', href: '/catalogo?categoria=efectos' },
  { name: 'Cables & Conectores', href: '/catalogo?categoria=cables' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const mobileMenuJSX = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999] bg-black/50"
        onClick={() => setMobileMenuOpen(false)}
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="/logo-venetian.png"
              alt="Venetian"
              width={180}
              height={40}
              className="h-7 w-auto object-contain invert"
            />
          </Link>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-700">
            <div className="space-y-2 py-6">
              <Link
                href="/"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-gray-900 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/catalogo"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-gray-900 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catálogo
              </Link>
              <div className="pl-4 border-l border-gray-800 ml-3">
                <p className="text-sm font-medium text-gray-500 px-3 py-2">Categorías</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-900 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/recursos"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-gray-900 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recursos
              </Link>
              <Link
                href="/soporte"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-gray-900 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Soporte
              </Link>
              <Link
                href="/contacto"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-gray-900 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              <Link
                href="/donde-comprar"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-gray-900 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dónde comprar
              </Link>
              <Link
                href="/resellers"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-gray-900 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resellers
              </Link>
            </div>
            <div className="py-6">
              <div className="hidden">
                <button
                  className="p-2 text-gray-400 hover:text-white relative"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-xs flex items-center justify-center text-white font-bold">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
              <Link
                href="/contacto"
                className="mt-4 block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solicitar Cotización
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Venetian Audio & Iluminación</span>
              <Image
                src="/logo.png"
                alt="Venetian"
                width={300}
                height={300}
                priority
                className="h-12 sm:h-14 w-auto object-contain invert"
              />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <Link href="/" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/catalogo" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
              Catálogo
            </Link>
            {/* Dropdown Categorías */}
            <div className="relative group">
              <button className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Categorías
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/recursos" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
              Recursos
            </Link>
            <Link href="/soporte" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
              Soporte
            </Link>
            <Link href="/donde-comprar" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
              Dónde comprar
            </Link>
            <Link href="/resellers" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
              Resellers
            </Link>
            <Link href="/contacto" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
              Contacto
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
            <button className="p-2 text-gray-400 hover:text-white">
              <Search className="h-5 w-5" />
            </button>
            <div className="hidden">
              <button
                className="p-2 text-gray-400 hover:text-white relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-xs flex items-center justify-center text-white font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
            <Link
              href="/contacto"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              Consultar
            </Link>
          </div>
        </nav>
      </header>
      {/* Mobile menu rendered via portal to escape header stacking context */}
      {mounted && mobileMenuOpen && createPortal(mobileMenuJSX, document.body)}
    </>
  );
}
