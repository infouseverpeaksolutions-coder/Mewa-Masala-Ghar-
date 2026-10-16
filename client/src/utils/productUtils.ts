/**
 * Product utility helpers for Mewa Masala Ghar
 */

export interface ProductLike {
  name?: string;
  category?: { name?: string; slug?: string } | null;
  categoryName?: string;
  categorySlug?: string;
  isCombo?: boolean;
}

/**
 * Determines whether a product belongs to a Gift / Hamper category
 * or is a gift pack/hamper requiring a Minimum Order Quantity (MOQ) of 3 units.
 */
export const isGiftProduct = (product?: ProductLike | null): boolean => {
  if (!product) return false;
  const catName = (product.category?.name || product.categoryName || '').toLowerCase().trim();
  const catSlug = (product.category?.slug || product.categorySlug || '').toLowerCase().trim();
  const prodName = (product.name || '').toLowerCase().trim();

  // 1. Category check: category name or slug contains 'gift' or 'hamper'
  if (
    catName.includes('gift') ||
    catSlug.includes('gift') ||
    catName.includes('hamper') ||
    catSlug.includes('hamper')
  ) {
    return true;
  }

  // 2. Product name check: product name contains 'hamper', 'gift box', 'gift pack', 'gift hamper'
  if (
    prodName.includes('hamper') ||
    prodName.includes('gift box') ||
    prodName.includes('gift pack') ||
    prodName.includes('gift hamper')
  ) {
    return true;
  }

  return false;
};

/**
 * Returns the minimum order quantity for a given product.
 * Gift category products require at least 3 units; all other items require 1.
 */
export const getMinOrderQuantity = (product?: ProductLike | null): number => {
  return isGiftProduct(product) ? 3 : 1;
};
