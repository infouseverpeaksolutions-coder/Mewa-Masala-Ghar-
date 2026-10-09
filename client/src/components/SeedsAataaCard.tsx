import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../utils/imageUrl';

export const SeedsAataaCard: React.FC<{ product: any }> = ({ product }) => {
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
  const categoryName = product.category?.name || product.category || 'Seeds';
  const badge = product.badge || (product.isFeatured ? 'Featured' : undefined);

  // Image resolution
  const rawImg =
    product.images?.find((i: any) => i.isPrimary)?.url ||
    product.images?.[0]?.url ||
    product.image ||
    '/foods/foods_dryfruits.jpg';
  const imgUrl = resolveImageUrl(rawImg);

  const rating = product.rating || 4.9;
  const reviewCount = product.reviewCount || 24;

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

  return (
    <div className="group bg-white dark:bg-[#18221B] rounded-2xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-3 sm:p-3.5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1 relative">
      {/* Top Badges Row */}
      <div className="flex items-center justify-between gap-1.5 mb-2">
        {badge ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6EC] dark:bg-[#202E24] text-[#1F4D2E] dark:text-[#8ED9A0] border border-[#E7E0D0]/80 dark:border-[#2A3B2F] truncate">
            {badge}
          </span>
        ) : (
          <span className="text-[10px] font-medium text-[#7A6B58] dark:text-[#C5BCAD]">
            {categoryName}
          </span>
        )}

        {discountPercent && discountPercent > 0 && (
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-[#C8933B] dark:text-[#E5B85C] border border-amber-200/50 dark:border-amber-800/40 shrink-0">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* 4:5 Aspect Ratio Image Container */}
      <Link
        to={link}
        className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#FAF6EC]/80 dark:bg-[#111813]/60 mb-2.5 flex items-center justify-center p-2.5"
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
          <span className="absolute bottom-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/65 text-white backdrop-blur-xs">
            {weight}
          </span>
        )}
      </Link>

      {/* Product Content & Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating & Review Count */}
          {rating && (
            <div className="flex items-center gap-1 text-[11px] text-[#8C6D37] dark:text-[#E5B85C] mb-1">
              <Star className="w-3 h-3 fill-[#D9A441] text-[#D9A441]" />
              <span className="font-semibold">{rating}</span>
              {reviewCount > 0 && (
                <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Product Title */}
          <Link to={link} className="block group-hover:underline decoration-[#D9A441]">
            <h3 className="font-serif text-xs sm:text-[13px] font-bold text-[#1F4D2E] dark:text-[#8ED9A0] group-hover:text-[#D9A441] dark:group-hover:text-[#E5B85C] transition-colors leading-snug line-clamp-2 min-h-[2rem]">
              {name}
            </h3>
          </Link>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-2.5 pt-2 border-t border-[#E7E0D0]/50 dark:border-[#2A3B2F]/60">
          <div className="flex items-baseline gap-1.5 mb-2">
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
            className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FAF6EC] hover:bg-[#1F4D2E] text-[#1F4D2E] hover:text-white dark:bg-[#111813] dark:hover:bg-[#284F33] dark:text-[#E2DDD3] dark:hover:text-white border border-[#E7E0D0] dark:border-[#2A3B2F]'
            }`}
          >
            {added ? (
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
    </div>
  );
};
