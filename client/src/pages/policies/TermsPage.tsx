import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldAlert, CheckCircle2, Scale } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const POLICY_LINKS = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Shipping & Delivery', path: '/shipping-policy' },
  { label: 'Returns & Refunds', path: '/returns-policy' },
  { label: 'Frequently Asked Questions', path: '/faq' },
];

export const TermsPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-10 sm:py-14 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">
          Legal & Conditions
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-1">Terms of Service</h1>
        <p className="text-xs text-gray-500 mt-1">Statutory Commercial Terms • Last updated: January 2026</p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {POLICY_LINKS.map((link) => {
          const isActive = link.path === '/terms';
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
            <FileText className="w-5 h-5 text-[#2F5D3A]" />
            <span>1. Agreement to Terms</span>
          </h2>
          <p>
            By accessing or purchasing from {settings.company_name} ("MMG"), you agree to be bound by these Terms of Service, all applicable laws and regulations of the Republic of India, and agree that you are responsible for compliance with any applicable local statutory requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#2F5D3A]" />
            <span>2. Product Pricing & Tax Compliance</span>
          </h2>
          <p>
            All prices listed on the platform are in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST) at statutory rates. {settings.company_name} complies with all applicable commercial taxation guidelines. Official tax invoices are generated for every completed purchase.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#2F5D3A]" />
            <span>3. Product Disclaimers & Department Advisories</span>
          </h2>
          <p>
            The products offered across our three stores are traditional agricultural commodities, dietary infant blends, and natural mineral clays:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong className="text-gray-900">Mewa & Healthy Foods:</strong> Packed under strict hygienic standards. May contain tree nut allergens. Store in airtight jars.</li>
            <li><strong className="text-gray-900">Baby & Family Nutrition:</strong> Intended as complementary solid food weaning. Not a replacement for mother's milk. Consult a certified pediatrician before introduction.</li>
            <li><strong className="text-gray-900">Personal Care & Clays:</strong> External cosmetic use only. Perform a behind-the-ear patch test before full application.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-[#2F5D3A]" />
            <span>4. Governing Jurisdiction</span>
          </h2>
          <p>
            Any dispute, claim, or controversy arising out of purchases from {settings.company_name} shall be governed by the laws of India, under the exclusive jurisdiction of the competent courts in Mumbai / Thane, Maharashtra.
          </p>
        </section>
      </div>
    </div>
  </div>
  );
};
