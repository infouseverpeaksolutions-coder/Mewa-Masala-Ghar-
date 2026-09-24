import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, Search, ShoppingBag } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const NotFoundPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-[#FAF6EC]">
      <SEOHead title="404 Page Not Found" description="The page you are looking for could not be found." />
      <div className="max-w-lg w-full text-center p-8 md:p-12 bg-white rounded-3xl border border-[#E7E0D0] shadow-soft space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-[#2F5D3A] rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441]">Error 404</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#183B23]">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            The page you requested might have been moved, renamed, or is temporarily unavailable. Let us help you find your pure harvest.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-sm mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dry fruits, spices, clays..."
            className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm bg-[#FAF6EC]/60 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white min-h-[44px]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white rounded-full text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-[#2F5D3A] text-white rounded-full text-xs font-bold hover:bg-[#1F4D2E] transition shadow-xs"
          >
            <Home className="w-4 h-4" /> <span>Go to Homepage</span>
          </Link>
          <Link
            to="/shop"
            className="flex items-center gap-2 px-6 py-3 bg-[#FAF6EC] text-[#805D17] border border-[#E7E0D0] rounded-full text-xs font-bold hover:bg-[#EFE8D6] transition"
          >
            <ShoppingBag className="w-4 h-4 text-[#D9A441]" /> <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
