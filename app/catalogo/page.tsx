'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductTable from '@/components/ProductTable';
import { fetchProducts, fetchCategories } from '@/lib/api';
import { Filter, Grid, List, ChevronDown, Search, X, Loader } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import Link from 'next/link';

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>("relevance");
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 12;

  // Valor debounceado para la búsqueda
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Cargar categorías una sola vez
  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await fetchCategories();
        setAllCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
    loadCategories();
  }, []);

  // Cargar productos cuando cambian los filtros o la página
  useEffect(() => {
    async function loadProductsData() {
      try {
        setLoading(true);
        const response = await fetchProducts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: debouncedSearchQuery || undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sort: sortBy === 'relevance' ? undefined : sortBy,
          page: currentPage,
          pageSize: pageSize,
        });
        
        setProducts(response.data);
        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.pageCount);
          setTotalProducts(response.meta.pagination.total);
        }
      } catch (error) {
        console.error('[CATALOGO] Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProductsData();
  }, [selectedCategory, debouncedSearchQuery, priceRange, sortBy, currentPage]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearchQuery, priceRange, sortBy]);

  const maxPrice = 5000000;
  const minPrice = 0;

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange([minPrice, maxPrice]);
    setSortBy("relevance");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header del catálogo */}
      <div className="border-b border-gray-900 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-4xl">Catálogo Venetian</h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                {totalProducts} productos de audio, iluminación, efectos y cables.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
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

      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-24 lg:px-8 text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Cargando catálogo...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
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
                 <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === 'all' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                  >
                    Todas las categorías
                  </button>
                   {allCategories.map((cat) => (
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
                onClick={clearFilters}
                className="w-full py-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 text-sm font-medium"
              >
                Limpiar todos los filtros
              </button>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            {/* Estadísticas */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <p className="text-gray-400">
                Mostrando <span className="text-white font-semibold">{products.length}</span> de{' '}
                 <span className="text-white font-semibold">{totalProducts}</span> productos
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                 Ordenar por
                 <div className="relative">
                   <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as any)}
                     className="pl-3 pr-8 py-2 rounded-lg border border-gray-800 bg-gray-900 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                   >
                     <option value="relevance">Relevancia</option>
                     <option value="price_asc">Precio: Menor a Mayor</option>
                     <option value="price_desc">Precio: Mayor a Menor</option>
                     <option value="name_asc">Nombre: A-Z</option>
                     <option value="name_desc">Nombre: Z-A</option>
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                     <ChevronDown className="h-4 w-4" />
                   </div>
                 </div>
               </div>
            </div>

            {/* Grid/Lista de productos */}
            {products.length === 0 ? (
              <div className="text-center py-16 border border-gray-800 rounded-2xl bg-gradient-to-b from-gray-900/50 to-transparent">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900 mb-4">
                  <Search className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron productos</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Intenta con otros filtros o términos de búsqueda.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <ProductTable products={products} />
            )}

            {/* Paginación */}
            {products.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button 
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-800 px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                  // Mostrar solo algunas páginas si hay muchas
                  if (
                    totalPages > 7 &&
                    num !== 1 &&
                    num !== totalPages &&
                    Math.abs(num - currentPage) > 2
                  ) {
                    if (num === 2 && currentPage > 4) {
                      return <span key="dots-start" className="text-gray-600">...</span>;
                    }
                    if (num === totalPages - 1 && currentPage < totalPages - 3) {
                      return <span key="dots-end" className="text-gray-600">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={num}
                      onClick={() => {
                        setCurrentPage(num);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${num === currentPage ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                    >
                      {num}
                    </button>
                  );
                })}
                <button 
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-800 px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    )}
    </div>
  );
}
