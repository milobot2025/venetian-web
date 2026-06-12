import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const footerNavigation = {
  productos: [
    { name: 'Audio Profesional', href: '/catalogo' },
    { name: 'Iluminación Escénica', href: '/catalogo' },
    { name: 'Efectos Especiales', href: '/catalogo' },
    { name: 'Cables y Conectores', href: '/catalogo' },
    { name: 'Consolas y Mixers', href: '/catalogo/consola-de-audio' },
  ],
  soporte: [
    { name: 'Consultas', href: '/contacto' },
    { name: 'Dónde comprar', href: '/donde-comprar' },
    { name: 'Resellers', href: '/resellers' },
    { name: 'Catálogo completo', href: '/catalogo' },
  ],
  empresa: [
    { name: 'Contacto', href: '/contacto' },
  ],
  legal: [] as { name: string; href: string }[],
};

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
              <div className="mb-4">
                <Image
                  src="/logo-venetian.png"
                  alt="Venetian"
                  width={200}
                  height={44}
                  className="h-9 w-auto object-contain invert"
                />
              </div>
             <p className="text-sm leading-6 max-w-md">
               Venetian — Importadores de equipamiento profesional de audio, iluminación y efectos especiales para eventos, teatros y estudios.
             </p>
            <div className="mt-6 space-y-2">
              <a href="mailto:info@venetian.com.ar" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <Mail className="h-4 w-4" />
                info@venetian.com.ar
              </a>
              <br />
              <a href="https://www.instagram.com/venetianoficial/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <InstagramIcon className="h-4 w-4" />
                @venetianoficial
              </a>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Productos</h3>
            <ul role="list" className="mt-3 space-y-2">
              {footerNavigation.productos.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Soporte</h3>
            <ul role="list" className="mt-3 space-y-2">
              {footerNavigation.soporte.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Empresa</h3>
            <ul role="list" className="mt-3 space-y-2">
              {footerNavigation.empresa.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="mt-12 pt-8 border-t border-gray-900 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg">
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Teléfono</p>
              <p className="text-sm">+54 9 11 7640-2148</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Email</p>
              <p className="text-sm">info@venetian.com.ar</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-900">
           <p className="text-sm">
             &copy; {new Date().getFullYear()} Venetian SRL. Todos los derechos reservados.
           </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap gap-4 text-sm">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}