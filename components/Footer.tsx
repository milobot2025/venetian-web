import Link from 'next/link';
import { Mail, Phone, MapPin, Share2, MessageCircle, Video } from 'lucide-react';

const footerNavigation = {
  productos: [
    { name: 'Audio Profesional', href: '/catalogo?categoria=audio' },
    { name: 'Iluminación Escénica', href: '/catalogo?categoria=iluminacion' },
    { name: 'Efectos Especiales', href: '/catalogo?categoria=efectos' },
    { name: 'Cables y Conectores', href: '/catalogo?categoria=cables' },
    { name: 'Consolas y Mixers', href: '/catalogo?categoria=consolas' },
  ],
  soporte: [
    { name: 'Garantías', href: '/soporte/garantias' },
    { name: 'Manuales y Drivers', href: '/soporte/manuales' },
    { name: 'Centro de Soporte', href: '/soporte' },
    { name: 'Reparaciones', href: '/soporte/reparaciones' },
    { name: 'Preguntas Frecuentes', href: '/soporte/faq' },
  ],
  empresa: [
    { name: 'Quiénes Somos', href: '/empresa' },
    { name: 'Nuestra Historia', href: '/empresa/historia' },
    { name: 'Trabaja con Nosotros', href: '/empresa/trabaja' },
    { name: 'Distribuidores', href: '/empresa/distribuidores' },
    { name: 'Contacto', href: '/contacto' },
  ],
  legal: [
    { name: 'Política de Privacidad', href: '/legal/privacidad' },
    { name: 'Términos de Servicio', href: '/legal/terminos' },
    { name: 'Política de Envíos', href: '/legal/envios' },
    { name: 'Facturación', href: '/legal/facturacion' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                DMX<span className="text-blue-400">PRO</span>
              </span>
            </div>
            <p className="text-sm leading-6 max-w-md">
              Especialistas en audio profesional, iluminación escénica y efectos especiales para eventos, teatros, estudios y más. Distribuidores oficiales de las principales marcas del sector.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Share2 className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white">
                <span className="sr-only">Instagram</span>
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white">
                <span className="sr-only">YouTube</span>
                <Video className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
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
        <div className="mt-12 pt-8 border-t border-gray-900 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Dirección</p>
              <p className="text-sm">Paraná 266, CABA</p>
              <p className="text-sm">Buenos Aires, Argentina</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Teléfono</p>
              <p className="text-sm">011 4373-0621</p>
              <p className="text-sm">Lunes a Viernes 9-18hs</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Email</p>
              <p className="text-sm">ventas@dmxpro.com.ar</p>
              <p className="text-sm">facturasvenetian@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-900">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} DMX SRL. Todos los derechos reservados.
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