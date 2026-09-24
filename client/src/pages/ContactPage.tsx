import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, MessageCircle, ChevronDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const QUICK_FAQS = [
  {
    q: 'How do I track my dispatched order?',
    a: 'You can use the Track Order page with your MMG order number or click the direct tracking link sent to your registered email and mobile SMS.',
  },
  {
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'Yes! Cash on Delivery is available across 25,000+ Indian pincodes without any hidden surcharges on orders above ₹499.',
  },
  {
    q: 'Can I get custom corporate or festive gifting hampers?',
    a: 'Absolutely. We provide personalized dry fruit and makhana boxes for Diwali, weddings, and corporate occasions. Reach out via WhatsApp or email for custom quotes.',
  },
  {
    q: 'What makes your infant porridge 100% clean label?',
    a: 'Our Pratham Aahar blends contain 0% added sugar, 0% added salt, no artificial flavors, and no milk powders or maltodextrin. Only sprouted grains and real dry fruit powder.',
  },
];

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/91${settings.phone?.replace(/\D/g, '') || '9820012345'}?text=Hi%20Mewa%20Masala%20Ghar,%20I%20have%20an%20inquiry%20regarding%20my%20order/products`;

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-10 sm:py-14 space-y-14 pb-20">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-2.5">
        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">
          Customer Care & Bulk Gifting Inquiries
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900">
          We're Here to Assist You
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
          Have questions regarding dry fruit grading, baby food suitability, corporate gifting, or current orders? Our dedicated APMC team is ready to help.
        </p>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E7E0D0] p-6 sm:p-8 shadow-soft space-y-6">
            <h3 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              Get in Touch Directly
            </h3>

            {/* WhatsApp Quick Connect Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Chat with Us on WhatsApp</span>
            </a>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF6EC] border border-[#E7E0D0] text-[#2F5D3A] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Phone Support</span>
                <a
                  href={`tel:${settings.phone}`}
                  className="font-bold text-sm text-gray-900 hover:text-[#2F5D3A] transition-colors"
                >
                  {settings.phone}
                </a>
                <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>Mon - Sat, 9:00 AM - 7:00 PM IST</span>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-[#D9A441] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">Email Care</span>
                <a
                  href={`mailto:${settings.email}`}
                  className="font-bold text-sm text-gray-900 hover:text-[#2F5D3A] transition-colors break-all"
                >
                  {settings.email}
                </a>
                <p className="text-[11px] text-gray-400 mt-0.5">Replies guaranteed within 4 business hours</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">APMC Packaging Depot</span>
                <p className="font-semibold text-xs text-gray-800 leading-relaxed mt-0.5">
                  {settings.address}
                </p>
              </div>
            </div>

            {/* Regulatory FSSAI & GSTIN */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600 bg-[#FAF6EC]/60 p-4 rounded-2xl border border-[#E7E0D0]">
              <div className="flex items-center justify-between">
                <span>FSSAI License:</span>
                <strong className="text-gray-900">{settings.fssai}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>GSTIN:</span>
                <strong className="text-gray-900">{settings.gstin}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E7E0D0] p-6 sm:p-8 shadow-soft">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-[#2F5D3A] rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900">Message Received!</h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting Mewa Masala Ghar. A dedicated representative will review your query and connect back within 4 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', orderNumber: '', subject: '', message: '' });
                }}
                className="px-7 py-3 rounded-full bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white text-xs font-bold shadow-md transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-1 border-b border-gray-100 pb-3">
                Send Us an Online Inquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Aarav Sharma"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF6EC]/40 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aarav@example.com"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF6EC]/40 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF6EC]/40 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="MMG-2026-XXXX"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF6EC]/40 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Subject / Inquiry Type *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF6EC]/40 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white min-h-[44px]"
                >
                  <option value="">Select Topic...</option>
                  <option value="Order Tracking & Delivery">Order Tracking & Delivery</option>
                  <option value="Product Sourcing & Quality">Product Sourcing & Quality</option>
                  <option value="Baby Nutrition Advisory">Baby Nutrition Advisory</option>
                  <option value="Bulk / Festive Corporate Gifting">Bulk / Festive Corporate Gifting</option>
                  <option value="Billing & GST Invoice">Billing & GST Invoice</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our APMC customer care team assist you today?"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF6EC]/40 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Submit Inquiry</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Quick FAQ Accordion */}
      <div className="bg-white rounded-3xl border border-[#E7E0D0] p-6 sm:p-8 shadow-soft space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">Instant Answers</span>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Quick Assistance FAQ</h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {QUICK_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-serif font-bold text-sm sm:text-base text-gray-900 hover:text-[#2F5D3A] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ml-2 ${
                      isOpen ? 'rotate-180 text-[#2F5D3A]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
