import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Venetian | Audio, Iluminación y Efectos Especiales en Argentina",
    template: "%s | Venetian",
  },
  description: "Venetian — La marca que acompaña a profesionales del rubro. Audio, iluminación, efectos especiales y rigging para eventos, teatros, estudios e integradores en Argentina.",
  keywords: [
    "Venetian", "Venetian Argentina", "Venetian audio", "Venetian iluminación",
    "audio profesional Argentina", "iluminación escénica",
    "cabezal móvil", "máquina de humo", "par led", "consola dmx",
    "equipamiento eventos", "efectos especiales", "audio iluminación CABA",
    "marca venetian", "DMX argentina", "rigging escénico",
  ],
  authors: [{ name: "Venetian" }],
  creator: "Venetian",
  publisher: "Venetian",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: "/favicon.ico", apple: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Venetian",
    title: "Venetian | Audio, Iluminación y Efectos Especiales en Argentina",
    description: "La marca que acompaña a profesionales del rubro. Audio, iluminación, efectos especiales y rigging.",
    images: [{ url: "/logo-venetian-full.png", width: 1200, height: 630, alt: "Venetian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Venetian | Audio, Iluminación y Efectos Especiales",
    description: "La marca que acompaña a profesionales del rubro.",
    images: ["/logo-venetian-full.png"],
  },
  alternates: { canonical: SITE_URL },
  category: "Equipamiento profesional de audio e iluminación",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Venetian',
              alternateName: ['Venetian Argentina', 'Venetian Audio'],
              url: SITE_URL,
              logo: `${SITE_URL}/logo-venetian-full.png`,
              description: 'Audio, iluminación y efectos especiales. La marca que acompaña a profesionales del rubro.',
              email: 'venetianarg@gmail.com',
              telephone: '+54-9-11-7640-2148',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Paraná 266',
                addressLocality: 'CABA',
                addressRegion: 'Buenos Aires',
                addressCountry: 'AR',
              },
              areaServed: 'AR',
              sameAs: [],
            }),
          }}
        />
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
