const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { variants: true }
  });

  console.log(`Checking ${products.length} products in database...`);
  const standardWeights = [100, 200, 250, 500, 1000];

  let addedCount = 0;

  for (const product of products) {
    const existing = product.variants || [];
    const baseVar = existing.find(v => Number(v.price) > 0 && Number(v.weightGrams) > 0) || existing[0];
    const baseGrams = Number(baseVar?.weightGrams) || 250;
    const basePrice = Number(baseVar?.price) || Number(product.price) || 299;
    const baseMrp = Number(baseVar?.mrp) || Math.round(basePrice * 1.2);
    const pricePerG = basePrice / baseGrams;
    const mrpPerG = baseMrp / baseGrams;

    for (const targetGrams of standardWeights) {
      const match = existing.find(v => {
        const w = Number(v.weightGrams);
        if (w === targetGrams) return true;
        const n = (v.name || '').toLowerCase();
        if (targetGrams === 100 && (n.includes('100g') || n.includes('100 g'))) return true;
        if (targetGrams === 200 && (n.includes('200g') || n.includes('200 g'))) return true;
        if (targetGrams === 250 && (n.includes('250g') || n.includes('250 g'))) return true;
        if (targetGrams === 500 && (n.includes('500g') || n.includes('500 g'))) return true;
        if (targetGrams === 1000 && (n.includes('1kg') || n.includes('1 kg') || n.includes('1000g'))) return true;
        return false;
      });

      if (!match) {
        let factor = 1.0;
        if (targetGrams === 500) factor = 0.96;
        if (targetGrams === 1000) factor = 0.92;

        const calcPrice = Math.max(19, Math.round((pricePerG * targetGrams * factor) / 5) * 5);
        const calcMrp = Math.max(calcPrice, Math.round((mrpPerG * targetGrams * factor) / 5) * 5);
        const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const wLabel = targetGrams >= 1000 ? `${targetGrams / 1000}kg Pack` : `${targetGrams}g Pack`;

        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: `${product.name} - ${wLabel}`,
            weightGrams: targetGrams,
            price: calcPrice,
            mrp: calcMrp,
            stockQty: 50,
            packQty: 1,
            gstPercent: product.gstRate || 12.0,
            sku: `${product.sku || 'MMG'}-${targetGrams}G-${randSuffix}`,
            isDefault: targetGrams === 250 || targetGrams === 200,
            isActive: true,
          }
        });
        addedCount++;
        console.log(`Added ${targetGrams}g (₹${calcPrice}) for "${product.name}"`);
      }
    }
  }

  console.log(`Done! Added ${addedCount} missing variants across ${products.length} products.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
