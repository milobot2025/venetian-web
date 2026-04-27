'use client';

import Link from 'next/link';
import { HOME_VIDEO_HIGHLIGHTS } from '@/lib/product-videos';

export default function VideoShowcase() {
  return (
    <section className="bg-black border-y border-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-blue-400 uppercase mb-3">
            En acción
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white">Iluminación que se mueve</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            Mirá nuestros equipos top en funcionamiento.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {HOME_VIDEO_HIGHLIGHTS.map((v) => (
            <Link
              key={v.documentId}
              href={`/producto/${v.documentId}`}
              className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-black border border-gray-900 hover:border-blue-700/50 transition-colors"
            >
              <video
                src={v.src}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-blue-400 uppercase">
                  Cabezal
                </p>
                <p className="text-base sm:text-xl font-bold text-white mt-1 leading-tight">
                  {v.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
