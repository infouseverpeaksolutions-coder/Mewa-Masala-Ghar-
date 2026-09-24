import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const POLICY_LINKS = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Shipping & Delivery', path: '/shipping-policy' },
  { label: 'Returns & Refunds', path: '/returns-policy' },
  { label: 'Frequently Asked Questions', path: '/faq' },
];

export const ShippingPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-10 sm:py-14 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">
          Fulfillment & Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-1">Shipping & Delivery Policy</h1>
        <p className="text-xs text-gray-500 mt-1">Pan-India Express Dispatch • Last updated: January 2026</p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {POLICY_LINKS.map((link) => {
          const isActive = link.path === '/shipping-policy';
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
            <Truck className="w-5 h-5 text-[#2F5D3A]" />
            <span>1. Pan-India Delivery Network</span>
          </h2>
          <p>
            {settings.company_name} ships to over 25,000+ postal pin codes across all 28 states and union territories of India through premier logistics partners including Blue Dart, Delhivery, Xpressbees, and India Post Speed Post.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#2F5D3A]" />
            <span>2. Processing & Dispatch Timelines</span>
          </h2>
          <p>
            All confirmed orders are processed, nitrogen-sealed, and dispatched from our APMC central hub within <strong className="text-gray-900 font-bold">24 business hours</strong> (excluding Sundays and national holidays).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong className="text-gray-900">Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune, Kolkata):</strong> 2 to 4 business days.</li>
            <li><strong className="text-gray-900">Tier 2 & Tier 3 Cities:</strong> 3 to 6 business days.</li>
            <li><strong className="text-gray-900">North-East, J&K, Remote Pincodes:</strong> 5 to 8 business days.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#2F5D3A]" />
            <span>3. Shipping Rates & Free Delivery</span>
          </h2>
          <p>
            Orders with a cart value of <strong className="text-gray-900 font-bold">₹{settings.free_shipping_threshold || 499} or more qualify for 100% FREE Standard Shipping</strong> across India. For orders below ₹{settings.free_shipping_threshold || 499}, a nominal shipping fee of ₹{settings.standard_delivery_fee || 50} is applied at checkout.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-[#2F5D3A]" />
            <span>4. Real-Time Consignment Tracking</span>
          </h2>
          <p>
            Once your package is handed over to the courier partner, an automated dispatch notification with your AWB tracking link is triggered via email and SMS. You can also monitor your shipment live on our dedicated <Link to="/track-order" className="text-[#2F5D3A] underline font-bold">Track Order</Link> page by entering your order number.
          </p>
        </section>
      </div>
    </div>
  </div>
  );
};
