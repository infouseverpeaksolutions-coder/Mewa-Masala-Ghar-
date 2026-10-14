import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Mail,
  Check,
  ArrowRight,
  Sparkles,
  Baby,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { Product } from '../types';
import { resolveImageUrl } from '../utils/imageUrl';

export const JimmiJagguBrandPage: React.FC = () => {
  const { setActiveStore } = useTheme();
  const { addToCart } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveStore('baby');
  }, [setActiveStore]);

  // Fetch real uploaded banners from Database / Admin Panel
  const { data: dbBanners = [] } = useQuery({
    queryKey: ['jimmi-jaggu-banners'],
    queryFn: async () => {
      try {
        const res = await api.get('/banners');
        const allBanners = res.data?.data || [];
        const jimmiBanners = allBanners.filter(
          (b: any) =>
            b.isActive &&
            (b.ctaLink?.includes('jimmi') ||
              b.ctaLink?.includes('baby') ||
              b.ctaLink?.includes('care') ||
              b.title?.toLowerCase().includes('jimmi') ||
              b.title?.toLowerCase().includes('baby') ||
              b.title?.toLowerCase().includes('care'))
        );
        return jimmiBanners.length > 0
          ? jimmiBanners
          : allBanners.filter((b: any) => b.isActive && b.imageUrl);
      } catch {
        return [];
      }
    },
  });

  // Auto-advance banner slides if multiple banners exist
  useEffect(() => {
    if (dbBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dbBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [dbBanners.length]);

  const nextSlide = () => {
    if (dbBanners.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % dbBanners.length);
  };

  const prevSlide = () => {
    if (dbBanners.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + dbBanners.length) % dbBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || dbBanners.length <= 1) return;
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

  // Fetch Real Jimmi Jaggu Products from Database
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['jimmi-jaggu-products'],
    queryFn: async () => {
      const res = await api.get('/products?brand=jimmi-jaggu&limit=20');
      return (res.data?.data?.products || []) as Product[];
    },
  });

  // Fetch Real Jimmi Jaggu Categories from Database
  const { data: dbCategories = [] } = useQuery({
    queryKey: ['jimmi-jaggu-categories'],
    queryFn: async () => {
      const res = await api.get('/categories?brand=jimmi-jaggu');
      return (res.data?.data || []) as any[];
    },
  });

  const handleAddToCart = (prod: Product) => {
    const defaultVariant =
      prod.variants?.find((v) => v.isDefault) ||
      prod.variants?.[0] || {
        id: `${prod.id}-v1`,
        productId: prod.id,
        name: 'Standard',
        sku: `JJ-${prod.slug || prod.id}`,
        weightGrams: 200,
        price: 299,
        mrp: 399,
        stock: 50,
        isDefault: true,
      };

    addToCart(prod, defaultVariant, 1);
    setAddedItem(prod.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
        1. HERO SECTION (Dynamic from Admin Banners OR Clean Brand Hero)
        NO DEMO STOCK PHOTOS - Only Real Uploads from Admin Panel
        ========================================================================
      */}
      {dbBanners.length > 0 ? (
        <section
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full overflow-hidden border-b border-[#EFE8DF] dark:border-[#243529] h-[calc(100dvh-152px)] sm:h-[calc(100dvh-114px)] min-h-[380px] flex items-center justify-center bg-[#FAF6F0] dark:bg-[#141E17] select-none"
        >
          {dbBanners.map((slide: any, index: number) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id || index}
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
                  src={resolveImageUrl(slide.imageUrl)}
                  alt={slide.title || 'Jimmi Jaggu Banner'}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            );
          })}

          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent dark:from-black/70 dark:via-black/30" />

          {/* Centered Content over banner */}
          <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#18221B]/95 backdrop-blur-md border border-[#E8DDD0] dark:border-[#2A3B2F] text-xs font-bold text-[#8C5E58] dark:text-[#E5B85C] shadow-md mb-3">
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
              <span>Presented by Mewa Masala Ghar</span>
            </div>

            {dbBanners[currentSlide]?.title && (
              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {dbBanners[currentSlide].title}
              </h1>
            )}

            {dbBanners[currentSlide]?.subtitle && (
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl leading-relaxed font-medium drop-shadow-sm mt-2">
                {dbBanners[currentSlide].subtitle}
              </p>
            )}

            {dbBanners[currentSlide]?.ctaText && (
              <div className="pt-4">
                <a
                  href={dbBanners[currentSlide].ctaLink || '#featured-products'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C47D76] hover:bg-[#B36E67] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <span>{dbBanners[currentSlide].ctaText}</span>
                  <span>→</span>
                </a>
              </div>
            )}
          </div>

          {dbBanners.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-[#18221B]/80 hover:bg-white text-gray-900 dark:text-white items-center justify-center shadow-md backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-[#18221B]/80 hover:bg-white text-gray-900 dark:text-white items-center justify-center shadow-md backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </section>
      ) : (
        /* Pristine Brand Showcase Hero (Zero Demo Photos) */
        <section className="relative w-full overflow-hidden border-b border-[#EFE8DF] dark:border-[#243529] py-16 sm:py-24 bg-gradient-to-b from-[#FBF6F0] via-[#FAF3EC] to-[#FAF7F2] dark:from-[#152018] dark:via-[#131A15] dark:to-[#111813] flex items-center justify-center text-center">
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 dark:bg-[#18221B]/95 backdrop-blur-md border border-[#E8DDD0] dark:border-[#2A3B2F] text-xs font-bold text-[#8C5E58] dark:text-[#E5B85C] shadow-xs">
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
              <span>A Brand of Mewa Masala Ghar</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-[#2B2321] dark:text-white tracking-tight leading-tight">
              JIMMI JAGGU
            </h1>

            <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] font-bold text-[#A0352A] dark:text-[#E5B85C]">
              Baby Nutrition &nbsp;•&nbsp; Pure Skincare &nbsp;•&nbsp; Maternity Care
            </p>

            <p className="text-xs sm:text-sm md:text-base text-[#6E5D57] dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
              Pure botanical formulations, doctor-safe infant foods, and natural earthen clays crafted with utmost honesty and gentle care.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <a
                href="#featured-products"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#C47D76] hover:bg-[#B36E67] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <span>View Products</span>
                <span>↓</span>
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white dark:bg-[#18221B] text-[#2B2321] dark:text-white border border-[#D5C9B8] dark:border-[#2A3B2F] text-xs sm:text-sm font-bold shadow-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105"
              >
                <span>Explore All Stores</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 
        ========================================================================
        2. CATEGORY SHOWCASE CARDS (Strictly Database Driven, No Fake Demo Cards)
        ========================================================================
      */}
      {dbCategories && dbCategories.length > 0 && (
        <section id="categories" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-10 sm:pt-14">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#2B2321] dark:text-white tracking-tight">
                  Shop by Category
                </h2>
                <div className="w-12 sm:w-16 h-[1.5px] bg-[#D8CFC4] dark:bg-[#3E5244] hidden sm:block" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-7">
              {dbCategories.map((cat: any, idx: number) => {
                const hasImg = Boolean(cat.image);
                const catImg = hasImg ? resolveImageUrl(cat.image) : null;
                const targetUrl =
                  cat.slug?.includes('baby') || cat.slug?.includes('aahar') || cat.slug?.includes('poshan')
                    ? `/baby-nutrition?category=${cat.slug}`
                    : cat.slug?.includes('care') || cat.slug?.includes('skin') || cat.slug?.includes('clay')
                    ? `/personal-care?category=${cat.slug}`
                    : `/shop?category=${cat.slug}&brand=jimmi-jaggu`;

                return (
                  <div
                    key={cat.id || idx}
                    className="bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#EFE8DF] dark:border-[#2A3B2F] p-4 pb-5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      {hasImg ? (
                        <div className="w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6F0] dark:bg-[#141E17] mb-3.5">
                          <img
                            src={catImg!}
                            alt={cat.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[16/10] rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FAF5EE] to-[#F5EBE1] dark:from-[#1E2B22] dark:to-[#141E17] mb-3.5 flex flex-col items-center justify-center border border-[#EFE8DF]/60 dark:border-[#2A3B2F]">
                          <span className="font-serif font-bold text-3xl text-[#8C5E58] dark:text-[#E5B85C]">
                            {cat.name.charAt(0)}
                          </span>
                          <span className="text-[10px] font-bold text-[#8C5E58]/80 dark:text-[#E5B85C]/80 uppercase tracking-widest mt-1">
                            Jimmi Jaggu
                          </span>
                        </div>
                      )}
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2B2321] dark:text-white px-1">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#82746E] dark:text-gray-400 mt-1 mb-4 px-1 line-clamp-2">
                        {cat.description || 'Gentle • Safe • Everyday Essentials'}
                      </p>
                    </div>
                    <div className="px-1">
                      <Link
                        to={targetUrl}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#B97375] hover:bg-[#A86466] text-white text-xs font-semibold shadow-xs transition-all hover:scale-105"
                      >
                        <span>Explore</span>
                        <span className="text-xs">→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 
        ========================================================================
        3. FEATURED PRODUCTS (Dynamic from Admin Uploads Only)
        ========================================================================
      */}
      <section id="featured-products" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-14 sm:pt-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#2B2321] dark:text-white tracking-tight">
              Products
            </h2>
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#D8CFC4] dark:bg-[#3E5244] hidden sm:block" />
          </div>
          {products.length > 0 && (
            <Link
              to="/shop?brand=jimmi-jaggu"
              className="text-xs sm:text-sm font-semibold text-[#8C6D37] dark:text-[#E5B85C] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <span className="text-xs">→</span>
            </Link>
          )}
        </div>

        {/* Empty State when no products are uploaded yet under Jimmi Jaggu */}
        {products.length === 0 ? (
          <div className="w-full text-center py-16 px-6 bg-white dark:bg-[#18221B] rounded-3xl border border-[#EFE8DF] dark:border-[#2A3B2F] shadow-soft max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#B97375]/10 text-[#B97375] flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-[#B97375]" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B2321] dark:text-white">
              No Jimmi Jaggu Products Listed Yet
            </h3>
            <p className="text-xs text-[#82746E] dark:text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
              Products uploaded under the Jimmi Jaggu brand in the Admin Panel will appear here automatically with your images and custom prices.
            </p>
            <div className="mt-5">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#B97375] hover:bg-[#A86466] text-white text-xs font-semibold shadow-xs transition-all hover:scale-105"
              >
                <span>Browse Mewa Masala Ghar Foods</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative group/carousel">
            {/* Left Arrow */}
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-[#18221B] shadow-md border border-[#EFE8DF] dark:border-[#2A3B2F] flex items-center justify-center text-[#2B2321] dark:text-white hover:bg-gray-50 transition-all cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-[#18221B] shadow-md border border-[#EFE8DF] dark:border-[#2A3B2F] flex items-center justify-center text-[#2B2321] dark:text-white hover:bg-gray-50 transition-all cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Scrollable Track */}
            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((prod) => {
                const primaryImg =
                  prod.images?.find((img) => img.isPrimary)?.url ||
                  prod.images?.[0]?.url;
                const defaultVariant =
                  prod.variants?.find((v) => v.isDefault) || prod.variants?.[0];
                const price = defaultVariant?.price ?? 0;

                return (
                  <div
                    key={prod.id}
                    className="w-[210px] sm:w-[230px] shrink-0 bg-white dark:bg-[#18221B] rounded-2xl border border-[#EFE8DF] dark:border-[#2A3B2F] p-3.5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Image - Uploaded Image ONLY */}
                      <Link
                        to={`/product/${prod.slug}`}
                        className="block w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF6F0] dark:bg-[#141E17] mb-3 flex items-center justify-center p-2"
                      >
                        {primaryImg ? (
                          <img
                            src={resolveImageUrl(primaryImg)}
                            alt={prod.name}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <span className="font-serif font-bold text-sm text-[#8C5E58]">
                              Jimmi Jaggu
                            </span>
                            <span className="text-[10px] text-gray-400 mt-1">Image Pending</span>
                          </div>
                        )}
                      </Link>

                      {/* Title */}
                      <Link to={`/product/${prod.slug}`}>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2B2321] dark:text-white text-center leading-snug min-h-[36px] hover:text-[#B97375] transition-colors line-clamp-2">
                          {prod.name}
                        </h4>
                      </Link>

                      {/* Price */}
                      <p className="text-center font-bold text-sm sm:text-base text-[#2B2321] dark:text-white mt-1">
                        ₹ {price}
                      </p>

                      {/* Star Rating */}
                      <div className="flex items-center justify-center gap-1 text-[11px] text-[#82746E] dark:text-gray-400 mt-1 mb-3">
                        <Star className="w-3.5 h-3.5 fill-[#D9A441] text-[#D9A441]" />
                        <span className="font-bold text-[#2B2321] dark:text-white">
                          {prod.rating || 5.0}
                        </span>
                        <span>({prod.reviewCount || 0})</span>
                      </div>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className={`w-full py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
                        addedItem === prod.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#A89882] hover:bg-[#968670] text-white shadow-xs'
                      }`}
                    >
                      {addedItem === prod.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <span>Add to Cart</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 
        ========================================================================
        4. SUB-BRAND STORY / HIGHLIGHT BANNER (Clean Brand Styling, No Demo Still)
        ========================================================================
      */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-14 sm:pt-16">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EFE8DF] dark:border-[#2A3B2F] shadow-card bg-gradient-to-br from-[#FFF9F5] via-[#FFF3EC] to-[#FCEEEA] dark:from-[#18221B] dark:via-[#1F171A] dark:to-[#141E17] min-h-[260px] sm:min-h-[280px] flex items-center p-6 sm:p-10 md:p-12">
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/jimmi-jaggu/logo_dark.png"
                alt="Jimmi Jaggu"
                className="h-12 sm:h-14 w-auto object-contain dark:hidden"
              />
              <img
                src="/assets/jimmi-jaggu/logo_light.png"
                alt="Jimmi Jaggu"
                className="h-12 sm:h-14 w-auto object-contain hidden dark:block"
              />
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#8C6D37] dark:text-[#E5B85C] uppercase block">
                  OUR SISTER BRAND
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2B2321] dark:text-white">
                  JIMMI JAGGU
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[#6E5D57] dark:text-gray-200 tracking-wider">
              Baby Nutrition &nbsp;•&nbsp; Natural Skincare &nbsp;•&nbsp; Pregnancy Care
            </p>

            <p className="text-xs sm:text-sm text-[#4A3F3A] dark:text-gray-300 leading-relaxed font-normal">
              Thoughtfully curated products crafted with ancient wisdom and gentle purity — presented with pride by Mewa Masala Ghar.
            </p>

            <div className="pt-1">
              <Link
                to="/shop?brand=jimmi-jaggu"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B97375] hover:bg-[#A86466] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-98"
              >
                <span>Explore Brand Products</span>
                <span>→</span>
              </Link>
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
