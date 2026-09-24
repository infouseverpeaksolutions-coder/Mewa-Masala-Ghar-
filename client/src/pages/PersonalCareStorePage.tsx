import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ShieldCheck, ArrowRight, Droplet, Sun, Feather, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CornerLeaves, DeliveryTruckIcon, QualityBadgeIcon } from '../components/ui/Icons';
import api from '../services/api';
import { Product } from '../types';

export const PersonalCareStorePage: React.FC = () => {
  const { setActiveStore } = useTheme();
  const { settings } = useSettings();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  useEffect(() => {
    setActiveStore('care');
    window.scrollTo(0, 0);
  }, [setActiveStore]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['care-store-products'],
    queryFn: async () => {
      const res = await api.get('/products?store=care&limit=50');
      return (res.data?.data?.products || []) as Product[];
    },
  });

  const multani = products.filter(
    (p) =>
      p.category?.slug === 'multani-mitti-clays' ||
      p.name?.toLowerCase().includes('multani') ||
      p.slug?.includes('multani')
  );
  const muds = products.filter(
    (p) =>
      p.category?.slug === 'dead-sea-mud' ||
      p.name?.toLowerCase().includes('mud') ||
      p.slug?.includes('mud')
  );

  const filteredProducts =
    selectedSubCategory === 'all'
      ? products
      : products.filter(
          (p) =>
            p.category?.slug === selectedSubCategory ||
            (selectedSubCategory === 'multani' && (p.name?.toLowerCase().includes('multani') || p.slug?.includes('multani'))) ||
            (selectedSubCategory === 'mud' && (p.name?.toLowerCase().includes('mud') || p.slug?.includes('mud')))
        );

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. ONE CLEAN HERO BANNER (Personal Care Theme: Rose & Warm Sand) */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FDF2F4] via-[#FAF0EE] to-[#F7EBE8] border border-[#F5CED4] shadow-card min-h-[380px] sm:min-h-[440px] flex items-center">
          {/* Subtle corner leaves */}
          <div className="absolute top-2 left-2 pointer-events-none opacity-30">
            <CornerLeaves className="w-28 h-28 text-[#E0808C]" color="#E0808C" />
          </div>

          <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#F5CED4] text-[#8E3B46] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#C26371]" />
                <span>Pure Earth Minerals & Micro-Fine Clays</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#8E3B46] leading-[1.1] tracking-tight">
                Triple-Sifted Multani Mitti & <br />
                <span className="text-[#8E3B46]">Natural Mineral Clays.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#2B2B2B]/85 max-w-lg leading-relaxed">
                Sourced from pristine Rajasthan geological beds, sun-purified and 300-mesh sifted. 100% natural Fuller's Earth, soothing Rose Pink Clay, and mineral-dense Dead Sea Mud.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#clays-section"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C26371] hover:bg-[#A84E5B] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all group"
                >
                  <span>Explore Natural Clays</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <Link
                  to="/shop?store=care"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 hover:bg-white text-[#8E3B46] font-bold text-xs sm:text-sm border border-[#F5CED4] transition-all shadow-2xs"
                >
                  <span>All Personal Care</span>
                </Link>
              </div>

              <div className="pt-3 border-t border-[#8E3B46]/15 flex flex-wrap items-center gap-4 text-xs text-[#8E3B46]/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C26371]" />
                  300-Mesh Micro Triple-Sifted
                </span>
                <span>•</span>
                <span>Zero Fragrance & Paraben Free</span>
              </div>
            </div>

            {/* Right imagery showcase */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative">
              <div className="relative w-full max-w-sm flex items-center justify-center gap-3 drop-shadow-lg">
                <div className="w-1/2 aspect-square rounded-2xl overflow-hidden bg-white/80 border-2 border-white shadow-md p-1">
                  <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80"
                    alt="Natural Skincare Clay Tube"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="w-1/2 aspect-square rounded-2xl overflow-hidden bg-white/80 border-2 border-white shadow-md p-1">
                  <img
                    src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80"
                    alt="Mineral Clay Powder and Mask"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 pointer-events-none opacity-30">
                <CornerLeaves className="w-28 h-28 text-[#E0808C]" color="#E0808C" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHORT BENEFITS ROW (4 Circular Rose Theme Badges) */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="bg-white rounded-2xl border border-[#F5CED4] py-4 px-6 shadow-soft">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full border-2 border-[#E0808C] flex items-center justify-center shrink-0">
                <Feather className="w-5 h-5 text-[#C26371]" />
              </div>
              <span className="text-xs font-bold text-gray-800">300-Mesh Triple Sifted</span>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full border-2 border-[#E0808C] flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5 text-[#C26371]" />
              </div>
              <span className="text-xs font-bold text-gray-800">Sun-Purified Natural</span>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full border-2 border-[#E0808C] flex items-center justify-center shrink-0">
                <QualityBadgeIcon className="w-5 h-5 text-[#C26371]" color="#C26371" />
              </div>
              <span className="text-xs font-bold text-gray-800">Zero Chemical Additives</span>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full border-2 border-[#E0808C] flex items-center justify-center shrink-0">
                <DeliveryTruckIcon className="w-5 h-5 text-[#C26371]" color="#C26371" />
              </div>
              <span className="text-xs font-bold text-gray-800">Pan-India Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUBCATEGORY CARDS */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <SectionHeading title="Explore Clay & Mineral Collections" leafColor="#E0808C" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Premium Multani Mitti */}
          <div className="bg-[#FCE9EC] rounded-2xl border border-[#F5CED4] p-6 shadow-soft flex flex-col justify-between relative group hover:shadow-card transition-all">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80"
                alt="Premium Multani Mitti"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-[#8E3B46]">
                  Premium Multani Mitti
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">(Export Quality 300 Mesh)</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubCategory('multani')}
              className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#C26371] hover:bg-[#A84E5B] text-white text-xs font-bold transition-colors min-h-[44px]"
            >
              <span>Explore Fuller's Earth</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Pink Multani */}
          <div className="bg-[#FCE9EC] rounded-2xl border border-[#F5CED4] p-6 shadow-soft flex flex-col justify-between relative group hover:shadow-card transition-all">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=200&q=80"
                alt="Pink Multani Clay"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-[#8E3B46]">
                  Pink Multani Mitti
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">Gentle Glow for Sensitive Skin</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubCategory('multani')}
              className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#C26371] hover:bg-[#A84E5B] text-white text-xs font-bold transition-colors min-h-[44px]"
            >
              <span>Explore Pink Clays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Dead Sea Mud */}
          <div className="bg-[#FCE9EC] rounded-2xl border border-[#F5CED4] p-6 shadow-soft flex flex-col justify-between relative group hover:shadow-card transition-all">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=200&q=80"
                alt="Dead Sea Mineral Mud"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-[#8E3B46]">
                  Dead Sea Mineral Mud
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">Detoxifying Natural Minerals</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubCategory('mud')}
              className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#C26371] hover:bg-[#A84E5B] text-white text-xs font-bold transition-colors min-h-[44px]"
            >
              <span>Explore Mineral Muds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Personal Care' },
            { id: 'multani', label: 'Multani Mitti & Clays' },
            { id: 'mud', label: 'Dead Sea Mud Packs' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedSubCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all min-h-[44px] ${
                selectedSubCategory === cat.id
                  ? 'bg-[#C26371] text-white shadow-xs'
                  : 'bg-white border border-[#F5CED4] text-gray-700 hover:bg-[#FCE9EC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS GRID */}
      {selectedSubCategory !== 'all' ? (
        <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
          <SectionHeading
            title={selectedSubCategory === 'multani' ? 'Multani Mitti Clays' : 'Mineral Mud Packs'}
            leafColor="#E0808C"
          />
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 bg-white animate-pulse rounded-2xl border border-gray-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 space-y-12">
          {/* Multani Mitti Shelf */}
          <div id="clays-section">
            <SectionHeading
              title="Fuller's Earth & Multani Mitti Packs"
              viewAllLink="/shop?store=care&category=multani-mitti-clays"
              leafColor="#E0808C"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {multani.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Mud Packs Shelf */}
          {muds.length > 0 && (
            <div>
              <SectionHeading
                title="Dead Sea & Mineral Mud Treatments"
                viewAllLink="/shop?store=care&category=dead-sea-mud"
                leafColor="#E0808C"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {muds.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
