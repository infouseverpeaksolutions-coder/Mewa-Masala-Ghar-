import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Heart, ChevronDown } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { resolveImageUrl, getSmartProductFallback } from '../utils/imageUrl';
import { formatWeight } from '../utils/weight';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const cardVariants = React.useMemo(() => {
    return product.variants || [];
  }, [product]);

  // Default to designated default variant or first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    cardVariants.find((v) => v.isDefault) || cardVariants[0] || {
      id: 'default',
      name: 'Standard',
      weightGrams: 200,
      mrp: 299,
      price: 249,
      stock: 50,
      sku: 'MMG-DEF-200',
      isDefault: true,
    }
  );

  React.useEffect(() => {
    if (cardVariants.length > 0) {
      setSelectedVariant((prev) => {
        if (prev) {
          const match = cardVariants.find((v) => v.id === prev.id);
          if (match) return match;
        }
        return cardVariants.find((v) => v.isDefault) || cardVariants[0];
      });
    }
  }, [cardVariants]);

  const [addedAnimation, setAddedAnimation] = useState(false);

  const isJimmi =
    product.brand?.slug === 'jimmi-jaggu' ||
    (product.storeId &&
      (product.storeId.includes('baby') ||
        product.storeId.includes('care') ||
        product.storeId.includes('jimmi')));

  const rawImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;

  const primaryImage = rawImage
    ? resolveImageUrl(rawImage, product.name, product.category?.name)
    : getSmartProductFallback(product.name, product.category?.name);

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

  // Tag style: show real Category name or brand badge
  const getProductBadge = () => {
    if (isJimmi) {
      return {
        label: product.category?.name || 'Jimmi Jaggu',
        bg: 'bg-[#B97375]',
        text: 'text-white',
      };
    }
    if (product.category?.name) {
      return { label: product.category.name, bg: 'bg-[#1F4D2E]', text: 'text-white' };
    }
    return { label: 'Pure & Natural', bg: 'bg-[#1F4D2E]', text: 'text-white' };
  };

  const badge = getProductBadge();

  return (
    <div className="group bg-white dark:bg-[#18221B] rounded-2xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-2.5 sm:p-3 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full relative card-hover-lift">
      {/* Top badges & Wishlist */}
      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider truncate max-w-[130px] ${badge.bg} ${badge.text} shadow-2xs`}
          >
            {badge.label}
          </span>

          <button
            onClick={handleWishlistClick}
            className={`p-1 rounded-full transition-colors ${
              inWishlist
                ? 'bg-rose-50 text-rose-600'
                : 'text-gray-400 hover:text-rose-600 hover:bg-gray-50 dark:hover:bg-[#202E24]'
            }`}
            aria-label="Save to Wishlist"
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Product Image (Compact, responsive, never huge) */}
        <Link
          to={`/product/${product.slug}`}
          className="relative block aspect-square sm:aspect-[4/5] max-h-44 sm:max-h-48 rounded-xl overflow-hidden bg-[#FAF6EC]/80 dark:bg-[#111813]/60 flex items-center justify-center mb-2"
        >
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = getSmartProductFallback(product.name, product.category?.name);
            }}
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between pt-1">
        <div>
          <Link to={`/product/${product.slug}`} className="block mb-1">
            <h3
              className={`font-serif font-bold text-xs sm:text-[13px] text-gray-900 dark:text-gray-100 line-clamp-1 transition-colors ${
                isJimmi ? 'group-hover:text-[#B97375]' : 'group-hover:text-[#1F4D2E] dark:group-hover:text-[#8ED9A0]'
              }`}
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          {/* Weight Dropdown if multiple variants, or single weight display */}
          {cardVariants.length > 1 ? (
            <div className="mt-1 mb-2">
              <div className="relative">
                <select
                  value={selectedVariant.id}
                  onChange={(e) => {
                    e.stopPropagation();
                    const v = cardVariants.find((x) => x.id === e.target.value);
                    if (v) setSelectedVariant(v);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full text-[11px] font-bold px-2 py-1 bg-[#FAF6EC] dark:bg-[#111813] border border-[#E7E0D0] dark:border-[#2A3B2F] rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer appearance-none pr-5 ${
                    isJimmi ? 'focus:ring-1 focus:ring-[#B97375]' : 'focus:ring-1 focus:ring-[#1F4D2E]'
                  }`}
                >
                  {cardVariants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {formatWeight(v.weightGrams, v.name)} — ₹{v.price}
                    </option>
                  ))}
                </select>
                <div
                  className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 ${
                    isJimmi ? 'text-[#B97375]' : 'text-[#1F4D2E] dark:text-[#8ED9A0]'
                  }`}
                >
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5 mb-1.5 font-medium">
              {formatWeight(selectedVariant.weightGrams, selectedVariant.name)}
            </span>
          )}

          {/* Price Block */}
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              ₹{selectedVariant.price}
            </span>
            {selectedVariant.mrp > selectedVariant.price && (
              <span className="text-[10px] text-gray-400 line-through">
                ₹{selectedVariant.mrp}
              </span>
            )}
            {discountPercent > 0 && (
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  isJimmi
                    ? 'text-[#B97375] bg-[#B97375]/10'
                    : 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
                }`}
              >
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button (Compact & responsive) */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
            addedAnimation
              ? 'bg-emerald-600 text-white'
              : isJimmi
              ? 'bg-[#B97375] hover:bg-[#A66264] text-white hover:shadow-xs active:scale-[0.98]'
              : 'bg-[#1F4D2E] hover:bg-[#163821] dark:bg-[#284F33] dark:hover:bg-[#346643] text-white hover:shadow-xs active:scale-[0.98]'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Added</span>
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
