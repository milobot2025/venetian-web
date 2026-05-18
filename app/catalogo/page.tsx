import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CatalogoClient from './CatalogoClient';

const SITE_URL = 'https://venetian.com.ar';

export const metadata: Metadata = {
  title: 'Catálogo Venetian — Audio, Iluminación y Efectos Profesionales',
  description:
    'Catálogo completo Venetian: micrófonos, consolas, bafles, máquinas de humo, niebla y efectos, cables y conectores. Envíos a toda Argentina.',
  alternates: { canonical: `${SITE_URL}/catalogo` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/catalogo`,
    title: 'Catálogo Venetian',
    description: 'Audio, iluminación y efectos para profesionales.',
    siteName: 'Venetian',
  },
};

type SearchParams = { categoria?: string; search?: string };

export default async function CatalogoPage({
  searchParams,
}: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  // Fase SEO: si llega /catalogo?categoria=X → 301 a /catalogo/X (path-based, indexable).
  // Resuelve las 29 URLs "Página alternativa con etiqueta canónica adecuada" de GSC.
  if (sp?.categoria && typeof sp.categoria === 'string') {
    const slug = sp.categoria.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (slug) {
      redirect(`/catalogo/${slug}`);
    }
  }
  return <CatalogoClient />;
}
