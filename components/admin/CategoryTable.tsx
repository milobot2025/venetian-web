'use client';

import { StrapiCategory, deleteCategory } from '@/lib/strapi-api';

interface CategoryTableProps {
  categories: StrapiCategory[];
  onEdit: (category: StrapiCategory) => void;
}

export function CategoryTable({ categories, onEdit }: CategoryTableProps) {
  const handleDelete = async (documentId: string) => {
    if (confirm('¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.')) {
      try {
        await deleteCategory(documentId);
        window.alert('Categoría eliminada correctamente');
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        window.alert('Error al eliminar categoría: ' + (error as Error).message);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="font-medium text-gray-900">{category.name}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                <code className="bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-600 truncate max-w-xs">
                  {category.description || 'Sin descripción'}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(category)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(category.documentId)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay categorías cargadas.
        </div>
      )}
    </div>
  );
}