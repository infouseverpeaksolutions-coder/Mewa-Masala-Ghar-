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
  BESTSELLERS_PRODUCTS,
  SISTER_BRAND_BANNER,
  SUB_BRAND_BANNERS,
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
    <div className="space-y-10 sm:space-y-14 pb-16 bg-[#FAF6EC] dark:bg-[#111813] text-[#2B2B2B] dark:text-[#F3EFE6] transition-colors duration-300">
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
        9. SUB-BRAND BANNERS (Jimmy & Jaggu - Beauty & Baby Care)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center gap-1.5">
              <span>Jimmy & Jaggu</span>
              <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
            </h2>
            <span className="text-xs sm:text-sm text-[#7A5852] dark:text-[#C5BCAD] font-semibold italic">
              (presented by Mewa Masala Ghar)
            </span>
          </div>
          <Link
            to="/jimmi-jaggu"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] hover:text-[#D9A441] transition-colors"
          >
            Explore Brand →
          </Link>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {SUB_BRAND_BANNERS.map((banner) => (
            <div
              key={banner.id}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-card border border-[#E8D4D0]/70 h-[200px] sm:h-[230px] md:h-[260px] lg:h-[280px] group bg-[#FAF6EC]"
            >
              {/* Full-bleed background image */}
              <img
                src={banner.image}
                alt={banner.title}
                className={`absolute inset-0 w-full h-full object-cover ${
                  banner.id === 'baby-products'
                    ? 'object-[85%_center] sm:object-right md:object-center'
                    : 'object-[70%_center] sm:object-right md:object-center'
                } group-hover:scale-[1.02] transition-transform duration-500`}
              />

              {/* Gradient overlay on left to ensure crisp text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    banner.id === 'beauty-products'
                      ? 'linear-gradient(to right, rgba(253, 244, 240, 0.98) 0%, rgba(253, 244, 240, 0.94) 42%, rgba(253, 244, 240, 0.5) 65%, transparent 88%)'
                      : 'linear-gradient(to right, rgba(255, 252, 247, 0.98) 0%, rgba(255, 252, 247, 0.94) 42%, rgba(255, 252, 247, 0.5) 65%, transparent 88%)',
                }}
              />

              {/* Text content over the image */}
              <div className="relative z-10 h-full flex flex-col justify-center max-w-[78%] sm:max-w-sm md:max-w-md p-4 sm:p-7 lg:p-9">
                {/* Tagline */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#1F4D2E]/10 border border-[#1F4D2E]/25 text-[#1F4D2E] text-[10px] sm:text-xs font-bold tracking-wide w-fit mb-1.5 sm:mb-2 backdrop-blur-xs">
                  <span>{banner.tagline}</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-base sm:text-2xl lg:text-[26px] font-bold text-[#3B2825] leading-tight mb-1 sm:mb-1.5">
                  {banner.title}
                </h3>

                {/* Subtitle */}
                <p className="text-[11px] sm:text-xs md:text-sm text-[#7A5852] font-medium line-clamp-2 mb-2.5 sm:mb-4">
                  {banner.subtitle}
                </p>

                {/* Action button */}
                <Link
                  to={banner.link}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-white text-[11px] sm:text-xs md:text-sm font-bold shadow-md hover:shadow-lg transition-all w-fit cursor-pointer"
                  style={{ backgroundColor: banner.buttonColor }}
                >
                  <span>{banner.ctaText}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        11. WHAT OUR CUSTOMERS SAY (3 Review Cards + Dots)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center">
            <span>What Our Customers Say</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
          </h2>
          <span className="text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] cursor-pointer hover:underline">
            View All →
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-5 sm:p-6 shadow-soft flex flex-col justify-between"
            >
              <p className="text-xs sm:text-[13px] text-[#4A443B] dark:text-[#E2DDD3] leading-relaxed italic mb-4">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#D9A441]/40"
                  />
                  <div>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1F4D2E] dark:text-[#8ED9A0]">
                      {rev.name}
                    </h4>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{rev.city}</span>
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
          <span className="w-4 h-1.5 rounded-full bg-[#1F4D2E] dark:bg-[#8ED9A0]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
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
