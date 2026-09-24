import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowLeft,
  Sparkles,
  Percent,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    gstAmount,
    shippingFee,
    discountAmount,
    totalAmount,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const freeShippingThreshold = settings.free_shipping_threshold || 499;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        cartAmount: subtotal,
      });

      if (res.data?.success) {
        applyCoupon(res.data.data.code, res.data.data.discountAmount);
        setCouponSuccess(`Coupon ${res.data.data.code} applied! You saved ₹${res.data.data.discountAmount}`);
        setCouponCode('');
      } else {
        setCouponError(res.data?.message || 'Invalid coupon code');
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Failed to apply coupon. Check minimum order value.');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-[#FAF6EC] border border-[#E7E0D0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#2F5D3A] shadow-soft">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441] block mb-1">
          Your Shopping Basket
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Your Basket is Currently Empty
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Looks like you haven't added any royal dry fruits, wholesome baby porridge, or mineral clays to your basket yet.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2F5D3A] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#1F4D2E] transition-all"
        >
          <span>Explore Pure Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E0D0] gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441] block">
            Review Your Items
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5">
            Your Shopping Basket
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your basket • Mandi direct fresh harvest
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F5D3A] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cart Items & Free Delivery Meter */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Progress Meter in Green & Gold */}
          <div className="bg-[#FAF6EC] border border-[#E7E0D0] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2.5">
              <span className="flex items-center gap-2 text-gray-900">
                <Truck className="w-4 h-4 text-[#2F5D3A]" />
                {amountNeededForFreeShipping > 0
                  ? <span>Add <strong className="text-[#1F4D2E]">₹{amountNeededForFreeShipping.toFixed(0)}</strong> more for <strong>FREE Standard Pan-India Delivery!</strong></span>
                  : <span className="text-[#1F4D2E] font-bold">🎉 You've unlocked FREE Standard Pan-India Delivery!</span>}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F7EBD2] text-[#805D17] border border-[#D9A441]/40">
                {progressToFreeShipping}%
              </span>
            </div>
            <div className="w-full bg-[#E7E0D0] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2F5D3A] via-[#1F4D2E] to-[#D9A441] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-3xl border border-[#E7E0D0] divide-y divide-[#E7E0D0] shadow-soft overflow-hidden">
            {items.map((item) => (
              <div
                key={item.variant.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Thumbnail & Product Details */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.product.images?.[0]?.url || '/logo.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-[#E7E0D0] shrink-0 bg-[#FAF6EC]"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441] block">
                      {item.product.store?.name || 'Mewa Masala Ghar'}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="font-serif text-sm sm:text-base font-bold text-gray-900 hover:text-[#2F5D3A] transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF6EC] text-gray-700 border border-[#E7E0D0] font-medium">
                        {item.variant.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold mt-1">
                      ₹{item.variant.price}{' '}
                      <span className="text-[11px] text-gray-400 font-normal">
                        ({item.product.gstRate || 12}% GST incl.)
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quantity Stepper, Total & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-300 rounded-full bg-white p-0.5 shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-[#FAF6EC] rounded-full transition-colors active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs sm:text-sm font-bold text-gray-900 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-[#FAF6EC] rounded-full transition-colors active:scale-95"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for Line Item */}
                  <div className="text-right min-w-[80px]">
                    <span className="font-serif text-base sm:text-lg font-bold text-[#1F4D2E]">
                      ₹{item.variant.price * item.quantity}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.variant.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mandi Direct Fresh Assurance Banner */}
          <div className="flex items-center gap-3 bg-[#FAF6EC] border border-[#E7E0D0] rounded-2xl p-4 text-xs text-gray-700 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#2F5D3A] shrink-0" />
            <span>
              <strong className="font-bold text-gray-900">FSSAI Certified Nitrogen Pouching:</strong> All dry fruits, seeds, and infant blends are vacuum-sealed to preserve natural harvest crunch and aroma without chemical fumigation.
            </span>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          {/* Discount Coupon Card with Pill Button */}
          <div className="bg-white rounded-3xl border border-[#E7E0D0] p-6 shadow-soft space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D9A441]" />
              <span>Apply Discount Coupon</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-emerald-600 font-medium">
                      ₹{appliedCoupon.discount} savings applied
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-red-600 hover:underline px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. MEWA10 or PURE50"
                    className="flex-1 px-4 py-2.5 text-xs uppercase bg-[#FAF6EC]/50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] focus:bg-white transition-all font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-5 py-2.5 bg-[#2F5D3A] hover:bg-[#1F4D2E] disabled:opacity-50 text-white text-xs font-bold rounded-full transition-colors shadow-xs"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-xs text-emerald-700 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponSuccess}</span>
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Cart Breakdown Card with Green Checkout Button */}
          <div className="bg-white rounded-3xl border border-[#E7E0D0] p-6 sm:p-7 shadow-soft space-y-4">
            <h3 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Bag Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> Coupon Savings
                  </span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500 text-xs">
                <span>Estimated GST (Inclusive)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Standard Pan-India Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-700 uppercase text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{shippingFee}</span>
                  )}
                </span>
              </div>

              <div className="border-t border-[#E7E0D0] pt-4 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-gray-900">Total Payable</span>
                <span className="font-serif text-2xl font-bold text-[#1F4D2E]">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 text-right">(Inclusive of all applicable Indian taxes)</p>
            </div>

            {/* Green Pill Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-full bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 min-h-[44px]"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Assurances */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2F5D3A] shrink-0" />
                <span>256-Bit Encrypted Razorpay & Netbanking Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#2F5D3A] shrink-0" />
                <span>Cash on Delivery (COD) available across India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
