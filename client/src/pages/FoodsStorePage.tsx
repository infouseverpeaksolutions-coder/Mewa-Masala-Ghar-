import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Gift, Sparkles, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CategoryCard } from '../components/ui/CategoryCard';
import { CornerLeaves } from '../components/ui/Icons';
import api from '../services/api';
import { Product } from '../types';

interface FoodsHeroSlide {
  id: string;
  image: string;
  alt: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryCta: { text: string; to?: string; href?: string };
  secondaryCta: { text: string; to?: string; href?: string };
  theme: 'light' | 'terracotta';
}

const FOODS_HERO_SLIDES: FoodsHeroSlide[] = [
  {
    id: 'jars',
    image: '/banners/foods/foods_banner_jars.png',
    alt: 'Mewa Masala Ghar Luxury Airtight Jars',
    badge: 'Pure Mandi Harvest',
    title: 'Mewa, Makhana &',
    highlight: 'Stone-Ground Spices',
    description:
      'Direct from APMC Mandi — Sun-cured California Badam, King W240 Kaju, and handpicked dry fruits sealed in luxury airtight glass jars.',
    primaryCta: {
      text: 'Explore Combos (2/4/6)',
      href: '#combos-section',
    },
    secondaryCta: {
      text: 'All Food Products',
      to: '/shop?store=foods',
    },
    theme: 'light',
  },
  {
    id: 'seeds',
    image: '/banners/foods/foods_banner_mewa_seeds.png',
    alt: 'Daily Nutrition Mewa & Super Vitality Seeds',
    badge: '100% Pure & Natural',
    title: 'Daily Nutrition Mewa &',
    highlight: 'Super Vitality Seeds',
    description:
      'High in Plant Protein, Omega-3 & Essential Fiber — Jumbo fox nuts, raw chia, pumpkin & sunflower seeds for complete family nourishment.',
    primaryCta: {
      text: 'Shop Super Seeds',
      to: '/shop?store=foods&category=seeds-mixes',
    },
    secondaryCta: {
      text: 'Browse Dry Fruits',
      to: '/shop?store=foods&category=dry-fruits',
    },
    theme: 'light',
  },
  {
    id: 'makhana',
    image: '/banners/foods/foods_banner_makhana.png',
    alt: 'Slow-Roasted Crunchy Peri-Peri Makhana',
    badge: 'Roasted Not Fried',
    title: 'Slow-Roasted Crunchy',
    highlight: 'Peri-Peri Makhana',
    description:
      'Authentic popped water lily seeds tossed in fiery stone-ground red chillies and secret APMC spices. 100% guilt-free snacking.',
    primaryCta: {
      text: 'Shop Roasted Makhana',
      to: '/shop?store=foods&category=makhana',
    },
    secondaryCta: {
      text: 'View Flavour Packs',
      href: '#combos-section',
    },
    theme: 'terracotta',
  },
];

const CURATED_COMBO_SLUGS = [
  'royal-dry-fruit-duo-pack-of-2',
  'royal-panch-mewa-dry-fruit-mix',
  'royal-california-badam-almonds',
  'king-size-w240-kaju-cashews',
  'afghan-roasted-salted-pista',
  'kashmiri-snow-white-akhrot-giri-walnuts',
  'sun-dried-turkish-anjeer-figs',
  'golden-long-afghan-kismis-raisins',
];

