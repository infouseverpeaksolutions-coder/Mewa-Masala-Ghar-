import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Mail,
  Loader2,
  CheckCircle2,
  Gift,
  Sparkles,
} from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { ProductCard } from '../components/ProductCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { StoreCard } from '../components/ui/StoreCard';
import { CategoryCard } from '../components/ui/CategoryCard';
import { ReviewCard } from '../components/ui/ReviewCard';
import { LeafIcon } from '../components/ui/Icons';
import api from '../services/api';
import { Product } from '../types';

const HOMEPAGE_CATEGORIES = [
  {
    id: 'baby-products',
    name: 'Baby Products',
    badge: 'Jimmi Jaggu',
    description: 'Sprouted ragi, infant nutrition & poshan',
    image: '/categories/baby_products.jpg',
    link: '/baby-nutrition',
  },
  {
    id: 'dry-fruits',
    name: 'Dry Fruits',
    badge: 'APMC Direct',
    description: 'California badam, king kaju & anjeer',
    image: '/banners/hero_slide_dryfruits.png',
    link: '/shop?category=dry-fruits',
  },
  {
    id: 'skin-care',
    name: 'Skin Care',
    badge: 'Jimmi Jaggu',
    description: 'Multani mitti & ancient volcanic clays',
    image: '/categories/skin_care.jpg',
    link: '/personal-care',
  },
  {
    id: 'flour-aata',
    name: 'Flour (Aata)',
    badge: 'Stone Ground',
    description: 'Fresh multigrain & laddoo flours',
    image: '/categories/flour_aata.jpg',
    link: '/shop?category=specialty-flours',
  },
  {
    id: 'combo-packs',
    name: 'Combo Packs',
    badge: 'Super Saver',
    description: 'Curated health bundles & value packs',
    image: '/categories/combo_packs.jpg',
    link: '/shop?combo=true',
  },
  {
    id: 'gifts-item',
    name: 'Gifts Item',
    badge: 'Festive Luxury',
    description: 'Royal handcrafted boxes & gift hampers',
    image: '/categories/gifts_item.jpg',
    link: '/shop?category=gift-boxes',
  },
];

