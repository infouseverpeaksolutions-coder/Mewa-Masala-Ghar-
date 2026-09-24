import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { BrandLogoBadge, JaaliBorder } from './ui/Icons';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#183B23] text-gray-200 relative pt-0 pb-10 overflow-hidden">
      {/* 1. Scalloped / Jaali Pattern Border Strip across top */}
      <div className="w-full overflow-hidden">
        <JaaliBorder className="w-full h-3 text-[#1F4D2E]" color="#1F4D2E" />
      </div>

      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogoBadge size="lg" />
            </Link>

            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              Mewa Masala Ghar is an authentic Indian purveyor of sun-cured dry fruits, cold-ground spices, guilt-free roasted makhana, sprouted first foods for babies, and pure volcanic mineral clays.
            </p>

            <p className="text-[11px] text-[#D9A441] font-serif italic">
              Goodness from Nature • Rooted in Tradition
            </p>

            {/* FSSAI Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
              <span className="text-[11px] text-gray-300">
                FSSAI Lic. No. <strong className="text-white font-mono">{settings.fssai || '10021051000123'}</strong>
              </span>
            </div>
          </div>

          {/* Store 1: Mewa & Healthy Foods */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#D9A441] mb-3 uppercase tracking-wider">
              Mewa & Healthy Foods
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/shop?store=foods&category=dry-fruits" className="hover:text-white transition-colors">
                  Dry Fruits
                </Link>
              </li>
              <li>
                <Link to="/shop?store=foods&category=seeds-mixes" className="hover:text-white transition-colors">
                  Seeds & Mixes
                </Link>
              </li>
              <li>
                <Link to="/shop?store=foods" className="hover:text-white transition-colors">
                  Flavoured Makhana
                </Link>
              </li>
              <li>
                <Link to="/shop?store=foods&category=spices-seasonings" className="hover:text-white transition-colors">
                  Artisanal Spices
                </Link>
              </li>
              <li>
                <Link to="/shop?combo=true" className="hover:text-white transition-colors">
                  Combo Packs (2/4/6)
                </Link>
              </li>
              <li>
                <Link to="/shop?store=foods" className="hover:text-white transition-colors">
                  Nutrition Essentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Store 2: Baby & Family Nutrition */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#5DB4D6] mb-3 uppercase tracking-wider">
              Baby & Family
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/shop?store=baby&category=pratham-aahar" className="hover:text-white transition-colors">
                  Pratham Aahar (6+ Mo)
                </Link>
              </li>
              <li>
                <Link to="/shop?store=baby&category=daily-poshan" className="hover:text-white transition-colors">
                  Daily Poshan
                </Link>
              </li>
              <li>
                <Link to="/shop?store=baby&category=pregnancy-care" className="hover:text-white transition-colors">
                  Pregnancy Diet
                </Link>
              </li>
              <li>
                <Link to="/shop?store=baby&category=daily-poshan" className="hover:text-white transition-colors">
                  Elders' Diet
                </Link>
              </li>
              <li>
                <Link to="/shop?store=baby" className="hover:text-white transition-colors">
                  Family Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Store 3: Personal Care */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#E0808C] mb-3 uppercase tracking-wider">
              Personal Care
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/shop?store=care&category=multani-mitti-clays" className="hover:text-white transition-colors">
                  Premium Multani Mitti
                </Link>
              </li>
              <li>
                <Link to="/shop?store=care&category=multani-mitti-clays" className="hover:text-white transition-colors">
                  Pink Multani
                </Link>
              </li>
              <li>
                <Link to="/shop?store=care&category=dead-sea-mud" className="hover:text-white transition-colors">
                  Dead Sea Mud
                </Link>
              </li>
              <li>
                <Link to="/shop?store=care&category=rose-petal-herbal" className="hover:text-white transition-colors">
                  Herbal Body Care
                </Link>
              </li>
              <li>
                <Link to="/shop?store=care" className="hover:text-white transition-colors">
                  Clay Hair Masks
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Statutory Column */}
          <div>
            <h4 className="font-serif font-bold text-sm text-white mb-3 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                <a href={`tel:${(settings.phone || '+91 98200 12345').replace(/\s+/g, '')}`} className="hover:text-white">
                  {settings.phone || '+91 98200 12345'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                <a href={`mailto:${settings.email || 'care@mewamasalaghar.com'}`} className="hover:text-white truncate">
                  {settings.email || 'care@mewamasalaghar.com'}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D9A441] shrink-0 mt-0.5" />
                <span className="leading-tight text-gray-400">
                  {settings.address || 'APMC Grain Market, Navi Mumbai, India'}
                </span>
              </li>
            </ul>

            {/* Payment & Security icons */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">
                We Accept Securely
              </span>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-white">UPI</span>
                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-white">VISA</span>
                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-white">Mastercard</span>
                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-white">RuPay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Social Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Mewa Masala Ghar Private Limited. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
