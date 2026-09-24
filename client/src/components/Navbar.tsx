import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Heart,
  ChevronDown,
  LogOut,
  Package,
  UserCircle,
  MapPin,
  Compass,
} from 'lucide-react';
import { useTheme, StoreType } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import {
  LeafIcon,
  LotusIcon,
  MotherChildIcon,
  BrandLogoBadge,
} from './ui/Icons';

interface MegaMenuCategory {
  title: string;
  link: string;
  items: { name: string; link: string }[];
}

const STORE_MEGA_MENUS: Record<StoreType, MegaMenuCategory[]> = {
  foods: [
    {
      title: 'Dry Fruits & Nuts',
      link: '/shop?store=foods&category=dry-fruits',
      items: [
        { name: 'California Almonds', link: '/product/royal-california-badam-almonds' },
        { name: 'Kashmiri Walnuts', link: '/shop?store=foods&category=dry-fruits' },
        { name: 'Grade W240 Cashews', link: '/product/king-size-w240-kaju-cashews' },
        { name: 'Iranian Pistachios', link: '/shop?store=foods&category=dry-fruits' },
      ],
    },
    {
      title: 'Roasted Makhana & Seeds',
      link: '/shop?store=foods&category=seeds-mixes',
      items: [
        { name: 'Cream & Onion Makhana', link: '/shop?store=foods' },
        { name: 'Peri-Peri Makhana', link: '/shop?store=foods' },
        { name: 'Mint Punch Makhana', link: '/shop?store=foods' },
        { name: 'Raw Pumpkin & Chia Seeds', link: '/shop?store=foods&category=seeds-mixes' },
      ],
    },
    {
      title: 'Artisanal Spices & Combos',
      link: '/shop?store=foods&category=spices-seasonings',
      items: [
        { name: 'Cold-Ground Turmeric & Chili', link: '/shop?store=foods&category=spices-seasonings' },
        { name: 'Shahi Biryani Khada Masala', link: '/shop?store=foods&category=spices-seasonings' },
        { name: 'Combo Packs (Packs of 2, 4, 6)', link: '/shop?store=foods&category=dry-fruits-combos' },
        { name: 'Festive Hampers', link: '/shop?store=foods&category=dry-fruits-combos' },
      ],
    },
  ],
  baby: [
    {
      title: 'Pratham Aahar (6+ Months)',
      link: '/shop?store=baby&category=pratham-aahar',
      items: [
        { name: 'Sprouted Ragi & Almond Mix', link: '/shop?store=baby&category=pratham-aahar' },
        { name: 'Rice & Moong Porridge', link: '/shop?store=baby&category=pratham-aahar' },
        { name: 'Millets & Makhana Baby Food', link: '/shop?store=baby&category=pratham-aahar' },
      ],
    },
    {
      title: 'Daily Family Poshan',
      link: '/shop?store=baby&category=daily-poshan',
      items: [
        { name: "Women's Daily Nutrition Mix", link: '/shop?store=baby&category=daily-poshan' },
        { name: "Growing Kids Brain Boost", link: '/shop?store=baby&category=daily-poshan' },
        { name: "Elders' Bone & Joint Mix", link: '/shop?store=baby&category=daily-poshan' },
      ],
    },
    {
      title: 'Pregnancy & New Mother Care',
      link: '/shop?store=baby&category=pregnancy-care',
      items: [
        { name: 'Ayurvedic Laddoo Flour Mix', link: '/shop?store=baby&category=pregnancy-care' },
        { name: 'Maternal Iron & Calcium Boost', link: '/shop?store=baby&category=pregnancy-care' },
        { name: 'Herbal Postpartum Care', link: '/shop?store=baby&category=pregnancy-care' },
      ],
    },
  ],
  care: [
    {
      title: 'Natural Volcanic Clays',
      link: '/shop?store=care&category=multani-mitti-clays',
      items: [
        { name: '300-Mesh Multani Mitti Powder', link: '/shop?store=care&category=multani-mitti-clays' },
        { name: 'French Pink Clay', link: '/shop?store=care&category=multani-mitti-clays' },
        { name: 'Bentonite Healing Clay', link: '/shop?store=care&category=multani-mitti-clays' },
      ],
    },
    {
      title: 'Herbal Face & Body Packs',
      link: '/shop?store=care&category=rose-petal-herbal',
      items: [
        { name: 'Sun-Dried Rose Petal Powder', link: '/shop?store=care&category=rose-petal-herbal' },
        { name: 'Wild Kasturi Manjal Haldi', link: '/shop?store=care&category=rose-petal-herbal' },
        { name: 'Sandalwood & Orange Peel Mix', link: '/shop?store=care&category=rose-petal-herbal' },
      ],
    },
    {
      title: 'Dead Sea Minerals',
      link: '/shop?store=care&category=dead-sea-mud',
      items: [
        { name: 'Natural Dead Sea Mud Pack', link: '/shop?store=care&category=dead-sea-mud' },
        { name: 'Mineral Exfoliating Scrub', link: '/shop?store=care&category=dead-sea-mud' },
        { name: 'Pure Clay Face Masks', link: '/shop?store=care&category=dead-sea-mud' },
      ],
    },
  ],
};

