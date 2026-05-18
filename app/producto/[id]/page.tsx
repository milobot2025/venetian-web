import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { fetchProduct } from '@/lib/api';
import ProductPageClient from './ProductPageClient';
import ProductViewTracker from '@/components/analytics/ProductViewTracker';
import dump from '@/lib/products-dump.json';

interface PageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = 'https://venetian.com.ar';

// Prerenderizar las 540 páginas de producto en build (estáticas, sirven desde edge sin SSR).
// Cualquier slug no listado cae a SSR on-demand (dynamicParams default = true).
export async function generateStaticParams() {
  const products = (dump as { productos?: Array<{ seoSlug?: string; legacySlug?: string; documentId?: string }> })?.productos || [];
  const seen = new Set<string>();
  const out: { id: string }[] = [];
  for (const p of products) {
    const slug = p.seoSlug || p.legacySlug || p.documentId;
    if (slug && !seen.has(slug)) { seen.add(slug); out.push({ id: slug }); }
  }
  return out;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const p = await fetchProduct(id);
    const title = p.subtitulo ? `${p.subtitulo} — ${p.title}` : p.title;
    const description = p.description?.slice(0, 160) || `${p.title} de Venetian. Audio, iluminacion y efectos especiales para profesionales.`;
    // URL canónica = slug SEO descriptivo (self-referencing)
    const canonicalSlug = p.slug || p.documentId;
    const url = `${SITE_URL}/producto/${canonicalSlug}`;
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
  let product = null;
  let jsonLd: object | null = null;

  try {
    product = await fetchProduct(id);
    const canonicalSlug = product.slug || product.documentId;
    // Fase SEO: si el cliente llegó por una URL distinta al canonical (ej /producto/{documentId}),
    // redirigir 301 a la URL canónica. Resuelve los 289 productos "Descubierta sin indexar" en GSC.
    const idDecoded = decodeURIComponent(id).toLowerCase();
    const canonicalLower = (canonicalSlug || '').toLowerCase();
    if (idDecoded !== canonicalLower && canonicalLower) {
      redirect(`/producto/${canonicalSlug}`);
    }
    const url = `${SITE_URL}/producto/${canonicalSlug}`;
    const categorySlug = (product.categoryName || '').toLowerCase().replace(/\s+/g, '-');
    const imageUrl = product.image?.url
      ? (product.image.url.startsWith('http') ? product.image.url : `${SITE_URL}${product.image.url}`)
      : undefined;
    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          name: product.subtitulo || product.title,
          alternateName: product.title,
          sku: product.sku,
          mpn: product.title,
          description: product.description,
          image: imageUrl,
          brand: { '@type': 'Brand', name: 'Venetian' },
          category: product.categoryName,
          url,
          offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'ARS',
            price: product.price,
            priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: 'Venetian' },
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Catalogo', item: `${SITE_URL}/catalogo` },
            { '@type': 'ListItem', position: 3, name: product.categoryName, item: `${SITE_URL}/catalogo/${categorySlug}` },
            { '@type': 'ListItem', position: 4, name: product.title, item: url },
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
      {product && (
        <ProductViewTracker
          documentId={product.documentId}
          name={product.subtitulo || product.title}
          sku={product.sku}
          category={product.categoryName}
          price={product.price}
        />
      )}
      <ProductPageClient id={id} />
    </>
  );
}
