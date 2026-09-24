import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck, Eye, Server, FileText, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const POLICY_LINKS = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Shipping & Delivery', path: '/shipping-policy' },
  { label: 'Returns & Refunds', path: '/returns-policy' },
  { label: 'Frequently Asked Questions', path: '/faq' },
];

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-10 sm:py-14 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">
          Legal & Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-1">Privacy Policy</h1>
        <p className="text-xs text-gray-500 mt-1">DPDP Act (India) 2023 Compliant • Last updated: January 2026</p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {POLICY_LINKS.map((link) => {
          const isActive = link.path === '/privacy-policy';
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
            <Lock className="w-5 h-5 text-[#2F5D3A]" />
            <span>1. Introduction & Statutory Scope</span>
          </h2>
          <p>
            {settings.company_name} ("we", "our", or "MMG") is committed to safeguarding your personal data in accordance with the Digital Personal Data Protection (DPDP) Act, 2023 of India. This Privacy Policy details how we collect, store, and utilize your personal information when you visit or make purchases across our three stores.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-[#2F5D3A]" />
            <span>2. Information We Collect</span>
          </h2>
          <p>When you register, place an order, or browse our storefront, we collect:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong className="text-gray-900">Identity & Contact:</strong> Full name, delivery postal address, email address, and 10-digit Indian mobile number.</li>
            <li><strong className="text-gray-900">Payment & Transaction Data:</strong> Payment method selected, Razorpay transaction identifier, and order invoice breakdown. We never store raw credit/debit card numbers or UPI PINs on our servers.</li>
            <li><strong className="text-gray-900">Device & Usage:</strong> IP address, browser type, and anonymous cookies to maintain shopping cart sessions.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <Server className="w-5 h-5 text-[#2F5D3A]" />
            <span>3. How Your Data is Used</span>
          </h2>
          <p>We use your information exclusively to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li>Process, vacuum-pack, and deliver your food, infant nutrition, and personal care consignments.</li>
            <li>Generate GST-compliant tax invoices as required under Indian commercial taxation laws.</li>
            <li>Transmit real-time shipment dispatch tracking notifications via email and SMS.</li>
            <li>Prevent duplicate orders, identity theft, and fraudulent transactions.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#2F5D3A]" />
            <span>4. Data Sharing & Security Guarantee</span>
          </h2>
          <p>
            We will never sell, rent, or trade your personal data to third-party marketing brokers. Data is shared strictly with verified operational partners: licensed logistics carriers (Blue Dart, Delhivery) for doorstep fulfillment, and PCI-DSS certified payment gateways (Razorpay) for processing transactions.
          </p>
        </section>
      </div>
    </div>
  </div>
  );
};
