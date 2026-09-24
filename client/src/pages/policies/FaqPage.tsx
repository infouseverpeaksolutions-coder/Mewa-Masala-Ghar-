import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const POLICY_LINKS = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Shipping & Delivery', path: '/shipping-policy' },
  { label: 'Returns & Refunds', path: '/returns-policy' },
  { label: 'Frequently Asked Questions', path: '/faq' },
];

const FAQS: FaqItem[] = [
  {
    category: 'Foods & Dry Fruits',
    question: 'How do you ensure the freshness of your dry fruits without chemical preservatives?',
    answer:
      'We use food-grade nitrogen-flushed multilayer zipper pouches. By replacing residual oxygen with inert nitrogen, we prevent oil oxidation and rancidity naturally, keeping our almonds, cashews, and walnuts crisp and nutrient-rich for months without chemical sulfur fumigation.',
  },
  {
    category: 'Foods & Dry Fruits',
    question: 'What is the grade of your Cashews and California Almonds?',
    answer:
      'Our single-origin cashews are Grade W240 (large, pristine white kernels, zero insect damage). Our almonds are premium nonpareil California crops, sorted for uniform kernel size and high natural vitamin E content.',
  },
  {
    category: 'Foods & Dry Fruits',
    question: 'What is the curcumin percentage in your Salem Turmeric?',
    answer:
      'Our Salem Haldi is stone-ground from selected rhizomes testing at an impressive 5%+ natural curcumin content, compared to commercial supermarket turmeric which often tests below 2-3% after solvent extraction.',
  },
  {
    category: 'Baby & Family Nutrition',
    question: 'From what age can my infant start eating Pratham Aahar?',
    answer:
      'Our Pratham Aahar Sprouted Ragi & Almond blend is specifically formulated for babies 6 months and older who are beginning their solid food weaning journey. Always consult your pediatrician before introducing any new solid food.',
  },
  {
    category: 'Baby & Family Nutrition',
    question: 'Does the baby food contain any added sugar, salt, or milk solids?',
    answer:
      'No. Our baby formulations contain 0% added refined sugar, 0% added salt, no artificial flavors, and no milk powders or maltodextrin. It is 100% natural sprouted grains and dry fruit powder.',
  },
  {
    category: 'Personal Care & Clays',
    question: 'Why is your Multani Mitti called "Export Quality"?',
    answer:
      'Our Multani Mitti is sourced from the pristine volcanic geological beds of Barmer, Rajasthan. It undergoes traditional sun-purification followed by micro-mesh 300-mesh triple sifting. It produces an ultra-silky, clump-free paste with zero coarse grit or sand particles.',
  },
  {
    category: 'Personal Care & Clays',
    question: 'Should I do a patch test before applying the clay masks?',
    answer:
      'Yes! Even though our clays are 100% natural and free of chemical bleaches, pure volcanic earth contains active natural minerals. We recommend applying a coin-sized paste behind your ear for 15 minutes to ensure suitability with your individual skin profile.',
  },
  {
    category: 'Orders & Shipping',
    question: 'What is your free shipping threshold and delivery timeline?',
    answer:
      'Orders above ₹499 qualify for 100% FREE delivery across India. Metro cities are delivered within 2-4 business days, while other destinations take 3-6 business days.',
  },
  {
    category: 'Orders & Shipping',
    question: 'Is Cash on Delivery (COD) available?',
    answer:
      'Yes, Cash on Delivery is available across 25,000+ Indian postal pin codes for your convenience.',
  },
];

export const FaqPage: React.FC = () => {
  const { settings } = useSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Foods & Dry Fruits', 'Baby & Family Nutrition', 'Personal Care & Clays', 'Orders & Shipping'];

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-10 sm:py-14 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A441]">
          Help & Answers
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Everything you need to know about our sourcing, infant nutrition, mineral clays, and delivery.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {POLICY_LINKS.map((link) => {
          const isActive = link.path === '/faq';
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

      {/* Category Filter Chips */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#D9A441] text-white shadow-xs'
                : 'bg-[#FAF6EC] text-gray-700 border border-[#E7E0D0] hover:bg-[#EFE8D6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white rounded-3xl border border-[#E7E0D0] p-6 sm:p-8 shadow-soft divide-y divide-[#E7E0D0]">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-5 first:pt-0 last:pb-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 group"
              >
                <span className="font-serif text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#2F5D3A] transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${
                    isOpen ? 'rotate-180 text-[#2F5D3A]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed bg-[#FAF6EC]/50 p-4 rounded-2xl border border-[#E7E0D0] animate-in fade-in duration-200">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="p-6 bg-[#FAF6EC] rounded-3xl border border-[#E7E0D0] text-center space-y-3">
        <h3 className="font-serif text-lg font-bold text-gray-900">Still have questions?</h3>
        <p className="text-xs text-gray-600 max-w-sm mx-auto">
          Can't find the answer you're looking for? Please reach out to our friendly customer support team.
        </p>
        <Link
          to="/contact-us"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white text-xs font-bold shadow-xs transition-all"
        >
          Contact Support Team
        </Link>
      </div>
    </div>
  </div>
  );
};
