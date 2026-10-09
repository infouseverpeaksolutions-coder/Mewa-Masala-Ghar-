import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Star, Trophy, Sparkles, Flame, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../utils/imageUrl';

export const BestsellerRankedCard: React.FC<{
  product: any;
  rank?: number;
}> = ({ product, rank = 1 }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const id = product.id;
  const name = product.name;
  const slug = product.slug || product.link?.replace('/product/', '') || product.id;
  const link = product.link || `/product/${slug}`;

  // Primary variant
  const primaryVariant = product.variants?.[0] || {
    id: `var-${id}`,
    name: product.weight || 'Standard Pack',
    price: product.price || 299,
    mrp: product.originalPrice || Math.round((product.price || 299) * 1.2),
    weightGrams: product.weight?.includes('kg') ? 1000 : 250,
    stock: 50,
    sku: `SKU-${id}`,
    isDefault: true,
  };
  const price = primaryVariant.price ?? product.price ?? 299;
  const originalPrice = primaryVariant.mrp ?? product.originalPrice ?? null;
  const weight = product.weight || (primaryVariant.weightGrams ? `${primaryVariant.weightGrams}g` : undefined);
  const categoryName = product.category?.name || product.category || 'Mewa Masala';
  const badge = product.badge || (product.isFeatured ? 'Featured' : undefined);

  // Image resolution
  const rawImg =
    product.images?.find((i: any) => i.isPrimary)?.url ||
    product.images?.[0]?.url ||
    product.image ||
    '/foods/foods_dryfruits.jpg';
  const imgUrl = resolveImageUrl(rawImg);

  const rating = product.rating || 4.9;
  const reviewCount = product.reviewCount || 36;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, primaryVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  // Rank badge styling helper
  const getRankBadge = () => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D9A441] to-[#B8860B] text-white shadow-xs">
          <Trophy className="w-3 h-3" />
          <span>#1 Bestseller</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#C28C2B] to-[#996D1E] text-white shadow-xs">
          <Sparkles className="w-3 h-3" />
          <span>#2 Most Loved</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#BD4B37] to-[#A33927] text-white shadow-xs">
          <Flame className="w-3 h-3" />
          <span>#3 Trending</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#1F4D2E] dark:bg-[#284F33] text-white shadow-xs">
        <Award className="w-3 h-3 text-[#D9A441]" />
        <span>{badge || `#${rank} Top Choice`}</span>
      </span>
    );
  };

  return (
    <div className="group bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-3 sm:p-4 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1 relative">
      {/* Top Header Row: Rank Badge & Discount */}
      <div className="flex items-center justify-between gap-1 mb-2">
        {getRankBadge()}

        {discountPercent && discountPercent > 0 && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 shrink-0">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* 4:5 Aspect Ratio Image Container */}
      <Link
        to={link}
        className="relative aspect-[4/5] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6EC]/80 dark:bg-[#111813]/60 mb-2.5 flex items-center justify-center p-3"
      >
        <img
          src={imgUrl}
          alt={name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/foods/foods_dryfruits.jpg';
          }}
        />

        {/* Net Weight Pill */}
        {weight && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 dark:bg-[#18221B]/90 text-[#1F4D2E] dark:text-[#8ED9A0] backdrop-blur-xs shadow-2xs border border-[#E7E0D0]/50 dark:border-[#2A3B2F]">
            {weight}
          </span>
        )}
      </Link>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#7A6B58] dark:text-[#C5BCAD] mb-1">
            <span className="font-medium truncate">{categoryName}</span>
            {rating && (
              <div className="flex items-center gap-1 text-[#8C6D37] dark:text-[#E5B85C] shrink-0">
                <Star className="w-3 h-3 fill-[#D9A441] text-[#D9A441]" />
                <span className="font-bold">{rating}</span>
                {reviewCount > 0 && (
                  <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                    ({reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Title */}
          <Link to={link} className="block group-hover:underline decoration-[#D9A441]">
            <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1F4D2E] dark:text-[#8ED9A0] group-hover:text-[#D9A441] dark:group-hover:text-[#E5B85C] transition-colors leading-snug line-clamp-2 min-h-[2.4rem]">
              {name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 pt-2.5 border-t border-[#E7E0D0]/50 dark:border-[#2A3B2F]/60">
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="font-serif font-bold text-sm sm:text-base text-[#1F4D2E] dark:text-white">
              ₹ {price}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                ₹ {originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
            className={`w-full py-2 px-3 rounded-xl sm:rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1F4D2E] hover:bg-[#163821] dark:bg-[#284F33] dark:hover:bg-[#346643] text-white active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
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
    </div>
  );
};
