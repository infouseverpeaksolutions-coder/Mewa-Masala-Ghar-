import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ProductCard } from '../components/ProductCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import api from '../services/api';
import { Product } from '../types';

interface HeroSlide {
  id: string;
  image: string;
  badgeStore: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  objectPosition?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: '/assets/jimmi-jaggu/hero_slide_1.jpg',
    badgeStore: 'Presented by Mewa Masala Ghar',
    title: 'Gentle Care for',
    titleAccent: 'Little Ones & You',
    subtitle: 'Pure, wholesome botanicals crafted for happy babies, healthy skin and a healthier tomorrow.',
    ctaText: 'Shop Baby Care',
    ctaLink: '#products-section',
    objectPosition: 'object-[65%_35%] sm:object-[center_35%]',
  },
  {
    id: 'slide-2',
    image: '/assets/jimmi-jaggu/hero_slide_2.jpg',
    badgeStore: '100% Safe & Certified Essentials',
    title: 'Pure Comfort for',
    titleAccent: 'Tender Baby Skin',
    subtitle: 'Nourishing botanical oils, soothing creams and everyday bedtime warmth.',
    ctaText: 'Explore Baby Products',
    ctaLink: '#products-section',
    objectPosition: 'object-[50%_35%] sm:object-[center_35%]',
  },
  {
    id: 'slide-3',
    image: '/assets/jimmi-jaggu/hero_slide_3.jpg',
    badgeStore: 'Ayurvedic Poshan for Mothers',
    title: 'Loving Care for',
    titleAccent: 'Mothers-to-Be',
    subtitle: 'Thoughtful formulations crafted for every stage — from bump to babyhood.',
    ctaText: 'Shop Maternity Care',
    ctaLink: '#products-section',
    objectPosition: 'object-[50%_45%] sm:object-[center_40%]',
  },
  {
    id: 'slide-4',
    image: '/assets/jimmi-jaggu/hero_slide_4.jpg',
    badgeStore: 'Triple-Sifted Ayurvedic Purity',
    title: 'Pure Botanical &',
    titleAccent: 'Ayurvedic Skincare',
    subtitle: 'Time-honored natural clays, multani mitti and chemical-free botanical blends.',
    ctaText: 'Discover Skincare',
    ctaLink: '#products-section',
    objectPosition: 'object-[50%_55%] sm:object-[center_50%]',
  },
];

