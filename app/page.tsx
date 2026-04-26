import Hero from '@/components/Hero';
import CategoryMarquee from '@/components/CategoryMarquee';
import { fetchCategories, fetchProducts } from '@/lib/api';
import { Product } from '@/types';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ILUMINACION = [
  'cabezal', 'efecto de luces', 'laser', 'par led', 'lampara',
  'consola dmx', 'splitter dmx', 'maquina de humo', 'maquina de humo bajo',
  'maquina de niebla', 'maquina de burbujas', 'maquina de espuma',
  'maquina de nieve', 'maquina de papeles',
];

const SONIDO = [
  'amplificador', 'bafle', 'microfono', 'microfono inalambrico',
  'consola de audio', 'auricular', 'parlante techo', 'caja directa', 'antipop',
];

const ACCESORIOS = [
  'cable midi', 'cable speakon', 'cable trs',
  'ficha ethercon', 'ficha plug', 'ficha rca', 'ficha speakon', 'ficha xlr',
  'adaptador audio', 'soporte', 'morsa', 'tester cables',
];

async function fetchByCategoryNames(names: string[], limit = 12): Promise<Product[]> {
  const results = await Promise.all(
    names.map((n) => fetchProducts({ category: n.replace(/\s+/g, '-'), pageSize: 4 }))
  );
  const all = results.flatMap((r) => r.data).filter((p) => p.image?.url);
  return all.slice(0, limit);
}

export default async function Home() {
  const [categories, iluminacion, sonido, accesorios] = await Promise.all([
    fetchCategories(),
    fetchByCategoryNames(ILUMINACION),
    fetchByCategoryNames(SONIDO),
    fetchByCategoryNames(ACCESORIOS),
  ]);

  return (
    <>
      <Hero />

      <CategoryMarquee
        title="Iluminación"
        subtitle="Cabezales móviles, lasers, par led, máquinas de humo y efectos."
        href="/catalogo?seccion=iluminacion"
        products={iluminacion}
      />

      <CategoryMarquee
        title="Sonido"
        subtitle="Consolas, micrófonos, amplificadores, bafles y monitoreo."
        href="/catalogo?seccion=sonido"
        products={sonido}
        reverse
      />

      <CategoryMarquee
        title="Accesorios"
        subtitle="Cables, fichas, adaptadores, soportes y herramientas."
        href="/catalogo?seccion=accesorios"
        products={accesorios}
      />

      {/* Categorías */}
      <section className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Todas las categorías</h2>
              <p className="text-gray-500 mt-1 text-sm">Navegá por tipo de equipo</p>
            </div>
            <Link
              href="/catalogo"
              className="text-sm font-semibold text-gray-400 hover:text-white inline-flex items-center gap-1"
            >
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalogo?categoria=${c.slug}`}
                className="group flex items-center justify-between p-4 rounded-lg border border-gray-900 hover:border-gray-700 hover:bg-gray-950 transition-colors"
              >
                <span className="text-sm font-medium text-white capitalize line-clamp-1">{c.name}</span>
                <span className="text-xs text-gray-600 group-hover:text-blue-400 transition-colors">{c.productCount}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA cerrar */}
      <section className="border-t border-gray-900 bg-black">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">¿Buscás algo específico?</h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base">
            Escribinos por WhatsApp o mail. Te orientamos con el equipo correcto para tu proyecto.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contacto"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-200"
            >
              Contacto
            </Link>
            <Link
              href="/donde-comprar"
              className="rounded-lg border border-gray-800 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900"
            >
              Dónde comprar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
