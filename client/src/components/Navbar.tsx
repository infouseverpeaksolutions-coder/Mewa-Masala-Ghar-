import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  UserCircle,
  MapPin,
  Compass,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { LeafIcon, BrandLogoBadge } from './ui/Icons';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const isJimmiJaggu = location.pathname.startsWith('/jimmi-jaggu');

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navItemClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-xs lg:text-[13px] font-semibold transition-colors duration-200 cursor-pointer ${
      isActive
        ? 'text-[#1F4D2E] dark:text-[#8ED9A0] font-bold'
        : 'text-[#2B2B2B] dark:text-[#E2DDD3] hover:text-[#1F4D2E] dark:hover:text-[#E5B85C]'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EC] dark:bg-[#111813] border-b border-[#E7E0D0] dark:border-[#243529] transition-colors duration-300">
      {/* 
        ========================================================================
        1. ANNOUNCEMENT BAR (Deep Forest Green #1F4D2E)
        "🌿 Free shipping above ₹499 | 100% Veg | FSSAI Certified 🌿"
        ========================================================================
      */}
      <div className="bg-[#1F4D2E] text-white text-xs py-2 px-2 sm:px-4 lg:px-6 font-medium tracking-wide">
        <div className="w-full mx-auto flex items-center justify-center relative">
          {/* Back link when inside /jimmi-jaggu */}
          {isJimmiJaggu && (
            <Link
              to="/"
              className="absolute left-0 text-[11px] text-[#D9A441] hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Mewa Masala Ghar</span>
            </Link>
          )}

          {/* Centered Offer Text flanked by gold leaf icons */}
          <div className="flex items-center gap-2 text-center text-xs sm:text-[13px] font-semibold">
            <LeafIcon className="w-3.5 h-3.5 text-[#D9A441]" color="#D9A441" />
            <span>Free shipping above ₹{settings.free_shipping_threshold || '499'}</span>
            <span className="text-white/40">|</span>
            <span>100% Veg</span>
            <span className="text-white/40">|</span>
            <span>FSSAI Certified</span>
            <LeafIcon className="w-3.5 h-3.5 text-[#D9A441]" color="#D9A441" />
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        2. MAIN HEADER (Ivory Background #FAF6EC)
        Logo Left | Nav Links Center | Search, Account, Cart Icons Right
        ========================================================================
      */}
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo on Left */}
          <div className="flex items-center gap-3 shrink-0">
            {isJimmiJaggu ? (
              <Link to="/jimmi-jaggu" className="flex items-center gap-2.5">
                <img
                  src="/brands/jimmi_jaggu_logo.png"
                  alt="Jimmi Jaggu"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain bg-white p-1 shadow-sm border border-[#D9A9A0]"
                />
                <div>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#2A2A2A] tracking-tight block">
                    Jimmi Jaggu
                  </span>
                  <span className="text-[10px] font-serif italic text-[#8C6D37] block -mt-0.5">
                    From Our Store to Your Home
                  </span>
                </div>
              </Link>
            ) : (
              <Link to="/" className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
                <BrandLogoBadge size="md" />
              </Link>
            )}
          </div>

          {/* Nav Links in Center (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 select-none">
            {/* Home */}
            <Link to="/" className={navItemClass('/')}>
              Home
            </Link>

            {/* Shop (with dropdown) */}
            <div className="relative" ref={shopRef}>
              <button
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className={`flex items-center gap-1 ${navItemClass('/shop')}`}
              >
                <span>Shop</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E7E0D0] py-2 z-50 animate-in fade-in duration-150">
                  <Link
                    to="/shop"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    All Products
                  </Link>
                  <Link
                    to="/shop?category=dry-fruits"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    Dry Fruits
                  </Link>
                  <Link
                    to="/shop?category=seeds-mixes"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    Seeds & Mixes
                  </Link>
                  <Link
                    to="/shop?category=makhana"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    Flavoured Makhana
                  </Link>
                  <Link
                    to="/shop?category=spices-seasonings"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    Spices
                  </Link>
                  <Link
                    to="/shop?category=specialty-flours"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    Aataa (Flour)
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <Link
                    to="/shop?combo=true"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-[#8C6D37] hover:bg-[#FAF6EC]"
                  >
                    Combo Packs (2/4/6)
                  </Link>
                </div>
              )}
            </div>

            {/* Categories (with dropdown) */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`flex items-center gap-1 ${navItemClass('/categories')}`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E7E0D0] py-2 z-50 animate-in fade-in duration-150">
                  <Link
                    to="/shop?category=dry-fruits"
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#1F4D2E]" />
                    <span>Dry Fruits</span>
                  </Link>
                  <Link
                    to="/shop?category=seeds-mixes"
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#1F4D2E]" />
                    <span>Seeds</span>
                  </Link>
                  <Link
                    to="/shop?category=makhana"
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#1F4D2E]" />
                    <span>Makhana</span>
                  </Link>
                  <Link
                    to="/shop?category=spices-seasonings"
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#1F4D2E]" />
                    <span>Spices</span>
                  </Link>
                  <Link
                    to="/shop?category=specialty-flours"
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-[#FAF6EC] hover:text-[#1F4D2E]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#1F4D2E]" />
                    <span>Aataa (Flour)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Bestsellers */}
            <Link to="/shop?featured=true" className={navItemClass('/shop?featured=true')}>
              Bestsellers
            </Link>

            {/* About Us */}
            <Link to="/about" className={navItemClass('/about')}>
              About Us
            </Link>

            {/* Contact */}
            <Link to="/contact" className={navItemClass('/contact')}>
              Contact
            </Link>
          </nav>

          {/* Right Action Icons: Theme Toggle, Search, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Theme Toggle Button (Light / Dark / Auto) */}
            <ThemeToggle variant="navbar" />

            {/* Search Icon / Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-[#1F4D2E] dark:hover:text-[#E5B85C] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#2B2B2B] dark:text-[#E2DDD3]" />
            </button>

            {/* User Account Icon */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:text-[#1F4D2E] dark:hover:text-[#E5B85C] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  aria-label="Account menu"
                >
                  <UserIcon className="w-5 h-5 text-[#2B2B2B] dark:text-[#E2DDD3]" />
                </button>

                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#18221B] rounded-2xl shadow-xl border border-[#E7E0D0] dark:border-[#2A3B2F] py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-white/10">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Namaste,</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/account?tab=profile"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#FAF6EC] dark:hover:bg-[#1F2E23] hover:text-[#1F4D2E] dark:hover:text-[#8ED9A0]"
                      >
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        <span>My Account</span>
                      </Link>
                      <Link
                        to="/account?tab=orders"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#FAF6EC] dark:hover:bg-[#1F2E23] hover:text-[#1F4D2E] dark:hover:text-[#8ED9A0]"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/track-order"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#FAF6EC] dark:hover:bg-[#1F2E23] hover:text-[#1F4D2E] dark:hover:text-[#8ED9A0]"
                      >
                        <Compass className="w-4 h-4 text-gray-400" />
                        <span>Track Order</span>
                      </Link>
                      <Link
                        to="/account?tab=addresses"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#FAF6EC] dark:hover:bg-[#1F2E23] hover:text-[#1F4D2E] dark:hover:text-[#8ED9A0]"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Saved Addresses</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-white/10 pt-1">
                      <button
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left cursor-pointer"
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
                className="p-2 text-gray-700 dark:text-gray-200 hover:text-[#1F4D2E] dark:hover:text-[#E5B85C] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                aria-label="Sign in"
              >
                <UserIcon className="w-5 h-5 text-[#2B2B2B] dark:text-[#E2DDD3]" />
              </Link>
            )}

            {/* Shopping Cart Icon with Gold Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-[#1F4D2E] dark:hover:text-[#E5B85C] transition-colors relative rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#2B2B2B] dark:text-[#E2DDD3]" />
                <span className="absolute -top-1.5 -right-2 bg-[#D9A441] text-[#1F4D2E] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount > 0 ? itemCount : 2}
                </span>
              </div>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:text-[#1F4D2E] dark:hover:text-[#E5B85C] rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Dropdown Search Bar when search is opened */}
        {searchOpen && (
          <div className="py-3 pb-4 border-t border-[#E7E0D0] animate-in fade-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dry fruits, seeds, makhana, spices..."
                  className="w-full pl-5 pr-12 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E0D0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#1F4D2E] text-[#2B2B2B] shadow-xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1F4D2E] text-white flex items-center justify-center shadow-xs"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-800"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 
        ========================================================================
        3. MOBILE DRAWER MENU
        ========================================================================
      */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E0D0] dark:border-[#243529] bg-[#FAF6EC] dark:bg-[#111813] px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          {/* Theme Selector for Mobile */}
          <ThemeToggle variant="mobile" />

          <form onSubmit={handleSearch}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 text-xs bg-white dark:bg-[#18221B] border border-[#E7E0D0] dark:border-[#2A3B2F] text-[#2B2B2B] dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#1F4D2E]"
              />
              <button
                type="submit"
                className="absolute right-1.5 w-7 h-7 rounded-full bg-[#1F4D2E] text-white flex items-center justify-center cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white dark:bg-[#18221B] rounded-xl text-center text-[#1F4D2E] dark:text-[#8ED9A0] font-bold border border-[#E7E0D0] dark:border-[#2A3B2F]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white dark:bg-[#18221B] rounded-xl text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2E23] border border-[#E7E0D0] dark:border-[#2A3B2F]"
            >
              Shop All
            </Link>
            <Link
              to="/shop?category=dry-fruits"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white dark:bg-[#18221B] rounded-xl text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2E23] border border-[#E7E0D0] dark:border-[#2A3B2F]"
            >
              Dry Fruits
            </Link>
            <Link
              to="/shop?category=seeds-mixes"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white dark:bg-[#18221B] rounded-xl text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2E23] border border-[#E7E0D0] dark:border-[#2A3B2F]"
            >
              Seeds
            </Link>
            <Link
              to="/shop?category=makhana"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white dark:bg-[#18221B] rounded-xl text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2E23] border border-[#E7E0D0] dark:border-[#2A3B2F]"
            >
              Makhana
            </Link>
            <Link
              to="/shop?category=specialty-flours"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white dark:bg-[#18221B] rounded-xl text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2E23] border border-[#E7E0D0] dark:border-[#2A3B2F]"
            >
              Aataa (Flour)
            </Link>
            <Link
              to="/jimmi-jaggu"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 p-2.5 bg-[#FAF4EC] dark:bg-[#1F2A22] rounded-xl text-center font-bold text-[#1F4D2E] dark:text-[#8ED9A0] border border-[#D9A441]/50 flex items-center justify-center gap-2"
            >
              <img
                src="/brands/jimmi_jaggu_logo.png"
                alt="Jimmi Jaggu"
                className="w-5 h-5 rounded-full object-contain"
              />
              <span>Jimmi Jaggu Sister Brand →</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white dark:bg-[#18221B] rounded-xl text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2E23] border border-[#E7E0D0] dark:border-[#2A3B2F]"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-white dark:bg-[#18221B] rounded-xl text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2E23] border border-[#E7E0D0] dark:border-[#2A3B2F]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
