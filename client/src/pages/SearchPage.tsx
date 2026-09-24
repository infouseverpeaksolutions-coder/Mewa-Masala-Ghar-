import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, ArrowUpDown, X, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { LeafIcon } from '../components/ui/Icons';
import api from '../services/api';
import { Product } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevant');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sync searchTerm state if URL changes
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  // Fetch search results
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['search-products', initialQuery, storeFilter],
    queryFn: async () => {
      let url = `/products?limit=100`;
      if (initialQuery) url += `&search=${encodeURIComponent(initialQuery)}`;
      if (storeFilter !== 'all') url += `&store=${storeFilter}`;
      const res = await api.get(url);
      return (res.data?.data?.products || []) as Product[];
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Client-side filtering & sorting
  const filteredProducts = products.filter((p) => {
    const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
    if (inStockOnly && totalStock <= 0) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.variants?.[0]?.price || 0;
    const priceB = b.variants?.[0]?.price || 0;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // relevance
  });

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-semibold">
        <Link to="/" className="hover:text-[#2F5D3A] transition-colors">Home</Link>
        <span>•</span>
        <span className="text-[#1F4D2E] font-bold">Search Catalog</span>
      </nav>

      {/* Search Header Card */}
      <div className="bg-white rounded-3xl border border-[#E7E0D0] p-6 sm:p-10 shadow-soft text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2">
          <LeafIcon className="w-5 h-5 text-[#2F5D3A]" color="#2F5D3A" />
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1F4D2E] tracking-tight">
            Search Our Catalog
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto font-sans">
          Pure dry fruits, slow-roasted makhana snacks, sprouted baby cereals, and authentic volcanic clays.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search almonds, peri-peri makhana, sprouted ragi, multani mitti..."
            className="w-full pl-12 pr-14 py-3.5 text-xs sm:text-sm bg-[#FAF6EC] border border-[#E7E0D0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] shadow-inner text-gray-900 placeholder-gray-400 min-h-[44px]"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pt-1" />
          <button
            type="submit"
            className="absolute right-1.5 top-3.5 bottom-1.5 w-10 h-10 bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] rounded-full flex items-center justify-center transition-colors shadow-2xs min-h-[40px]"
            aria-label="Submit search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Filter & Sort Controls */}
      <div className="bg-white rounded-2xl border border-[#E7E0D0] p-4 sm:p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Store Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Departments' },
            { id: 'foods', label: 'Foods & Spices' },
            { id: 'baby', label: 'Baby & Family' },
            { id: 'care', label: 'Personal Care' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStoreFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all min-h-[44px] ${
                storeFilter === tab.id
                  ? 'bg-[#2F5D3A] text-white shadow-2xs'
                  : 'bg-[#FAF6EC] text-gray-700 hover:bg-[#F2ECE0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort and Stock filter */}
        <div className="flex items-center gap-4 text-xs font-bold text-gray-700 self-end md:self-auto">
          <label className="flex items-center gap-2 cursor-pointer select-none min-h-[44px]">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#2F5D3A] focus:ring-[#2F5D3A] border-gray-300"
            />
            <span>In Stock Only</span>
          </label>

          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort search results"
              className="appearance-none pl-3 pr-8 py-2 bg-[#FAF6EC] border border-[#E7E0D0] rounded-full text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] min-h-[44px]"
            >
              <option value="relevant">Most Relevant</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-600 px-1">
        <div>
          {initialQuery ? (
            <span>
              Found <strong className="text-gray-900 font-bold">{sortedProducts.length}</strong> items for "{initialQuery}"
            </span>
          ) : (
            <span>
              Showing <strong className="text-gray-900 font-bold">{sortedProducts.length}</strong> products
            </span>
          )}
        </div>
        {initialQuery && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSearchParams({});
            }}
            className="text-[#2F5D3A] font-bold hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-[#E7E0D0]" />
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        /* Friendly Empty State with Suggestions */
        <div className="bg-white rounded-3xl border border-[#E7E0D0] p-12 text-center max-w-lg mx-auto shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF6EC] flex items-center justify-center mx-auto text-[#2F5D3A]">
            <LeafIcon className="w-8 h-8 text-[#2F5D3A]" color="#2F5D3A" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1F4D2E]">No matching products found</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
            We couldn't find any products matching "{initialQuery}". Try checking for spelling or explore our most popular staples below:
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            {['Almonds', 'Makhana', 'Flax Seeds', 'Turmeric', 'Multani Mitti', 'Baby Porridge'].map((sug) => (
              <button
                key={sug}
                onClick={() => {
                  setSearchTerm(sug);
                  setSearchParams({ q: sug });
                }}
                className="px-4 py-2 text-xs font-bold bg-[#FAF6EC] text-[#1F4D2E] rounded-full hover:bg-[#2F5D3A] hover:text-white transition-colors border border-[#E7E0D0] min-h-[44px]"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
