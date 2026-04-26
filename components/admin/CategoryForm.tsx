'use client';

import { useState } from 'react';
import { StrapiCategory, createCategory, updateCategory } from '@/lib/strapi-api';

interface CategoryFormProps {
  category?: StrapiCategory;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<StrapiCategory>>(
    category || {
      name: '',
      slug: '',
      description: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug if it's a new category
    if (name === 'name' && !category) {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id, documentId, createdAt, updatedAt, publishedAt, ...cleanData } = formData;

      if (category?.documentId) {
        await updateCategory(category.documentId, cleanData);
      } else {
        await createCategory(cleanData);
      }

      window.alert(category ? 'Categoría actualizada' : 'Categoría creada');
      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
      window.alert('Error al guardar: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          name="name"
          required
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          value={formData.name || ''}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input
          type="text"
          name="slug"
          required
          className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-50"
          value={formData.slug || ''}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          name="description"
          rows={3}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          value={formData.description || ''}
          onChange={handleChange}
        />
      </div>

      <div className="pt-4 flex justify-end space-x-3 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Categoría'}
        </button>
      </div>
    </form>
  );
}