'use client';

import { StrapiProduct, deleteProduct } from '@/lib/strapi-api';

interface ProductTableProps {
  products: StrapiProduct[];
  onEdit: (product: StrapiProduct) => void;
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
  const handleDelete = async (documentId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(documentId);
        window.alert('Producto eliminado correctamente');
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        window.alert('Error al eliminar producto: ' + (error as Error).message);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-800">
                {product.sku || '-'}
              </td>
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900">{product.title}</div>
                  <div className="text-xs text-gray-500">{product.modelo}</div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="font-semibold">{formatPrice(product.price)}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${product.stock?.includes('MAYOR') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {product.stock || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {product.category?.name || 'Sin categoría'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(product)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.documentId)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay productos cargados.
        </div>
      )}
    </div>
  );
}