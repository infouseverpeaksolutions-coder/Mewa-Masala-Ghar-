import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { BrandLogoBadge } from './ui/Icons';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const isJimmiJaggu = location.pathname.startsWith('/jimmi-jaggu');

  return (
    <footer className="bg-[#1F4D2E] text-white pt-12 pb-20 md:pb-12 border-t border-white/10">
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        {isJimmiJaggu ? (
          /* Jimmi Jaggu Specific Footer Layout Matching Mockup */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
            {/* Col 1: Brand & Logo */}
            <div className="space-y-4">
              <Link to="/jimmi-jaggu" className="inline-flex items-center gap-2.5">
                <img
                  src="/brands/jimmi_jaggu_logo.png"
                  alt="Jimmi Jaggu"
                  className="w-12 h-12 rounded-full object-contain bg-white p-1 shadow-sm border border-[#D9A9A0]"
                />
                <div>
                  <span className="font-serif text-lg font-bold text-white tracking-tight block">
                    Jimmi Jaggu
                  </span>
                  <span className="text-[10px] font-serif italic text-[#D9A441] block -mt-0.5">
                    From Our Store to Your Home
                  </span>
                </div>
              </Link>
              <p className="text-xs text-emerald-100/75 leading-relaxed">
                Natural care crafted for happy babies, radiant mothers and healthy families.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3.5 text-white/80 pt-1">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#D9A441] transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/10">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#D9A441] transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/10">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-[#D9A441] transition-colors p-1.5 bg-white/5 rounded-full hover:bg-white/10">
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Col 2: Shop */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#D9A441] mb-3.5 tracking-wide">
                Shop
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li>
                  <Link to="/shop?store=baby" className="hover:text-[#D9A441] transition-colors">
                    Baby Products
                  </Link>
                </li>
                <li>
                  <Link to="/shop?store=care" className="hover:text-[#D9A441] transition-colors">
                    Skincare
                  </Link>
                </li>
                <li>
                  <Link to="/shop?store=baby&category=pregnancy-care" className="hover:text-[#D9A441] transition-colors">
                    Pregnancy Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#D9A441] mb-3.5 tracking-wide">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li>
                  <Link to="/about" className="hover:text-[#D9A441] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#D9A441] transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-[#D9A441] transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#D9A441] transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Our Parent Brand */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#D9A441] mb-3.5 tracking-wide">
                Our Parent Brand
              </h4>
              <p className="text-xs text-emerald-100/80">
                Mewa Masala Ghar
              </p>
              <div className="pt-1">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/30 hover:border-[#D9A441] text-xs font-semibold text-white hover:text-[#D9A441] transition-all bg-white/5 hover:bg-white/10"
                >
                  <span>Visit Mewa Masala Ghar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Col 5: Get in Touch */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#D9A441] mb-3.5 tracking-wide">
                Get in Touch
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                  <a href="tel:+919876543210" className="hover:text-white transition-colors">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                  <a href="mailto:care@jimmijaggu.com" className="hover:text-white transition-colors truncate">
                    care@jimmijaggu.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D9A441] shrink-0 mt-0.5" />
                  <span className="leading-tight text-white/70">
                    Srinagar, Jammu & Kashmir
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* Main 5-Column Grid for Mewa Masala Ghar */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
            {/* Col 1: Brand & Logo */}
            <div className="space-y-4">
              <Link to="/" className="inline-block bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs border border-white/15">
                <BrandLogoBadge size="md" className="brightness-110" />
              </Link>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Pure, unadulterated dry fruits, cold-ground spices, guilt-free roasted snacks and authentic stone-ground flours.
              </p>
              <div className="text-[11px] text-[#D9A441] font-serif italic">
                Pure • Natural • Wholesome
              </div>
              <p className="text-[11px] text-white/50">
                FSSAI Lic. No. <span className="font-mono text-white/80">{settings.fssai || '10021051000123'}</span>
              </p>
            </div>

            {/* Col 2: Shop */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#D9A441] mb-3.5 tracking-wide">
                Shop
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li>
                  <Link to="/shop?category=dry-fruits" className="hover:text-[#D9A441] transition-colors">
                    Dry Fruits
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=seeds-mixes" className="hover:text-[#D9A441] transition-colors">
                    Seeds
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=makhana" className="hover:text-[#D9A441] transition-colors">
                    Makhana
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=spices-seasonings" className="hover:text-[#D9A441] transition-colors">
                    Spices
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=specialty-flours" className="hover:text-[#D9A441] transition-colors">
                    Aataa (Flour)
                  </Link>
                </li>
                <li>
                  <Link to="/shop?combo=true" className="hover:text-[#D9A441] transition-colors">
                    Combo Packs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#D9A441] mb-3.5 tracking-wide">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li>
                  <Link to="/about" className="hover:text-[#D9A441] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/shop?featured=true" className="hover:text-[#D9A441] transition-colors">
                    Bestsellers
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#D9A441] transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-[#D9A441] transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#D9A441] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="hover:text-[#D9A441] transition-colors">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Our Sister Brand */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#D9A441] mb-3.5 tracking-wide">
                Our Sister Brand
              </h4>
              <div className="space-y-2">
                <div className="font-serif font-bold text-base text-white">
                  Jimmi Jaggu
                </div>
                <p className="text-xs text-emerald-100/75">
                  Baby • Skincare • Pregnancy
                </p>
                <div className="pt-2">
                  <Link
                    to="/jimmi-jaggu"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/30 hover:border-[#D9A441] text-xs font-semibold text-white hover:text-[#D9A441] transition-all bg-white/5 hover:bg-white/10"
                  >
                    <span>Visit Jimmi Jaggu</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Col 5: Get in Touch */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#D9A441] mb-3.5 tracking-wide">
                Get in Touch
              </h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                  <a
                    href={`tel:${(settings.phone || '+91 98200 12345').replace(/\s+/g, '')}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.phone || '+91 98200 12345'}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                  <a
                    href={`mailto:${settings.email || 'care@mewamasalaghar.com'}`}
                    className="hover:text-white transition-colors truncate"
                  >
                    {settings.email || 'care@mewamasalaghar.com'}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D9A441] shrink-0 mt-0.5" />
                  <span className="leading-tight text-white/70">
                    {settings.address || 'APMC Grain Market, Vashi, Navi Mumbai, India'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2026 {isJimmiJaggu ? 'Jimmi Jaggu' : 'Mewa Masala Ghar'}. All rights reserved.</p>

          {/* Social icons */}
          <div className="flex items-center gap-4 text-white/80">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#D9A441] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#D9A441] transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-[#D9A441] transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {isJimmiJaggu && (
              <span className="text-white/60 hidden sm:inline">
                A sister brand of Mewa Masala Ghar 🍃
              </span>
            )}
            {/* EverPeak Solutions Backlink */}
            <p className="text-white/75">
              Designed and Developed by{' '}
              <a
                href="https://everpeaksolutions.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D9A441] hover:text-[#f3c875] hover:underline font-semibold transition-colors"
              >
                EverPeak Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
