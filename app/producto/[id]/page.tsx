import type { Metadata } from 'next';
import { fetchProduct } from '@/lib/api';
import ProductPageClient from './ProductPageClient';
import ProductViewTracker from '@/components/analytics/ProductViewTracker';

interface PageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = 'https://venetian.com.ar';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const p = await fetchProduct(id);
    const title = p.subtitulo ? `${p.subtitulo} — ${p.title}` : p.title;
    const description = p.description?.slice(0, 160) || `${p.title} de Venetian. Audio, iluminacion y efectos especiales para profesionales.`;
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
  let product = null;
  let jsonLd: object | null = null;

  try {
    product = await fetchProduct(id);
    const url = `${SITE_URL}/producto/${product.documentId}`;
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
            availability: 'https://schema.org/PreOrder',
            seller: { '@type': 'Organization', name: 'Venetian' },
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Catalogo', item: `${SITE_URL}/catalogo` },
            { '@type': 'ListItem', position: 3, name: product.categoryName, item: `${SITE_URL}/catalogo?categoria=${encodeURIComponent(product.categoryName)}` },
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
