import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Mail,
  Leaf,
  Heart,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  slug: string;
}

const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: 'jj-prod-1',
    name: 'Baby Moisturizing Cream',
    price: 499,
    rating: 4.8,
    reviewsCount: 124,
    image: '/jimmi-jaggu/prod_baby_cream.png',
    slug: 'baby-moisturizing-cream',
  },
  {
    id: 'jj-prod-2',
    name: 'Natural Baby Massage Oil',
    price: 449,
    rating: 4.7,
    reviewsCount: 98,
    image: '/jimmi-jaggu/prod_massage_oil.png',
    slug: 'natural-baby-massage-oil',
  },
  {
    id: 'jj-prod-3',
    name: 'Gentle Face Cream (for Sensitive Skin)',
    price: 599,
    rating: 4.9,
    reviewsCount: 156,
    image: '/jimmi-jaggu/prod_face_cream.png',
    slug: 'gentle-face-cream-sensitive-skin',
  },
  {
    id: 'jj-prod-4',
    name: 'Pregnancy Nutritional Powder',
    price: 799,
    rating: 4.6,
    reviewsCount: 87,
    image: '/jimmi-jaggu/prod_nutrition_powder.png',
    slug: 'pregnancy-nutritional-powder',
  },
  {
    id: 'jj-prod-5',
    name: 'Natural Sunscreen (for Kids & Adults)',
    price: 649,
    rating: 4.7,
    reviewsCount: 112,
    image: '/jimmi-jaggu/prod_sunscreen.png',
    slug: 'natural-sunscreen-kids-adults',
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    quote: 'The baby cream is so gentle and natural. My little one\'s skin has never been better!',
    name: 'Priya S.',
    avatar: '/jimmi-jaggu/avatar_priya.png',
    rating: 5,
  },
  {
    id: 2,
    quote: 'I love the quality and purity of their skincare products. I feel safe using them on my skin.',
    name: 'Neha K.',
    avatar: '/jimmi-jaggu/avatar_neha.png',
    rating: 5,
  },
  {
    id: 3,
    quote: 'Excellent products and fast delivery. A wonderful brand for every mom and baby!',
    name: 'Anjali R.',
    avatar: '/jimmi-jaggu/avatar_anjali.png',
    rating: 5,
  },
];

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
    image: '/jimmi-jaggu/hero_slide_1.jpg',
    badgeStore: 'Presented by Mewa Masala Ghar',
    title: 'Gentle Care for',
    titleAccent: 'Little Ones & You',
    subtitle: 'Pure, wholesome botanicals crafted for happy babies, healthy skin and a healthier tomorrow.',
    ctaText: 'Shop Baby Care',
    ctaLink: '#featured-products',
    objectPosition: 'object-[65%_35%] sm:object-[center_35%]',
  },
  {
    id: 'slide-2',
    image: '/jimmi-jaggu/hero_slide_2.jpg',
    badgeStore: '100% Safe & Certified Essentials',
    title: 'Pure Comfort for',
    titleAccent: 'Tender Baby Skin',
    subtitle: 'Nourishing botanical oils, soothing creams and everyday bedtime warmth.',
    ctaText: 'Explore Baby Products',
    ctaLink: '/shop?store=baby',
    objectPosition: 'object-[50%_35%] sm:object-[center_35%]',
  },
  {
    id: 'slide-3',
    image: '/jimmi-jaggu/hero_slide_3.jpg',
    badgeStore: 'Ayurvedic Poshan for Mothers',
    title: 'Loving Care for',
    titleAccent: 'Mothers-to-Be',
    subtitle: 'Thoughtful formulations crafted for every stage — from bump to babyhood.',
    ctaText: 'Shop Pregnancy Care',
    ctaLink: '/shop?store=baby&category=pregnancy-care',
    objectPosition: 'object-[50%_45%] sm:object-[center_40%]',
  },
  {
    id: 'slide-4',
    image: '/jimmi-jaggu/hero_slide_4.jpg',
    badgeStore: 'Triple-Sifted Ayurvedic Purity',
    title: 'Pure Botanical &',
    titleAccent: 'Ayurvedic Skincare',
    subtitle: 'Time-honored natural clays, multani mitti and chemical-free botanical blends.',
    ctaText: 'Discover Skincare',
    ctaLink: '/shop?store=care',
    objectPosition: 'object-[50%_55%] sm:object-[center_50%]',
  },
];

