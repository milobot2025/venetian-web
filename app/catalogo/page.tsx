'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/mock-data';
import { Filter, Grid, List, ChevronDown, Search, X } from 'lucide-react';

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filtro por búsqueda
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      );
    }

    // Filtro por precio
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, priceRange]);

  const maxPrice = Math.max(...products.map((p) => p.price));
  const minPrice = Math.min(...products.map((p) => p.price));

  return (
    <div className="min-h-screen bg-black">
      {/* Header del catálogo */}
      <div className="border-b border-gray-900 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white">Catálogo Completo</h1>
              <p className="text-gray-400 mt-2">
                {products.length} productos profesionales para audio, iluminación y efectos especiales.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, SKU o descripción..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Filter className="h-5 w-5" />
                Filtros
              </div>

              {/* Filtro por categoría */}
              <div className="border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Categorías</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === 'all' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                  >
                    Todas las categorías
                    <span className="float-right text-gray-500">{products.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === cat.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                    >
                      {cat.name}
                      <span className="float-right text-gray-500">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por precio */}
              <div className="border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Rango de precio</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>${priceRange[0].toLocaleString('es-AR')}</span>
                    <span>${priceRange[1].toLocaleString('es-AR')}</span>
                  </div>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={10000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-white text-sm"
                      placeholder="Mín"
                    />
                    <input
                      type="number"
                      min={0}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                      className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-white text-sm"
                      placeholder="Máx"
                    />
                  </div>
                </div>
              </div>

              {/* Botón limpiar filtros */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceRange([0, maxPrice]);
                }}
                className="w-full py-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 text-sm font-medium"
              >
                Limpiar todos los filtros
              </button>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            {/* Estadísticas */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                Mostrando <span className="text-white font-semibold">{filteredProducts.length}</span> de{' '}
                <span className="text-white font-semibold">{products.length}</span> productos
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                Ordenar por
                <button className="flex items-center gap-1 text-white">
                  Relevancia <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Grid/Lista de productos */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 border border-gray-800 rounded-2xl bg-gradient-to-b from-gray-900/50 to-transparent">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900 mb-4">
                  <Search className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron productos</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Intenta con otros filtros o términos de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setPriceRange([0, maxPrice]);
                  }}
                  className="mt-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col lg:flex-row gap-6 border border-gray-800 rounded-xl p-6 bg-gray-900/50 hover:bg-gray-900 transition-colors"
                  >
                    <div className="lg:w-48 lg:h-48 aspect-square rounded-lg bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-500">Sin imagen</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                          <p className="text-gray-400 mt-1">{product.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            ${product.price.toLocaleString('es-AR')}
                          </p>
                          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                          {product.category}
                        </span>
                        <div className="flex gap-2">
                          <button className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                            Ver detalles
                          </button>
                          <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                            Cotizar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button className="rounded-lg border border-gray-800 px-4 py-2 text-sm text-gray-400 hover:text-white">
                  Anterior
                </button>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${num === 1 ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {num}
                  </button>
                ))}
                <button className="rounded-lg border border-gray-800 px-4 py-2 text-sm text-gray-400 hover:text-white">
                  Siguiente
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}