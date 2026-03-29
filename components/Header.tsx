import Link from 'next/link';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Catálogo', href: '/catalogo' },
  { name: 'Recursos', href: '/recursos' },
  { name: 'Soporte', href: '/soporte' },
  { name: 'Contacto', href: '/contacto' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">DMX Audio & Iluminación</span>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                DMX<span className="text-blue-400">PRO</span>
              </span>
            </div>
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
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
          <button className="p-2 text-gray-400 hover:text-white">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-xs flex items-center justify-center text-white">
              0
            </span>
          </button>
          <Link
            href="/contacto"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            Cotizar
          </Link>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="text-2xl font-bold text-white">DMXPRO</span>
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
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-gray-900 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-400 hover:text-white">
                      <Search className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white relative">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-xs flex items-center justify-center text-white">
                        0
                      </span>
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
        </div>
      )}
    </header>
  );
}