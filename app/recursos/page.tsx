import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Recursos Útiles - Venetian',
  description: 'Recursos y documentación técnica para profesionales de audio e iluminación.',
};

export default function RecursosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero-like section for the title */}
      <section className="relative h-64 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* Subtle background pattern or image */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Recursos Útiles
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Documentación, links y herramientas para profesionales de audio e iluminación.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Manuales y Documentación */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
            Manuales y Documentación Técnica
          </h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-300">
              Aquí encontrarás enlaces a manuales de usuario, guías de instalación y especificaciones técnicas de los productos que comercializamos. Estamos trabajando para compilar una base de datos completa. Por favor, contáctanos si no encuentras lo que buscas.
            </p>
            {/* Placeholder for actual links */}
            <ul className="mt-4 space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">Manual de Consola de Sonido X-Pro:</span> Disponible pronto.
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">Guía Rápida de Iluminación LED Serie Nova:</span> En desarrollo.
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">Especificaciones de Parlantes Monitor Studio 5:</span> Consulta directa.
              </li>
            </ul>
          </div>
        </section>

        {/* Links Útiles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
            Links Útiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Software y Firmware</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    Descargas de firmware para controladores DMX <ArrowRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    Software de diseño de sistemas de sonido <ArrowRight className="h-4 w-4" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Comunidades y Foros</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    Foro de Audio Profesional Argentina <ArrowRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    Grupo de Iluminadores Escénicos <ArrowRight className="h-4 w-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action for Contact */}
        <section className="text-center bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-black border border-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de soporte técnico está disponible para ayudarte con cualquier consulta o necesidad de asistencia.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-purple-600 px-8 py-3 text-lg font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Contacta a Soporte <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </section>
      </main>
    </div>
  );
}