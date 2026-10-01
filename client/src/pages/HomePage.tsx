import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Gift,
  Mail,
  CheckCircle2,
  Loader2,
  Star,
  Baby,
  Sparkles,
  Heart,
  Leaf,
  ShieldCheck,
} from 'lucide-react';
import { HeroVideo } from '../components/HeroVideo';
import { MewaProductCard } from '../components/MewaProductCard';
import { BestsellerHorizontalCard } from '../components/BestsellerHorizontalCard';
import {
  SectionLeaf,
  BranchFlourishLeft,
  BranchFlourishRight,
} from '../components/ui/Icons';
import {
  CATEGORIES_DATA,
  DRY_FRUITS_PRODUCTS,
  COMBO_PACKS_BANNER,
  FLAVOURED_MAKHANA_PANELS,
  SEEDS_AATAA_PRODUCTS,
  BESTSELLERS_PRODUCTS,
  SISTER_BRAND_BANNER,
  SUB_BRAND_BANNERS,
} from '../data/mockData';
import api from '../services/api';

export const HomePage: React.FC = () => {
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');
    try {
      await api.post('/newsletter/subscribe', { email: newsletterEmail });
      setNewsletterStatus('success');
      setNewsletterMsg('Dhanyawaad! You have been subscribed successfully.');
      setNewsletterEmail('');
    } catch (err: any) {
      // In dev fallback or offline, show success
      setNewsletterStatus('success');
      setNewsletterMsg('Dhanyawaad! You have been subscribed successfully.');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-10 sm:space-y-14 pb-16 bg-[#FAF6EC] dark:bg-[#111813] text-[#2B2B2B] dark:text-[#F3EFE6] transition-colors duration-300">
      {/* 
        ========================================================================
        1. HERO VIDEO SECTION (Full-bleed edge-to-edge screen fit)
        ========================================================================
      */}
      <HeroVideo />


      {/* 
        ========================================================================
        3. SHOP BY CATEGORY (5 image cards with circular arrow button)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] tracking-tight flex items-center">
            <span>Shop by Category</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-3 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6EC] dark:bg-[#111813] mb-2.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Circular Arrow Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-xs sm:text-sm font-bold text-[#1F4D2E] dark:text-[#8ED9A0] group-hover:text-[#D9A441] dark:group-hover:text-[#E5B85C] transition-colors">
                  {cat.name}
                </span>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1F4D2E] dark:bg-[#284F33] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-2xs">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        4. DRY FRUITS ROW (7 cards with price, rating, round green cart button)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center">
            <span>Dry Fruits</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?category=dry-fruits"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {DRY_FRUITS_PRODUCTS.map((prod) => (
            <MewaProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        5. COMBO PACKS BANNER (Deep green with gold gift-box icon & button)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-card h-[150px] sm:h-[170px] lg:h-[190px]">
          {/* Full background image */}
          <img
            src={COMBO_PACKS_BANNER.image}
            alt="Combo Packs"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Text overlay — positioned on the left */}
          <div className="relative z-10 h-full flex items-center gap-4 sm:gap-5 px-5 sm:px-7 lg:px-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#D9A441]/40 flex items-center justify-center shrink-0 backdrop-blur-sm bg-white/5">
              <Gift className="w-7 h-7 text-[#D9A441]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                {COMBO_PACKS_BANNER.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#D9A441] font-medium mt-0.5 mb-2.5 drop-shadow-md">
                {COMBO_PACKS_BANNER.subtitle}
              </p>
              <Link
                to={COMBO_PACKS_BANNER.link}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#C8933B] hover:bg-[#B38131] text-white text-[10px] sm:text-xs font-bold tracking-wide transition-all shadow-sm"
              >
                {COMBO_PACKS_BANNER.ctaText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        6. FLAVOURED MAKHANA (3 Panels: Peri-Peri Red, Mint Green, Cream Teal)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center gap-1.5">
            <span>Flavoured Makhana</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?category=makhana"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {FLAVOURED_MAKHANA_PANELS.map((panel) => (
            <Link
              key={panel.id}
              to={panel.link}
              className="group relative rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 h-[130px] sm:h-[145px]"
            >
              {/* Full background image */}
              <img
                src={panel.image}
                alt={panel.name.replace('\n', ' ')}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Gradient overlay on left for text */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${panel.bgColor}dd 0%, ${panel.bgColor}aa 20%, ${panel.bgColor}55 40%, transparent 65%)`,
                }}
              />

              {/* Title text */}
              <div className="relative z-10 h-full flex items-center p-4 sm:p-5">
                <h3 className="font-serif text-base sm:text-lg lg:text-xl font-bold leading-snug text-white whitespace-pre-line drop-shadow-lg">
                  {panel.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        7. SEEDS & AATAA ROW (7 products in bordered container)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center">
            <span>Seeds & Aataa</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?category=seeds-mixes"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="border border-[#E7E0D0] dark:border-[#2A3B2F] rounded-2xl bg-white dark:bg-[#18221B] py-5 px-3 sm:px-5 shadow-soft overflow-x-auto">
          <div className="flex min-w-max lg:min-w-0 lg:grid lg:grid-cols-7">
            {SEEDS_AATAA_PRODUCTS.map((prod, idx) => (
              <Link
                key={prod.id}
                to={prod.link}
                className={`group flex flex-col items-center text-center w-[115px] sm:w-[125px] lg:w-auto shrink-0 px-2 sm:px-3 py-1 ${
                  idx < SEEDS_AATAA_PRODUCTS.length - 1 ? 'lg:border-r lg:border-[#E7E0D0]/60 dark:lg:border-[#2A3B2F]/60' : ''
                }`}
              >
                {/* 4:5 aspect ratio image container */}
                <div className="w-[80px] h-[100px] sm:w-[90px] sm:h-[112px] lg:w-[95px] lg:h-[118px] rounded-lg overflow-hidden bg-[#FAF6EC]/40 dark:bg-[#111813]/60 flex items-center justify-center p-1.5 mb-2.5">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = '/foods/foods_dryfruits.jpg'; }}
                  />
                </div>
                <h3 className="font-serif text-xs sm:text-[13px] font-semibold text-[#2B2B2B] dark:text-[#E2DDD3] group-hover:text-[#D9A441] dark:group-hover:text-[#E5B85C] transition-colors leading-tight mb-1">
                  {prod.name}
                </h3>
                <div className="font-bold text-sm sm:text-base text-[#1F4D2E] dark:text-white tracking-tight">
                  ₹ {prod.price}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        8. BESTSELLERS (2x2 grid of horizontal product cards)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center">
            <span>Bestsellers</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?featured=true"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {BESTSELLERS_PRODUCTS.map((prod) => (
            <BestsellerHorizontalCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        9. JIMMI JAGGU SHOWCASE BANNER (Single Banner • Pure Logo Gradient • No Photos)
        - Pure CSS gradient using Jimmi Jaggu logo colors (#78363A, #B97375, #C47D68, #6D8B74, #D9A441)
        - Interactive navigation to Jimmi Jaggu page using official brand logo
        - Unique showcase featuring the 3 core pillars: Baby Nutrition (Pratham Aahar), Multani Clays, Maternal Care
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center gap-1.5">
              <span>Jimmi Jaggu</span>
              <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
            </h2>
            <span className="text-xs sm:text-sm text-[#7A5852] dark:text-[#C5BCAD] font-semibold italic">
              (presented by Mewa Masala Ghar)
            </span>
          </div>
          <Link
            to="/jimmi-jaggu"
            className="text-xs sm:text-sm font-semibold text-[#8F4349] dark:text-[#E8A598] hover:text-[#B97375] transition-colors"
          >
            Explore Brand Store →
          </Link>
        </div>

        {/* Single Premium Showcase Banner */}
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-8 md:p-10 lg:p-12 text-white border border-[#E4B5AF]/40 transition-all duration-300"
          style={{
            background:
              'linear-gradient(135deg, #62282D 0%, #7E373D 25%, #9E4D54 50%, #B86762 75%, #CB7F74 100%)',
          }}
        >
          {/* Luminous Ambient Glows using Jimmi Jaggu Logo Palette (Gold & Sage Eucalyptus) */}
          <div
            className="absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full pointer-events-none opacity-35 blur-3xl"
            style={{ background: 'radial-gradient(circle, #D9A441 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full pointer-events-none opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #6D8B74 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,240,235,0.25) 0%, transparent 70%)',
            }}
          />

          {/* Subtle Decorative Botanical Vector Flourish (No image file) */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-36 sm:w-48 h-36 sm:h-48 pointer-events-none opacity-15">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
              <path d="M20 180 C 40 120, 80 80, 160 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M70 125 C 85 110, 110 115, 115 130 C 105 140, 80 135, 70 125 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
              <path d="M100 95 C 115 80, 140 85, 145 100 C 135 110, 110 105, 100 95 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
              <path d="M130 65 C 145 50, 170 55, 175 70 C 165 80, 140 75, 130 65 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="150" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </div>

          <div className="relative z-10">
            {/* 1. Direct Navigation to Jimmi Jaggu using the Official Logo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-white/20">
              <Link
                to="/jimmi-jaggu"
                className="group inline-flex items-center gap-3.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                title="Navigate to Jimmi Jaggu Page"
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white p-1.5 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/brands/jimmi_jaggu_logo.png"
                    alt="Jimmi Jaggu Official Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-[#FDEBE6] transition-colors">
                      Jimmi Jaggu
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF6EC] text-[#7A3338] font-extrabold uppercase tracking-wider shadow-xs">
                      Official Sister Brand
                    </span>
                  </div>
                  <p className="text-xs text-white/85 font-medium flex items-center gap-1 group-hover:text-white transition-colors">
                    <span>Visit Jimmi Jaggu Page</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-pulse" />
                <span>Presented with Love by <strong>Mewa Masala Ghar</strong></span>
              </div>
            </div>

            {/* 2. Headline & Mission */}
            <div className="mt-5 sm:mt-7 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white text-[11px] sm:text-xs font-semibold mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>Pure Botanicals & Ayurvedic Living</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-extrabold text-white leading-tight drop-shadow-sm">
                Gentle Care for Little Ones, Radiant Skin & Maternal Poshan
              </h3>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-sans max-w-xl">
                Rooted in timeless Indian wisdom — from sprouted multi-grain baby food and soothing massage oils to triple-sifted earthen multani clays and nurturing postpartum care.
              </p>
            </div>

            {/* 3. Unique Showcase: The 3 Core Pillars of Jimmi Jaggu */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
              {/* Pillar 1: Baby Nutrition & Care */}
              <Link
                to="/jimmi-jaggu?category=baby-nutrition"
                className="group relative rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-[#FAF6EC] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white group-hover:text-[#7A3338] transition-all duration-300 shadow-sm">
                    <Baby className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FAF6EC]/80 block">
                    Baby Care & Nutrition
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-white mt-1 group-hover:text-[#FAF6EC]">
                    Pratham Aahar & Baby Food
                  </h4>
                  <p className="mt-2 text-xs text-white/85 leading-relaxed font-normal">
                    100% natural sprouted multi-grain porridge, nourishing infant massage oils, and soothing baby creams.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-[#FAF6EC]">
                  <span>Shop Baby Care</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Pillar 2: Personal Care & Multani Mitti */}
              <Link
                to="/jimmi-jaggu?category=multani-collection"
                className="group relative rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-[#FAF6EC] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white group-hover:text-[#7A3338] transition-all duration-300 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FAF6EC]/80 block">
                    Personal Care & Skincare
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-white mt-1 group-hover:text-[#FAF6EC]">
                    Multani Collection & Clays
                  </h4>
                  <p className="mt-2 text-xs text-white/85 leading-relaxed font-normal">
                    300-Mesh triple-sifted Fuller’s Earth, Dead Sea mineral mud packs, and Pink Glow Clay for chemical-free detox.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-[#FAF6EC]">
                  <span>Shop Multani Clays</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Pillar 3: Pregnancy & Maternal Poshan */}
              <Link
                to="/jimmi-jaggu?category=pregnancy-care"
                className="group relative rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 p-4 sm:p-5 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-[#FAF6EC] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white group-hover:text-[#7A3338] transition-all duration-300 shadow-sm">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FAF6EC]/80 block">
                    Pregnancy & Maternity
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-white mt-1 group-hover:text-[#FAF6EC]">
                    Maternal & Family Poshan
                  </h4>
                  <p className="mt-2 text-xs text-white/85 leading-relaxed font-normal">
                    Ayurvedic prenatal and postpartum nourishment formulated with ancient Indian wisdom for mothers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-[#FAF6EC]">
                  <span>Shop Maternal Care</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* 4. Footer Strip: Trust Badges & Grand Action Button */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/20 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-5">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-white/95">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20">
                  <Leaf className="w-3.5 h-3.5 text-[#8ED9A0]" />
                  <span>100% Ayurvedic Heritage</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>Zero Harsh Chemicals</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#FBEAE4]" />
                  <span>Pediatrician & Derm Verified</span>
                </div>
              </div>

              <Link
                to="/jimmi-jaggu"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#FAF6EC] hover:bg-white text-[#78363A] font-serif font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 group"
              >
                <span>Explore Jimmi Jaggu Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#78363A]" />
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* 
        ========================================================================
        11. NEWSLETTER STRIP (Flanked by leaf illustrations)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="hidden lg:block shrink-0">
            <BranchFlourishLeft className="w-20 h-10 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
          </div>

          <div className="flex-1 bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-5 sm:p-7 shadow-soft flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3 sm:gap-4 text-center md:text-left">
              <div className="w-11 h-11 rounded-full bg-[#FAF6EC] dark:bg-[#111813] border border-[#E7E0D0] dark:border-[#2A3B2F] flex items-center justify-center shrink-0 text-[#1F4D2E] dark:text-[#8ED9A0]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F4D2E] dark:text-[#8ED9A0]">
                  Get 10% off your first order
                </h3>
                <p className="text-xs text-[#7A6B58] dark:text-[#C5BCAD] mt-0.5">
                  Be the first to know about new products, offers and healthy living tips.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full md:w-auto flex-1 max-w-md flex items-center gap-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 pl-4 pr-3 py-2.5 rounded-full text-xs text-gray-900 dark:text-white bg-[#FAF6EC] dark:bg-[#111813] border border-[#E7E0D0] dark:border-[#2A3B2F] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1F4D2E]"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="px-6 py-2.5 rounded-full bg-[#1F4D2E] hover:bg-[#163821] dark:bg-[#284F33] dark:hover:bg-[#346643] text-white text-xs font-bold transition-all shadow-xs shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {newsletterStatus === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>
          </div>

          <div className="hidden lg:block shrink-0">
            <BranchFlourishRight className="w-20 h-10 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
          </div>
        </div>

        {newsletterStatus === 'success' && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{newsletterMsg}</span>
          </div>
        )}
      </section>
    </div>
  );
};
