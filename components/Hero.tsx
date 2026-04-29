import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-black min-h-[80vh] flex items-center">
      {/* Video de fondo — dropear hero.mp4 en public/videos/ */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-50"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-black/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40 w-full">
        <div className="max-w-3xl">
          <h1 className="relative w-full max-w-5xl aspect-[6/1]">
            <span className="sr-only">Venetian</span>
            <Image
              src="/logo-venetian.png"
              alt="Venetian"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover invert"
            />
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-7 text-gray-300 sm:text-xl sm:leading-8">
            Audio, iluminación y efectos especiales. La marca que acompaña a profesionales del rubro.
          </p>
          <div className="mt-10">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-base font-semibold text-white shadow-2xl shadow-blue-900/50 hover:opacity-90 hover:scale-105 transition-all sm:text-lg"
            >
              Ver catálogo
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