export const JimmiJagguBrandPage: React.FC = () => {
  const { setActiveStore } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveStore('baby');
  }, [setActiveStore]);

  // Auto-advance hero slides every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  // Fetch real Jimmi Jaggu Products from Database
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['jimmi-jaggu-products'],
    queryFn: async () => {
      const res = await api.get('/products?brand=jimmi-jaggu&limit=100');
      return (res.data?.data?.products || []) as Product[];
    },
  });

  // Fetch real Jimmi Jaggu Categories from Database
  const { data: dbCategories = [] } = useQuery({
    queryKey: ['jimmi-jaggu-categories'],
    queryFn: async () => {
      const res = await api.get('/categories?brand=jimmi-jaggu');
      return (res.data?.data || []) as any[];
    },
  });

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter(
          (p) =>
            p.category?.slug === selectedCategory ||
            p.category?.id === selectedCategory ||
            (p as any).categoryId === selectedCategory
        );

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail('');
      }, 3500);
    }
  };

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#111813] text-[#2B2321] dark:text-[#F3EFE6] transition-colors duration-300 min-h-screen">
      {/* 
        ========================================================================
        1. HERO SECTION (Full-Screen Image Slider with Smooth Blur Transition)
        Restored with original high-definition brand banners
        ========================================================================
      */}
      <section
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full overflow-hidden border-b border-[#EFE8DF] dark:border-[#243529] h-[calc(100dvh-152px)] sm:h-[calc(100dvh-114px)] min-h-[420px] flex items-center justify-center bg-[#FAF6F0] dark:bg-[#141E17] select-none"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full will-change-[opacity,filter,transform] ${
                isActive ? 'z-0 pointer-events-auto' : '-z-10 pointer-events-none'
              }`}
              style={{
                opacity: isActive ? 1 : 0,
                filter: isActive ? 'blur(0px)' : 'blur(8px)',
                transform: isActive ? 'scale(1)' : 'scale(1.02)',
                transition:
                  'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), filter 700ms cubic-bezier(0.4, 0, 0.2, 1), transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover ${slide.objectPosition || 'object-center'}`}
              />
            </div>
          );
        })}

        {/* Gentle background scrim for pristine text contrast */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.08)_50%,transparent_80%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(17,24,19,0.40)_0%,rgba(17,24,19,0.15)_50%,transparent_80%)]" />

        {/* Centered Content */}
        <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-6">
          <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 max-w-xl sm:max-w-2xl lg:max-w-3xl">
            {/* Sub-brand badge with official Jimmi Jaggu logo */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#18221B]/95 backdrop-blur-md border border-[#E8DDD0] dark:border-[#2A3B2F] text-xs font-bold text-[#8C5E58] dark:text-[#E5B85C] shadow-md mx-auto">
              <img
                src="/assets/jimmi-jaggu/logo_dark.png"
                alt="Jimmi Jaggu"
                className="w-4 h-5 object-contain dark:hidden"
              />
              <img
                src="/assets/jimmi-jaggu/logo_light.png"
                alt="Jimmi Jaggu"
                className="w-4 h-5 object-contain hidden dark:block"
              />
              <span>{HERO_SLIDES[currentSlide].badgeStore}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.12] font-black text-[#1F1410] dark:text-white tracking-tight drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              {HERO_SLIDES[currentSlide].title}{' '}
              <span className="text-[#A0352A] dark:text-[#F0C060]">
                {HERO_SLIDES[currentSlide].titleAccent}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#2A1D18] dark:text-gray-100 max-w-md sm:max-w-lg md:max-w-xl leading-relaxed font-semibold drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] mx-auto">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex items-center justify-center gap-3 sm:gap-4 flex-wrap mx-auto">
              <a
                href={HERO_SLIDES[currentSlide].ctaLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#C47D76] hover:bg-[#B36E67] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>{HERO_SLIDES[currentSlide].ctaText}</span>
                <span className="text-sm">→</span>
              </a>

              <a
                href="#categories-section"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/95 dark:bg-[#18221B]/95 hover:bg-white dark:hover:bg-[#18221B] text-[#2B2321] dark:text-white border border-[#D5C9B8] dark:border-[#2A3B2F] text-xs sm:text-sm font-bold backdrop-blur-xs transition-all hover:scale-105 shadow-md"
              >
                <span>Browse Categories</span>
              </a>
            </div>
          </div>
        </div>

        {/* Left / Right Nav Arrows */}
        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 dark:bg-[#18221B]/85 hover:bg-white dark:hover:bg-[#18221B] text-[#2B2321] dark:text-white border border-[#E0D4C3] dark:border-[#2A3B2F] items-center justify-center shadow-md backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 dark:bg-[#18221B]/85 hover:bg-white dark:hover:bg-[#18221B] text-[#2B2321] dark:text-white border border-[#E0D4C3] dark:border-[#2A3B2F] items-center justify-center shadow-md backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 sm:w-12 bg-[#C47D76] dark:bg-[#E5B85C] shadow-sm'
                  : 'w-2 sm:w-2.5 bg-black/25 dark:bg-white/35 hover:bg-black/45 dark:hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        2. CATEGORY PILLS (Same Interactive Subcategory Bar as Mewa Masala Ghar)
        ========================================================================
      */}
      {dbCategories.length > 0 && (
        <section id="categories-section" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-10 sm:pt-14">
          <SectionHeading title="Browse by Category" leafColor="#B97375" />

          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-2 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#B97375] text-white shadow-xs'
                  : 'bg-white dark:bg-[#18221B] border border-[#E7E0D0] dark:border-[#2A3B2F] text-gray-700 dark:text-gray-300 hover:border-[#B97375]'
              }`}
            >
              All Products ({products.length})
            </button>

            {dbCategories.map((cat: any) => {
              const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
              const count = products.filter(
                (p) =>
                  p.category?.slug === cat.slug ||
                  p.category?.id === cat.id ||
                  (p as any).categoryId === cat.id
              ).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug || cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#B97375] text-white shadow-xs'
                      : 'bg-white dark:bg-[#18221B] border border-[#E7E0D0] dark:border-[#2A3B2F] text-gray-700 dark:text-gray-300 hover:border-[#B97375]'
                  }`}
                >
                  {cat.name} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 
        ========================================================================
        3. PRODUCT LISTING (Same ProductCard Grid & Workflow as Mewa Masala Ghar)
        Dynamic with live weight dropdown, cart context, wishlist & real images
        ========================================================================
      */}
      <section id="products-section" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-10 sm:pt-14">
        <div className="flex items-center justify-between mb-6">
          <SectionHeading
            title={
              selectedCategory === 'all'
                ? 'All Jimmi Jaggu Products'
                : dbCategories.find((c: any) => c.slug === selectedCategory || c.id === selectedCategory)?.name ||
                  'Products'
            }
            leafColor="#B97375"
          />

          {products.length > 0 && (
            <span className="text-xs font-bold text-gray-500">
              Showing {filteredProducts.length} of {products.length} Items
            </span>
          )}
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 sm:h-72 bg-white dark:bg-[#18221B] animate-pulse rounded-2xl border border-gray-200 dark:border-gray-800"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="w-full text-center py-16 px-6 bg-white dark:bg-[#18221B] rounded-3xl border border-[#EFE8DF] dark:border-[#2A3B2F] shadow-soft max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#B97375]/10 text-[#B97375] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-[#B97375]" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B2321] dark:text-white">
              {selectedCategory === 'all'
                ? 'No Products Listed Yet Under Jimmi Jaggu'
                : 'No Products in this Category'}
            </h3>
            <p className="text-xs text-[#82746E] dark:text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
              When you add products under the Jimmi Jaggu brand from the Admin Panel, they will appear here with your uploaded images, custom prices, and weights.
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => handleCategorySelect('all')}
                className="mt-4 px-4 py-2 rounded-full bg-[#B97375] text-white text-xs font-bold"
              >
                View All Jimmi Jaggu Products
              </button>
            )}
          </div>
        ) : (
          /* Same High-Performance Compact ProductCard Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4.5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 
        ========================================================================
        4. SISTER BRAND HIGHLIGHT BANNER (Restored with original brand still)
        ========================================================================
      */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-14 sm:pt-16">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EFE8DF] dark:border-[#2A3B2F] shadow-card min-h-[340px] sm:min-h-[380px] md:min-h-[400px] lg:min-h-[420px] flex items-center group">
          <img
            src="/assets/jimmi-jaggu/banner_still.jpg"
            alt="Jimmi Jaggu Baby and Skincare"
            className="absolute inset-0 w-full h-full object-cover object-[78%_center] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9]/95 via-[#FFFDF9]/85 to-transparent dark:from-[#18221B]/95 dark:via-[#18221B]/85 dark:to-transparent max-w-lg sm:max-w-xl md:max-w-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-[#FFFDF9]/30 dark:bg-[#18221B]/30 sm:hidden pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 max-w-lg sm:max-w-xl space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/jimmi-jaggu/logo_dark.png"
                alt="Jimmi Jaggu"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain dark:hidden"
              />
              <img
                src="/assets/jimmi-jaggu/logo_light.png"
                alt="Jimmi Jaggu"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain hidden dark:block"
              />
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#8C6D37] dark:text-[#E5B85C] uppercase block">
                  OUR SISTER BRAND
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#2B2321] dark:text-white">
                  JIMMI JAGGU
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[#6E5D57] dark:text-gray-200 tracking-wider">
              Baby &nbsp;•&nbsp; Skincare &nbsp;•&nbsp; Pregnancy
            </p>

            <p className="text-xs sm:text-sm text-[#4A3F3A] dark:text-gray-200 max-w-md leading-relaxed font-normal">
              Thoughtfully crafted formulations for every stage of your journey — from bump to babyhood.
            </p>

            <div className="pt-2">
              <a
                href="#products-section"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B97375] hover:bg-[#A86466] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-98"
              >
                <span>Shop Jimmi Jaggu</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        5. NEWSLETTER STRIP
        ========================================================================
      */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-14 sm:pt-16 pb-16">
        <div className="bg-[#FCEEEA] dark:bg-[#1E1719] rounded-2xl sm:rounded-3xl border border-[#F2DDD7] dark:border-[#38262A] p-6 sm:p-8 lg:p-10 shadow-soft relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="w-12 h-12 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center shrink-0 text-[#C47D76] shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#2B2321] dark:text-white">
                  Join our family for care tips and early offers
                </h3>
                <p className="text-xs text-[#7A6D68] dark:text-gray-400 mt-0.5">
                  Be the first to know about new products, helpful tips and special offers.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 max-w-md"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full sm:w-72 px-4 py-2.5 text-xs bg-white dark:bg-[#141E17] text-gray-900 dark:text-white rounded-full border border-[#E7DCD5] dark:border-[#3A2A2E] focus:outline-none focus:ring-2 focus:ring-[#C47D76]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#C47D76] hover:bg-[#B36E67] text-white text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
