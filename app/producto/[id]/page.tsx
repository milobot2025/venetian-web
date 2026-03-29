import { notFound } from 'next/navigation';
import { products } from '@/lib/mock-data';
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  Check, 
  Star, 
  ChevronRight, 
  Share2, 
  Heart,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== id).slice(0, 4);

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
            <Link href={`/catalogo?categoria=${product.category}`} className="hover:text-white capitalize">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div>
            <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-black aspect-square mb-4">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
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
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className="aspect-square rounded-lg border border-gray-800 bg-gray-900 hover:border-gray-700"
                >
                  {/* Miniaturas */}
                  <div className="h-full w-full flex items-center justify-center text-gray-600">
                    {i}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">{product.name}</h1>
                <p className="text-gray-400 mt-2">{product.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white">
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
                Categoría: <span className="text-white capitalize">{product.category}</span>
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
              <button className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white hover:opacity-90 flex items-center justify-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Agregar al carrito
              </button>
              <button className="flex-1 rounded-lg border border-gray-800 px-8 py-4 text-lg font-semibold text-white hover:bg-gray-900">
                Solicitar cotización
              </button>
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
                href={`/catalogo?categoria=${product.category}`}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-semibold"
              >
                Ver todos <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Volver al catálogo */}
        <div className="mt-12 pt-8 border-t border-gray-900">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}