export const Navbar: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { activeStore, setActiveStore } = useTheme();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<StoreType | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const storeRoutes: Record<StoreType, string> = {
    foods: '/foods',
    baby: '/baby-nutrition',
    care: '/personal-care',
  };

  // Clicking navigates directly to that store's separate landing page
  const handleStoreTabClick = (storeKey: StoreType) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveStore(storeKey);
    setActiveMegaMenu(null);
    navigate(storeRoutes[storeKey]);
  };

  // Hovering reveals the category options
  const handleStoreMouseEnter = (storeKey: StoreType) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(storeKey);
  };

  const handleStoreMouseLeave = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  const isStoreActive = (storeKey: StoreType) => {
    if (storeKey === 'foods' && (location.pathname === '/foods' || (activeStore === 'foods' && location.pathname === '/'))) return true;
    if (storeKey === 'baby' && (location.pathname === '/baby-nutrition' || activeStore === 'baby')) return true;
    if (storeKey === 'care' && (location.pathname === '/personal-care' || activeStore === 'care')) return true;
    return activeStore === storeKey;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EC] border-b border-[#E7E0D0] transition-colors duration-300">
      {/* 1. Announcement Bar (Deep Forest Green #1F4D2E) */}
      <div className="bg-[#1F4D2E] text-white text-xs py-2 px-2 sm:px-4 lg:px-6 xl:px-8 font-medium tracking-wide">
        <div className="w-full mx-auto flex justify-between items-center">
          {/* Centered Offer Text flanked by gold leaf icons */}
          <div className="mx-auto flex items-center gap-2 text-center text-xs sm:text-sm font-semibold">
            <LeafIcon className="w-4 h-4 text-[#D9A441] hidden sm:inline" color="#D9A441" />
            <span>Free shipping above ₹{settings.free_shipping_threshold || '499'}</span>
            <span className="text-white/40">|</span>
            <span>100% Veg</span>
            <span className="text-white/40">|</span>
            <span>FSSAI Certified</span>
            <LeafIcon className="w-4 h-4 text-[#D9A441] hidden sm:inline" color="#D9A441" />
          </div>

          {/* Right end text links on desktop */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-white/80">
            <Link to="/about" className="hover:text-[#D9A441] transition-colors">
              About Us
            </Link>
            <span className="text-white/40">•</span>
            <Link to="/contact" className="hover:text-[#D9A441] transition-colors">
              Contact Us
            </Link>
            <span className="text-white/40">•</span>
            <Link to="/track-order" className="hover:text-[#D9A441] transition-colors font-medium">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header on Ivory Canvas */}
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo Badge */}
          <Link to="/" className="shrink-0 transition-transform duration-200 hover:scale-102">
            <BrandLogoBadge size="md" />
          </Link>

          {/* Center Pill Search Bar with round gold search button */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block mx-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dry fruits, seeds, makhana..."
                className="w-full pl-5 pr-14 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E0D0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] text-[#2B2B2B] placeholder-gray-400 shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 w-8 h-8 rounded-full bg-[#D9A441] hover:bg-[#C28E31] text-[#1F4D2E] flex items-center justify-center transition-colors shadow-xs"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4 text-[#1F4D2E]" />
              </button>
            </div>
          </form>

          {/* Right Action Icons with Small Labels Below */}
          <div className="flex items-center gap-3.5 sm:gap-6">
            {/* Home Page Button */}
            <Link
              to="/"
              className={`flex flex-col items-center transition-colors group ${
                location.pathname === '/' ? 'text-[#2F5D3A]' : 'text-gray-700 hover:text-[#2F5D3A]'
              }`}
              aria-label="Home"
            >
              <div className="relative">
                <Home
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    location.pathname === '/' ? 'text-[#2F5D3A]' : 'text-gray-700 group-hover:text-[#2F5D3A]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-semibold mt-0.5 ${
                  location.pathname === '/' ? 'text-[#2F5D3A] font-bold' : 'text-gray-600'
                }`}
              >
                Home
              </span>
            </Link>

            {/* User Account / Login */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex flex-col items-center text-gray-700 hover:text-[#2F5D3A] transition-colors group"
                  aria-label="Account menu"
                >
                  <UserIcon className="w-5 h-5 text-gray-700 group-hover:text-[#2F5D3A]" />
                  <span className="text-[10px] font-semibold mt-0.5 text-gray-600">Account</span>
                </button>

                {/* Account Dropdown */}
                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E7E0D0] py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Namaste,</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/account?tab=profile"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#2F5D3A]"
                      >
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        <span>My Account</span>
                      </Link>
                      <Link
                        to="/account?tab=orders"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#2F5D3A]"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/track-order"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#2F5D3A]"
                      >
                        <Compass className="w-4 h-4 text-gray-400" />
                        <span>Track Order</span>
                      </Link>
                      <Link
                        to="/account?tab=addresses"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#2F5D3A]"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Saved Addresses</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex flex-col items-center text-gray-700 hover:text-[#2F5D3A] transition-colors group"
                aria-label="Sign in"
              >
                <UserIcon className="w-5 h-5 text-gray-700 group-hover:text-[#2F5D3A]" />
                <span className="text-[10px] font-semibold mt-0.5 text-gray-600">Account</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/account?tab=wishlist"
              className="flex flex-col items-center text-gray-700 hover:text-rose-600 transition-colors relative group"
              aria-label="Wishlist"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-gray-700 group-hover:text-rose-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold mt-0.5 text-gray-600">Wishlist</span>
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center text-gray-700 hover:text-[#2F5D3A] transition-colors relative group"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-[#2F5D3A]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#D9A441] text-[#1F4D2E] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold mt-0.5 text-gray-600">Cart</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#2F5D3A] rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 3. Three Rounded Store Tabs with Icons & Chevrons (Directly under header) */}
        <div
          className="relative pb-3"
          ref={megaMenuRef}
          onMouseLeave={handleStoreMouseLeave}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none py-1">
            {/* Quick Home Tab Button */}
            <Link
              to="/"
              className={`py-2.5 px-4 sm:px-5 rounded-full flex items-center gap-2 text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs shrink-0 cursor-pointer ${
                location.pathname === '/'
                  ? 'bg-[#1F4D2E] text-white ring-2 ring-[#D9A441]'
                  : 'bg-white border border-[#E7E0D0] text-[#1F4D2E] hover:bg-[#FAF6EC]'
              }`}
              title="Return to Home"
            >
              <Home className="w-4 h-4 text-[#D9A441]" />
              <span>Home</span>
            </Link>
            {/* Tab 1: Mewa & Healthy Foods */}
            <button
              onClick={() => handleStoreTabClick('foods')}
              onMouseEnter={() => handleStoreMouseEnter('foods')}
              className={`flex-1 min-w-[240px] py-2.5 px-5 rounded-full flex items-center justify-between text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs cursor-pointer ${
                isStoreActive('foods')
                  ? 'bg-[#2F5D3A] text-white ring-2 ring-[#D9A441]'
                  : 'bg-[#2F5D3A]/90 hover:bg-[#2F5D3A] text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <LeafIcon className="w-4 h-4 text-[#D9A441]" color="#D9A441" />
                <span>Mewa & Healthy Foods</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeMegaMenu === 'foods' ? 'rotate-180 text-[#D9A441]' : 'text-white/70'
                }`}
              />
            </button>

            {/* Tab 2: Baby & Family Nutrition */}
            <button
              onClick={() => handleStoreTabClick('baby')}
              onMouseEnter={() => handleStoreMouseEnter('baby')}
              className={`flex-1 min-w-[240px] py-2.5 px-5 rounded-full flex items-center justify-between text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs cursor-pointer ${
                isStoreActive('baby')
                  ? 'bg-[#5DB4D6] text-white ring-2 ring-[#2C8CAE]'
                  : 'bg-[#5DB4D6]/90 hover:bg-[#5DB4D6] text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <MotherChildIcon className="w-4 h-4 text-white" color="#FFFFFF" />
                <span>Baby & Family Nutrition</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeMegaMenu === 'baby' ? 'rotate-180 text-white' : 'text-white/70'
                }`}
              />
            </button>

            {/* Tab 3: Personal Care */}
            <button
              onClick={() => handleStoreTabClick('care')}
              onMouseEnter={() => handleStoreMouseEnter('care')}
              className={`flex-1 min-w-[240px] py-2.5 px-5 rounded-full flex items-center justify-between text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs cursor-pointer ${
                isStoreActive('care')
                  ? 'bg-[#E0808C] text-white ring-2 ring-[#C26371]'
                  : 'bg-[#E0808C]/90 hover:bg-[#E0808C] text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <LotusIcon className="w-4 h-4 text-white" color="#FFFFFF" />
                <span>Personal Care</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeMegaMenu === 'care' ? 'rotate-180 text-white' : 'text-white/70'
                }`}
              />
            </button>
          </div>

          {/* Mega-Menu Dropdown Panel */}
          {activeMegaMenu && (
            <div
              onMouseEnter={() => {
                if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
              }}
              onMouseLeave={handleStoreMouseLeave}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-[#E7E0D0] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STORE_MEGA_MENUS[activeMegaMenu].map((col, idx) => (
                  <div key={idx} className="space-y-3">
                    <Link
                      to={col.link}
                      onClick={() => setActiveMegaMenu(null)}
                      className="font-serif font-bold text-sm text-[#1F4D2E] hover:text-[#D9A441] transition-colors block border-b border-gray-100 pb-2"
                    >
                      {col.title}
                    </Link>
                    <ul className="space-y-2">
                      {col.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <Link
                            to={item.link}
                            onClick={() => setActiveMegaMenu(null)}
                            className="text-xs text-gray-600 hover:text-[#2F5D3A] hover:translate-x-1 transition-all block"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E0D0] bg-[#FAF6EC] px-4 py-4 space-y-4 shadow-lg">
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 text-xs bg-white border border-[#E7E0D0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
              />
              <button
                type="submit"
                className="absolute right-1.5 w-7 h-7 rounded-full bg-[#D9A441] text-[#1F4D2E] flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`col-span-2 p-2.5 rounded-xl text-center font-bold flex items-center justify-center gap-2 transition-colors border ${
                location.pathname === '/'
                  ? 'bg-[#2F5D3A] text-white border-[#2F5D3A]'
                  : 'bg-white text-[#2F5D3A] hover:bg-[#FAF6EC] border-[#E7E0D0]'
              }`}
            >
              <Home className="w-4 h-4 text-[#D9A441]" />
              <span>Home Page</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white rounded-xl text-center text-gray-700 hover:bg-gray-50 border border-gray-100"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white rounded-xl text-center text-gray-700 hover:bg-gray-50 border border-gray-100"
            >
              Contact Us
            </Link>
            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white rounded-xl text-center text-[#2F5D3A] font-bold hover:bg-gray-50 border border-gray-100"
            >
              Track Order
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white rounded-xl text-center text-gray-700 hover:bg-gray-50 border border-gray-100"
            >
              Full Cart ({itemCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
