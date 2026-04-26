'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StrapiProduct, StrapiCategory } from '@/lib/strapi-api';
import { ProductTable } from './ProductTable';
import { CategoryTable } from './CategoryTable';
import { ProductForm } from './ProductForm';
import { CategoryForm } from './CategoryForm';
import { LogOut, Loader2 } from 'lucide-react';

interface AdminClientProps {
  initialProducts: StrapiProduct[];
  initialCategories: StrapiCategory[];
}

export function AdminClient({ initialProducts, initialCategories }: AdminClientProps) {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StrapiProduct | undefined>(undefined);
  const [editingCategory, setEditingCategory] = useState<StrapiCategory | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  const handleProductSuccess = () => {
    setShowProductForm(false);
    setEditingProduct(undefined);
    window.location.reload();
  };

  const handleCategorySuccess = () => {
    setShowCategoryForm(false);
    setEditingCategory(undefined);
    window.location.reload();
  };

  const handleEditProduct = (product: StrapiProduct) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleEditCategory = (category: StrapiCategory) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Gestión de productos y categorías</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </header>

      {/* Modals */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <ProductForm
              product={editingProduct}
              categories={initialCategories}
              onSuccess={handleProductSuccess}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(undefined);
              }}
            />
          </div>
        </div>
      )}

      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <CategoryForm
              category={editingCategory}
              onSuccess={handleCategorySuccess}
              onCancel={() => {
                setShowCategoryForm(false);
                setEditingCategory(undefined);
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Productos ({initialProducts.length})
              </h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                + Nuevo Producto
              </button>
            </div>
            <ProductTable products={initialProducts} onEdit={handleEditProduct} />
          </section>
        </div>

        <div>
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Categorías ({initialCategories.length})
              </h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                + Nueva Categoría
              </button>
            </div>
            <CategoryTable categories={initialCategories} onEdit={handleEditCategory} />
          </section>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Conectado a Strapi en {process.env.NEXT_PUBLIC_STRAPI_URL}</p>
      </div>
    </div>
  );
}