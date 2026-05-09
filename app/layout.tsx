import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SideCart from "@/components/SideCart";
import IntroOverlay from "@/components/IntroOverlay";
import { CartProvider } from "@/lib/context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = 'https://venetian.com.ar';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Venetian | Audio, Iluminacion y Efectos Especiales en Argentina",
    template: "%s | Venetian",
  },
  description: "Venetian — La marca que acompana a profesionales del rubro. Audio, iluminacion, efectos especiales y rigging para eventos, teatros, estudios e integradores en Argentina.",
  keywords: [
    "Venetian", "Venetian Argentina", "Venetian audio", "Venetian iluminacion",
    "audio profesional Argentina", "iluminacion escenica",
    "cabezal movil", "maquina de humo", "par led", "consola dmx",
    "equipamiento eventos", "efectos especiales", "audio iluminacion CABA",
    "marca venetian", "DMX argentina", "rigging escenico",
  ],
  authors: [{ name: "Venetian" }],
  creator: "Venetian",
  publisher: "Venetian",
  verification: {
    google: "5qpplNb0oz_likPQAFy62wTdVC4XnHrlWtBrCClbmcA",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: "/favicon.ico", apple: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Venetian",
    title: "Venetian | Audio, Iluminacion y Efectos Especiales en Argentina",
    description: "La marca que acompana a profesionales del rubro. Audio, iluminacion, efectos especiales y rigging.",
    images: [{ url: "/logo-venetian-full.png", width: 1200, height: 630, alt: "Venetian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Venetian | Audio, Iluminacion y Efectos Especiales",
    description: "La marca que acompana a profesionales del rubro.",
    images: ["/logo-venetian-full.png"],
  },
  alternates: { canonical: SITE_URL },
  category: "Equipamiento profesional de audio e iluminacion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {/* GTM noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* GTM script */}
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}

        {/* GA4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { page_path: window.location.pathname });`}
            </Script>
          </>
        )}

        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            }),
          }}
        />
        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Venetian',
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/catalogo?search={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <CartProvider>
          <IntroOverlay />
          <Header />
          <SideCart />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
