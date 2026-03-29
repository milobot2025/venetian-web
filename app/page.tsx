import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { featuredProducts, categories } from '@/lib/mock-data';
import { ArrowRight, Check, Shield, Truck, Headphones } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Categorías destacadas */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Explorar por Categoría</h2>
            <p className="text-gray-400 mt-2">Equipamiento especializado para cada necesidad</p>
          </div>
          <Link href="/catalogo" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-semibold">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalogo?categoria=${category.slug}`}
              className="group flex flex-col items-center justify-center p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-blue-900/50 transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-blue-400">{category.productCount}</span>
              </div>
              <span className="text-sm font-medium text-white text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Productos Destacados</h2>
            <p className="text-gray-400 mt-2">Lo más vendido y mejor evaluado por nuestros clientes</p>
          </div>
          <Link href="/catalogo" className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900">
            Ver catálogo completo
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">¿Por qué elegir DMXPRO?</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Somos distribuidores oficiales con más de 15 años de experiencia en el rubro.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Garantía Oficial</h3>
              <p className="text-gray-400">6 meses de garantía por fabricante con soporte técnico especializado.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Entrega Rápida</h3>
              <p className="text-gray-400">Despacho en 24-48hs para CABA y GBA. Envíos a todo el país.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Calidad Certificada</h3>
              <p className="text-gray-400">Productos de marcas líderes con certificaciones internacionales.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-600 to-orange-800 flex items-center justify-center mb-4">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Soporte Técnico</h3>
              <p className="text-gray-400">Asesoramiento personalizado antes, durante y después de la compra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-black border border-gray-800 p-8 lg:p-12">
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white">¿Necesitas asesoramiento técnico?</h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Nuestros especialistas te ayudarán a elegir el equipo perfecto para tu proyecto.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Contactar a un Asesor
              </Link>
              <Link
                href="/catalogo"
                className="rounded-lg border border-gray-700 bg-gray-900/50 px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Explorar Catálogo
              </Link>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl" />
        </div>
      </section>
    </>
  );
}