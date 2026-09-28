import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Heart,
  Baby,
  Sparkle,
  CheckCircle2,
  Award,
  Leaf,
  Droplets,
  PackageCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ProductCard } from '../components/ProductCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import api from '../services/api';
import { Product } from '../types';

export const JimmiJagguBrandPage: React.FC = () => {
  const { setActiveStore } = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'baby' | 'care'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Baby Nutrition Products
  const { data: babyProducts = [], isLoading: loadingBaby } = useQuery({
    queryKey: ['jimmi-jaggu-baby-products'],
    queryFn: async () => {
      const res = await api.get('/products?store=baby&limit=12');
      return (res.data?.data?.products || []) as Product[];
    },
  });

  // Fetch Personal Care Products
  const { data: careProducts = [], isLoading: loadingCare } = useQuery({
    queryKey: ['jimmi-jaggu-care-products'],
    queryFn: async () => {
      const res = await api.get('/products?store=care&limit=12');
      return (res.data?.data?.products || []) as Product[];
    },
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 bg-[#FAF7F2]">
      {/* 1. BRAND HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF4EC] via-[#FDF9F4] to-[#FAF7F2] border-b border-[#E7E0D0] pt-10 pb-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A441]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2C8CAE]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Authentic Logo Badge Container */}
          <div className="relative group mb-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white p-3 shadow-xl border-2 border-[#D9A441]/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src="/brands/jimmi_jaggu_logo.png"
                alt="Jimmi Jaggu Sub-Brand"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-2 inset-x-0 flex justify-center">
              <span className="bg-[#1F4D2E] text-[#D9A441] text-[10px] sm:text-xs font-bold uppercase tracking-wider py-0.5 px-3 rounded-full shadow-sm border border-[#D9A441]/30">
                Official Sub-Brand
              </span>
            </div>
          </div>

          {/* Sub-brand Title & Heritage Subtitle */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F4D2E]/5 border border-[#1F4D2E]/15 text-[#1F4D2E] text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>Mewa Masala Ghar Presents</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F4D2E] tracking-tight mb-3">
            Jimmi Jaggu
          </h1>

          <p className="font-serif italic text-base sm:text-xl text-[#8C6D37] font-medium tracking-wide mb-4">
            “From Our Store to Your Home”
          </p>

          <p className="text-sm sm:text-base text-gray-700 max-w-2xl leading-relaxed mb-8">
            An exclusive family wellness & skincare sub-brand crafted with ancestral Indian care.
            Uniting doctor-formulated <strong>Baby Nutrition</strong> with pristine <strong>Volcanic & Herbal Skin Care</strong> — pure, certified, and delivered straight to your doorstep.
          </p>

          {/* Quick Pillar Jump Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#baby-nutrition"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2C8CAE] hover:bg-[#237492] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Baby className="w-4 h-4" />
              <span>Baby Food & Nutrition</span>
            </a>
            <a
              href="#skin-care"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B85966] hover:bg-[#9E4753] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Sparkle className="w-4 h-4" />
              <span>Natural Skin Care & Clays</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. TRUST HIGHLIGHTS BAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-2xl sm:rounded-3xl border border-[#E7E0D0] p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4FA] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#2C8CAE]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">100% Preservative Free</h4>
              <p className="text-[11px] text-gray-500">No chemicals or artificial fillers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-[#B85966]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">300-Mesh Micro Clays</h4>
              <p className="text-[11px] text-gray-500">Triple-sifted volcanic earth</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF4EC] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#8C6D37]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Pediatric & Ayurvedic</h4>
              <p className="text-[11px] text-gray-500">Curated by wellness experts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F7F2] flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5 text-[#1F4D2E]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Store to Your Home</h4>
              <p className="text-[11px] text-gray-500">Direct vacuum-sealed packaging</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL-PILLAR INTERACTIVE FILTER TABS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 p-1.5 bg-[#EAE3D2]/50 rounded-full max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#1F4D2E] text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            All Jimmi Jaggu
          </button>
          <button
            onClick={() => setActiveTab('baby')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
              activeTab === 'baby'
                ? 'bg-[#2C8CAE] text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Baby Food
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
              activeTab === 'care'
                ? 'bg-[#B85966] text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Skin Care
          </button>
        </div>
      </section>

      {/* 4. PILLAR ONE: BABY FOOD & NUTRITION */}
      {(activeTab === 'all' || activeTab === 'baby') && (
        <section id="baby-nutrition" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-gradient-to-r from-[#EBF6FB] to-[#F2F8FB] border border-[#CCE8F5] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#1E6B86] text-xs font-bold border border-[#CCE8F5]">
                <Baby className="w-3.5 h-3.5 text-[#2C8CAE]" />
                <span>Jimmi Jaggu Baby & Poshan</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E6B86]">
                Wholesome Infant & Family Poshan
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                Fresh sprouted ragi, traditional first foods for 6+ months, iron-rich porridge mixes, and maternal nutrition made with zero preservatives.
              </p>
            </div>
            <Link
              to="/baby-nutrition"
              onClick={() => setActiveStore('baby')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2C8CAE] hover:bg-[#216F8C] text-white text-xs font-bold shrink-0 transition-colors"
            >
              <span>View Full Baby Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Baby Category Shelves (Moved from Homepage) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Pratham Aahar (6+ Months) */}
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
                  <p className="text-xs text-gray-600 mt-0.5">Pure. Safe. Nutritious.</p>
                </div>
              </div>

              <Link
                to="/shop?store=baby&category=pratham-aahar"
                className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#2C8CAE] hover:bg-[#216F8C] text-white text-xs font-bold transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Daily Poshan (Family) */}
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
                      Daily Poshan
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">For a stronger family</p>
                  </div>
                </div>

                {/* Sub-chips */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded-full text-[#1E6B86]">Women</span>
                  <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded-full text-[#1E6B86]">Youngsters</span>
                  <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded-full text-[#1E6B86]">Elders' Diet</span>
                </div>
              </div>

              <Link
                to="/shop?store=baby&category=daily-poshan"
                className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#2C8CAE] hover:bg-[#216F8C] text-white text-xs font-bold transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
                    Pregnancy Diet
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">Healthy mom. Healthy baby.</p>
                </div>
              </div>

              <Link
                to="/shop?store=baby&category=pregnancy-care"
                className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#2C8CAE] hover:bg-[#216F8C] text-white text-xs font-bold transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Baby Products Grid */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E6B86]">
              Featured Baby Foods & Poshan Blends
            </h3>
            {loadingBaby ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {babyProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. PILLAR TWO: SKIN CARE & NATURAL CLAYS */}
      {(activeTab === 'all' || activeTab === 'care') && (
        <section id="skin-care" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
          <div className="bg-gradient-to-r from-[#FDF2F4] to-[#FAF0EE] border border-[#F5CED4] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#8E2835] text-xs font-bold border border-[#F5CED4]">
                <Sparkle className="w-3.5 h-3.5 text-[#B85966]" />
                <span>Jimmi Jaggu Personal Care</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#8E2835]">
                Natural Volcanic Clays & Herbal Formulations
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                Microfine 300-mesh Multani Mitti, organic sun-dried rose petal powder, wild turmeric, and nutrient-packed Dead Sea mineral muds.
              </p>
            </div>
            <Link
              to="/personal-care"
              onClick={() => setActiveStore('care')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B85966] hover:bg-[#9E4753] text-white text-xs font-bold shrink-0 transition-colors"
            >
              <span>View Full Skin Care Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Personal Care Category Shelves (Moved from Homepage) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Premium Multani Mitti */}
            <div className="bg-[#FCE9EC] rounded-2xl border border-[#F5CED4] p-6 shadow-soft flex flex-col justify-between relative group hover:shadow-card transition-all">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80"
                  alt="Multani Mitti Clay Powder"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#8E3B46]">
                    Premium Multani Mitti
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">(Export Quality 300 Mesh)</p>
                </div>
              </div>

              <Link
                to="/shop?store=care&category=multani-mitti-clays"
                className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#C26371] hover:bg-[#A84E5B] text-white text-xs font-bold transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Pink Multani */}
            <div className="bg-[#FCE9EC] rounded-2xl border border-[#F5CED4] p-6 shadow-soft flex flex-col justify-between relative group hover:shadow-card transition-all">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=200&q=80"
                  alt="Pink Clay Powder"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#8E3B46]">
                    Pink Multani
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">For Healthy & Glowing Skin</p>
                </div>
              </div>

              <Link
                to="/shop?store=care&category=multani-mitti-clays"
                className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#C26371] hover:bg-[#A84E5B] text-white text-xs font-bold transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Dead Sea Mud */}
            <div className="bg-[#FCE9EC] rounded-2xl border border-[#F5CED4] p-6 shadow-soft flex flex-col justify-between relative group hover:shadow-card transition-all">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=200&q=80"
                  alt="Dead Sea Mud Mineral Pack"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#8E3B46]">
                    Dead Sea Mud
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">With Natural Minerals</p>
                </div>
              </div>

              <Link
                to="/shop?store=care&category=dead-sea-mud"
                className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-full bg-[#C26371] hover:bg-[#A84E5B] text-white text-xs font-bold transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Care Products Grid */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#8E2835]">
              Featured Micro Clays & Herbal Packs
            </h3>
            {loadingCare ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {careProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. BRAND STORY / MANIFESTO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E7E0D0] p-8 sm:p-12 text-center shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF6EC] border border-[#D9A441]/40 flex items-center justify-center mx-auto mb-2">
            <img
              src="/brands/jimmi_jaggu_logo.png"
              alt="Jimmi Jaggu Emblem"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F4D2E]">
            The Jimmi Jaggu Promise
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Born from the legacy of Mewa Masala Ghar, <strong>Jimmi Jaggu</strong> was established with a singular devotion: bringing uncompromising purity from our store directly into the sanctuary of your home. Whether it is nourishing your newborn child’s very first solid meal or giving your skin the healing touch of earth’s oldest clays, Jimmi Jaggu stands for honest ingredients and zero shortcuts.
          </p>
          <div className="pt-4 flex items-center justify-center gap-2">
            <Link
              to="/about"
              className="text-xs font-bold text-[#1F4D2E] hover:text-[#D9A441] underline underline-offset-4"
            >
              Learn more about our heritage & standards &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
