import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Gift,
  Mail,
  CheckCircle2,
  Loader2,
  Baby,
  Sparkles,
  Heart,
  Trophy,
  Package,
} from 'lucide-react';
import { HeroVideo } from '../components/HeroVideo';
import { MewaProductCard } from '../components/MewaProductCard';
import { SeedsAataaCard } from '../components/SeedsAataaCard';
import { BestsellerRankedCard } from '../components/BestsellerRankedCard';
import {
  SectionLeaf,
  BranchFlourishLeft,
  BranchFlourishRight,
  RajasthaniDivider,
} from '../components/ui/Icons';
import { COMBO_PACKS_BANNER, FLAVOURED_MAKHANA_PANELS } from '../data/mockData';
import { resolveImageUrl } from '../utils/imageUrl';
import api from '../services/api';

const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-3 sm:p-4 animate-pulse space-y-3">
    <div className="aspect-[4/5] w-full rounded-xl sm:rounded-2xl bg-gray-200 dark:bg-gray-800" />
    <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
  </div>
);

export const HomePage: React.FC = () => {
  // Category filter state for Seeds & Aataa
  const [seedsAataaFilter, setSeedsAataaFilter] = useState<'all' | 'seeds' | 'aataa'>('all');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // 1. Fetch Real Categories from Database (Admin uploaded)
  const { data: dbCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['home-categories'],
    queryFn: async () => {
      const res = await api.get('/categories?store=foods');
      return res.data?.data || res.data?.all || [];
    },
  });

  // 2. Fetch Real Dry Fruits from Database
  const { data: dryFruitsData = [], isLoading: dryFruitsLoading } = useQuery({
    queryKey: ['home-dry-fruits'],
    queryFn: async () => {
      const res = await api.get('/products?store=foods&category=dry-fruits&limit=14');
      return res.data?.data?.products || [];
    },
  });

  // 3. Fetch All Foods Products from Database for Seeds & Aataa + General Display
  const { data: allFoodsData = [], isLoading: allFoodsLoading } = useQuery({
    queryKey: ['home-foods-all'],
    queryFn: async () => {
      const res = await api.get('/products?store=foods&limit=50');
      return res.data?.data?.products || [];
    },
  });

  // 4. Fetch Real Bestsellers from Database
  const { data: bestsellersData = [], isLoading: bestsellersLoading } = useQuery({
    queryKey: ['home-bestsellers'],
    queryFn: async () => {
      const res = await api.get('/products?store=foods&bestSeller=true&limit=6');
      return res.data?.data?.products || [];
    },
  });

  // Strict Category Identification Helpers (Prevents category mixing on Home Page)
  const isStrictlyDryFruit = (p: any) => {
    const slug = (p.category?.slug || '').toLowerCase();
    const catName = (p.category?.name || '').toLowerCase();
    const prodName = (p.name || '').toLowerCase();

    // STRICT REJECTIONS: Spices, Makhana, Seeds, Flours/Aataa, Baby/Care
    if (
      slug.includes('spice') || catName.includes('spice') || catName.includes('masala') ||
      prodName.includes('powder') || prodName.includes('mirch') || prodName.includes('haldi') || prodName.includes('coriander') || prodName.includes('dhaniya') || prodName.includes('chilli') ||
      slug.includes('makhana') || catName.includes('makhana') || prodName.includes('makhana') ||
      slug.includes('seed') || catName.includes('seed') || prodName.includes('seed') || prodName.includes('chia') || prodName.includes('flax') ||
      slug.includes('aata') || catName.includes('aata') || slug.includes('flour') || catName.includes('flour') || prodName.includes('aata') || prodName.includes('flour') ||
      slug.includes('baby') || catName.includes('baby') || slug.includes('care') || catName.includes('care')
    ) {
      return false;
    }

    return (
      slug.includes('dry-fruit') ||
      catName.includes('dry fruit') ||
      catName.includes('mewa') ||
      slug.includes('nut') ||
      catName.includes('nut') ||
      prodName.includes('badam') ||
      prodName.includes('almond') ||
      prodName.includes('kaju') ||
      prodName.includes('cashew') ||
      prodName.includes('pista') ||
      prodName.includes('pistachio') ||
      prodName.includes('anjeer') ||
      prodName.includes('fig') ||
      prodName.includes('akhrot') ||
      prodName.includes('walnut') ||
      prodName.includes('kismis') ||
      prodName.includes('kishmish') ||
      prodName.includes('raisin') ||
      prodName.includes('dry fruit') ||
      prodName.includes('munch')
    );
  };

  const isStrictlySeed = (p: any) => {
    const slug = (p.category?.slug || '').toLowerCase();
    const catName = (p.category?.name || '').toLowerCase();
    const prodName = (p.name || '').toLowerCase();

    // STRICT REJECTIONS: Spices, Makhana, Dry Fruits, Flours, Baby/Care
    if (
      slug.includes('spice') || catName.includes('spice') || catName.includes('masala') ||
      prodName.includes('powder') || prodName.includes('mirch') || prodName.includes('haldi') || prodName.includes('coriander') || prodName.includes('dhaniya') ||
      slug.includes('makhana') || catName.includes('makhana') || prodName.includes('makhana') ||
      slug.includes('dry-fruit') || catName.includes('dry fruit') ||
      slug.includes('aata') || catName.includes('aata') || slug.includes('flour') || catName.includes('flour') ||
      slug.includes('baby') || catName.includes('baby') || slug.includes('care') || catName.includes('care')
    ) {
      return false;
    }

    return (
      slug.includes('seed') ||
      catName.includes('seed') ||
      prodName.includes('seed') ||
      prodName.includes('chia') ||
      prodName.includes('flax') ||
      prodName.includes('pumpkin') ||
      prodName.includes('sunflower') ||
      prodName.includes('sesame') ||
      prodName.includes('til') ||
      prodName.includes('alsi') ||
      prodName.includes('magaz')
    );
  };

  const isStrictlyAataa = (p: any) => {
    const slug = (p.category?.slug || '').toLowerCase();
    const catName = (p.category?.name || '').toLowerCase();
    const prodName = (p.name || '').toLowerCase();

    // STRICT REJECTIONS: Spices, Makhana, Dry Fruits, Seeds, Baby/Care
    if (
      slug.includes('spice') || catName.includes('spice') || catName.includes('masala') ||
      prodName.includes('powder') ||
      slug.includes('makhana') || catName.includes('makhana') || prodName.includes('makhana') ||
      slug.includes('dry-fruit') || catName.includes('dry fruit') ||
      slug.includes('seed') || catName.includes('seed') ||
      slug.includes('baby') || catName.includes('baby') || slug.includes('care') || catName.includes('care')
    ) {
      return false;
    }

    return (
      slug.includes('aata') ||
      catName.includes('aata') ||
      slug.includes('flour') ||
      catName.includes('flour') ||
      prodName.includes('aata') ||
      prodName.includes('flour') ||
      prodName.includes('chakki') ||
      prodName.includes('ragi flour') ||
      prodName.includes('besan')
    );
  };

  // Dry fruits to display: strictly Dry Fruits only
  const displayedDryFruits = useMemo(() => {
    const pool = [...dryFruitsData];
    allFoodsData.forEach((p: any) => {
      if (!pool.some((item) => item.id === p.id)) {
        pool.push(p);
      }
    });
    return pool.filter(isStrictlyDryFruit).slice(0, 7);
  }, [dryFruitsData, allFoodsData]);

  // Seeds & Aataa products: strictly Seeds and Aataa only
  const filteredSeedsAataa = useMemo(() => {
    if (seedsAataaFilter === 'seeds') {
      return allFoodsData.filter(isStrictlySeed).slice(0, 7);
    }
    if (seedsAataaFilter === 'aataa') {
      return allFoodsData.filter(isStrictlyAataa).slice(0, 7);
    }
    return allFoodsData.filter((p: any) => isStrictlySeed(p) || isStrictlyAataa(p)).slice(0, 7);
  }, [allFoodsData, seedsAataaFilter]);

  // Bestsellers: DB bestsellers or supplemented by foods catalog
  const displayedBestsellers = useMemo(() => {
    if (bestsellersData.length >= 4) return bestsellersData.slice(0, 6);
    const combined = [...bestsellersData];
    allFoodsData.forEach((p: any) => {
      if (!combined.some((b) => b.id === p.id)) {
        combined.push(p);
      }
    });
    return combined.slice(0, 6);
  }, [bestsellersData, allFoodsData]);

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
      setNewsletterStatus('success');
      setNewsletterMsg('Dhanyawaad! You have been subscribed successfully.');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="text-[#2B2B2B] dark:text-[#F3EFE6] transition-colors duration-300">
      {/* 
        ========================================================================
        1. HERO VIDEO SECTION (100% full-bleed edge-to-edge, zero margin/padding)
        ========================================================================
      */}
      <HeroVideo />

      {/* 
        ========================================================================
        ALL SECTIONS BELOW HERO - CLEAN PLAIN WHITE BACKGROUND
        ========================================================================
      */}
      <div className="bg-white dark:bg-[#111813] relative space-y-10 sm:space-y-14 pt-8 sm:pt-12 pb-20 overflow-hidden">

      {/* 
        ========================================================================
        3. SHOP BY CATEGORY (Dynamic from Admin Panel Uploads)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center">
            <span>Shop by Category</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white dark:bg-[#18221B] rounded-2xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-3 animate-pulse space-y-2">
                <div className="aspect-[4/3] w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
                <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : dbCategories.length === 0 ? (
          <div className="text-center py-8 px-4 bg-[#FAF6EC] dark:bg-[#18221B] rounded-2xl border border-dashed border-[#E6DEC8] dark:border-[#2A3B2F]">
            <Package className="w-8 h-8 text-[#D9A441] mx-auto mb-2 opacity-70" />
            <p className="font-serif font-bold text-sm text-[#1F4D2E] dark:text-[#8ED9A0]">No categories added yet</p>
            <p className="text-xs text-[#8C7B65] mt-1">Categories created in the Admin Panel will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {dbCategories.slice(0, 5).map((cat: any) => {
              const catImage = resolveImageUrl(cat.image) || '/foods/foods_dryfruits.jpg';
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="group bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-3 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                >
                  {/* Category Image */}
                  <div className="relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6EC] dark:bg-[#111813] mb-2.5">
                    <img
                      src={catImage}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/foods/foods_dryfruits.jpg';
                      }}
                    />
                  </div>

                  {/* Title & Circular Arrow Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif text-xs sm:text-sm font-bold text-[#1F4D2E] dark:text-[#8ED9A0] group-hover:text-[#D9A441] dark:group-hover:text-[#E5B85C] transition-colors truncate pr-1">
                      {cat.name}
                    </span>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1F4D2E] dark:bg-[#284F33] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-2xs shrink-0">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <RajasthaniDivider />

      {/* 
        ========================================================================
        4. DRY FRUITS / FRESH ARRIVALS ROW (Dynamic from Admin Panel Uploads)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center">
            <span>Dry Fruits & Fresh Arrivals</span>
            <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
          </h2>
          <Link
            to="/shop?category=dry-fruits"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] hover:text-[#D9A441] transition-colors"
          >
            View All →
          </Link>
        </div>

        {dryFruitsLoading || allFoodsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedDryFruits.length === 0 ? (
          <div className="text-center py-8 px-4 bg-[#FAF6EC] dark:bg-[#18221B] rounded-2xl border border-dashed border-[#E6DEC8] dark:border-[#2A3B2F]">
            <Package className="w-8 h-8 text-[#D9A441] mx-auto mb-2 opacity-70" />
            <p className="font-serif font-bold text-sm text-[#1F4D2E] dark:text-[#8ED9A0]">No products uploaded yet</p>
            <p className="text-xs text-[#8C7B65] mt-1">Products added in the Admin Panel will be displayed here immediately.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {displayedDryFruits.map((prod: any) => (
              <MewaProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
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
              <img
                src={panel.image}
                alt={panel.name.replace('\n', ' ')}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${panel.bgColor}dd 0%, ${panel.bgColor}aa 20%, ${panel.bgColor}55 40%, transparent 65%)`,
                }}
              />

              <div className="relative z-10 h-full flex items-center p-4 sm:p-5">
                <h3 className="font-serif text-base sm:text-lg lg:text-xl font-bold leading-snug text-white whitespace-pre-line drop-shadow-lg">
                  {panel.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <RajasthaniDivider />

      {/* 
        ========================================================================
        7. SEEDS & AATAA SECTION (Dynamic from Admin Panel Uploads)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center gap-1.5">
              <span>Seeds & Aataa</span>
              <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
            </h2>
            <p className="text-xs sm:text-[13px] text-[#7A6B58] dark:text-[#C5BCAD] mt-0.5">
              100% natural raw super seeds and fresh traditional stone-chakki ground flours.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-white dark:bg-[#18221B] border border-[#E7E0D0] dark:border-[#2A3B2F] shadow-2xs">
              <button
                onClick={() => setSeedsAataaFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  seedsAataaFilter === 'all'
                    ? 'bg-[#1F4D2E] text-white dark:bg-[#284F33] shadow-xs'
                    : 'text-[#7A6B58] hover:text-[#1F4D2E] dark:text-[#C5BCAD] dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSeedsAataaFilter('seeds')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  seedsAataaFilter === 'seeds'
                    ? 'bg-[#1F4D2E] text-white dark:bg-[#284F33] shadow-xs'
                    : 'text-[#7A6B58] hover:text-[#1F4D2E] dark:text-[#C5BCAD] dark:hover:text-white'
                }`}
              >
                Super Seeds
              </button>
              <button
                onClick={() => setSeedsAataaFilter('aataa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  seedsAataaFilter === 'aataa'
                    ? 'bg-[#1F4D2E] text-white dark:bg-[#284F33] shadow-xs'
                    : 'text-[#7A6B58] hover:text-[#1F4D2E] dark:text-[#C5BCAD] dark:hover:text-white'
                }`}
              >
                Specialty Aataa
              </button>
            </div>

            <Link
              to="/shop?category=seeds-mixes"
              className="hidden md:inline-flex text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] hover:text-[#D9A441] transition-colors ml-2"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        {allFoodsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredSeedsAataa.length === 0 ? (
          <div className="text-center py-8 px-4 bg-[#FAF6EC] dark:bg-[#18221B] rounded-2xl border border-dashed border-[#E6DEC8] dark:border-[#2A3B2F]">
            <Package className="w-8 h-8 text-[#D9A441] mx-auto mb-2 opacity-70" />
            <p className="font-serif font-bold text-sm text-[#1F4D2E] dark:text-[#8ED9A0]">No items found in this section</p>
            <p className="text-xs text-[#8C7B65] mt-1">Uploaded seed and flour items from the Admin Panel will appear here.</p>
          </div>
        ) : (
          <div
            className={`grid gap-3 sm:gap-4 ${
              seedsAataaFilter === 'all'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7'
                : seedsAataaFilter === 'seeds'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
                : 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
            }`}
          >
            {filteredSeedsAataa.map((prod: any) => (
              <SeedsAataaCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      <RajasthaniDivider />

      {/* 
        ========================================================================
        8. BESTSELLERS (Dynamic from Admin Panel Uploads)
        ========================================================================
      */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#D9A441] uppercase tracking-wider mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>India's Most Loved</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F4D2E] dark:text-[#8ED9A0] tracking-tight flex items-center gap-1.5">
              <span>Bestsellers</span>
              <SectionLeaf className="w-4 h-4 text-[#2F5D3A] dark:text-[#8ED9A0]" color="#2F5D3A" />
            </h2>
            <p className="text-xs sm:text-[13px] text-[#7A6B58] dark:text-[#C5BCAD] mt-0.5">
              Handpicked customer favorites loved by 50,000+ happy households across India.
            </p>
          </div>
          <Link
            to="/shop?featured=true"
            className="text-xs sm:text-sm font-semibold text-[#1F4D2E] dark:text-[#E5B85C] hover:text-[#D9A441] transition-colors"
          >
            View All Bestsellers →
          </Link>
        </div>

        {bestsellersLoading || allFoodsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedBestsellers.length === 0 ? (
          <div className="text-center py-8 px-4 bg-[#FAF6EC] dark:bg-[#18221B] rounded-2xl border border-dashed border-[#E6DEC8] dark:border-[#2A3B2F]">
            <Package className="w-8 h-8 text-[#D9A441] mx-auto mb-2 opacity-70" />
            <p className="font-serif font-bold text-sm text-[#1F4D2E] dark:text-[#8ED9A0]">No bestsellers uploaded yet</p>
            <p className="text-xs text-[#8C7B65] mt-1">Products flagged as Bestseller in the Admin Panel will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {displayedBestsellers.map((prod: any, idx: number) => (
              <BestsellerRankedCard key={prod.id} product={prod} rank={idx + 1} />
            ))}
          </div>
        )}
      </section>

      <RajasthaniDivider />

      {/* 
        ========================================================================
        9. JIMMI JAGGU SHOWCASE BANNER (Brand Hub)
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
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_12px_45px_-12px_rgba(60,40,30,0.08)] dark:shadow-[0_12px_45px_-12px_rgba(0,0,0,0.5)] p-5 sm:p-8 md:p-10 lg:p-12 border border-[#E2D9CC] dark:border-[#3E3533] transition-all duration-300 bg-gradient-to-br from-[#FDFBF7] via-[#F5EFE6] to-[#ECE4D6] dark:from-[#211D1C] dark:via-[#272220] dark:to-[#1B1817]"
        >
          {/* Ambient Accents */}
          <div
            className="absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full pointer-events-none opacity-20 dark:opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #D9A441 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full pointer-events-none opacity-15 dark:opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #78363A 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            {/* Direct Navigation using Official Logo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-[#E2D9CC] dark:border-white/10">
              <Link
                to="/jimmi-jaggu"
                className="group inline-flex items-center gap-3.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 border border-[#DED5C6] dark:border-white/15 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                title="Navigate to Jimmi Jaggu Page"
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white p-1.5 shadow-xs border border-[#EDE5D8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/brands/jimmi_jaggu_logo.png"
                    alt="Jimmi Jaggu Official Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#2C1D20] dark:text-[#FAF6EC] group-hover:text-[#78363A] dark:group-hover:text-[#E8A598] transition-colors">
                      Jimmi Jaggu
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#78363A] text-white dark:bg-[#FAF6EC] dark:text-[#78363A] font-extrabold uppercase tracking-wider shadow-xs">
                      Official Sister Brand
                    </span>
                  </div>
                  <p className="text-xs text-[#63524E] dark:text-white/70 font-medium flex items-center gap-1 group-hover:text-[#78363A] dark:group-hover:text-white transition-colors">
                    <span>Visit Jimmi Jaggu Store</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2 text-[#63524E] dark:text-white/80 text-xs sm:text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-pulse" />
                <span>Presented with Care by <strong className="text-[#2C1D20] dark:text-white font-semibold">Mewa Masala Ghar</strong></span>
              </div>
            </div>

            {/* Headline */}
            <div className="mt-5 sm:mt-7 max-w-2xl">
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-extrabold text-[#2C1D20] dark:text-[#FAF6EC] leading-tight drop-shadow-xs">
                Gentle Care for Little Ones, Radiant Skin & Maternal Poshan
              </h3>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-[#5C4B47] dark:text-[#C7BCB8] leading-relaxed font-sans max-w-xl">
                Rooted in timeless Indian wisdom — from sprouted multi-grain baby food and soothing massage oils to triple-sifted earthen multani clays and nurturing postpartum care.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
              <Link
                to="/jimmi-jaggu?category=baby-nutrition"
                className="group relative rounded-2xl bg-white/85 dark:bg-[#181514]/75 hover:bg-white dark:hover:bg-[#181514] border border-[#E0D7C8] dark:border-[#38302E] hover:border-[#CFBFA9] dark:hover:border-[#524643] p-4 sm:p-5 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FAF2EB] dark:bg-white/10 text-[#A66038] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#78363A] group-hover:text-white transition-all duration-300 shadow-xs">
                    <Baby className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F4349] dark:text-[#E8A598] block">
                    Baby Care & Nutrition
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#2C1D20] dark:text-[#FAF6EC] mt-1 group-hover:text-[#78363A] dark:group-hover:text-[#FAF6EC] transition-colors">
                    Pratham Aahar & Baby Food
                  </h4>
                  <p className="mt-2 text-xs text-[#5C4B47] dark:text-[#B3A6A2] leading-relaxed font-normal">
                    100% natural sprouted multi-grain porridge, nourishing infant massage oils, and soothing baby creams.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EAE3D6] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#78363A] dark:text-[#E8A598] group-hover:text-[#5E272B] dark:group-hover:text-[#FAF6EC] transition-colors">
                  <span>Shop Baby Care</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/jimmi-jaggu?category=multani-collection"
                className="group relative rounded-2xl bg-white/85 dark:bg-[#181514]/75 hover:bg-white dark:hover:bg-[#181514] border border-[#E0D7C8] dark:border-[#38302E] hover:border-[#CFBFA9] dark:hover:border-[#524643] p-4 sm:p-5 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FDF0EE] dark:bg-white/10 text-[#C0606B] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#78363A] group-hover:text-white transition-all duration-300 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F4349] dark:text-[#E8A598] block">
                    Personal Care & Skincare
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#2C1D20] dark:text-[#FAF6EC] mt-1 group-hover:text-[#78363A] dark:group-hover:text-[#FAF6EC] transition-colors">
                    Multani Collection & Clays
                  </h4>
                  <p className="mt-2 text-xs text-[#5C4B47] dark:text-[#B3A6A2] leading-relaxed font-normal">
                    300-Mesh triple-sifted Fuller’s Earth, Dead Sea mineral mud packs, and Pink Glow Clay for chemical-free detox.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EAE3D6] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#78363A] dark:text-[#E8A598] group-hover:text-[#5E272B] dark:group-hover:text-[#FAF6EC] transition-colors">
                  <span>Shop Multani Clays</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/jimmi-jaggu?category=pregnancy-care"
                className="group relative rounded-2xl bg-white/85 dark:bg-[#181514]/75 hover:bg-white dark:hover:bg-[#181514] border border-[#E0D7C8] dark:border-[#38302E] hover:border-[#CFBFA9] dark:hover:border-[#524643] p-4 sm:p-5 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F0F5ED] dark:bg-white/10 text-[#4E7D58] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#78363A] group-hover:text-white transition-all duration-300 shadow-xs">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F4349] dark:text-[#E8A598] block">
                    Pregnancy & Maternity
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#2C1D20] dark:text-[#FAF6EC] mt-1 group-hover:text-[#78363A] dark:group-hover:text-[#FAF6EC] transition-colors">
                    Maternal & Family Poshan
                  </h4>
                  <p className="mt-2 text-xs text-[#5C4B47] dark:text-[#B3A6A2] leading-relaxed font-normal">
                    Ayurvedic prenatal and postpartum nourishment formulated with ancient Indian wisdom for mothers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EAE3D6] dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#78363A] dark:text-[#E8A598] group-hover:text-[#5E272B] dark:group-hover:text-[#FAF6EC] transition-colors">
                  <span>Shop Maternal Care</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Footer Action */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#E2D9CC] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#63524E] dark:text-[#C7BCB8]">
                <span className="w-2 h-2 rounded-full bg-[#78363A] dark:bg-[#E8A598]" />
                <span>Wholesome nutrition & earthen skin wellness for every generation</span>
              </div>

              <Link
                to="/jimmi-jaggu"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#78363A] hover:bg-[#62282D] text-[#FAF8F5] dark:bg-[#8F3E44] dark:hover:bg-[#78363A] font-serif font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 group"
              >
                <span>Explore Jimmi Jaggu Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FAF8F5]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RajasthaniDivider />

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
    </div>
  );
};
