import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Check,
  AlertTriangle,
  Heart,
  Share2,
  FileText,
  Sparkles,
  Maximize2,
  X,
  Package,
  Award,
  ChevronRight,
} from 'lucide-react';
import { PincodeChecker } from '../components/PincodeChecker';
import { ProductCard } from '../components/ProductCard';
import { ProductReviewsSection } from '../components/ProductReviewsSection';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import { Product, ProductVariant } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'nutrition' | 'usage'>('benefits');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Zoom lens coordinates
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data?.data as { product: Product; relatedProducts: Product[] };
    },
  });

  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];

  // Update selected variant when product data loads
  React.useEffect(() => {
    if (product?.variants?.length) {
      const defaultVar = product.variants.find((v) => v.isDefault) || product.variants[0];
      setSelectedVariant(defaultVar);
    }
  }, [product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  if (isLoading) {
    return (
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-amber-50/60 rounded-3xl border border-[#E7E0D0]" />
          <div className="space-y-4">
            <div className="h-6 bg-amber-100/60 rounded-full w-1/4" />
            <div className="h-10 bg-amber-100/60 rounded-xl w-3/4" />
            <div className="h-4 bg-amber-100/60 rounded w-1/2" />
            <div className="h-20 bg-amber-50/60 rounded-2xl w-full mt-6" />
            <div className="h-12 bg-amber-100/60 rounded-xl w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-[#E7E0D0] flex items-center justify-center mx-auto mb-4 text-[#D9A441]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6 max-w-md mx-auto">
          The artisanal product you are looking for might have been moved or is currently sold out for the season.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#2F5D3A] text-white text-xs font-bold rounded-full shadow-md hover:bg-[#1F4D2E] transition-all"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const currentVariant = selectedVariant || product.variants[0];
  const images = product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', isPrimary: true, displayOrder: 0, id: '1', productId: product.id }];
  const currentImage = images[selectedImageIndex]?.url || images[0].url;

  const discountPercent = currentVariant.mrp > currentVariant.price
    ? Math.round(((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addToCart(product, currentVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    if (!currentVariant) return;
    addToCart(product, currentVariant, quantity);
    navigate('/checkout');
  };

  // Determine store-themed category badges
  const storeSlug = product.store?.slug || 'foods';
  const getStoreTheme = () => {
    if (storeSlug === 'baby-nutrition' || product.storeId === 'baby') {
      return {
        label: 'Baby & Family Nutrition',
        badgeClass: 'bg-[#5DB4D6]/15 text-[#1e6f92] border-[#5DB4D6]/30',
        dotClass: 'bg-[#5DB4D6]',
        primaryColor: '#5DB4D6',
      };
    }
    if (storeSlug === 'personal-care' || product.storeId === 'care') {
      return {
        label: 'Personal Care & Clays',
        badgeClass: 'bg-[#E0808C]/15 text-[#973441] border-[#E0808C]/30',
        dotClass: 'bg-[#E0808C]',
        primaryColor: '#E0808C',
      };
    }
    return {
      label: 'Mewa & Healthy Foods',
      badgeClass: 'bg-[#2F5D3A]/10 text-[#1F4D2E] border-[#2F5D3A]/20',
      dotClass: 'bg-[#2F5D3A]',
      primaryColor: '#2F5D3A',
    };
  };

  const storeTheme = getStoreTheme();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 pb-28 sm:pb-16 bg-[#FAF6EC] dark:bg-[#111813] text-[#2B2B2B] dark:text-[#F3EFE6] transition-colors duration-300 min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-[#2F5D3A] dark:hover:text-[#65B77E] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" />
        <Link to={`/shop?store=${storeSlug}`} className="hover:text-[#2F5D3A] dark:hover:text-[#65B77E] transition-colors">
          {storeTheme.label}
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" />
            <Link to={`/shop/${product.category.slug}`} className="hover:text-[#2F5D3A] dark:hover:text-[#65B77E] transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" />
        <span className="text-[#2F5D3A] dark:text-[#65B77E] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Hero Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left Column: Gallery with Zoom Preview */}
        <div className="space-y-4">
          <div
            ref={imgContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
            className="aspect-square rounded-3xl overflow-hidden bg-white dark:bg-[#18221B] border border-[#E7E0D0] dark:border-[#2A3B2F] shadow-soft relative cursor-crosshair group"
          >
            <img
              src={currentImage}
              alt={product.name}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }}
              className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                isHoveringImage ? 'sm:scale-150' : 'scale-100'
              }`}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#D9A441] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            )}

            {/* Wishlist & Zoom Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className={`w-9 h-9 rounded-full bg-white/95 dark:bg-[#18221B]/95 backdrop-blur-xs border border-gray-200 dark:border-[#2A3B2F] flex items-center justify-center shadow-xs transition-all ${
                  wishlisted ? 'text-red-500 bg-red-50/90 dark:bg-red-950/40' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
                }`}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <button
                onClick={() => setIsZoomModalOpen(true)}
                className="w-9 h-9 rounded-full bg-white/95 dark:bg-[#18221B]/95 backdrop-blur-xs border border-gray-200 dark:border-[#2A3B2F] text-gray-600 dark:text-gray-300 hover:text-[#2F5D3A] dark:hover:text-[#65B77E] flex items-center justify-center shadow-xs transition-all"
                title="Open fullscreen view"
                aria-label="Full screen zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* FSSAI Badge on Image */}
            {product.fssaiNumber && product.storeId !== 'care' && (
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-[#18221B]/90 backdrop-blur-md text-[11px] font-semibold text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full border border-gray-200/80 dark:border-[#2A3B2F] flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F5D3A] dark:text-[#65B77E]" />
                <span>FSSAI Lic. {product.fssaiNumber}</span>
              </div>
            )}

            {/* Hover Zoom hint for desktop */}
            <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span>Roll over to zoom</span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white dark:bg-[#18221B] ${
                    selectedImageIndex === idx
                      ? 'border-[#2F5D3A] dark:border-[#65B77E] shadow-md scale-102 ring-2 ring-[#2F5D3A]/20'
                      : 'border-[#E7E0D0] dark:border-[#2A3B2F] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Controls */}
        <div className="space-y-6">
          {/* Header & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              {/* Store-themed category badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${storeTheme.badgeClass}`}>
                <span className={`w-2 h-2 rounded-full ${storeTheme.dotClass}`} />
                {storeTheme.label}
              </span>

              {/* Dietary / Feature Tags */}
              {product.dietaryTags && product.dietaryTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-[#FAF6EC] dark:bg-[#18221B] text-[#805D17] dark:text-[#E6C687] border border-[#E7E0D0] dark:border-[#2A3B2F]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Metadata */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2.5 text-xs text-gray-500 dark:text-gray-400">
              <a
                href="#customer-reviews"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                title="Click to view verified customer reviews"
              >
                <div className="flex text-[#D9A441]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4.8)
                          ? 'fill-[#D9A441] text-[#D9A441]'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-900 dark:text-white ml-0.5">{(product.rating || 4.8).toFixed(1)}</span>
                <span className="text-gray-500 dark:text-gray-400 underline decoration-dotted underline-offset-2">
                  ({product.reviewCount || 48} reviews)
                </span>
              </a>
              <span>•</span>
              <span>HSN: <strong className="text-gray-700 dark:text-gray-300">{product.hsnCode}</strong></span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">✓ Mandi Direct Fresh</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 bg-[#FAF6EC]/80 dark:bg-[#18221B] rounded-2xl border border-[#E7E0D0] dark:border-[#2A3B2F] flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1F4D2E] dark:text-[#65B77E]">
                  ₹{currentVariant.price}
                </span>
                {currentVariant.mrp > currentVariant.price && (
                  <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                    ₹{currentVariant.mrp}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-[#805D17] dark:text-[#E6C687] bg-[#F7EBD2] dark:bg-[#2A2312] border border-[#D9A441]/40 px-2.5 py-0.5 rounded-full">
                    Save ₹{currentVariant.mrp - currentVariant.price} ({discountPercent}% OFF)
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1.5">
                Price includes {product.gstRate}% GST (₹{(currentVariant.price - currentVariant.price / (1 + product.gstRate / 100)).toFixed(2)} tax inclusive)
              </span>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className={`font-bold inline-flex items-center gap-1 ${currentVariant.stock > 10 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {currentVariant.stock > 0 ? `In Stock (${currentVariant.stock} available)` : 'Sold Out'}
              </span>
              <span className="text-gray-400 dark:text-gray-500 block mt-0.5">SKU: {currentVariant.sku}</span>
            </div>
          </div>

          {/* Pill-Style Weight Selector Chips */}
          {product.variants.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Select Pack Size / Weight:
                </span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  Active: <strong className="text-gray-900 dark:text-white">{currentVariant.name}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = currentVariant.id === v.id;
                  const vDiscount = v.mrp > v.price ? Math.round(((v.mrp - v.price) / v.mrp) * 100) : 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-full border-2 text-xs transition-all flex items-center gap-2.5 min-h-[44px] ${
                        isSelected
                          ? 'border-[#2F5D3A] dark:border-[#65B77E] bg-[#FAF6EC] dark:bg-[#14261B] text-[#1F4D2E] dark:text-[#8ED9A0] font-bold shadow-xs ring-2 ring-[#2F5D3A]/20'
                          : 'border-gray-200 dark:border-[#2A3B2F] bg-white dark:bg-[#18221B] text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className={`font-bold ${isSelected ? 'text-[#2F5D3A] dark:text-[#8ED9A0]' : 'text-gray-900 dark:text-white'}`}>
                        ₹{v.price}
                      </span>
                      {vDiscount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF6EC] dark:bg-[#2A2312] text-[#805D17] dark:text-[#E6C687] border border-[#E7E0D0] dark:border-[#3E3520]">
                          {vDiscount}% off
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Dual CTA Buttons (Green Add to Cart + Gold Buy Now) */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center justify-between border border-gray-300 dark:border-[#2A3B2F] rounded-full bg-white dark:bg-[#18221B] px-2 py-1 shadow-xs shrink-0 h-12 sm:w-36">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#FAF6EC] dark:hover:bg-[#223326] rounded-full transition-colors active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-gray-900 dark:text-white px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#FAF6EC] dark:hover:bg-[#223326] rounded-full transition-colors active:scale-95"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Green Pill Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={currentVariant.stock <= 0}
                className={`flex-1 h-12 px-6 rounded-full font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 min-h-[44px] ${
                  addedAnimation
                    ? 'bg-emerald-700 text-white scale-98'
                    : 'bg-[#2F5D3A] hover:bg-[#1F4D2E] text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket • ₹{currentVariant.price * quantity}</span>
                  </>
                )}
              </button>

              {/* Gold Pill Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={currentVariant.stock <= 0}
                className="h-12 px-7 rounded-full font-bold text-sm bg-[#D9A441] hover:bg-[#B88728] text-white shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 min-h-[44px]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Safe Advisory Warning if applicable */}
          {product.safetyNotice && (
            <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#D9A441] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Health & Safe Usage Advisory:</strong>
                <p>{product.safetyNotice}</p>
              </div>
            </div>
          )}

          {/* Real-Time Pincode Checker */}
          <PincodeChecker />

          {/* 4 Trust Badges Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-200 dark:border-[#2A3B2F]">
            <div className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-[#18221B] rounded-xl border border-gray-100 dark:border-[#2A3B2F] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#2F5D3A] dark:text-[#8ED9A0] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <strong className="block text-gray-900 dark:text-white">100% Pure</strong>
                <span className="text-gray-500 dark:text-gray-400">Zero fillers</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-[#18221B] rounded-xl border border-gray-100 dark:border-[#2A3B2F] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-[#D9A441] flex items-center justify-center shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <strong className="block text-gray-900 dark:text-white">Airtight Fresh</strong>
                <span className="text-gray-500 dark:text-gray-400">Nitrogen pouch</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-[#18221B] rounded-xl border border-gray-100 dark:border-[#2A3B2F] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <strong className="block text-gray-900 dark:text-white">Pan-India</strong>
                <span className="text-gray-500 dark:text-gray-400">Free on ₹499+</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-[#18221B] rounded-xl border border-gray-100 dark:border-[#2A3B2F] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#2F5D3A] dark:text-[#8ED9A0] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <strong className="block text-gray-900 dark:text-white">Certified</strong>
                <span className="text-gray-500 dark:text-gray-400">FSSAI / AYUSH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Benefits, Nutrition Facts, Usage */}
      <div className="bg-white dark:bg-[#18221B] rounded-3xl border border-[#E7E0D0] dark:border-[#2A3B2F] shadow-soft p-6 sm:p-8">
        <div className="flex border-b border-gray-200 dark:border-[#2A3B2F] mb-6 gap-3 sm:gap-8 overflow-x-auto scrollbar-none items-center justify-between">
          <div className="flex gap-3 sm:gap-8 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'benefits'
                  ? 'border-[#2F5D3A] dark:border-[#65B77E] text-[#2F5D3A] dark:text-[#65B77E]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Purity & Key Benefits
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'nutrition'
                  ? 'border-[#2F5D3A] dark:border-[#65B77E] text-[#2F5D3A] dark:text-[#65B77E]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Ingredients & Nutrition
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'usage'
                  ? 'border-[#2F5D3A] dark:border-[#65B77E] text-[#2F5D3A] dark:text-[#65B77E]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              How to Consume / Use
            </button>
          </div>

          <a
            href="#customer-reviews"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="pb-3 text-xs sm:text-sm font-bold border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-[#2F5D3A] dark:hover:text-[#65B77E] transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Jump to verified customer reviews"
          >
            <span>Customer Reviews</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-[#805D17] dark:text-[#E6C687] font-bold">
              {product.reviewCount || 48}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 hidden sm:inline">↓</span>
          </a>
        </div>

        {activeTab === 'benefits' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">{product.description}</p>
            {product.benefits && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  Key Ayurvedic & Nutritional Benefits:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-[#FAF6EC]/60 dark:bg-[#14261B]/60 p-3 rounded-xl border border-[#E7E0D0]/80 dark:border-[#2A3B2F]">
                      <Check className="w-4 h-4 text-[#2F5D3A] dark:text-[#65B77E] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-5">
            {product.ingredients && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Declared Ingredients:</h4>
                <p className="text-sm text-gray-800 dark:text-gray-200 bg-[#FAF6EC]/60 dark:bg-[#14261B]/60 p-3.5 rounded-xl border border-[#E7E0D0] dark:border-[#2A3B2F]">
                  {product.ingredients}
                </p>
              </div>
            )}
            {product.nutritionFacts && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Nutritional Values (Approx. per 100g):
                </h4>
                <div className="overflow-x-auto max-w-xl">
                  <table className="min-w-full text-xs text-left border border-[#E7E0D0] dark:border-[#2A3B2F] rounded-xl overflow-hidden">
                    <thead className="bg-[#FAF6EC] dark:bg-[#14261B] text-gray-800 dark:text-gray-200 uppercase font-bold">
                      <tr>
                        <th className="p-3">Nutrient Parameter</th>
                        <th className="p-3">Quantity per 100g</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E0D0] dark:divide-[#2A3B2F]">
                      {Object.entries(product.nutritionFacts).map(([k, v]) => (
                        <tr key={k} className="hover:bg-gray-50 dark:hover:bg-[#14261B]/40">
                          <td className="p-3 font-medium text-gray-600 dark:text-gray-400 capitalize">{k}</td>
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{String(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 max-w-3xl">
            <p>{product.howToUse || 'Store in a cool, dry place away from direct sunlight. Once opened, transfer to an airtight container to preserve authentic crunch.'}</p>
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <strong className="block font-bold">Packaging & Shelf Life Guarantee:</strong>
              <p>Best Before: 9 Months from date of packaging. Packed in an FSSAI certified hygienic facility with nitrogen flushing.</p>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Customer Reviews & Ratings Section */}
      <div id="customer-reviews" className="scroll-mt-24">
        <ProductReviewsSection
          productId={product.id}
          productName={product.name}
          initialRating={product.rating || 4.8}
          initialReviewCount={product.reviewCount || 48}
        />
      </div>

      {/* Related Products Shelf */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441] block">
                Pure Complements
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                You May Also Like
              </h3>
            </div>
            <Link
              to={`/shop?store=${storeSlug}`}
              className="text-xs font-bold text-[#2F5D3A] dark:text-[#65B77E] hover:underline flex items-center gap-1"
            >
              <span>Explore All {storeTheme.label}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p as Product} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Purchase Bar on Mobile (390px) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#18221B]/95 backdrop-blur-md border-t border-[#E7E0D0] dark:border-[#2A3B2F] p-3 flex items-center justify-between gap-3 sm:hidden shadow-xl">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-bold text-[#1F4D2E] dark:text-[#65B77E]">
              ₹{currentVariant.price * quantity}
            </span>
            {currentVariant.mrp > currentVariant.price && (
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                ₹{currentVariant.mrp * quantity}
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate max-w-[120px]">
            {currentVariant.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={currentVariant.stock <= 0}
            className={`px-4 py-2.5 rounded-full font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 min-h-[44px] ${
              addedAnimation
                ? 'bg-emerald-700 text-white'
                : 'bg-[#2F5D3A] text-white'
            }`}
          >
            {addedAnimation ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>Add</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={currentVariant.stock <= 0}
            className="px-5 py-2.5 rounded-full font-bold text-xs bg-[#D9A441] text-white shadow-sm flex items-center gap-1.5 min-h-[44px]"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-[#D9A441] p-2 rounded-full bg-black/40 transition-colors"
            aria-label="Close fullscreen zoom"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-3xl max-h-[85vh] bg-white dark:bg-[#18221B] rounded-3xl overflow-hidden p-2">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
