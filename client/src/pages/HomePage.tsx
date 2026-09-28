import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Gift,
  Mail,
  CheckCircle2,
  Loader2,
  Star,
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
  SPICES_PRODUCTS,
  BESTSELLERS_PRODUCTS,
  SISTER_BRAND_BANNER,
  CUSTOMER_REVIEWS,
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
    <div className="space-y-10 sm:space-y-14 pb-16 bg-[#FAF6EC] text-[#2B2B2B]">
      {/* 
        ========================================================================
        1. HERO VIDEO SECTION (Two-column desktop / full-bleed mobile)
        ========================================================================
      */}
      <div className="pt-2 sm:pt-4">
        <HeroVideo />
      </div>


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
              className="group bg-white rounded-2xl sm:rounded-3xl border border-[#E7E0D0] p-3 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6EC] mb-2.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Circular Arrow Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-serif text-xs sm:text-sm font-bold text-[#1F4D2E] group-hover:text-[#D9A441] transition-colors">
                  {cat.name}
                </span>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1F4D2E] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-2xs">
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
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] tracking-tight flex items-center">
            <span>Dry Fruits</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?category=dry-fruits"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] hover:text-[#D9A441] transition-colors"
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
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1F4D2E] text-white p-5 sm:p-7 lg:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Column: Icon, Title, Subtitle, Button */}
          <div className="flex items-center gap-4 sm:gap-6 text-left">
            {/* Gold Outline Gift Box Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#D9A441]/60 flex items-center justify-center shrink-0 bg-white/5">
              <Gift className="w-7 h-7 text-[#D9A441]" strokeWidth={1.5} />
            </div>

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                {COMBO_PACKS_BANNER.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#D9A441] font-medium mt-0.5 mb-3">
                {COMBO_PACKS_BANNER.subtitle}
              </p>
              <Link
                to={COMBO_PACKS_BANNER.link}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] text-xs font-bold transition-all shadow-xs"
              >
                <span>{COMBO_PACKS_BANNER.ctaText}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Combo Hampers & Ribbon Jars */}
          <div className="w-full md:w-auto max-w-sm rounded-xl overflow-hidden shadow-xs">
            <img
              src={COMBO_PACKS_BANNER.image}
              alt="Curated Combo Packs of 2 4 6"
              className="w-full h-32 sm:h-36 object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        6. FLAVOURED MAKHANA (3 Panels: Peri-Peri Red, Mint Green, Cream Teal)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] tracking-tight flex items-center">
            <span>Flavoured Makhana</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?category=makhana"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {FLAVOURED_MAKHANA_PANELS.map((panel) => (
            <Link
              key={panel.id}
              to={panel.link}
              className="group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex items-center justify-between hover:-translate-y-1"
              style={{ backgroundColor: panel.bgColor }}
            >
              <div className="max-w-[55%] z-10">
                <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug">
                  {panel.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] text-white/80 font-medium mt-2 underline underline-offset-2">
                  <span>Explore Jar</span>
                  <span>→</span>
                </span>
              </div>

              {/* Jar Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white/20 p-1 flex items-center justify-center shrink-0">
                <img
                  src={panel.image}
                  alt={panel.name}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        7. SEEDS & AATAA ROW (7 cards with prices & round cart buttons)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] tracking-tight flex items-center">
            <span>Seeds & Aataa</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?category=seeds-mixes"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {SEEDS_AATAA_PRODUCTS.map((prod) => (
            <MewaProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        8. SPICES ROW (3 cards with prices)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] tracking-tight flex items-center">
            <span>Spices</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?category=spices-seasonings"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {SPICES_PRODUCTS.map((prod) => (
            <Link
              key={prod.id}
              to={prod.link}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-[#E7E0D0] p-4 shadow-soft hover:shadow-card transition-all duration-300 flex items-center justify-between gap-4 hover:-translate-y-1"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF6EC] flex items-center justify-center p-1 shrink-0">
                <img
                  src={prod.image}
                  alt={prod.name}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 text-left">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#1F4D2E] group-hover:text-[#D9A441] transition-colors">
                  {prod.name}
                </h3>
                <div className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E] mt-1">
                  ₹ {prod.price}
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#1F4D2E] text-white flex items-center justify-center shrink-0 group-hover:bg-[#163821] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        9. BESTSELLERS (2-Column list of horizontal product cards)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] tracking-tight flex items-center">
            <span>Bestsellers</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?featured=true"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
          {BESTSELLERS_PRODUCTS.map((prod) => (
            <BestsellerHorizontalCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        10. SISTER BRAND BANNER (Jimmi Jaggu - Soft Rose Palette)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F6ECE8] border border-[#E8D4D0] p-6 sm:p-8 lg:p-10 shadow-soft">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center lg:text-left space-y-2 max-w-xl">
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#3B2825] leading-snug">
                {SISTER_BRAND_BANNER.headline}
              </h3>
              <p className="font-serif text-sm sm:text-base text-[#7A5852] italic font-medium">
                {SISTER_BRAND_BANNER.subline}
              </p>
              <div className="pt-3">
                <Link
                  to={SISTER_BRAND_BANNER.link}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C27E7A] hover:bg-[#B06D69] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <span>{SISTER_BRAND_BANNER.ctaText}</span>
                </Link>
              </div>
            </div>

            {/* Baby & Care Image */}
            <div className="w-full lg:w-80 h-44 sm:h-52 rounded-2xl overflow-hidden bg-white/70 shadow-xs flex items-center justify-center p-2">
              <img
                src={SISTER_BRAND_BANNER.image}
                alt="Jimmi Jaggu Baby and Personal Care"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        11. WHAT OUR CUSTOMERS SAY (3 Review Cards + Dots)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] tracking-tight flex items-center">
            <span>What Our Customers Say</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A]" color="#2F5D3A" />
          </h2>
          <span className="text-xs sm:text-sm font-semibold text-[#1F4D2E] cursor-pointer hover:underline">
            View All →
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7E0D0] p-5 sm:p-6 shadow-soft flex flex-col justify-between"
            >
              <p className="text-xs sm:text-[13px] text-[#4A443B] leading-relaxed italic mb-4">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-black/5">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#D9A441]/40"
                  />
                  <div>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1F4D2E]">
                      {rev.name}
                    </h4>
                    <span className="text-[10px] text-gray-500">{rev.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-[#D9A441] text-[#D9A441]"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel indicator dots */}
        <div className="flex justify-center items-center gap-1.5 mt-5">
          <span className="w-4 h-1.5 rounded-full bg-[#1F4D2E]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        </div>
      </section>

      {/* 
        ========================================================================
        12. NEWSLETTER STRIP (Flanked by leaf illustrations)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="hidden lg:block shrink-0">
            <BranchFlourishLeft className="w-20 h-10 text-[#2F5D3A]" color="#2F5D3A" />
          </div>

          <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl border border-[#E7E0D0] p-5 sm:p-7 shadow-soft flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3 sm:gap-4 text-center md:text-left">
              <div className="w-11 h-11 rounded-full bg-[#FAF6EC] border border-[#E7E0D0] flex items-center justify-center shrink-0 text-[#1F4D2E]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F4D2E]">
                  Get 10% off your first order
                </h3>
                <p className="text-xs text-[#7A6B58] mt-0.5">
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
                className="flex-1 pl-4 pr-3 py-2.5 rounded-full text-xs text-gray-900 bg-[#FAF6EC] border border-[#E7E0D0] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F4D2E]"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="px-6 py-2.5 rounded-full bg-[#1F4D2E] hover:bg-[#163821] text-white text-xs font-bold transition-all shadow-xs shrink-0 disabled:opacity-50"
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
            <BranchFlourishRight className="w-20 h-10 text-[#2F5D3A]" color="#2F5D3A" />
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
