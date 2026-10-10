import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Heart, ChevronDown } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { resolveImageUrl } from '../utils/imageUrl';
import { formatWeight } from '../utils/weight';

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
      return '/foods/foods_superseeds.jpg';
    }
    if (nameLower.includes('makhana')) {
      return '/foods/foods_makhana.jpg';
    }
    return '/foods/foods_dryfruits.jpg';
  };

  const rawImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;

  const primaryImage = rawImage ? resolveImageUrl(rawImage) : getFallbackImage();

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

  // Tag style: show real Category name or Jimmi Jaggu badge
  const getProductBadge = () => {
    const sId = product.storeId || '';
    if (product.brand?.slug === 'jimmi-jaggu' || sId.includes('baby') || sId.includes('care')) {
      return { label: 'Jimmi Jaggu', bg: 'bg-[#B97375]', text: 'text-white' };
    }
    if (product.category?.name) {
      return { label: product.category.name, bg: 'bg-[#2F5D3A]', text: 'text-white' };
    }
    return { label: 'Pure & Natural', bg: 'bg-[#2F5D3A]', text: 'text-white' };
  };

  const badge = getProductBadge();

  return (
    <div className="group bg-white rounded-2xl border border-[#E7E0D0] p-3 sm:p-4 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full relative card-hover-lift">
      {/* Top badges & Wishlist */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${badge.bg} ${badge.text} shadow-2xs`}>
            {badge.label}
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
          className="relative block aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF6EC] flex items-center justify-center mb-3"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = getFallbackImage();
            }}
          />
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

          {/* Weight Dropdown if multiple variants, or single weight display */}
          {product.variants && product.variants.length > 1 ? (
            <div className="mt-1 mb-2.5">
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">
                Weight:
              </label>
              <div className="relative">
                <select
                  value={selectedVariant.id}
                  onChange={(e) => {
                    e.stopPropagation();
                    const v = product.variants.find((x) => x.id === e.target.value);
                    if (v) setSelectedVariant(v);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-xs font-bold px-2.5 py-1.5 bg-[#FAF6EC] border border-[#E7E0D0] rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#2F5D3A] cursor-pointer appearance-none pr-6"
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {formatWeight(v.weightGrams, v.name)} — ₹{v.price}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#2F5D3A]">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-500 block mt-0.5 mb-2 font-medium">
              {formatWeight(selectedVariant.weightGrams, selectedVariant.name)}
            </span>
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
