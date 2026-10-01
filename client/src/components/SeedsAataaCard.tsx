import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MockProduct } from '../data/mockData';

export const SeedsAataaCard: React.FC<{ product: MockProduct }> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartProduct: any = {
      id: product.id,
      name: product.name,
      slug: product.id,
      price: product.price,
      images: [{ url: product.image, isPrimary: true }],
    };
    const cartVariant: any = {
      id: `var-${product.id}`,
      name: product.weight || 'Standard Pack',
      price: product.price,
      mrp: product.originalPrice || Math.round(product.price * 1.2),
      weightGrams: product.weight?.includes('kg') ? 1000 : 200,
      stock: 50,
    };

    addToCart(cartProduct, cartVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white dark:bg-[#18221B] rounded-2xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-3 sm:p-3.5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1 relative">
      {/* Top Badges Row */}
      <div className="flex items-center justify-between gap-1.5 mb-2">
        {product.badge ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6EC] dark:bg-[#202E24] text-[#1F4D2E] dark:text-[#8ED9A0] border border-[#E7E0D0]/80 dark:border-[#2A3B2F] truncate">
            {product.badge}
          </span>
        ) : (
          <span className="text-[10px] font-medium text-[#7A6B58] dark:text-[#C5BCAD]">
            {product.category}
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
        to={product.link}
        className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#FAF6EC]/80 dark:bg-[#111813]/60 mb-2.5 flex items-center justify-center p-2.5"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/foods/foods_dryfruits.jpg';
          }}
        />

        {/* Net Weight Pill */}
        {product.weight && (
          <span className="absolute bottom-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/65 text-white backdrop-blur-xs">
            {product.weight}
          </span>
        )}
      </Link>

      {/* Product Content & Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating & Review Count */}
          {product.rating && (
            <div className="flex items-center gap-1 text-[11px] text-[#8C6D37] dark:text-[#E5B85C] mb-1">
              <Star className="w-3 h-3 fill-[#D9A441] text-[#D9A441]" />
              <span className="font-semibold">{product.rating}</span>
              {product.reviewCount && (
                <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Product Title */}
          <Link to={product.link} className="block group-hover:underline decoration-[#D9A441]">
            <h3 className="font-serif text-xs sm:text-[13px] font-bold text-[#1F4D2E] dark:text-[#8ED9A0] group-hover:text-[#D9A441] dark:group-hover:text-[#E5B85C] transition-colors leading-snug line-clamp-2 min-h-[2rem]">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-2.5 pt-2 border-t border-[#E7E0D0]/50 dark:border-[#2A3B2F]/60">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-serif font-bold text-sm sm:text-base text-[#1F4D2E] dark:text-white">
              ₹ {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                ₹ {product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
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
