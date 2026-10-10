/**
 * Formats weight in grams into clean human-readable label (e.g. 100g, 200g, 250g, 500g, 1 kg)
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
