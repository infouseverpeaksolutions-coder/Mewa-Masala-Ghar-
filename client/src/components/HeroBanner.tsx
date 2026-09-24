import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface HeroSlide {
  id: string;
  title: string;
  titleColor: string;
  description: string;
  descColor: string;
  ctaText: string;
  btnBg: string;
  btnHoverBg: string;
  btnShadow: string;
  link: string;
  image: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  // 1. Royal Dry Fruits & Combos
  {
    id: 'dryfruits',
    title: 'Royal Handpicked Dry Fruits, Nuts & Festive Combos',
    titleColor: 'text-[#1C2C1F]',
    description:
      'Direct from APMC Mandi — California Badam, King W240 Kaju, Afghan Anjeer & Walnuts packed fresh with zero preservatives for daily family vitality and royal gifting.',
    descColor: 'text-[#3E3A34]',
    ctaText: 'Shop Royal Mewa',
    btnBg: 'bg-[#C88E2D]',
    btnHoverBg: 'hover:bg-[#183B23]',
    btnShadow: 'shadow-[0_4px_14px_rgba(200,142,45,0.4)] hover:shadow-[0_8px_25px_rgba(24,59,35,0.45)]',
    link: '/foods',
    image: '/banners/hero_slide_dryfruits.png',
  },
  // 2. Wholesome Super Seeds
  {
    id: 'seeds',
    title: 'Wholesome Nutrient-Rich Super Seeds & Vitality Mixes',
    titleColor: 'text-[#12381E]',
    description:
      'High in Plant Protein, Omega-3 & Essential Fiber — Slow-roasted flax, raw chia, jumbo pumpkin, sunflower & 7-in-1 signature mixes to energize your daily health naturally.',
    descColor: 'text-[#283E31]',
    ctaText: 'Shop Super Seeds',
    btnBg: 'bg-[#2F5D3A]',
    btnHoverBg: 'hover:bg-[#C88E2D]',
    btnShadow: 'shadow-[0_4px_14px_rgba(47,93,58,0.4)] hover:shadow-[0_8px_25px_rgba(200,142,45,0.45)]',
    link: '/shop?store=foods&category=seeds-mixes',
    image: '/banners/hero_slide_seeds.png',
  },
  // 3. Baby Food & Daily Poshan
  {
    id: 'baby-poshan',
    title: 'Traditional Sprouted Baby Food & Wholesome Daily Poshan',
    titleColor: 'text-[#0E3345]',
    description:
      'Ayurvedic & Motherly Care — Sprouted Ragi & Badam Pratham Aahaar for infants (6+ months), nourishing blends for active women, and gentle bone & vitality poshan for elders.',
    descColor: 'text-[#234252]',
    ctaText: 'Shop Baby & Poshan',
    btnBg: 'bg-[#25728F]',
    btnHoverBg: 'hover:bg-[#183B23]',
    btnShadow: 'shadow-[0_4px_14px_rgba(37,114,143,0.4)] hover:shadow-[0_8px_25px_rgba(24,59,35,0.45)]',
    link: '/baby-nutrition',
    image: '/banners/hero_slide_baby_poshan.png',
  },
  // 4. Pregnancy Care & Maternal Nutrition
  {
    id: 'pregnancy',
    title: 'Doctor-Curated Ayurvedic Pregnancy Care & Maternal Nutrition',
    titleColor: 'text-[#3B1420]',
    description:
      'Nutrient-dense care for mother and baby — Organic dry fruit laddoo flour, natural plant iron, calcium, and essential minerals supporting vitality, fetal growth, and postpartum recovery.',
    descColor: 'text-[#4A2531]',
    ctaText: 'Shop Pregnancy Care',
    btnBg: 'bg-[#B54D60]',
    btnHoverBg: 'hover:bg-[#812336]',
    btnShadow: 'shadow-[0_4px_14px_rgba(181,77,96,0.4)] hover:shadow-[0_8px_25px_rgba(129,35,54,0.45)]',
    link: '/baby-nutrition',
    image: '/banners/hero_slide_pregnancy.png',
  },
  // 5. Natural Clays & Skincare
  {
    id: 'personal-care',
    title: 'Export Grade Volcanic Clays, Mineral Mud & Herbal Care',
    titleColor: 'text-[#351B0F]',
    description:
      'Ancient Earth Radiance — Ultra-fine 300-mesh Multani Mitti, soothing French Rose Pink Clay, and mineral-rich Dead Sea Mud for deep pore detoxification, oil control, and natural glow.',
    descColor: 'text-[#4A3022]',
    ctaText: 'Shop Personal Care',
    btnBg: 'bg-[#A65E36]',
    btnHoverBg: 'hover:bg-[#753916]',
    btnShadow: 'shadow-[0_4px_14px_rgba(166,94,54,0.4)] hover:shadow-[0_8px_25px_rgba(117,57,22,0.45)]',
    link: '/personal-care',
    image: '/banners/hero_slide_personal_care.png',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Fetch active hero banners from API
  const { data: dbBanners = [] } = useQuery<any[]>({
    queryKey: ['public-hero-banners'],
    queryFn: async () => {
      try {
        const res = await api.get('/banners');
        return res.data?.data || [];
      } catch (err) {
        return [];
      }
    },
    staleTime: 1000 * 60, // 1 minute
  });

  // Construct active slides: Use DB banners if available, otherwise fallback to high-res studio defaults
  const activeSlides: HeroSlide[] = useMemo(() => {
    if (!dbBanners || dbBanners.length === 0) return DEFAULT_SLIDES;

    return dbBanners.map((b, idx) => {
      const fallbackPreset = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];
      return {
        id: b.id || `banner-${idx}`,
        title: b.title || fallbackPreset.title,
        titleColor: fallbackPreset.titleColor || 'text-[#1C2C1F]',
        description: b.subtitle !== undefined && b.subtitle !== null ? b.subtitle : fallbackPreset.description,
        descColor: fallbackPreset.descColor || 'text-[#3E3A34]',
        ctaText: b.ctaText || fallbackPreset.ctaText || 'Shop Now',
        btnBg: fallbackPreset.btnBg || 'bg-[#C88E2D]',
        btnHoverBg: fallbackPreset.btnHoverBg || 'hover:bg-[#183B23]',
        btnShadow:
          fallbackPreset.btnShadow ||
          'shadow-[0_4px_14px_rgba(200,142,45,0.4)] hover:shadow-[0_8px_25px_rgba(24,59,35,0.45)]',
        link: b.linkUrl || fallbackPreset.link || '/foods',
        image: b.imageUrl || fallbackPreset.image,
      };
    });
  }, [dbBanners]);

  // Keep current slide within bounds
  useEffect(() => {
    if (currentSlide >= activeSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  // Auto-advance every 4 seconds, pausing while hovered
  useEffect(() => {
    if (isHovered || activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, activeSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  // Touch swipe handling for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    if (deltaX > 40) {
      prevSlide();
    } else if (deltaX < -40) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
      {/* Outer Banner Card Container: Fitted to header width with subtle luxury shadow */}
      <div
        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF6EC] border border-black/5 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.06),0_2px_10px_rgba(0,0,0,0.03)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal Continuous Sliding Track with Smooth Shifting Momentum */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {activeSlides.map((slide, idx) => {
              const isActive = currentSlide === idx;

              return (
                <div
                  key={slide.id}
                  className="w-full min-w-full shrink-0 relative aspect-[1024/342] bg-[#FAF6EC] overflow-hidden select-none"
                >
                  {/* Full-bleed Studio Banner Image spanning the entire card */}
                  <Link to={slide.link} className="block w-full h-full cursor-pointer">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-full object-cover object-center block pointer-events-none select-none"
                    />
                  </Link>

                  {/* Ambient Contrast Feather Gradient on the Left */}
                  <div className="absolute inset-y-0 left-0 w-[55%] sm:w-[48%] bg-gradient-to-r from-white/50 via-white/20 to-transparent pointer-events-none" />

                  {/* Dynamic Heading & Buttons on the Blank Left Side with Smooth Shifting Animation */}
                  <div className="absolute left-3.5 sm:left-14 md:left-18 lg:left-22 xl:left-24 top-1/2 -translate-y-1/2 z-10 w-[58%] sm:w-[46%] md:w-[44%] lg:w-[42%] xl:w-[40%] flex flex-col items-start justify-center pointer-events-none">
                    {/* Main Headline with Serif Typography and Smooth Shifting Transition */}
                    <h2
                      className={`font-serif font-bold text-[12px] sm:text-lg md:text-[22px] lg:text-[28px] xl:text-[34px] leading-[1.15] sm:leading-[1.18] mb-1 sm:mb-2.5 transition-all duration-700 ease-out tracking-tight ${
                        slide.titleColor
                      } ${
                        isActive
                          ? 'opacity-100 translate-x-0 delay-100'
                          : 'opacity-0 -translate-x-8'
                      }`}
                    >
                      {slide.title}
                    </h2>

                    {/* Subtitle Description with Smooth Shifting Transition */}
                    <p
                      className={`text-[7.5px] sm:text-[11px] md:text-xs lg:text-[13px] leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-3 mb-1.5 sm:mb-3 max-w-full sm:max-w-md transition-all duration-700 ease-out ${
                        slide.descColor
                      } ${
                        isActive
                          ? 'opacity-100 translate-x-0 delay-200'
                          : 'opacity-0 -translate-x-10'
                      }`}
                    >
                      {slide.description}
                    </p>

                    {/* Animated Interactive CTA Button */}
                    <Link
                      to={slide.link}
                      className={`group/btn pointer-events-auto inline-flex items-center gap-1 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-full text-white font-semibold text-[8px] sm:text-xs md:text-sm ${
                        slide.btnBg
                      } ${slide.btnHoverBg} ${
                        slide.btnShadow
                      } transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 relative overflow-hidden ${
                        isActive
                          ? 'opacity-100 translate-x-0 delay-300'
                          : 'opacity-0 -translate-x-12'
                      }`}
                      aria-label={`${slide.ctaText} - ${slide.title}`}
                    >
                      {/* Animated Gleaming Light-Beam Shimmer across button on hover */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

                      {/* Button label */}
                      <span className="relative z-10 leading-none">{slide.ctaText}</span>

                      {/* Animated Arrow that translates right on hover */}
                      <ArrowRight className="relative z-10 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Circular Frosted-Glass Previous Arrow (Hidden on mobile phones for clean edge-to-edge layout) */}
        {activeSlides.length > 1 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            aria-label="Previous banner slide"
            className="hidden sm:flex absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-[#C88E2D] text-[#183B23] hover:text-white shadow-md backdrop-blur-xs items-center justify-center transition-all duration-200 opacity-70 group-hover:opacity-100 transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Circular Frosted-Glass Next Arrow (Hidden on mobile phones for clean edge-to-edge layout) */}
        {activeSlides.length > 1 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            aria-label="Next banner slide"
            className="hidden sm:flex absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-[#C88E2D] text-[#183B23] hover:text-white shadow-md backdrop-blur-xs items-center justify-center transition-all duration-200 opacity-70 group-hover:opacity-100 transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Floating Indicator Pills at Bottom Center */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-1.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/80 backdrop-blur-xs shadow-xs border border-black/5">
            {activeSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Jump to slide ${idx + 1}: ${s.title}`}
                className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-400 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-5 sm:w-8 bg-[#C88E2D] shadow-[0_0_8px_rgba(200,142,45,0.6)]'
                    : 'w-1.5 sm:w-2.5 bg-black/20 hover:bg-black/45'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
