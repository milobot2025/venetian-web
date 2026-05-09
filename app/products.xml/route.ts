import { NextResponse } from 'next/server';
import dump from '@/lib/products-dump.json';
import imageManifest from '@/lib/product-images.json';

const SITE_URL = 'https://venetian.com.ar';

interface DumpProduct {
  id: string;
  documentId: string;
  title: string;
  subtitulo?: string;
  description?: string;
  price: number;
  sku: string;
  categoryName: string;
}

const IMAGE_MANIFEST = imageManifest as Record<string, string[]>;

function getImageUrl(sku: string): string {
  const paths = IMAGE_MANIFEST[sku];
  if (!paths || !paths.length) return `${SITE_URL}/logo-venetian-full.png`;
  const p = paths[0];
  return p.startsWith('http') ? p : `${SITE_URL}${p}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const revalidate = 3600; // 1 hour cache

export async function GET() {
  const productos = (dump.productos as DumpProduct[]).filter(p => p.price > 0);

  const items = productos.map(p => {
    const name = escapeXml(p.subtitulo || p.title);
    const description = escapeXml(p.description?.slice(0, 500) || p.title);
    const link = `${SITE_URL}/producto/${p.documentId}`;
    const imageLink = getImageUrl(p.sku);
    const price = p.price.toFixed(2);
    const category = escapeXml(p.categoryName);

    return `  <item>
    <g:id>${escapeXml(p.sku)}</g:id>
    <g:title>${name}</g:title>
    <g:description>${description}</g:description>
    <g:link>${link}</g:link>
    <g:image_link>${imageLink}</g:image_link>
    <g:condition>new</g:condition>
    <g:availability>preorder</g:availability>
    <g:price>${price} ARS</g:price>
    <g:brand>Venetian</g:brand>
    <g:mpn>${escapeXml(p.sku)}</g:mpn>
    <g:google_product_category>Electronics</g:google_product_category>
    <g:product_type>${category}</g:product_type>
  </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Venetian - Catalogo de Productos</title>
    <link>${SITE_URL}</link>
    <description>Audio, iluminacion y efectos especiales para profesionales en Argentina.</description>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
