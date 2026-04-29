import type { Metadata } from 'next';
import { fetchProduct } from '@/lib/api';
import ProductPageClient from './ProductPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = 'https://venetian.com.ar';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const p = await fetchProduct(id);
    const title = p.subtitulo ? `${p.subtitulo} — ${p.title}` : p.title;
    const description = p.description?.slice(0, 160) || `${p.title} de Venetian. Audio, iluminación y efectos especiales para profesionales.`;
    const url = `${SITE_URL}/producto/${p.documentId}`;
    const imageUrl = p.image?.url
      ? (p.image.url.startsWith('http') ? p.image.url : `${SITE_URL}${p.image.url}`)
      : `${SITE_URL}/logo-venetian-full.png`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: 'website',
        url,
        title,
        description,
        siteName: 'Venetian',
        images: [{ url: imageUrl, width: 1200, height: 1200, alt: title }],
      },
      twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
    };
  } catch {
    return { title: 'Producto no encontrado' };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  let jsonLd: object | null = null;
  try {
    const p = await fetchProduct(id);
    const url = `${SITE_URL}/producto/${p.documentId}`;
    const imageUrl = p.image?.url
      ? (p.image.url.startsWith('http') ? p.image.url : `${SITE_URL}${p.image.url}`)
      : undefined;
    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          name: p.subtitulo || p.title,
          alternateName: p.title,
          sku: p.sku,
          mpn: p.title,
          description: p.description,
          image: imageUrl,
          brand: { '@type': 'Brand', name: 'Venetian' },
          category: p.categoryName,
          url,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${SITE_URL}/catalogo` },
            { '@type': 'ListItem', position: 3, name: p.categoryName, item: `${SITE_URL}/catalogo?categoria=${encodeURIComponent(p.categoryName)}` },
            { '@type': 'ListItem', position: 4, name: p.title, item: url },
          ],
        },
      ],
    };
  } catch {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductPageClient id={id} />
    </>
  );
}
