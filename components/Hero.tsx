import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-black to-black">
      {/* Fondo con patrón sutil */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">Audio Profesional</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                & Iluminación
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Equipamiento de alta gama para eventos, teatros, estudios y producciones. Más de 1.000 productos en stock con entrega inmediata y garantía oficial.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/catalogo"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                Ver Catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="rounded-lg border border-gray-700 bg-gray-900/50 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                Video Demo
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-bold text-white">1,138+</p>
                <p className="text-sm text-gray-400">Productos en stock</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">30+</p>
                <p className="text-sm text-gray-400">Marcas premium</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">6</p>
                <p className="text-sm text-gray-400">Meses garantía</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24h</p>
                <p className="text-sm text-gray-400">Soporte técnico</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/30">
              {/* Placeholder para imagen hero */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                    <span className="text-2xl font-bold text-white">DMX</span>
                  </div>
                  <p className="text-gray-400">Imagen de producto destacado</p>
                </div>
              </div>
            </div>
            {/* Elementos decorativos */}
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-blue-900/20 blur-3xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-purple-900/20 blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}