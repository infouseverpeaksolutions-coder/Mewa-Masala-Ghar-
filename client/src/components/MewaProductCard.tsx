import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../utils/imageUrl';

export const MewaProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Extract fields whether from DB Product or MockProduct
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
    weightGrams: 250,
    stock: 50,
    sku: `SKU-${id}`,
    isDefault: true,
  };
  const price = primaryVariant.price ?? product.price ?? 299;

  // Image resolution
  const rawImg =
    product.images?.find((i: any) => i.isPrimary)?.url ||
    product.images?.[0]?.url ||
    product.image ||
    '/foods/foods_dryfruits.jpg';
  const imgUrl = resolveImageUrl(rawImg);

  const rating = product.rating || 4.9;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, primaryVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group bg-white dark:bg-[#18221B] rounded-2xl sm:rounded-3xl border border-[#E7E0D0] dark:border-[#2A3B2F] p-3 sm:p-4 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full relative hover:-translate-y-1">
      {/* Product Image */}
      <Link
        to={link}
        className="block relative aspect-[4/5] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6EC]/70 dark:bg-[#111813]/60 mb-3 flex items-center justify-center p-2"
      >
        <img
          src={imgUrl}
          alt={name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/foods/foods_dryfruits.jpg';
          }}
        />
      </Link>

      {/* Product Info & Action */}
      <div className="flex-1 flex flex-col justify-between">
        <Link to={link} className="block mb-1.5">
          <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1F4D2E] dark:text-[#8ED9A0] group-hover:text-[#D9A441] dark:group-hover:text-[#E5B85C] transition-colors leading-tight truncate">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <div className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E] dark:text-white">
              ₹ {price}
            </div>

            {rating && (
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#8C6D37] dark:text-[#E5B85C] mt-0.5">
                <Star className="w-3 h-3 fill-[#D9A441] text-[#D9A441]" />
                <span className="font-semibold">{rating}</span>
              </div>
            )}
          </div>

          {/* Round Dark Green Cart Button */}
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-[#1F4D2E] hover:bg-[#163821] dark:bg-[#284F33] dark:hover:bg-[#346643] text-white active:scale-95'
            }`}
          >
            {added ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
