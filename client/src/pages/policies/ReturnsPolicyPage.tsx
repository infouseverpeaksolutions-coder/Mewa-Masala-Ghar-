import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, AlertCircle, CheckCircle2, ShieldCheck, Phone, Mail } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const POLICY_LINKS = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Shipping & Delivery', path: '/shipping-policy' },
  { label: 'Returns & Refunds', path: '/returns-policy' },
  { label: 'Frequently Asked Questions', path: '/faq' },
];

export const ReturnsPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-10 sm:py-14 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">
          Customer Assurance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-1">Returns & Replacement Policy</h1>
        <p className="text-xs text-gray-500 mt-1">100% Quality & Freshness Guarantee • Last updated: January 2026</p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {POLICY_LINKS.map((link) => {
          const isActive = link.path === '/returns-policy';
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#2F5D3A] text-white shadow-xs'
                  : 'bg-white border border-[#E7E0D0] text-gray-700 hover:bg-[#FAF6EC]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-[#E7E0D0] p-6 sm:p-10 shadow-soft space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-[#2F5D3A]" />
            <span>1. Perishable Food & Hygiene Standards</span>
          </h2>
          <p>
            Due to the hygienic nature of food items (dry fruits, nuts, makhana, spices, and infant baby nutrition) and cosmetic clays, products once delivered and unsealed cannot be returned for resale under statutory food safety and consumer hygiene guidelines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#2F5D3A]" />
            <span>2. Hassle-Free 7-Day Replacement Guarantee</span>
          </h2>
          <p>
            We take supreme pride in our packaging integrity. If you receive an item that satisfies any of the following criteria, {settings.company_name} will issue an <strong className="text-gray-900 font-bold">immediate 100% free replacement or full refund</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li>Damaged, crushed, or compromised vacuum seal upon courier doorstep arrival.</li>
            <li>Incorrect variant, weight, or missing items from your consignment.</li>
            <li>Expired batch or sensory defect (unusual odor, discoloration).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#2F5D3A]" />
            <span>3. How to Initiate a Replacement Request</span>
          </h2>
          <p>
            To initiate a replacement, kindly report the issue within <strong className="text-gray-900 font-bold">7 days of delivery</strong>:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Take 1-2 clear photographs showing the shipping label, batch number, and condition of the affected item.</li>
            <li>Email our support team at <a href={`mailto:${settings.email}`} className="text-[#2F5D3A] underline font-bold">{settings.email}</a> or connect via WhatsApp at <a href={`tel:${settings.phone}`} className="text-[#2F5D3A] underline font-bold">{settings.phone}</a> with your Order ID.</li>
            <li>Our operations team will verify the claim and dispatch a replacement package within 24 hours at zero additional cost.</li>
          </ol>
        </section>
      </div>
    </div>
  </div>
  );
};
