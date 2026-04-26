'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MarqueeProduct {
  id: string;
  documentId: string;
  title: string;
  subtitulo?: string;
  imageUrl: string;
}

interface Props {
  title: string;
  subtitle?: string;
  href: string;
  categoryNames: string[];
  reverse?: boolean;
}

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'https://strapi-backend-production-35d0.up.railway.app/api';
const STRAPI_BASE_URL = STRAPI_URL.replace(/\/api\/?$/, '');

export default function CategoryMarquee({ title, subtitle, href, categoryNames, reverse = false }: Props) {
  const [items, setItems] = useState<MarqueeProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams();
        params.append('populate[image]', 'true');
        params.append('pagination[pageSize]', '24');
        categoryNames.forEach((n, i) => params.append(`filters[categoryName][$in][${i}]`, n));
        const res = await fetch(`${STRAPI_URL}/productos?${params.toString()}`);
        if (!res.ok) return;
        const json = await res.json();
        const arr: MarqueeProduct[] = (json.data || [])
          .filter((p: { image?: { url?: string } }) => p.image?.url)
          .slice(0, 12)
          .map((p: { id: number; documentId: string; title: string; subtitulo?: string; image: { url: string } }) => ({
            id: String(p.id),
            documentId: p.documentId,
            title: p.title,
            subtitulo: p.subtitulo,
            imageUrl: p.image.url.startsWith('http') ? p.image.url : `${STRAPI_BASE_URL}${p.image.url}`,
          }));
        if (!cancelled) setItems(arr);
      } catch (e) {
        console.error('marquee fetch', e);
      }
    })();
    return () => { cancelled = true; };
  }, [categoryNames]);

  if (items.length === 0) return null;

  // duplicar para loop infinito sin saltos
  const loop = [...items, ...items];

  return (
    <section className="relative overflow-hidden border-y border-gray-900 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-6 sm:pt-24">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-5xl">{title}</h2>
            {subtitle && <p className="text-gray-400 mt-2 text-sm sm:text-base">{subtitle}</p>}
          </div>
          <Link
            href={href}
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-black transition-colors"
          >
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative pb-16 sm:pb-24">
        {/* Fades laterales */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

        <div
          className="flex gap-6 w-max"
          style={{
            animation: `${reverse ? 'marqueeReverse' : 'marquee'} 60s linear infinite`,
          }}
        >
          {loop.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              href={`/producto/${p.documentId}`}
              className="group relative w-56 sm:w-64 shrink-0"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-white">
                <div className="relative h-full w-full">
                  <Image
                    src={p.imageUrl}
                    alt={p.subtitulo || p.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="256px"
                  />
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs font-semibold text-blue-400 tracking-wider">{p.title}</p>
                <p className="text-sm text-white line-clamp-1">{p.subtitulo || p.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
