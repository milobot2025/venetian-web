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

export const metadata: Metadata = {
  title: "Venetian — Audio Profesional & Iluminación",
  description: "Importadores de equipamiento profesional de audio, iluminación, efectos especiales y cables para eventos, teatros y estudios.",
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
