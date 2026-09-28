import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MockProduct } from '../data/mockData';

export const MewaProductCard: React.FC<{ product: MockProduct }> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Map mock product to Cart item
    const cartProduct: any = {
      id: product.id,
      name: product.name,
      slug: product.id,
      price: product.price,
      images: [{ url: product.image, isPrimary: true }],
    };
    const cartVariant: any = {
      id: `var-${product.id}`,
      name: 'Standard Pack',
      price: product.price,
      mrp: Math.round(product.price * 1.2),
      weightGrams: 250,
      stock: 50,
    };

    addToCart(cartProduct, cartVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-[#E7E0D0] p-3 sm:p-4 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between h-full relative hover:-translate-y-1">
      {/* Product Image */}
      <Link to={product.link} className="block relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6EC]/70 mb-3 flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={product.name}
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/foods/foods_dryfruits.jpg';
          }}
        />
      </Link>

      {/* Product Info & Action */}
      <div className="flex-1 flex flex-col justify-between">
        <Link to={product.link} className="block mb-1.5">
          <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1F4D2E] group-hover:text-[#D9A441] transition-colors leading-tight truncate">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <div className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E]">
              ₹ {product.price}
            </div>

            {product.rating && (
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#8C6D37] mt-0.5">
                <Star className="w-3 h-3 fill-[#D9A441] text-[#D9A441]" />
                <span className="font-semibold">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Round Dark Green Cart Button (touch target >= 44px) */}
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-[#1F4D2E] hover:bg-[#163821] text-white active:scale-95'
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