export const FoodsStorePage: React.FC = () => {
  const { setActiveStore } = useTheme();
  const { settings } = useSettings();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveStore('foods');
    window.scrollTo(0, 0);
  }, [setActiveStore]);

  const nextSlide = () => {
    setHeroIndex((prev) => (prev + 1) % FOODS_HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setHeroIndex((prev) => (prev - 1 + FOODS_HERO_SLIDES.length) % FOODS_HERO_SLIDES.length);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, heroIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 40) {
      prevSlide();
    } else if (deltaX < -40) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  // Fetch all food products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['foods-store-products'],
    queryFn: async () => {
      const res = await api.get('/products?store=foods&limit=50');
      return (res.data?.data?.products || []) as Product[];
    },
  });

  const combos = products.filter((p) => p.category?.slug === 'dry-fruits-combos' || p.isCombo);
  const dryFruits = products.filter(
    (p) => p.category?.slug === 'dry-fruits' || (p.category?.slug === 'dry-fruits-combos' && !p.isCombo)
  );
  const makhana = products.filter((p) => p.category?.slug === 'makhana');
  const seeds = products.filter((p) => p.category?.slug === 'healthy-seeds' || p.category?.slug === 'seeds-mixes');
  const spices = products.filter((p) => p.category?.slug === 'spices' || p.category?.slug === 'spices-seasonings');

  // 8 Curated Combos & Premium Dry Fruits with brand photography
  const curatedCombos = CURATED_COMBO_SLUGS
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  const displayCombos = curatedCombos.length > 0 ? curatedCombos : combos;

  const filteredProducts =
    selectedSubCategory === 'all'
      ? products
      : products.filter(
          (p) =>
            p.category?.slug === selectedSubCategory ||
            (selectedSubCategory === 'dry-fruits-combos' && p.isCombo)
        );

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. DYNAMIC MULTI-SLIDE HERO BANNER CAROUSEL */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div
          className="relative rounded-3xl overflow-hidden border border-[#E7E0D0] shadow-card min-h-[440px] sm:min-h-[460px] md:min-h-[500px] flex items-center group bg-[#FAF0DC]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {FOODS_HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === heroIndex;
            const isTerracotta = slide.theme === 'terracotta';

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Full Panoramic Background Image */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover object-right sm:object-right md:object-right-bottom"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />

                {/* Smooth Gradient Overlay for Contrast */}
                <div
                  className={`absolute inset-0 ${
                    isTerracotta
                      ? 'bg-gradient-to-r from-[#200903] via-[#200903]/90 sm:via-[#200903]/75 md:via-[#200903]/45 to-[#200903]/30 sm:to-transparent'
                      : 'bg-gradient-to-r from-[#FAF0DC] via-[#FAF0DC]/92 sm:via-[#FAF0DC]/80 md:via-[#FAF0DC]/45 to-[#FAF0DC]/35 sm:to-transparent'
                  }`}
                />

                {/* Botanical Corner Flourish */}
                <div
                  className={`absolute top-2 left-2 pointer-events-none ${
                    isTerracotta ? 'opacity-20' : 'opacity-30'
                  }`}
                >
                  <CornerLeaves
                    className="w-20 h-20 sm:w-28 sm:h-28"
                    color={isTerracotta ? '#D9A441' : '#2F5D3A'}
                  />
                </div>

                {/* Slide Text Content */}
                <div className="relative z-10 h-full w-full px-5 sm:px-12 lg:px-16 pt-7 pb-14 sm:py-12 md:py-14 flex items-center">
                  <div className="max-w-xl lg:max-w-2xl space-y-3.5 sm:space-y-5">
                    {/* Badge */}
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide ${
                        isTerracotta
                          ? 'bg-white/10 border border-[#E6A838]/60 text-[#FFD56B] backdrop-blur-xs'
                          : 'bg-white/80 border border-[#D9A441]/50 text-[#1F4D2E] backdrop-blur-xs'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span>{slide.badge}</span>
                    </div>

                    {/* Headline */}
                    <h1
                      className={`font-serif text-2xl sm:text-4xl lg:text-6xl font-extrabold leading-[1.15] sm:leading-[1.1] tracking-tight ${
                        isTerracotta ? 'text-white' : 'text-[#1F4D2E]'
                      }`}
                    >
                      {slide.title} <br />
                      <span className={isTerracotta ? 'text-[#FFD56B]' : 'text-[#1F4D2E]'}>
                        {slide.highlight}
                      </span>
                    </h1>

                    {/* Description */}
                    <p
                      className={`text-xs sm:text-sm md:text-base max-w-lg leading-relaxed ${
                        isTerracotta ? 'text-white/90' : 'text-[#2B2B2B]/85'
                      }`}
                    >
                      {slide.description}
                    </p>

                    {/* Call to Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                      {slide.primaryCta.to ? (
                        <Link
                          to={slide.primaryCta.to}
                          className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all group"
                        >
                          <span>{slide.primaryCta.text}</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      ) : (
                        <a
                          href={slide.primaryCta.href}
                          className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all group"
                        >
                          <span>{slide.primaryCta.text}</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      )}

                      {slide.secondaryCta.to ? (
                        <Link
                          to={slide.secondaryCta.to}
                          className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all shadow-2xs ${
                            isTerracotta
                              ? 'bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-xs'
                              : 'bg-white/80 hover:bg-white text-[#1F4D2E] border border-[#2F5D3A]/20'
                          }`}
                        >
                          <span>{slide.secondaryCta.text}</span>
                        </Link>
                      ) : (
                        <a
                          href={slide.secondaryCta.href}
                          className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all shadow-2xs ${
                            isTerracotta
                              ? 'bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-xs'
                              : 'bg-white/80 hover:bg-white text-[#1F4D2E] border border-[#2F5D3A]/20'
                          }`}
                        >
                          <span>{slide.secondaryCta.text}</span>
                        </a>
                      )}
                    </div>

                    {/* Quality & Free Shipping Footer */}
                    <div
                      className={`pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-medium ${
                        isTerracotta
                          ? 'text-white/80 border-t border-white/20'
                          : 'text-[#1F4D2E]/80 border-t border-[#1F4D2E]/15'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            isTerracotta ? 'text-[#FFD56B]' : 'text-[#2F5D3A]'
                          }`}
                        />
                        100% Authentic Quality
                      </span>
                      <span>•</span>
                      <span>Free Shipping Above ₹{settings.free_shipping_threshold}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Prev / Next Navigation Arrows (Hidden on small screens where touch swipe is used) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center bg-white/75 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center bg-white/75 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {FOODS_HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setHeroIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === heroIndex
                    ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#D9A441] shadow-sm'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white/90 shadow-2xs'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. SUBCATEGORY BOWL CARDS */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <SectionHeading title="Browse by Category" leafColor="#2F5D3A" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <CategoryCard
            name="Dry Fruits"
            image="/foods/foods_dryfruits.jpg"
            link="/shop?store=foods&category=dry-fruits"
          />
          <CategoryCard
            name="Seeds"
            image="/foods/foods_seeds.jpg"
            link="/shop?store=foods&category=seeds-mixes"
          />
          <CategoryCard
            name="Makhana"
            image="/foods/foods_makhana.jpg"
            link="/shop?store=foods&category=makhana"
          />
          <CategoryCard
            name="Spices"
            image="/foods/foods_spices.jpg"
            link="/shop?store=foods&category=spices-seasonings"
          />

          {/* Combo Packs Card (Cream-Gold Tint #F7EBD2) */}
          <div className="col-span-2 sm:col-span-1 bg-[#F7EBD2] rounded-2xl border border-[#E8D7B8] p-4 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between relative group">
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Gift className="w-3 h-3" />
              <span>Gifting</span>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-[#1F4D2E]">Combo Packs</h3>
              <p className="text-xs text-gray-600 font-medium mt-0.5">of 2 / 4 / 6</p>

              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-white/60 my-3 flex items-center justify-center p-1">
                <img
                  src="/foods/foods_combos.jpg"
                  alt="Combo Packs of 2 4 6"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <a
              href="#combos-section"
              className="w-full py-2 rounded-full bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Foods' },
            { id: 'dry-fruits-combos', label: 'Hampers & Combos (2/4/6)' },
            { id: 'dry-fruits', label: 'Single Dry Fruits' },
            { id: 'makhana', label: 'Roasted & Raw Makhana' },
            { id: 'healthy-seeds', label: 'Seeds 200g' },
            { id: 'spices', label: 'Stone-Ground Spices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedSubCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all min-h-[44px] ${
                selectedSubCategory === cat.id
                  ? 'bg-[#2F5D3A] text-white shadow-xs'
                  : 'bg-white border border-[#E7E0D0] text-gray-700 hover:bg-emerald-50 hover:border-emerald-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. HIGHLIGHT: COMBOS (Packs of 2, 4, 6) */}
      {(selectedSubCategory === 'all' || selectedSubCategory === 'dry-fruits-combos') && displayCombos.length > 0 && (
        <section id="combos-section" className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="bg-[#F7EBD2] rounded-3xl p-6 sm:p-8 border border-[#E8D7B8] shadow-card mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#1F4D2E] bg-white/70 px-2.5 py-1 rounded-full inline-block mb-2">
                  Festive & Corporate Gifting
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F4D2E]">
                  Curated Combos & Gift Hampers (Packs of 2, 4 & 6)
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 max-w-xl">
                  Royal brass-motif gift packaging loaded with hand-sorted Badam, Kaju, Akhrot, Pista, and Anjeer.
                </p>
              </div>
              <Link
                to="/shop?store=foods&category=dry-fruits-combos"
                className="text-xs font-bold text-[#1F4D2E] inline-flex items-center gap-1 hover:underline shrink-0 bg-white/80 px-4 py-2 rounded-full border border-[#E8D7B8]"
              >
                <span>View all hampers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayCombos.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FEATURED PRODUCTS GRID */}
      {selectedSubCategory !== 'all' ? (
        <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
          <SectionHeading
            title={selectedSubCategory.replace('-', ' ')}
            leafColor="#2F5D3A"
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
          {/* Dry Fruits Shelf */}
          <div>
            <SectionHeading
              title="Premium Dry Fruits"
              viewAllLink="/shop?store=foods&category=dry-fruits"
              leafColor="#2F5D3A"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {dryFruits.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Makhana Shelf */}
          <div>
            <SectionHeading
              title="Crunchy Fox Nut Makhana"
              viewAllLink="/shop?store=foods&category=makhana"
              leafColor="#2F5D3A"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {makhana.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Seeds Shelf */}
          <div>
            <SectionHeading
              title="Superfood Seeds 200g"
              viewAllLink="/shop?store=foods&category=healthy-seeds"
              leafColor="#2F5D3A"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {seeds.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Spices Shelf */}
          <div>
            <SectionHeading
              title="Traditional Stone-Ground Spices"
              viewAllLink="/shop?store=foods&category=spices"
              leafColor="#2F5D3A"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {spices.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
