import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ShieldCheck, ArrowRight, Baby, Users, HeartPulse, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CornerLeaves, MotherChildIcon, DeliveryTruckIcon, QualityBadgeIcon } from '../components/ui/Icons';
import api from '../services/api';
import { Product } from '../types';

export const BabyNutritionStorePage: React.FC = () => {
  const { setActiveStore } = useTheme();
  const { settings } = useSettings();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  useEffect(() => {
    setActiveStore('baby');
    window.scrollTo(0, 0);
  }, [setActiveStore]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['baby-store-products'],
    queryFn: async () => {
      const res = await api.get('/products?store=baby&limit=50');
      return (res.data?.data?.products || []) as Product[];
    },
  });

  const prathamAahar = products.filter((p) => p.category?.slug === 'pratham-aahar');
  const dailyPoshan = products.filter((p) => p.category?.slug === 'daily-poshan');
  const pregnancyDiet = products.filter((p) => p.category?.slug === 'pregnancy-diet' || p.category?.slug === 'pregnancy-care');

  const filteredProducts =
    selectedSubCategory === 'all'
      ? products
      : products.filter((p) => p.category?.slug === selectedSubCategory);

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. ONE CLEAN HERO BANNER (Baby Theme: Sky Blue & Soft Peach) */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#EBF6FB] via-[#F2F8FB] to-[#FFF3EB] border border-[#CCE8F5] shadow-card min-h-[380px] sm:min-h-[440px] flex items-center">
          {/* Subtle corner leaves */}
          <div className="absolute top-2 left-2 pointer-events-none opacity-30">
            <CornerLeaves className="w-28 h-28 text-[#5DB4D6]" color="#5DB4D6" />
          </div>

          <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#5DB4D6]/40 text-[#1E6B86] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#2C8CAE]" />
                <span>Pure Pediatric & Ayurvedic Care</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E6B86] leading-[1.1] tracking-tight">
                Wholesome Pratham Aahar & <br />
                <span className="text-[#1E6B86]">Generational Poshan.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#2B2B2B]/85 max-w-lg leading-relaxed">
                Sprouted ragi, almond flour, Makhana baby porridge (6+ months), age-specific daily family wellness blends, and maternal pregnancy nourishment.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#pratham-section"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2C8CAE] hover:bg-[#216F8C] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all group"
                >
                  <span>Explore Baby First Foods</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <Link
                  to="/shop?store=baby"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 hover:bg-white text-[#1E6B86] font-bold text-xs sm:text-sm border border-[#5DB4D6]/30 transition-all shadow-2xs"
                >
                  <span>All Nutrition Blends</span>
                </Link>
              </div>

              <div className="pt-3 border-t border-[#1E6B86]/15 flex flex-wrap items-center gap-4 text-xs text-[#1E6B86]/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2C8CAE]" />
                  0% Added Sugar, Salt & Preservatives
                </span>
                <span>•</span>
                <span>Pediatrician Approved</span>
              </div>
            </div>

            {/* Right imagery showcase */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative">
              <div className="relative w-full max-w-sm flex items-center justify-center gap-3 drop-shadow-lg">
                <div className="w-1/2 aspect-square rounded-2xl overflow-hidden bg-white/80 border-2 border-white shadow-md p-1">
                  <img
                    src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=400&q=80"
                    alt="Baby & Maternal Care"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="w-1/2 aspect-square rounded-2xl overflow-hidden bg-white/80 border-2 border-white shadow-md p-1">
                  <img
                    src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=400&q=80"
                    alt="Sprouted Ragi & Almond Baby Porridge"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 pointer-events-none opacity-30">
                <CornerLeaves className="w-28 h-28 text-[#5DB4D6]" color="#5DB4D6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHORT BENEFITS ROW (4 Circular Baby Theme Badges) */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="bg-white rounded-2xl border border-[#CCE8F5] py-4 px-6 shadow-soft">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full border-2 border-[#5DB4D6] flex items-center justify-center shrink-0">
                <MotherChildIcon className="w-5 h-5 text-[#2C8CAE]" color="#2C8CAE" />
              </div>
              <span className="text-xs font-bold text-gray-800">Sprouted Grain First Foods</span>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full border-2 border-[#5DB4D6] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#2C8CAE]" />
              </div>
              <span className="text-xs font-bold text-gray-800">0% Sugar & Salt</span>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full border-2 border-[#5DB4D6] flex items-center justify-center shrink-0">
                <QualityBadgeIcon className="w-5 h-5 text-[#2C8CAE]" color="#2C8CAE" />
              </div>
              <span className="text-xs font-bold text-gray-800">Pediatric Formulated</span>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full border-2 border-[#5DB4D6] flex items-center justify-center shrink-0">
                <DeliveryTruckIcon className="w-5 h-5 text-[#2C8CAE]" color="#2C8CAE" />
              </div>
              <span className="text-xs font-bold text-gray-800">Pan-India Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUBCATEGORY CARDS */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <SectionHeading title="Explore Nutrition Categories" leafColor="#5DB4D6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Pratham Aahar */}
          <div className="bg-[#E6F4FA] rounded-2xl border border-[#CCE8F5] p-6 shadow-soft flex flex-col justify-between relative group hover:shadow-card transition-all">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=200&q=80"
                alt="Pratham Aahar Baby Nutrition"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-[#1E6B86]">
                  Pratham Aahar (6+ Months)
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">Sprouted Ragi, Almond & Makhana</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubCategory('pratham-aahar')}
              className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#2C8CAE] hover:bg-[#216F8C] text-white text-xs font-bold transition-colors min-h-[44px]"
            >
              <span>View First Foods</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Daily Poshan */}
          <div className="bg-[#E6F4FA] rounded-2xl border border-[#CCE8F5] p-6 shadow-soft flex flex-col justify-between relative group hover:shadow-card transition-all">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"
                  alt="Daily Family Nutrition"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1E6B86]">
                    Daily Poshan (Family)
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">Strength for Every Generation</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 my-3">
                <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded-full text-[#1E6B86]">Women</span>
                <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded-full text-[#1E6B86]">Youngsters</span>
                <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded-full text-[#1E6B86]">Elders' Diet</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubCategory('daily-poshan')}
              className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#2C8CAE] hover:bg-[#216F8C] text-white text-xs font-bold transition-colors min-h-[44px]"
            >
              <span>View Family Blends</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Pregnancy Diet */}
          <div className="bg-[#E6F4FA] rounded-2xl border border-[#CCE8F5] p-6 shadow-soft flex flex-col justify-between relative group hover:shadow-card transition-all">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=200&q=80"
                alt="Pregnancy Care & Maternal Diet"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-[#1E6B86]">
                  Pregnancy Diet & Care
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">Healthy Mom • Healthy Baby</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubCategory('pregnancy-diet')}
              className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#2C8CAE] hover:bg-[#216F8C] text-white text-xs font-bold transition-colors min-h-[44px]"
            >
              <span>View Maternal Nutrition</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Nutrition Products' },
            { id: 'pratham-aahar', label: 'Pratham Aahar (6+ Mo)' },
            { id: 'daily-poshan', label: 'Daily Poshan (Family)' },
            { id: 'pregnancy-diet', label: 'Pregnancy Diet' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedSubCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all min-h-[44px] ${
                selectedSubCategory === cat.id
                  ? 'bg-[#2C8CAE] text-white shadow-xs'
                  : 'bg-white border border-[#CCE8F5] text-gray-700 hover:bg-[#E6F4FA]'
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
            title={selectedSubCategory.replace('-', ' ')}
            leafColor="#5DB4D6"
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
          {/* Pratham Aahar Shelf */}
          <div id="pratham-section">
            <SectionHeading
              title="Pratham Aahar: First Solid Foods (6+ Months)"
              viewAllLink="/shop?store=baby&category=pratham-aahar"
              leafColor="#5DB4D6"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {prathamAahar.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Daily Poshan Shelf */}
          <div>
            <SectionHeading
              title="Daily Poshan: Age-Specific Family Wellness"
              viewAllLink="/shop?store=baby&category=daily-poshan"
              leafColor="#5DB4D6"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {dailyPoshan.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Pregnancy Diet Shelf */}
          <div>
            <SectionHeading
              title="Maternal Care & Pregnancy Nourishment"
              viewAllLink="/shop?store=baby&category=pregnancy-care"
              leafColor="#5DB4D6"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {pregnancyDiet.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
