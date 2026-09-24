import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isInWishlist: () => false,
  toggleWishlist: async () => {},
  removeFromWishlist: async () => {},
  wishlistCount: 0,
});

const STORAGE_KEY = 'mmg_guest_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // If logged in, fetch from backend
  useEffect(() => {
    if (user) {
      api
        .get('/auth/wishlist')
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data?.data)) {
            setWishlist(res.data.data);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Sync to localStorage for guests
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    const exists = isInWishlist(product.id);
    let updated: Product[];

    if (exists) {
      updated = wishlist.filter((item) => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);

    if (user) {
      try {
        await api.post('/auth/wishlist/toggle', { productId: product.id });
      } catch (e) {
        console.error('Failed to sync wishlist with server', e);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const updated = wishlist.filter((item) => item.id !== productId);
    setWishlist(updated);

    if (user) {
      try {
        await api.post('/auth/wishlist/toggle', { productId });
      } catch (e) {
        console.error('Failed to remove from wishlist on server', e);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