export const JimmiJagguBrandPage: React.FC = () => {
  const { setActiveStore } = useTheme();
  const { addToCart } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance hero slides every 4 seconds with smooth blur transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentSlide]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveStore('baby');
  }, [setActiveStore]);

  const handleAddToCart = (prod: FeaturedProduct) => {
    addToCart(
      {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: 'Natural care crafted for happy babies and glowing skin.',
        categoryId: 'baby',
        rating: prod.rating,
        reviewCount: prod.reviewsCount,
        images: [{ id: '1', url: prod.image, isPrimary: true, displayOrder: 0, productId: prod.id }],
        variants: [
          {
            id: `${prod.id}-v1`,
            productId: prod.id,
            sku: `JJ-${prod.id}`,
            weight: '100g',
            price: prod.price,
            mrp: prod.price + 100,
            stockQty: 50,
          },
        ],
      } as any,
      {
        id: `${prod.id}-v1`,
        productId: prod.id,
        sku: `JJ-${prod.id}`,
        weight: '100g',
        price: prod.price,
        mrp: prod.price + 100,
        stockQty: 50,
      } as any,
      1
    );

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
        1. HERO SECTION (Full-Screen Image Slider with 4s Smooth Blur Transition)
        Centered Heading, Badge, Subtitle & Buttons, Perfectly Fit to Viewport
        ========================================================================
      */}
      <section
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full overflow-hidden border-b border-[#EFE8DF] dark:border-[#243529] h-[calc(100dvh-152px)] sm:h-[calc(100dvh-114px)] min-h-[380px] flex items-center justify-center bg-[#FAF6F0] dark:bg-[#141E17] select-none"
      >
        {/* Full-bleed background images with dreamy smooth blur crossfade */}
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
                transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), filter 700ms cubic-bezier(0.4, 0, 0.2, 1), transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
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

        {/* 
          Ultra-low fade scrim (reduced to ~15%):
          Ensures images are 100% vibrant, rich and natural without any milky wash,
          while providing optimal contrast for centered text across all slides.
        */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.08)_50%,transparent_80%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(17,24,19,0.40)_0%,rgba(17,24,19,0.15)_50%,transparent_80%)]" />

        {/* Subtle decorative botanical background line art (Left & Right) */}
        <div className="absolute top-6 left-6 w-56 h-56 pointer-events-none opacity-20 dark:opacity-10 hidden md:block z-10">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#C7926B]">
            <path d="M20 180 C 40 120, 80 80, 160 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M70 125 C 85 110, 110 115, 115 130 C 105 140, 80 135, 70 125 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
            <path d="M100 95 C 115 80, 140 85, 145 100 C 135 110, 110 105, 100 95 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
            <path d="M130 65 C 145 50, 170 55, 175 70 C 165 80, 140 75, 130 65 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="150" r="15" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-8 w-56 h-56 pointer-events-none opacity-20 dark:opacity-10 hidden md:block z-10">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#C7926B]">
            <path d="M180 20 C 140 80, 110 130, 40 160" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M130 75 C 115 90, 90 85, 85 70 C 95 60, 120 65, 130 75 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
            <path d="M100 105 C 85 120, 60 115, 55 100 C 65 90, 90 95, 100 105 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
            <circle cx="150" cy="50" r="15" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>

        {/* Centered Content directly over the image (No box / No heavy card) */}
        <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-2 sm:py-6">
          <div className="flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3.5 md:space-y-4 max-w-xl sm:max-w-2xl lg:max-w-3xl">
            {/* Sub-brand badge with official Jimmi Jaggu logo */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 dark:bg-[#18221B]/95 backdrop-blur-md border border-[#E8DDD0] dark:border-[#2A3B2F] text-[10px] sm:text-xs font-bold text-[#8C5E58] dark:text-[#E5B85C] shadow-md transition-all mx-auto">
              <img
                src="/jimmi-jaggu/logo_dark.png"
                alt="Jimmi Jaggu"
                className="w-3.5 h-4 sm:w-4 sm:h-5 object-contain dark:hidden"
              />
              <img
                src="/jimmi-jaggu/logo_light.png"
                alt="Jimmi Jaggu"
                className="w-3.5 h-4 sm:w-4 sm:h-5 object-contain hidden dark:block"
              />
              <span className="transition-opacity duration-500">
                {HERO_SLIDES[currentSlide].badgeStore}
              </span>
            </div>

            {/* Headline with dynamic slide title & responsive typography */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] leading-[1.14] sm:leading-[1.12] font-black text-[#1F1410] dark:text-white tracking-tight drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] transition-all duration-700 mx-auto">
              {HERO_SLIDES[currentSlide].title}{' '}
              <span className="text-[#A0352A] dark:text-[#F0C060] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {HERO_SLIDES[currentSlide].titleAccent}
              </span>
            </h1>

            {/* Subtitle with high-visibility shadow */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#2A1D18] dark:text-gray-100 max-w-md sm:max-w-lg md:max-w-xl leading-relaxed font-semibold drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] transition-all duration-700 mx-auto line-clamp-2 sm:line-clamp-none">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>

            {/* CTA Buttons - Centered */}
            <div className="pt-1.5 sm:pt-2.5 md:pt-3 flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap mx-auto">
              <a
                href={HERO_SLIDES[currentSlide].ctaLink}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#C47D76] hover:bg-[#B36E67] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>{HERO_SLIDES[currentSlide].ctaText}</span>
                <span className="text-sm">→</span>
              </a>

              <a
                href="#categories"
                className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/95 dark:bg-[#18221B]/95 hover:bg-white dark:hover:bg-[#18221B] text-[#2B2321] dark:text-white border border-[#D5C9B8] dark:border-[#2A3B2F] text-xs sm:text-sm font-bold backdrop-blur-xs transition-all hover:scale-105 shadow-md"
              >
                <span>Explore Categories</span>
              </a>
            </div>
          </div>
        </div>

        {/* Left / Right Nav Arrows (Edge Positioned, Vertically Centered on sm+) */}
        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 dark:bg-[#18221B]/85 hover:bg-white dark:hover:bg-[#18221B] text-[#2B2321] dark:text-white border border-[#E0D4C3] dark:border-[#2A3B2F] items-center justify-center shadow-md backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 dark:bg-[#18221B]/85 hover:bg-white dark:hover:bg-[#18221B] text-[#2B2321] dark:text-white border border-[#E0D4C3] dark:border-[#2A3B2F] items-center justify-center shadow-md backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slide Progress Indicators - Centered at Bottom with safe clearance */}
        <div className="absolute bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-auto">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  isActive
                    ? 'w-8 sm:w-12 bg-[#C47D76] dark:bg-[#E5B85C] shadow-sm'
                    : 'w-2 sm:w-2.5 bg-black/25 dark:bg-white/35 hover:bg-black/45 dark:hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </section>

      {/* 
        ========================================================================
        2. CATEGORY SHOWCASE CARDS (3 Columns: Baby, Skincare, Pregnancy)
        ========================================================================
      */}
      <section id="categories" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-10 sm:pt-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {/* Card 1: Baby Products */}
          <div className="bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#EFE8DF] dark:border-[#2A3B2F] p-3 sm:p-4 pb-5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6F0] dark:bg-[#141E17] mb-3.5">
                <img
                  src="/jimmi-jaggu/cat_baby_bottle.jpg"
                  alt="Baby Products"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2B2321] dark:text-white px-1">
                Baby Products
              </h3>
              <p className="text-xs text-[#82746E] dark:text-gray-400 mt-1 mb-4 px-1">
                Safe • Gentle • Everyday Essentials
              </p>
            </div>
            <div className="px-1">
              <Link
                to="/shop?store=baby"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#B97375] hover:bg-[#A86466] text-white text-xs font-semibold shadow-xs transition-all hover:scale-105"
              >
                <span>Explore</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Personal Care & Skincare */}
          <div className="bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#EFE8DF] dark:border-[#2A3B2F] p-3 sm:p-4 pb-5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6F0] dark:bg-[#141E17] mb-3.5">
                <img
                  src="/jimmi-jaggu/cat_ayurvedic_powder.jpg"
                  alt="Personal Care & Skincare"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2B2321] dark:text-white px-1">
                Personal Care & Skincare
              </h3>
              <p className="text-xs text-[#82746E] dark:text-gray-400 mt-1 mb-4 px-1">
                Pure Ingredients • Healthy Skin
              </p>
            </div>
            <div className="px-1">
              <Link
                to="/shop?store=care"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#6D8B74] hover:bg-[#5C7762] text-white text-xs font-semibold shadow-xs transition-all hover:scale-105"
              >
                <span>Explore</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Pregnancy Products */}
          <div className="bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#EFE8DF] dark:border-[#2A3B2F] p-3 sm:p-4 pb-5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6F0] dark:bg-[#141E17] mb-3.5">
                <img
                  src="/jimmi-jaggu/cat_pregnancy_mother.jpg"
                  alt="Pregnancy Products"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2B2321] dark:text-white px-1">
                Pregnancy Products
              </h3>
              <p className="text-xs text-[#82746E] dark:text-gray-400 mt-1 mb-4 px-1">
                Care for You & Your Little One
              </p>
            </div>
            <div className="px-1">
              <Link
                to="/shop?store=baby&category=pregnancy-care"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#B97375] hover:bg-[#A86466] text-white text-xs font-semibold shadow-xs transition-all hover:scale-105"
              >
                <span>Explore</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        3. FEATURED PRODUCTS (With Left/Right Carousel Controls)
        ========================================================================
      */}
      <section id="featured-products" className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-14 sm:pt-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#2B2321] dark:text-white tracking-tight">
              Featured Products
            </h2>
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#D8CFC4] dark:bg-[#3E5244] hidden sm:block" />
          </div>
          <Link
            to="/shop?store=baby"
            className="text-xs sm:text-sm font-semibold text-[#8C6D37] dark:text-[#E5B85C] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <span className="text-xs">→</span>
          </Link>
        </div>

        {/* Carousel Container with Arrows */}
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
            {FEATURED_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="w-[210px] sm:w-[230px] shrink-0 bg-white dark:bg-[#18221B] rounded-2xl border border-[#EFE8DF] dark:border-[#2A3B2F] p-3.5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF6F0] dark:bg-[#141E17] mb-3 flex items-center justify-center p-2">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title */}
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2B2321] dark:text-white text-center leading-snug min-h-[36px]">
                    {prod.name}
                  </h4>

                  {/* Price */}
                  <p className="text-center font-bold text-sm sm:text-base text-[#2B2321] dark:text-white mt-1">
                    ₹ {prod.price}
                  </p>

                  {/* Star Rating */}
                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#82746E] dark:text-gray-400 mt-1 mb-3">
                    <Star className="w-3.5 h-3.5 fill-[#D9A441] text-[#D9A441]" />
                    <span className="font-bold text-[#2B2321] dark:text-white">{prod.rating}</span>
                    <span>({prod.reviewsCount})</span>
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
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        4. 4 VALUE / TRUST BADGES (Horizontal Card with dividers)
        ========================================================================
      */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-14 sm:pt-16">
        <div className="bg-[#FAF4EC] dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#EFE8DF] dark:border-[#2A3B2F] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E7DEC8] dark:divide-[#2A3B2F]">
            {/* 1: Natural Ingredients */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5 text-[#C47D76]">
                <Leaf className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#2B2321] dark:text-white">
                Natural Ingredients
              </h4>
              <p className="text-xs text-[#7A6D68] dark:text-gray-400 mt-0.5">
                Pure & plant-based goodness
              </p>
            </div>

            {/* 2: Gentle & Safe */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4 pt-4 sm:pt-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5 text-[#C47D76]">
                <Heart className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#2B2321] dark:text-white">
                Gentle & Safe
              </h4>
              <p className="text-xs text-[#7A6D68] dark:text-gray-400 mt-0.5">
                For your little ones & you
              </p>
            </div>

            {/* 3: FSSAI Compliant */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4 pt-4 sm:pt-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5 text-[#C47D76]">
                <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#2B2321] dark:text-white">
                FSSAI Compliant
              </h4>
              <p className="text-xs text-[#7A6D68] dark:text-gray-400 mt-0.5">
                Quality you can trust
              </p>
            </div>

            {/* 4: Made with Care */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4 pt-4 sm:pt-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5 text-[#C47D76]">
                <Sparkles className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#2B2321] dark:text-white">
                Made with Care
              </h4>
              <p className="text-xs text-[#7A6D68] dark:text-gray-400 mt-0.5">
                Because your family matters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        5. SUB-BRAND STORY / HIGHLIGHT BANNER
        ========================================================================
      */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-14 sm:pt-16">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EFE8DF] dark:border-[#2A3B2F] shadow-card min-h-[340px] sm:min-h-[380px] md:min-h-[400px] lg:min-h-[420px] flex items-center group">
          {/* Full-bleed background image across the whole banner */}
          <img
            src="/jimmi-jaggu/banner_still.jpg"
            alt="Jimmi Jaggu Baby and Skincare"
            className="absolute inset-0 w-full h-full object-cover object-[78%_center] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          />

          {/* Gentle gradient overlay on left for sharp, pristine text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9]/95 via-[#FFFDF9]/85 to-transparent dark:from-[#18221B]/95 dark:via-[#18221B]/85 dark:to-transparent max-w-lg sm:max-w-xl md:max-w-2xl pointer-events-none" />

          {/* Subtle mobile overlay for extra clarity on small screens */}
          <div className="absolute inset-0 bg-[#FFFDF9]/30 dark:bg-[#18221B]/30 sm:hidden pointer-events-none" />

          {/* Content overlay directly on the banner */}
          <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 max-w-lg sm:max-w-xl space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/jimmi-jaggu/logo_dark.png"
                alt="Jimmi Jaggu"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain dark:hidden"
              />
              <img
                src="/jimmi-jaggu/logo_light.png"
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
              Thoughtfully crafted products for every stage of your journey — from bump to babyhood.
            </p>

            <div className="pt-2">
              <Link
                to="/shop?store=baby"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B97375] hover:bg-[#A86466] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-98"
              >
                <span>Explore Jimmi Jaggu</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        6. WHAT OUR CUSTOMERS SAY (3 Testimonials with Avatars)
        ========================================================================
      */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-14 sm:pt-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#2B2321] dark:text-white tracking-tight">
              What Our Customers Say
            </h2>
            <div className="w-12 sm:w-16 h-[1.5px] bg-[#D8CFC4] dark:bg-[#3E5244] hidden sm:block" />
          </div>
          <Link
            to="/shop?store=baby"
            className="text-xs sm:text-sm font-semibold text-[#8C6D37] dark:text-[#E5B85C] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <span className="text-xs">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#EFE8DF] dark:border-[#2A3B2F] p-5 sm:p-6 shadow-soft flex flex-col justify-between"
            >
              <div>
                {/* Quotation Icon */}
                <span className="font-serif text-4xl text-[#C47D76]/40 leading-none block mb-2">“</span>
                <p className="text-xs sm:text-[13px] text-[#5B504B] dark:text-gray-300 leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              {/* Customer Avatar & Stars */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#F2ECE4] dark:border-white/5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#EAE1D5] shadow-xs shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#2B2321] dark:text-white">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#D9A441] text-[#D9A441]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        7. NEWSLETTER STRIP (Soft Peach / Blush background)
        ========================================================================
      */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto pt-14 sm:pt-16 pb-16">
        <div className="bg-[#FCEEEA] dark:bg-[#1E1719] rounded-2xl sm:rounded-3xl border border-[#F2DDD7] dark:border-[#38262A] p-6 sm:p-8 lg:p-10 shadow-soft relative overflow-hidden">
          {/* Decorative Corner Florals */}
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-20">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-[#C47D76]">
              <circle cx="80" cy="20" r="15" />
              <path d="M50 20 Q 80 50 80 80" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            {/* Left Title & Icon */}
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

            {/* Email Form */}
            <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 max-w-md">
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
