export interface StandardWeightOption {
  grams: number;
  label: string;
  shortLabel: string;
}

export const STANDARD_WEIGHT_OPTIONS: StandardWeightOption[] = [
  { grams: 100, label: '100 Grams (100g)', shortLabel: '100g' },
  { grams: 200, label: '200 Grams (200g)', shortLabel: '200g' },
  { grams: 250, label: '250 Grams (250g)', shortLabel: '250g' },
  { grams: 500, label: '500 Grams (500g)', shortLabel: '500g' },
  { grams: 1000, label: '1 Kilogram (1 kg)', shortLabel: '1 kg' },
];

/**
 * Formats weight in grams into clean human-readable label (e.g. 100g, 250g, 500g, 1 kg)
 */
export function formatWeight(weightGrams?: number | null, fallbackName?: string): string {
  if (weightGrams !== undefined && weightGrams !== null && !isNaN(Number(weightGrams))) {
    const g = Number(weightGrams);
    if (g >= 1000) {
      const kg = g / 1000;
      return `${kg % 1 === 0 ? kg : kg.toFixed(1)} kg`;
    }
    return `${g}g`;
  }
  return fallbackName || 'Standard Pack';
}

/**
 * Ensures all 5 standard weights (100g, 200g, 250g, 500g, 1 kg) are available for a product.
 * Preserves exact admin prices from DB where available, and computes clean proportional prices for any missing standard weights.
 */
export function ensureStandardVariants<T extends {
  id?: string;
  name?: string;
  weightGrams?: number | null;
  price?: number | string;
  mrp?: number | string;
  stock?: number;
  stockQty?: number;
  sku?: string;
  isDefault?: boolean;
}>(product: {
  id?: string;
  name?: string;
  sku?: string;
  price?: number | string;
  mrp?: number | string;
  variants?: T[];
}): T[] {
  const existingVariants = Array.isArray(product?.variants) ? [...product.variants] : [];

  // Determine base reference variant for proportional pricing
  let baseVariant = existingVariants.find((v) => Number(v.price) > 0 && Number(v.weightGrams) > 0);
  if (!baseVariant && existingVariants.length > 0) {
    baseVariant = existingVariants[0];
  }

  const basePrice = Number(baseVariant?.price) || Number(product?.price) || 299;
  const baseMrp = Number(baseVariant?.mrp) || Number(product?.mrp) || Math.round(basePrice * 1.2);
  const baseWeight = Number(baseVariant?.weightGrams) || 250;

  const pricePerGram = basePrice / baseWeight;
  const mrpPerGram = baseMrp / baseWeight;

  const standardWeights = [100, 200, 250, 500, 1000];
  const result: T[] = [];

  // 1. First, add all standard weights (using DB variant if exists, else synthesize)
  for (const targetGrams of standardWeights) {
    const matched = existingVariants.find((v) => {
      const w = Number(v.weightGrams);
      if (w === targetGrams) return true;
      // Also match by variant name if weightGrams was null
      const n = (v.name || '').toLowerCase();
      if (targetGrams === 100 && (n.includes('100g') || n.includes('100 g'))) return true;
      if (targetGrams === 200 && (n.includes('200g') || n.includes('200 g'))) return true;
      if (targetGrams === 250 && (n.includes('250g') || n.includes('250 g'))) return true;
      if (targetGrams === 500 && (n.includes('500g') || n.includes('500 g'))) return true;
      if (targetGrams === 1000 && (n.includes('1kg') || n.includes('1 kg') || n.includes('1000g'))) return true;
      return false;
    });

    if (matched) {
      result.push({
        ...matched,
        weightGrams: targetGrams,
        price: Number(matched.price) || basePrice,
        mrp: Number(matched.mrp) || Math.round(Number(matched.price) * 1.2),
      });
    } else {
      // Synthesize missing standard tier with clean pricing
      let factor = 1.0;
      if (targetGrams === 500) factor = 0.96; // 4% bulk economy
      if (targetGrams === 1000) factor = 0.92; // 8% bulk economy

      const calcPrice = Math.max(19, Math.round((pricePerGram * targetGrams * factor) / 5) * 5);
      const calcMrp = Math.max(calcPrice, Math.round((mrpPerGram * targetGrams * factor) / 5) * 5);

      const syntheticVariant: any = {
        id: `synth-${product?.id || 'prod'}-${targetGrams}`,
        productId: product?.id,
        name: `${product?.name || 'Product'} - ${formatWeight(targetGrams)}`,
        weightGrams: targetGrams,
        price: calcPrice,
        mrp: calcMrp,
        stock: baseVariant?.stockQty ?? baseVariant?.stock ?? 50,
        stockQty: baseVariant?.stockQty ?? baseVariant?.stock ?? 50,
        sku: `${product?.sku || 'MMG'}-${targetGrams}G`,
        isDefault: targetGrams === 250 || (baseWeight === targetGrams),
      };
      result.push(syntheticVariant);
    }
  }

  // 2. Also keep any non-standard custom variants the admin created (e.g. 80g snack pack)
  for (const v of existingVariants) {
    const w = Number(v.weightGrams);
    if (w && !standardWeights.includes(w)) {
      result.push(v);
    }
  }

  // Sort ascending by weight
  result.sort((a, b) => (Number(a.weightGrams) || 0) - (Number(b.weightGrams) || 0));

  return result;
}

