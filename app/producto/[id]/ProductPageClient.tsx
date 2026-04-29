'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { fetchProduct, fetchProducts, Product } from '@/lib/api';
import Image from 'next/image';
import {
  ShoppingCart,
  Shield,
  Star,
  ChevronRight,
  Share2,
  Heart,
  ArrowLeft,
  Loader2,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { PRODUCT_VIDEOS } from '@/lib/product-videos';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';


interface ProductPageProps {
  id: string;
}

export default function ProductPageClient({ id }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const productData = await fetchProduct(id);
        setProduct(productData);
        setActiveImage(productData.image?.url || '');

        const productsResponse = await fetchProducts({ category: productData.categoryName });
        const related = productsResponse.data
          .filter((p) => p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4 lg:px-8">
          <nav className="flex items-center text-sm text-gray-400 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/catalogo" className="hover:text-white">
              Catálogo
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href={`/catalogo?categoria=${product.categoryName}`} className="hover:text-white capitalize">
              {product.categoryName}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white truncate max-w-xs">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div>
            {PRODUCT_VIDEOS[product.documentId] && (
              <div className="rounded-2xl overflow-hidden border border-gray-800 bg-black mb-4 relative max-w-xs mx-auto">
                <video
                  src={PRODUCT_VIDEOS[product.documentId].src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="block w-full h-auto"
                />
              </div>
            )}
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-white aspect-square mb-4 relative cursor-zoom-in">
              {activeImage ? (
                <Zoom zoomMargin={20}>
                  <Image
                    src={activeImage}
                    alt={product.title}
                    fill
                    className="object-contain p-6 transition-all duration-500"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Zoom>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <ShoppingCart className="h-20 w-20 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500">Imagen no disponible</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Miniaturas */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img.url)}
                    className={`aspect-square rounded-lg border overflow-hidden bg-white transition-all relative ${
                      activeImage === img.url ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Image src={img.url} alt={`${product.title} ${i + 1}`} fill className="object-contain p-2" sizes="100px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {product.subtitulo && (
                  <p className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
                    {product.title}
                  </p>
                )}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
                  {product.subtitulo || product.title}
                </h1>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* SKU y Categoría */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <div className="text-gray-400 shrink-0">
                SKU: <span className="text-white font-mono text-xs">{product.sku}</span>
              </div>
              <div className="text-gray-400 shrink-0">
                Categoría: <span className="text-white capitalize">{product.categoryName}</span>
              </div>
            </div>

            {/* Descripción a lo ancho */}
            {product.description && (
              <p className="mt-4 text-gray-300 leading-relaxed">{product.description}</p>
            )}

            {/* Acciones */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/5491176402148?text=Hola! Estoy interesado en el producto: ${encodeURIComponent(product.title)} (SKU: ${product.sku})`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-green-600/50 bg-green-900/10 text-green-500 px-8 py-4 text-lg font-semibold hover:bg-green-900/20 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </div>

            {/* Beneficios */}
            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-800">
                <Shield className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Garantía oficial</p>
                  <p className="text-xs text-gray-400">6 meses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Productos Relacionados</h2>
              <Link
                href={`/catalogo?categoria=${product.categoryName}`}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-semibold"
              >
                Ver todos <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Volver al catálogo */}
        <div className="mt-12 pt-8 border-t border-gray-900">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
