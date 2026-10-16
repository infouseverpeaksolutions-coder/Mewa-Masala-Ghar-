import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, ProductVariant, CartItem } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import { isGiftProduct } from '../utils/productUtils';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  appliedCoupon: { code: string; discount: number } | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => Promise<void>;
  syncServerCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'mmg_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Sync with server cart
  const syncServerCart = useCallback(async () => {
    try {
      const res = await api.get('/cart');
      if (res.data?.success && res.data?.data?.items) {
        const serverItems: CartItem[] = res.data.data.items.map((i: any) => ({
          product: i.productVariant?.product,
          variant: i.productVariant,
          quantity: i.quantity,
        })).filter((i: any) => i.product && i.variant);

        if (serverItems.length > 0) {
          setItems(serverItems);
        }
      }
    } catch (e) {
      // Guest or offline
    }
  }, []);

  // When user logs in, merge guest cart and fetch updated server cart
  useEffect(() => {
    if (user) {
      api.post('/cart/merge')
        .catch(() => {})
        .finally(() => {
          syncServerCart();
        });
    }
  }, [user, syncServerCart]);

  const addToCart = async (product: Product, variant: ProductVariant, quantity = 1) => {
    const minQty = isGiftProduct(product) ? 3 : 1;
    let finalAddedQty = quantity;

    // Optimistic local update
    setItems((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      finalAddedQty = Math.max(minQty, quantity);
      return [...prev, { product, variant, quantity: finalAddedQty }];
    });
    setIsCartOpen(true);

    // Sync to server
    try {
      await api.post('/cart/items', { variantId: variant.id, quantity: finalAddedQty });
    } catch (e) {
      // Local storage fallback remains
    }
  };

  const removeFromCart = async (variantId: string) => {
    const itemToRemove = items.find((i) => i.variant.id === variantId);
    setItems((prev) => prev.filter((item) => item.variant.id !== variantId));

    if (itemToRemove) {
      try {
        // Find server item ID or clear
        const res = await api.get('/cart');
        const sItem = res.data?.data?.items?.find((i: any) => i.productVariantId === variantId);
        if (sItem?.id) {
          await api.delete(`/cart/items/${sItem.id}`);
        }
      } catch (e) {
        // Fallback
      }
    }
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(variantId);
      return;
    }

    const currentItem = items.find((item) => item.variant.id === variantId);
    const minQty = currentItem && isGiftProduct(currentItem.product) ? 3 : 1;
    const finalQty = Math.max(minQty, quantity);

    setItems((prev) =>
      prev.map((item) =>
        item.variant.id === variantId ? { ...item, quantity: finalQty } : item
      )
    );

    try {
      const res = await api.get('/cart');
      const sItem = res.data?.data?.items?.find((i: any) => i.productVariantId === variantId);
      if (sItem?.id) {
        await api.put(`/cart/items/${sItem.id}`, { quantity: finalQty });
      }
    } catch (e) {
      // Fallback
    }
  };

  const applyCoupon = (code: string, discount: number) => {
    const cleanDiscount = Number(discount);
    const safeDiscount = isNaN(cleanDiscount) ? 0 : Math.max(0, cleanDiscount);
    setAppliedCoupon({
      code: String(code || '').toUpperCase().trim(),
      discount: Number(safeDiscount.toFixed(2)),
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = async () => {
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    try {
      await api.delete('/cart');
    } catch (e) {
      // Fallback
    }
  };

  // Pricing calculations
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Subtotal in ₹ (inclusive of GST)
  const subtotal = items.reduce((sum, item) => sum + (item.variant?.price || 0) * (item.quantity || 0), 0);

  // Calculate embedded GST
  const gstAmount = items.reduce((sum, item) => {
    const rate = item.product?.gstRate || 12;
    const price = item.variant?.price || 0;
    const qty = item.quantity || 0;
    const base = (price * qty) / (1 + rate / 100);
    return sum + (price * qty - base);
  }, 0);

  const rawDiscount = appliedCoupon?.discount ?? 0;
  const discountAmount = isNaN(Number(rawDiscount)) ? 0 : Number(rawDiscount);
  const taxableAfterDiscount = Math.max(0, subtotal - discountAmount);
  // Free delivery threshold is ₹999 (configurable via admin settings)
  const freeShippingThreshold = Number(settings.free_shipping_threshold) || 999;
  const standardDeliveryFee = Number(settings.standard_delivery_fee) || 49;
  const shippingFee = items.length === 0 ? 0 : taxableAfterDiscount >= freeShippingThreshold ? 0 : standardDeliveryFee;
  const safeTotal = taxableAfterDiscount + shippingFee;
  const totalAmount = Number((isNaN(safeTotal) ? 0 : safeTotal).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        gstAmount: Number(gstAmount.toFixed(2)),
        shippingFee,
        discountAmount,
        totalAmount,
        appliedCoupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        syncServerCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
