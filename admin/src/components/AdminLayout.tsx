import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Boxes,
  Layers,
  Users,
  Tag,
  Star,
  MessageSquare,
  Home,
  FileText,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Search,
  ChevronDown,
} from 'lucide-react';
import { setAdminToken } from '../services/api';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Orders & Shipments', path: '/orders', icon: ShoppingCart },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Categories & Stores', path: '/categories-stores', icon: FolderTree },
  { label: 'Combos & Hampers', path: '/combos', icon: Layers },
  { label: 'Inventory Stocks', path: '/inventory', icon: Boxes },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Coupons & Promos', path: '/coupons', icon: Tag },
  { label: 'Product Reviews', path: '/reviews', icon: Star },
  { label: 'Contact Messages', path: '/contact-messages', icon: MessageSquare },
  { label: 'Homepage Manager', path: '/homepage-manager', icon: Home },
  { label: 'Content Pages', path: '/pages', icon: FileText },
  { label: 'Analytics & Reports', path: '/reports', icon: BarChart3 },
  { label: 'Staff & Roles', path: '/staff-roles', icon: UserCheck },
  { label: 'Store Settings', path: '/settings', icon: Settings },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    setAdminToken(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#FAF6EC] font-sans text-[#2B2B2B]">
      {/* Desktop Sidebar: Dark Forest Green #183B23 */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#183B23] text-[#FAF6EC] border-r border-[#122c1b] shrink-0 shadow-md">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#234c30] flex items-center gap-3">
          <img src="/logo.png" alt="Mewa Masala Ghar" className="h-10 w-auto object-contain drop-shadow-xs" />
          <div>
            <span className="font-serif font-bold text-white text-sm block leading-tight">
              Mewa Masala Ghar
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#D9A441] font-bold block mt-0.5">
              Admin Console
            </span>
          </div>
        </div>

        {/* Navigation List - 15 Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2F5D3A] text-[#FAF6EC] shadow-sm font-bold border-l-4 border-[#D9A441]'
                    : 'text-gray-300 hover:text-white hover:bg-[#234c30]/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D9A441]' : 'text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#234c30] space-y-1.5 bg-[#14321e]">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-[#D9A441] hover:bg-[#234c30] transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#D9A441]" />
            <span>View Live Storefront</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#E6DEC8] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick search input */}
            <div className="relative max-w-xs w-full hidden sm:block">
              <input
                type="text"
                placeholder="Quick search products, orders..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6EC] border border-[#E6DEC8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] text-gray-800"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-[#2F5D3A] bg-[#2F5D3A]/10 px-3 py-1 rounded-full border border-[#2F5D3A]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F5D3A]" />
              <span>FSSAI: 10021051000123 • GSTIN: 27AABCM1234F1Z5</span>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-gray-900 block leading-tight">Super Administrator</span>
                <span className="text-[11px] text-[#2F5D3A] font-semibold">super_admin@mewamasalaghar.com</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#183B23] text-[#FAF6EC] flex items-center justify-center font-bold text-sm border border-[#D9A441]">
                SA
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E6DEC8] rounded-2xl shadow-xl py-2 z-30">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">Mewa Masala Ghar HQ</p>
                  <p className="text-[11px] text-gray-500">APMC Market, Navi Mumbai</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF6EC] hover:text-[#2F5D3A]"
                >
                  <Settings className="w-4 h-4" />
                  <span>Platform Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative w-72 bg-[#183B23] text-white p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#234c30] mb-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Mewa Masala Ghar" className="h-8 w-auto object-contain" />
                  <span className="font-serif font-bold text-xs text-[#D9A441]">Admin Console</span>
                </div>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              <div className="space-y-1 max-h-[75vh] overflow-y-auto pr-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-[#2F5D3A] text-white font-bold' : 'text-gray-300 hover:bg-[#234c30]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#D9A441]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-semibold text-rose-300 pt-4 border-t border-[#234c30]"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

