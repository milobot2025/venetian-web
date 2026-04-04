import { MapPin, MessageCircle, Star } from 'lucide-react';

export const metadata = {
  title: 'Dónde Comprar — Venetian',
  description: 'Encontrá distribuidores autorizados de equipamiento Venetian cerca tuyo.',
};

const resellers = [
  {
    tipo: 'Premium Reseller',
    premium: true,
    nombre: 'DMX SRL',
    direccion: 'Paraná 266, CABA',
    cp: 'CP1017',
    whatsapp: '5491176402148',
    whatsappDisplay: '11 7640-2148',
  },
];

export default function DondeComprarPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="border-b border-gray-900 bg-gradient-to-b from-gray-900/60 to-black">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Distribuidores autorizados</p>
          <h1 className="text-3xl font-bold sm:text-5xl">Dónde comprar</h1>
          <p className="mt-4 text-gray-400 max-w-xl text-base sm:text-lg">
            Encontrá un distribuidor autorizado cerca tuyo para adquirir equipamiento Venetian con garantía oficial.
          </p>
        </div>
      </section>

      {/* Lista de resellers */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resellers.map((r) => (
            <div
              key={r.nombre}
              className="relative rounded-xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col gap-4"
            >
              {r.premium && (
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 px-3 py-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold text-yellow-500">Premium</span>
                </div>
              )}
              <div>
                <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-1">{r.tipo}</p>
                <h2 className="text-xl font-bold text-white">{r.nombre}</h2>
              </div>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span>{r.direccion} — {r.cp}</span>
              </div>
              <a
                href={`https://wa.me/${r.whatsapp}?text=Hola! Consulto por equipamiento Venetian.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto rounded-lg border border-green-600/50 bg-green-900/10 px-4 py-3 text-sm font-semibold text-green-500 hover:bg-green-900/20 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp {r.whatsappDisplay}
              </a>
            </div>
          ))}

          {/* Placeholder — próximamente */}
          <div className="rounded-xl border border-dashed border-gray-800 bg-transparent p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
            <p className="text-gray-600 text-sm">¿Querés ser distribuidor?</p>
            <a
              href="/resellers"
              className="text-blue-500 hover:text-blue-300 text-sm font-semibold underline underline-offset-4"
            >
              Conocé el programa →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
