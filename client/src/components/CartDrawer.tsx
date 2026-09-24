import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, AlertCircle, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    gstAmount,
    shippingFee,
    discountAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { settings } = useSettings();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        cartAmount: subtotal,
      });
      if (res.data?.success) {
        applyCoupon(res.data.data.code, res.data.data.discountAmount);
        setCouponCode('');
      } else {
        setCouponError(res.data.message || 'Invalid coupon');
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid or ineligible coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Free delivery progress in green & gold
  const freeDeliveryThreshold = settings.free_shipping_threshold || 499;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E7E0D0]">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#E7E0D0] flex items-center justify-between bg-[#FAF6EC]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#2F5D3A]" />
              <h2 className="font-serif text-lg font-bold text-gray-900">Your Basket</h2>
              <span className="text-xs bg-[#2F5D3A] text-white font-bold px-2.5 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator in Green & Gold */}
          <div className="bg-[#FAF6EC] px-5 py-3 border-b border-[#E7E0D0] text-xs">
            {remainingForFreeDelivery === 0 ? (
              <span className="text-[#1F4D2E] font-bold flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked FREE Pan-India Delivery.
              </span>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-800 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#2F5D3A]" />
                    <span>Add <strong>₹{remainingForFreeDelivery}</strong> more for FREE shipping</span>
                  </span>
                  <span className="text-xs font-bold text-[#805D17]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#E7E0D0] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#2F5D3A] to-[#D9A441] h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Drawer Body - Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF6EC] border border-[#E7E0D0] flex items-center justify-center mx-auto mb-4 text-[#2F5D3A]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-serif text-lg font-bold text-gray-900 mb-1">Your basket is empty</p>
                <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto">
                  Explore our royal dry fruits, wholesome baby porridge, and mineral face clays.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#2F5D3A] text-white text-xs font-bold rounded-full hover:bg-[#1F4D2E] shadow-sm transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const imgUrl =
                  item.product.images.find((i) => i.isPrimary)?.url ||
                  item.product.images[0]?.url ||
                  '/logo.jpg';
                return (
                  <div
                    key={item.variant.id}
                    className="flex gap-3 p-3.5 bg-[#FAF6EC]/50 rounded-2xl border border-[#E7E0D0]"
                  >
                    <img
                      src={imgUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl bg-white shrink-0 border border-[#E7E0D0]"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <h4 className="font-serif text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-gray-500 block">
                            Pack: {item.variant.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.variant.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-gray-300 rounded-full bg-white p-0.5 shadow-xs">
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-[#FAF6EC] rounded-full"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-[#FAF6EC] rounded-full"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-serif text-sm font-bold text-[#1F4D2E]">
                            ₹{item.variant.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E7E0D0] bg-white space-y-3 shadow-lg">
              {/* Promo Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Coupon '{appliedCoupon.code}' (-₹{appliedCoupon.discount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        placeholder="Coupon code (e.g. MEWA10)"
                        className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-[#FAF6EC]/50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
                      />
                      <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 bg-[#2F5D3A] text-white text-xs font-bold rounded-full hover:bg-[#1F4D2E] disabled:opacity-50 transition-colors shadow-xs"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && (
                  <span className="text-[11px] text-red-600 mt-1 block">{couponError}</span>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-[#E7E0D0]">
                  <span>Total Payable</span>
                  <span className="font-serif text-lg font-bold text-[#1F4D2E]">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Dual Action Buttons: View Cart & Checkout */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 bg-[#FAF6EC] border border-[#E7E0D0] text-gray-800 hover:bg-[#EFE8D6] font-bold text-xs rounded-full transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#2F5D3A]" />
                  <span>View Cart</span>
                </Link>

                <button
                  onClick={handleProceedCheckout}
                  className="py-3 px-4 bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white font-bold text-xs rounded-full transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
