import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileBottomNav: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const location = useLocation();
  const { itemCount, setIsCartOpen } = useCart();

  const isHome = location.pathname === '/';
  const isShop = location.pathname.startsWith('/shop') || location.pathname.startsWith('/categories');
  const isAccount = location.pathname.startsWith('/account') || location.pathname.startsWith('/login');

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111813]/95 backdrop-blur-md border-t border-[#E7E0D0] dark:border-[#243529] py-1.5 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.4)]">
      <div className="grid grid-cols-4 items-center text-center">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center py-1 transition-colors ${
            isHome
              ? 'text-[#1F4D2E] dark:text-[#8ED9A0]'
              : 'text-gray-500 dark:text-gray-400 hover:text-[#1F4D2E] dark:hover:text-[#8ED9A0]'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 ${isHome ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
        </Link>

        {/* Categories */}
        <Link
          to="/shop"
          className={`flex flex-col items-center py-1 transition-colors ${
            isShop
              ? 'text-[#1F4D2E] dark:text-[#8ED9A0]'
              : 'text-gray-500 dark:text-gray-400 hover:text-[#1F4D2E] dark:hover:text-[#8ED9A0]'
          }`}
        >
          <Grid className={`w-5 h-5 ${isShop ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 ${isShop ? 'font-bold' : 'font-medium'}`}>
            Categories
          </span>
        </Link>

        {/* Cart with badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center py-1 transition-colors text-gray-500 dark:text-gray-400 hover:text-[#1F4D2E] dark:hover:text-[#8ED9A0] relative cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#D9A441] text-[#1F4D2E] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Cart</span>
        </button>

        {/* Account */}
        <Link
          to="/account"
          className={`flex flex-col items-center py-1 transition-colors ${
            isAccount
              ? 'text-[#1F4D2E] dark:text-[#8ED9A0]'
              : 'text-gray-500 dark:text-gray-400 hover:text-[#1F4D2E] dark:hover:text-[#8ED9A0]'
          }`}
        >
          <User className={`w-5 h-5 ${isAccount ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 ${isAccount ? 'font-bold' : 'font-medium'}`}>
            Account
          </span>
        </Link>
      </div>
    </nav>
  );
};
