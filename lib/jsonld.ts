const SITE_URL = 'https://venetian.com.ar';

export interface ProductForJsonLd {
  documentId: string;
  title: string;
  subtitulo?: string;
  description?: string;
  sku: string;
  price?: number;
  categoryName: string;
  image?: { url: string };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'Venetian',
    alternateName: ['Venetian Argentina', 'Venetian Audio'],
    url: SITE_URL,
    logo: `${SITE_URL}/logo-venetian-full.png`,
    description: 'Audio, iluminacion y efectos especiales. La marca que acompana a profesionales del rubro.',
    email: 'venetianarg@gmail.com',
    telephone: '+54-9-11-7640-2148',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Parana 266',
      addressLocality: 'CABA',
      addressRegion: 'Buenos Aires',
      postalCode: 'C1017',
      addressCountry: 'AR',
    },
    areaServed: 'AR',
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Venetian',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/catalogo?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productJsonLd(p: ProductForJsonLd) {
  const url = `${SITE_URL}/producto/${p.documentId}`;
  const imageUrl = p.image?.url
    ? (p.image.url.startsWith('http') ? p.image.url : `${SITE_URL}${p.image.url}`)
    : undefined;
  const name = p.subtitulo || p.title;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name,
        alternateName: p.title,
        sku: p.sku,
        mpn: p.title,
        description: p.description,
        image: imageUrl,
        brand: { '@type': 'Brand', name: 'Venetian' },
        category: p.categoryName,
        url,
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: 'ARS',
          price: p.price,
          availability: 'https://schema.org/PreOrder',
          seller: { '@type': 'Organization', name: 'Venetian' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Catalogo', item: `${SITE_URL}/catalogo` },
          { '@type': 'ListItem', position: 3, name: p.categoryName, item: `${SITE_URL}/catalogo?categoria=${encodeURIComponent(p.categoryName)}` },
          { '@type': 'ListItem', position: 4, name: name, item: url },
        ],
      },
    ],
  };
}

export function catalogJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Catalogo Venetian',
    description: 'Catalogo completo de productos de audio, iluminacion y efectos especiales Venetian.',
    url: `${SITE_URL}/catalogo`,
    publisher: { '@type': 'Organization', name: 'Venetian', url: SITE_URL },
  };
}