export const HomePage: React.FC = () => {
  // 1. Fetch Bestsellers / Featured Products
  const { data: bestsellers, isLoading: loadingBestsellers } = useQuery({
    queryKey: ['home-bestsellers'],
    queryFn: async () => {
      const res = await api.get('/products?featured=true&limit=8');
      return (res.data?.data?.products || res.data?.products || []) as Product[];
    },
  });

  // Carousel index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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
      setNewsletterStatus('error');
      setNewsletterMsg(err?.response?.data?.message || 'Subscription failed. Please try again.');
    }
  };

  const nextSlide = () => {
    if (bestsellers && bestsellers.length > 0) {
      setCarouselIndex((prev) => (prev + 1) % bestsellers.length);
    }
  };

  const prevSlide = () => {
    if (bestsellers && bestsellers.length > 0) {
      setCarouselIndex((prev) => (prev === 0 ? bestsellers.length - 1 : prev - 1));
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-20">
      {/* 1. FITTED HERO SLIDING BANNER */}
      <div className="pt-1 sm:pt-2">
        <HeroBanner />
      </div>

      {/* 2. CATEGORIES SHOWCASE (Replaced Shop by Store) */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LeafIcon className="w-5 h-5 text-[#2F5D3A]" color="#2F5D3A" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441]">
                Pure & Authentic
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F4D2E] tracking-tight">
              Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#7A6B58] max-w-md">
            Explore certified organic foods, doctor-curated nutrition, ancient clays, stone-ground flours, and royal celebration hampers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {HOMEPAGE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#E7E0D0] p-3 sm:p-4 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 block"
            >
              {/* Category Image Container */}
              <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6EC] mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />

                {/* Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/95 text-[#1F4D2E] shadow-xs backdrop-blur-xs">
                  {cat.badge}
                </span>
              </div>

              {/* Title, Description & Action */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#1F4D2E] group-hover:text-[#D9A441] transition-colors leading-tight mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#7A6B58] line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-black/5">
                  <span className="text-[10px] sm:text-xs font-bold text-[#2F5D3A] group-hover:text-[#D9A441] transition-colors">
                    Explore
                  </span>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAF6EC] group-hover:bg-[#2F5D3A] text-[#2F5D3A] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. MEWA & HEALTHY FOODS SHELF */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <SectionHeading
          title="Mewa & Healthy Foods"
          viewAllLink="/foods"
          leafColor="#2F5D3A"
        />

        {/* Row 1: 4 Bowls Category Cards + 1 Combo Packs Card */}
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
            link="/shop?store=foods"
          />
          <CategoryCard
            name="Spices"
            image="/foods/foods_spices.jpg"
            link="/shop?store=foods&category=spices-seasonings"
          />

          {/* Combo Packs Card (Cream-Gold Tint #F7EBD2 with ribbon) */}
          <div className="col-span-2 sm:col-span-1 bg-[#F7EBD2] rounded-2xl border border-[#E8D7B8] p-4 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between relative group">
            {/* Red festive ribbon badge */}
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

            <Link
              to="/shop?combo=true"
              className="w-full py-2 rounded-full bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Row 2: Flavoured Makhana Wide Banner (split into red, green, teal flavour panels) */}
        <div className="rounded-3xl overflow-hidden shadow-card border border-[#E7E0D0] grid grid-cols-1 lg:grid-cols-12 bg-white">
          {/* Left Panel: Dark Green CTA */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#1F4D2E] to-[#2F5D3A] text-white p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#D9A441] block mb-1">
                Roasted Not Fried
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
                Flavoured Makhana
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-xs">
                Exciting flavours. 100% natural. Guilt-free snacking.
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/shop?store=foods"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] font-bold text-xs sm:text-sm shadow-xs transition-colors"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Panels: Red, Green, Teal Flavours */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {/* Flavour 1: Peri-Peri (Red Panel) */}
            <Link
              to="/shop?store=foods"
              className="bg-[#FAF2F2] p-5 sm:p-6 flex flex-col items-center justify-between text-center group hover:bg-[#FCE8E8] transition-colors"
            >
              <div className="w-full max-w-[210px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xs mb-3 bg-white p-1 border border-black/5">
                <img
                  src="/foods/makhana/makhana_peri_peri.jpg"
                  alt="Peri-Peri Makhana"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#8E2835] group-hover:text-[#A83242] transition-colors">Peri-Peri</h4>
                <span className="text-xs text-gray-500 font-medium">80g Jar • Slow Roasted</span>
              </div>
            </Link>

            {/* Flavour 2: Mint Punch (Green Panel) */}
            <Link
              to="/shop?store=foods"
              className="bg-[#F2FAF4] p-5 sm:p-6 flex flex-col items-center justify-between text-center group hover:bg-[#E8F8EC] transition-colors"
            >
              <div className="w-full max-w-[210px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xs mb-3 bg-white p-1 border border-black/5">
                <img
                  src="/foods/makhana/makhana_mint_punch.jpg"
                  alt="Mint Punch Makhana"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#1F4D2E] group-hover:text-[#2F5D3A] transition-colors">Mint Punch</h4>
                <span className="text-xs text-gray-500 font-medium">80g Jar • Pudina Refresh</span>
              </div>
            </Link>

            {/* Flavour 3: Cream & Onion (Teal Panel) */}
            <Link
              to="/shop?store=foods"
              className="bg-[#F2F9FC] p-5 sm:p-6 flex flex-col items-center justify-between text-center group hover:bg-[#E6F4FA] transition-colors"
            >
              <div className="w-full max-w-[210px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xs mb-3 bg-white p-1 border border-black/5">
                <img
                  src="/foods/makhana/makhana_cream_onion.jpg"
                  alt="Cream & Onion Makhana"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#1E6B86] group-hover:text-[#288AA8] transition-colors">Cream & Onion</h4>
                <span className="text-xs text-gray-500 font-medium">80g Jar • Herbed Cream</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. JIMMI JAGGU SUB-BRAND SHOWCASE BANNER */}
      <section id="jimmi-jaggu-showcase" className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FAF4EC] via-[#FFF9F3] to-[#FAF4EC] border-2 border-[#D9A441]/40 shadow-soft p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-2 shadow-md border-2 border-[#D9A441]/40 shrink-0 flex items-center justify-center">
                <img
                  src="/brands/jimmi_jaggu_logo.png"
                  alt="Jimmi Jaggu Sub-Brand"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1F4D2E]/10 text-[#1F4D2E] text-[11px] font-bold tracking-wide uppercase">
                  <span>Exclusive Sub-Brand</span>
                  <span className="text-[#D9A441]">•</span>
                  <span>Baby & Skincare</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F4D2E]">
                  Jimmi Jaggu
                </h3>
                <p className="font-serif italic text-sm text-[#8C6D37] font-semibold">
                  “From Our Store to Your Home”
                </p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Doctor-approved <strong>Baby First Foods & Poshan</strong> paired with 100% pure <strong>Micro-Sifted Clays & Herbal Skincare</strong>. Preservative-free generational wellness.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 shrink-0">
              <Link
                to="/jimmi-jaggu"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#1F4D2E] hover:bg-[#163821] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>Explore Sub-Brand</span>
                <ArrowRight className="w-4 h-4 text-[#D9A441]" />
              </Link>
              <Link
                to="/baby-nutrition"
                className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-full bg-[#2C8CAE] hover:bg-[#237492] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all"
              >
                <span>Baby Nutrition</span>
              </Link>
              <Link
                to="/personal-care"
                className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-full bg-[#B85966] hover:bg-[#9E4753] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all"
              >
                <span>Skin Care Clays</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BABY & FAMILY NUTRITION SHELF (Jimmi Jaggu) */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <SectionHeading
          title="Baby & Family Nutrition • Jimmi Jaggu"
          viewAllLink="/baby-nutrition"
          leafColor="#5DB4D6"
        />

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
      </section>

      {/* 7. PERSONAL CARE SHELF (Jimmi Jaggu) */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <SectionHeading
          title="Personal Care & Natural Clays • Jimmi Jaggu"
          viewAllLink="/personal-care"
          leafColor="#E0808C"
        />

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
      </section>

      {/* 7. BESTSELLERS CAROUSEL */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5">
            <LeafIcon className="w-5 h-5 text-[#2F5D3A]" color="#2F5D3A" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F4D2E] tracking-tight">
              Bestsellers
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop?featured=true"
              className="text-xs sm:text-sm font-bold text-[#2F5D3A] hover:underline mr-2"
            >
              View All →
            </Link>
            <button
              onClick={prevSlide}
              aria-label="Previous Products"
              className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Products"
              className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Grid */}
        {loadingBestsellers ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-white rounded-2xl animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {bestsellers
              ?.slice(carouselIndex, carouselIndex + 6)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        )}

        {/* Carousel indicator dots */}
        <div className="flex justify-center items-center gap-1.5 mt-6">
          <span className="w-5 h-1.5 rounded-full bg-[#2F5D3A]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        </div>
      </section>

      {/* 8. WHAT OUR CUSTOMERS SAY & NEWSLETTER ROW */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Customer Reviews (Left ~65% width) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <LeafIcon className="w-4 h-4 text-[#2F5D3A]" color="#2F5D3A" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1F4D2E]">
                What Our Customers Say
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
              <ReviewCard
                avatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                name="Neha S."
                city="Mumbai"
                rating={5}
                comment="The quality is amazing and the taste is so good. My family loves it!"
              />
              <ReviewCard
                avatar="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                name="Rohit M."
                city="Pune"
                rating={5}
                comment="Great products, fast delivery and excellent customer support. Highly recommended!"
              />
              <ReviewCard
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                name="Priya K."
                city="Bengaluru"
                rating={5}
                comment="We started using these for my baby and she absolutely loves them. Super natural."
              />
            </div>
          </div>

          {/* Newsletter Box (Right ~35% width, Deep Forest Green #1F4D2E) */}
          <div className="lg:col-span-4 bg-[#1F4D2E] rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#D9A441] mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold mb-1.5 text-white">
                Get 10% off your first order
              </h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Join our newsletter for healthy tips, new arrivals and exclusive offers.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="mt-6 space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-4 pr-12 py-3 rounded-full text-xs text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] flex items-center justify-center transition-colors disabled:opacity-50"
                  aria-label="Subscribe to newsletter"
                >
                  {newsletterStatus === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#1F4D2E]" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-[#1F4D2E]" />
                  )}
                </button>
              </div>

              {newsletterStatus === 'success' && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{newsletterMsg}</span>
                </div>
              )}
              {newsletterStatus === 'error' && (
                <p className="text-[11px] text-red-300">{newsletterMsg}</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
