'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { fetchProduct, fetchProducts, Product } from '@/lib/api';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  Check, 
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
import { useCart } from '@/lib/context/CartContext';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const { addToCart } = useCart();
  
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
          <nav className="flex items-center text-sm text-gray-400">
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

      <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div>
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-black aspect-square mb-4 relative">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  className="object-cover transition-all duration-500"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
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
                    className={`aspect-square rounded-lg border overflow-hidden bg-gray-900 transition-all relative ${
                      activeImage === img.url ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Image src={img.url} alt={`${product.title} ${i + 1}`} fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">{product.title}</h1>
                <p className="text-gray-400 mt-2">{product.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Rating y SKU */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-5 w-5 ${rating < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`}
                  />
                ))}
                <span className="ml-2 text-gray-400">({product.rating || 'N/A'})</span>
              </div>
              <div className="text-gray-400">
                SKU: <span className="text-white font-mono">{product.sku}</span>
              </div>
              <div className="text-gray-400">
                Categoría: <span className="text-white capitalize">{product.categoryName}</span>
              </div>
            </div>

            {/* Precio */}
            <div className="mt-8 p-6 rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-transparent">
              <div className="flex items-end gap-4">
                <span className="text-5xl font-bold text-white">
                  ${product.price.toLocaleString('es-AR')}
                </span>
                <span className="text-gray-400 line-through">${(product.price * 1.3).toLocaleString('es-AR')}</span>
                <span className="rounded-full bg-gradient-to-r from-green-600 to-green-800 px-3 py-1 text-xs font-semibold text-white">
                  30% OFF
                </span>
              </div>
              <p className="text-gray-400 mt-2">Precio público con descuento comercial incluido. IVA incluido.</p>
            </div>

            {/* Especificaciones */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Especificaciones Técnicas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Potencia</p>
                  <p className="text-white font-semibold">1000W RMS</p>
                </div>
                <div className="border border-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Conectividad</p>
                  <p className="text-white font-semibold">XLR, USB, Bluetooth</p>
                </div>
                <div className="border border-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Peso</p>
                  <p className="text-white font-semibold">8.5 kg</p>
                </div>
                <div className="border border-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Garantía</p>
                  <p className="text-white font-semibold">6 meses</p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar al carrito
              </button>
              <a
                href={`https://wa.me/5491143730621?text=Hola! Estoy interesado en el producto: ${product.title} (SKU: ${product.sku})`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-green-600/50 bg-green-900/10 text-green-500 px-8 py-4 text-lg font-semibold hover:bg-green-900/20 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                Consultar WhatsApp
              </a>
            </div>

            {/* Beneficios */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-800">
                <Truck className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Entrega rápida</p>
                  <p className="text-xs text-gray-400">24-48hs en CABA</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-800">
                <Shield className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Garantía oficial</p>
                  <p className="text-xs text-gray-400">6 meses</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-800">
                <Check className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Stock confirmado</p>
                  <p className="text-xs text-gray-400">Disponible</p>
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
