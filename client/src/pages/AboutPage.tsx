import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Award, MapPin, CheckCircle2, Truck, Package, ArrowRight, Star, Leaf } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="space-y-16 pb-24">
      {/* Brand Story Hero */}
      <section className="relative bg-gradient-to-br from-[#122E1B] via-[#2F5D3A] to-[#183B23] text-white py-16 sm:py-24 px-4 sm:px-8 shadow-card overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D9A441_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#D9A441]/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="mb-4">
            <img src="/logo.png" alt="Mewa Masala Ghar" className="h-16 sm:h-20 w-auto mx-auto drop-shadow-md" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D9A441]/40 text-[#D9A441] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pure Indian Goodness • Rooted in Tradition</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF6EC] leading-tight">
            Direct from the Source. Pure to the Core.
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl mx-auto font-light leading-relaxed">
            {settings.company_name} was founded with a singular conviction: real wellness begins with unadulterated, farm-pure harvest straight from Indian mandis and orchards.
          </p>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl border border-[#E7E0D0] shadow-soft p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="space-y-1">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1F4D2E]">25,000+</span>
            <p className="text-xs text-gray-500 font-medium">Pan-India Families Served</p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#D9A441]">100%</span>
            <p className="text-xs text-gray-500 font-medium">Mandi Direct Sourcing</p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1F4D2E]">4.9 / 5</span>
            <p className="text-xs text-gray-500 font-medium">Verified Customer Rating</p>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#D9A441]">0%</span>
            <p className="text-xs text-gray-500 font-medium">Chemicals & Dyes Added</p>
          </div>
        </div>
      </section>

      {/* Main Narrative & APMC Roots */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">
              The Mandi Direct Journey
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Rooted in Vashi APMC, Navi Mumbai
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              From our trading roots at the APMC Grain Market in Vashi, Navi Mumbai, we witnessed how industrial food supply chains compromise natural nutrient density through chemical fumigation, prolonged warehousing, and deceptive polishing.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We decided to establish a transparent, direct bridge: partnering with growers across Kashmir, Rajasthan, Bihar, and Tamil Nadu. We pack small batches in our hygienic, nitrogen-flushed facility, delivering crunch, fragrance, and purity directly to modern Indian homes.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2F5D3A]" />
                <span>Zero Sulfur Fumigation</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2F5D3A]" />
                <span>Single-Origin Harvests</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2F5D3A]" />
                <span>Nitrogen Pouch Freshness</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF6EC] rounded-3xl p-6 sm:p-8 border border-[#E7E0D0] shadow-soft space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2F5D3A]">
              Our Three Inviolable Principles
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Zero Artificial Buffers</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    No added sugar in baby porridges, no synthetic yellow dyes in Salem turmeric, and zero fillers in our cosmetic clays.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Nitrogen-Flushed Airtight Freshness</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Every pack is vacuum-sealed in food-grade multilayer pouching to keep oxygen and moisture away naturally.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Verified Lab Purity</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Every consignment undergoes strict heavy metal screening, moisture checks, and aflatoxin testing prior to dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Dedicated Stores Section */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441] block">
            Curated Departments
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900">
            Three Specialized Stores, One Standard of Purity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Store 1: Foods */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#2F5D3A]/20 shadow-soft space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#2F5D3A]/10 text-[#2F5D3A] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2F5D3A] block">
              Foods & Dry Fruits
            </span>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              Mewa & Healthy Foods
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Jumbo California Almonds, Kashmiri Kagzi Walnuts, Grade W240 Cashews, roasted makhana, and high-curcumin spices.
            </p>
            <Link
              to="/foods"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F5D3A] hover:underline pt-2"
            >
              <span>Explore Foods Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Store 2: Baby Nutrition */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#5DB4D6]/30 shadow-soft space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#5DB4D6]/15 text-[#1e6f92] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1e6f92] block">
              Pediatric & Maternal
            </span>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              Baby & Family Nutrition
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Pratham Aahar sprouted ragi porridge, daily child poshan nut powders, and lactation & pregnancy nutrition blends.
            </p>
            <Link
              to="/baby-nutrition"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e6f92] hover:underline pt-2"
            >
              <span>Explore Baby Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Store 3: Personal Care */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E0808C]/30 shadow-soft space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#E0808C]/15 text-[#973441] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#973441] block">
              Clay & Spa Rituals
            </span>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              Personal Care & Clays
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Barmer Fuller's earth, French pink clay, Dead sea mud, and pure sandalwood powders micro-sifted to 300-mesh velvet.
            </p>
            <Link
              to="/personal-care"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#973441] hover:underline pt-2"
            >
              <span>Explore Care Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sourcing Map & Origins */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441] block">
            Geographical Origins
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Where Our Ingredients Come From
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E7E0D0] shadow-soft text-center space-y-2">
            <div className="text-3xl mb-2">🏔️</div>
            <h3 className="font-serif font-bold text-gray-900 text-sm">Kashmir Valley</h3>
            <p className="text-xs text-[#D9A441] font-semibold">Walnuts & Saffron</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Snow-fed Kagzi Akhrot kernels rich in natural brain DHA oils and sweet Kashmiri saffron.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E7E0D0] shadow-soft text-center space-y-2">
            <div className="text-3xl mb-2">☀️</div>
            <h3 className="font-serif font-bold text-gray-900 text-sm">Barmer, Rajasthan</h3>
            <p className="text-xs text-[#D9A441] font-semibold">Fuller's Earth Clays</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Grade-1 bentonite volcanic clay deposits sun-dried and micro-sifted to 300 mesh velvet fineness.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E7E0D0] shadow-soft text-center space-y-2">
            <div className="text-3xl mb-2">🌿</div>
            <h3 className="font-serif font-bold text-gray-900 text-sm">Salem & Guntur</h3>
            <p className="text-xs text-[#D9A441] font-semibold">Stone-Ground Spices</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Salem Haldi with 5%+ active curcumin and sun-ripened fiery Guntur chillies pounded traditionally.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E7E0D0] shadow-soft text-center space-y-2">
            <div className="text-3xl mb-2">🌾</div>
            <h3 className="font-serif font-bold text-gray-900 text-sm">Darbhanga, Bihar</h3>
            <p className="text-xs text-[#D9A441] font-semibold">Jumbo Fox Nut Makhana</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Water lily seeds harvested sustainably from natural freshwater wetlands and popped into jumbo white pearls.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Compliance & Registered Depot */}
      <section className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="bg-white rounded-3xl border border-[#E7E0D0] p-6 sm:p-8 shadow-soft text-center space-y-4">
          <ShieldCheck className="w-10 h-10 text-[#2F5D3A] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-gray-900">
            Registered Commercial Entity
          </h3>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-600 pt-2">
            <div>
              <span className="font-bold text-gray-900 block">Company Name:</span>
              <span>{settings.company_name}</span>
            </div>
            <div className="sm:border-l border-gray-200 sm:pl-6">
              <span className="font-bold text-gray-900 block">Registered Office:</span>
              <span>{settings.address}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
