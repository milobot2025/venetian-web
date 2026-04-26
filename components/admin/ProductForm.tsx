'use client';

import { useState } from 'react';
import { StrapiProduct, StrapiCategory, createProduct, updateProduct, uploadImage } from '@/lib/strapi-api';

interface ProductFormProps {
  product?: StrapiProduct;
  categories: StrapiCategory[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, categories, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<StrapiProduct>>(
    product || {
      title: '',
      slug: '',
      description: '',
      price: 0,
      stock: 'STOCK DISPONIBLE',
      featured: false,
      sku: '',
      modelo: '',
    }
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : val,
    }));

    // Auto-generate slug from title if it's a new product
    if (name === 'title' && !product) {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let dataToSave = { ...formData };
      
      // 1. Upload image if selected
      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile);
        if (uploadRes && uploadRes[0]) {
          // Strapi v5 uses 'image' field for single relation
          dataToSave.image = uploadRes[0].id;
        }
      }

      // 2. Filter internal fields
      const { id, documentId, createdAt, updatedAt, publishedAt, category, ...cleanData } = dataToSave;

      // 3. Save to Strapi
      if (product?.documentId) {
        await updateProduct(product.documentId, cleanData);
      } else {
        await createProduct(cleanData);
      }

      window.alert(product ? 'Producto actualizado' : 'Producto creado');
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      window.alert('Error al guardar: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="title"
            required
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            value={formData.title || ''}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            name="sku"
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            value={formData.sku || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Modelo</label>
          <input
            type="text"
            name="modelo"
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            value={formData.modelo || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio (ARS)</label>
          <input
            type="number"
            name="price"
            required
            step="0.01"
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            value={formData.price || 0}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            name="category"
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            value={(formData as any).category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.documentId}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="text"
            name="stock"
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            value={formData.stock || ''}
            onChange={handleChange}
          />
        </div>
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Imagen</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded border" />
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          checked={formData.featured || false}
          onChange={handleChange}
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
          Producto destacado (aparece en la Home)
        </label>
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
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
}