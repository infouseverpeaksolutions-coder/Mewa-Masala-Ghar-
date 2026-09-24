import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Heart, ShieldCheck } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  // Default to the designated default variant or first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants?.find((v) => v.isDefault) || product.variants?.[0] || {
      id: 'default',
      name: 'Standard',
      weightGrams: 250,
      mrp: 299,
      price: 249,
      stock: 50,
      sku: 'MMG-DEF-250',
      isDefault: true,
    }
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const getFallbackImage = () => {
    const nameLower = (product.name || '').toLowerCase();
    if (nameLower.includes('flax') || nameLower.includes('seed') || nameLower.includes('chia') || nameLower.includes('pumpkin')) {
      return 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80';
    }
    if (nameLower.includes('almond') || nameLower.includes('badam') || nameLower.includes('kaju') || nameLower.includes('cashew') || nameLower.includes('walnut')) {
      return 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80';
    }
    if (nameLower.includes('makhana')) {
      return 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80';
    }
    if (nameLower.includes('spice') || nameLower.includes('masala') || nameLower.includes('turmeric') || nameLower.includes('chili') || nameLower.includes('garam') || nameLower.includes('haldi')) {
      return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80';
    }
    if (nameLower.includes('multani') || nameLower.includes('clay') || nameLower.includes('mud')) {
      return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80';
    }
    if (nameLower.includes('aahar') || nameLower.includes('poshan') || nameLower.includes('baby') || nameLower.includes('ragi') || nameLower.includes('garbh') || nameLower.includes('shishu')) {
      return 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80';
  };

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    getFallbackImage();

  const discountPercent =
    selectedVariant.mrp > selectedVariant.price
      ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Tag style by store
  const getStoreTag = () => {
    const sId = product.storeId || '';
    if (sId.includes('baby')) {
      return { label: 'Baby & Family', bg: 'bg-[#5DB4D6]', text: 'text-white' };
    }
    if (sId.includes('care')) {
      return { label: 'Personal Care', bg: 'bg-[#E0808C]', text: 'text-white' };
    }
    return { label: 'Mewa & Healthy Foods', bg: 'bg-[#7A2633]', text: 'text-white' };
  };

  const storeTag = getStoreTag();

  return (
    <div className="group bg-white rounded-2xl border border-[#E7E0D0] p-3 sm:p-4 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full relative card-hover-lift">
      {/* Top badges & Wishlist */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${storeTag.bg} ${storeTag.text} shadow-2xs`}>
            {storeTag.label}
          </span>

          <button
            onClick={handleWishlistClick}
            className={`p-1.5 rounded-full transition-colors ${
              inWishlist
                ? 'bg-rose-50 text-rose-600'
                : 'text-gray-400 hover:text-rose-600 hover:bg-gray-50'
            }`}
            aria-label="Save to Wishlist"
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Product Image */}
        <Link
          to={`/product/${product.slug}`}
          className="relative block aspect-square rounded-xl overflow-hidden bg-[#FAF6EC] flex items-center justify-center mb-3"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = getFallbackImage();
            }}
          />

          {/* FSSAI Mark in bottom right of image (as in mockup) */}
          <div className="absolute bottom-2 right-2 bg-white/95 rounded px-1.5 py-0.5 flex items-center gap-1 shadow-xs border border-gray-100">
            <ShieldCheck className="w-3 h-3 text-[#2F5D3A]" />
            <span className="text-[9px] font-bold text-[#1F4D2E]">fssai</span>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif font-bold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-[#2F5D3A] transition-colors">
              {product.name}
            </h3>
          </Link>

          <span className="text-xs text-gray-500 block mt-0.5 mb-2 font-medium">
            {selectedVariant.name || `${selectedVariant.weightGrams}g`}
          </span>

          {/* Variant chips if multiple */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {product.variants.slice(0, 3).map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors ${
                    selectedVariant.id === v.id
                      ? 'bg-[#2F5D3A] text-white font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}

          {/* Price Block */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              ₹{selectedVariant.price}
            </span>
            {selectedVariant.mrp > selectedVariant.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{selectedVariant.mrp}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Pill Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs ${
            addedAnimation
              ? 'bg-emerald-600 text-white'
              : 'bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white hover:shadow-md'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
