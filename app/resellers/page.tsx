import Link from 'next/link';
import { ArrowRight, CheckCircle, MessageCircle, Users, Package, TrendingUp, Award } from 'lucide-react';

export const metadata = {
  title: 'Programa de Distribuidores — Venetian',
  description: 'Trabajá con Venetian como distribuidor autorizado. Acceso a precios mayoristas, catálogo completo y soporte pre-venta.',
};

const beneficios = [
  {
    icon: TrendingUp,
    title: 'Precios mayoristas',
    desc: 'Acceso a listas de precios exclusivas para distribuidores con márgenes competitivos.',
  },
  {
    icon: Package,
    title: 'Catálogo completo',
    desc: 'Acceso prioritario a todo el catálogo incluyendo novedades antes de su lanzamiento público.',
  },
  {
    icon: Users,
    title: 'Soporte pre-venta',
    desc: 'Asesoramiento técnico para ayudarte a cerrar proyectos con tus clientes.',
  },
  {
    icon: Award,
    title: 'Materiales de marca',
    desc: 'Fichas técnicas, imágenes de alta resolución y materiales para tus propuestas comerciales.',
  },
];

const requisitos = [
  'Empresa o monotributo constituido',
  'Actividad comercial relacionada al sector de audio, iluminación o eventos',
  'Compromiso de volumen mínimo mensual',
  'Mantener estándares de servicio al cliente final',
];

export default function ResellersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative border-b border-gray-900 bg-gradient-to-b from-gray-900/60 to-black">
        <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-4">Para distribuidores</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Programa de<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                Distribuidores
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 leading-8">
              Trabajá con Venetian como distribuidor autorizado. Acceso a precios mayoristas, catálogo completo y soporte técnico para hacer crecer tu negocio.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#contacto"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 flex items-center justify-center gap-2"
              >
                Quiero ser distribuidor
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/5491176402148?text=Hola! Me interesa el programa de distribuidores de Venetian."
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-green-600/50 bg-green-900/10 px-6 py-3 text-sm font-semibold text-green-500 hover:bg-green-900/20 flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Beneficios del programa</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">Todo lo que necesitás para ofrecer equipamiento Venetian a tus clientes.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beneficios.map((b) => (
            <div key={b.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center mb-4">
                <b.icon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{b.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8 lg:p-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl mb-6">Requisitos</h2>
            <ul className="space-y-4">
              {requisitos.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-300">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="contacto" className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold sm:text-3xl">Contactanos</h2>
          <p className="text-gray-400 mt-3">Completá el formulario y nos comunicamos a la brevedad.</p>
        </div>
        <form
          action="mailto:venetianarg@gmail.com"
          method="post"
          encType="text/plain"
          className="space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre *</label>
              <input type="text" name="nombre" required className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Empresa *</label>
              <input type="text" name="empresa" required className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre de tu empresa" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Teléfono</label>
              <input type="tel" name="telefono" className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="11 1234-5678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
              <input type="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="vos@tuempresa.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Mensaje</label>
            <textarea name="mensaje" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Contanos sobre tu negocio y qué categorías te interesan..." />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white hover:opacity-90">
              Enviar consulta
            </button>
            <a
              href="https://wa.me/5491176402148?text=Hola! Me interesa el programa de distribuidores de Venetian."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg border border-green-600/50 bg-green-900/10 px-6 py-3 font-semibold text-green-500 hover:bg-green-900/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp directo
            </a>
          </div>
        </form>
      </section>
    </div>
  );
}
