import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { BrandLogoBadge } from './ui/Icons';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#1F4D2E] text-white pt-12 pb-20 md:pb-12 border-t border-white/10">
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        {/* Main 5-Column Grid */}
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

        {/* Bottom Strip: Copyright, Socials & Payments */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2025 Mewa Masala Ghar. All rights reserved.</p>

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

          {/* Payment badges */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/50 hidden sm:inline">Follow Us:</span>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-white tracking-wider">VISA</span>
              <span className="text-white/30">•</span>
              <span className="text-[10px] font-bold text-white tracking-wider">Mastercard</span>
              <span className="text-white/30">•</span>
              <span className="text-[10px] font-bold text-white tracking-wider">RuPay</span>
              <span className="text-white/30">•</span>
              <span className="text-[10px] font-bold text-white tracking-wider">UPI</span>
              <span className="text-white/30">•</span>
              <span className="text-[10px] font-bold text-[#D9A441] tracking-wider">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
