import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, SlidersHorizontal, RefreshCw, X, ChevronDown, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { LeafIcon } from '../components/ui/Icons';
import { useTheme, STORE_THEMES, StoreType } from '../context/ThemeContext';
import api from '../services/api';
import { Product, Category } from '../types';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeStore, setActiveStore } = useTheme();

  const storeParam = searchParams.get('store');
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const featuredParam = searchParams.get('featured') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedSort, setSelectedSort] = useState<string>(sortParam);
  const [searchInput, setSearchInput] = useState<string>(searchParam);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Sync with storeParam
  useEffect(() => {
    if (storeParam && (storeParam === 'foods' || storeParam === 'baby' || storeParam === 'care')) {
      if (activeStore !== storeParam) {
        setActiveStore(storeParam as StoreType);
      }
    }
  }, [storeParam, activeStore, setActiveStore]);

  // Fetch categories for active store
  const { data: storesData } = useQuery({
    queryKey: ['stores-categories'],
    queryFn: async () => {
      const res = await api.get('/products/stores');
      return res.data?.data as Array<{ slug: string; categories: Category[] }>;
    },
  });

  const activeStoreCategories =
    storesData?.find((s) => s.slug === activeStore)?.categories || [];

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', activeStore, selectedCategory, searchParam, featuredParam, selectedSort],
    queryFn: async () => {
      let url = `/products?store=${activeStore}&sort=${selectedSort}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (searchParam) url += `&search=${encodeURIComponent(searchParam)}`;
      if (featuredParam) url += `&featured=true`;
      const res = await api.get(url);
      return res.data?.data?.products as Product[];
    },
  });

  const handleApplyFilter = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (catSlug) p.set('category', catSlug);
      else p.delete('category');
      return p;
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSort(val);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('sort', val);
      return p;
    });
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSearchInput('');
    setCurrentPage(1);
    setSearchParams({ store: activeStore });
  };

  // Pagination calculations
  const totalProducts = productsData?.length || 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const paginatedProducts = productsData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12">
      {/* Breadcrumb in ivory context */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
        <Link to="/" className="hover:text-[#2F5D3A] transition-colors">Home</Link>
        <span>•</span>
        <Link to={`/shop?store=${activeStore}`} className="hover:text-[#2F5D3A] transition-colors">Catalog</Link>
        <span>•</span>
        <span className="text-[#1F4D2E] font-bold">{STORE_THEMES[activeStore]?.name}</span>
      </nav>

      {/* Page Title & Sort Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E7E0D0]">
        <div>
          <div className="flex items-center gap-2.5">
            <LeafIcon className="w-5 h-5 text-[#2F5D3A]" color="#2F5D3A" />
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1F4D2E] tracking-tight">
              {STORE_THEMES[activeStore]?.name}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl font-sans">
            {STORE_THEMES[activeStore]?.tagline}
          </p>
        </div>

        {/* Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-[#E7E0D0] rounded-full text-xs font-bold text-[#1F4D2E] bg-white shadow-2xs min-h-[44px]"
            aria-label="Open filter panel"
          >
            <Filter className="w-4 h-4 text-[#2F5D3A]" />
            <span>Filters {selectedCategory ? '(1)' : ''}</span>
          </button>

          <div className="relative flex items-center">
            <label htmlFor="shop-sort" className="sr-only">Sort products</label>
            <select
              id="shop-sort"
              value={selectedSort}
              onChange={handleSortChange}
              className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-[#E7E0D0] rounded-full text-xs font-bold text-gray-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] min-h-[44px]"
            >
              <option value="newest">Sort: Newest Arrivals</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="price_asc">Sort: Price Low to High</option>
              <option value="price_desc">Sort: Price High to Low</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 sticky top-24">
          {/* Active Store Switcher */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7E0D0] shadow-soft">
            <h3 className="font-serif font-bold text-sm text-[#1F4D2E] mb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2F5D3A]" />
              <span>Department</span>
            </h3>
            <div className="space-y-1.5">
              {(['foods', 'baby', 'care'] as StoreType[]).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setActiveStore(st);
                    setSelectedCategory('');
                    setCurrentPage(1);
                    setSearchParams({ store: st });
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-between min-h-[44px] ${
                    activeStore === st
                      ? 'bg-[#2F5D3A] text-white shadow-2xs'
                      : 'text-gray-700 hover:bg-[#FAF6EC]'
                  }`}
                >
                  <span>{STORE_THEMES[st].name}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/50"
                    style={{ backgroundColor: STORE_THEMES[st].accentColor }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7E0D0] shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-sm text-[#1F4D2E]">Categories</h3>
              {selectedCategory && (
                <button
                  onClick={() => handleApplyFilter('')}
                  className="text-[11px] text-[#2F5D3A] font-bold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleApplyFilter('')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between min-h-[40px] ${
                  !selectedCategory
                    ? 'font-bold text-[#1F4D2E] bg-[#FAF6EC]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>All Categories</span>
                {!selectedCategory && <span className="w-1.5 h-1.5 rounded-full bg-[#2F5D3A]" />}
              </button>
              {activeStoreCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleApplyFilter(cat.slug)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between min-h-[40px] ${
                    selectedCategory === cat.slug
                      ? 'font-bold text-[#1F4D2E] bg-[#FAF6EC]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.slug && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F5D3A]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(selectedCategory || searchParam) && (
            <button
              onClick={clearAllFilters}
              className="w-full py-2.5 border border-dashed border-gray-300 rounded-full text-xs font-bold text-gray-600 hover:text-red-700 hover:border-red-300 transition-colors flex items-center justify-center gap-2 bg-white shadow-2xs min-h-[44px]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Applied Filters</span>
            </button>
          )}
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {searchParam && (
            <div className="mb-6 flex items-center justify-between p-3.5 bg-[#FAF6EC] border border-[#E7E0D0] rounded-2xl text-xs text-gray-800">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                <span>Showing search results for: <strong>"{searchParam}"</strong></span>
              </span>
              <button
                onClick={() => {
                  setSearchInput('');
                  setSearchParams((p) => {
                    p.delete('search');
                    return p;
                  });
                }}
                className="p-1 text-gray-500 hover:text-gray-800"
                aria-label="Clear search filter"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-white rounded-2xl animate-pulse border border-[#E7E0D0]"
                />
              ))}
            </div>
          ) : paginatedProducts && paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Styled Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-[#E7E0D0]">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full border border-[#E7E0D0] text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1.5">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-full text-xs font-bold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                            currentPage === pageNum
                              ? 'bg-[#2F5D3A] text-white shadow-2xs'
                              : 'bg-white border border-[#E7E0D0] text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-full border border-[#E7E0D0] text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Friendly Empty State */
            <div className="bg-white rounded-3xl border border-[#E7E0D0] p-12 text-center max-w-lg mx-auto my-8 shadow-soft">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EC] flex items-center justify-center mx-auto mb-4 text-[#2F5D3A]">
                <LeafIcon className="w-8 h-8 text-[#2F5D3A]" color="#2F5D3A" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1F4D2E] mb-2">
                No Products Found
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 font-sans">
                We couldn't find any products matching your selected filters in this department. Try resetting your filters to explore our full selection.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white text-xs font-bold transition-all shadow-2xs min-h-[44px]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Slide-Up Filter Sheet (390px first-class experience) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl p-6 overflow-y-auto z-10 animate-in slide-in-from-bottom duration-300">
            {/* Grab handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <LeafIcon className="w-4 h-4 text-[#2F5D3A]" color="#2F5D3A" />
                <h3 className="font-serif font-bold text-lg text-[#1F4D2E]">Filter Products</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6 pb-20">
              {/* Departments */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Department
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {(['foods', 'baby', 'care'] as StoreType[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setActiveStore(st);
                        setSelectedCategory('');
                        setCurrentPage(1);
                        setSearchParams({ store: st });
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-between min-h-[44px] ${
                        activeStore === st
                          ? 'bg-[#2F5D3A] text-white'
                          : 'bg-[#FAF6EC] text-gray-800'
                      }`}
                    >
                      <span>{STORE_THEMES[st].name}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: STORE_THEMES[st].accentColor }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleApplyFilter('')}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs min-h-[44px] flex items-center justify-between ${
                      !selectedCategory
                        ? 'font-bold text-[#1F4D2E] bg-[#FAF6EC]'
                        : 'text-gray-700 bg-gray-50'
                    }`}
                  >
                    <span>All Categories</span>
                    {!selectedCategory && <span className="w-1.5 h-1.5 rounded-full bg-[#2F5D3A]" />}
                  </button>
                  {activeStoreCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleApplyFilter(cat.slug)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs min-h-[44px] flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? 'font-bold text-[#1F4D2E] bg-[#FAF6EC]'
                          : 'text-gray-700 bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory === cat.slug && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2F5D3A]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Action Button */}
            <div className="fixed inset-x-0 bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 rounded-full border border-gray-300 text-gray-700 text-xs font-bold min-h-[44px]"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-full bg-[#2F5D3A] text-white text-xs font-bold shadow-sm min-h-[44px]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
