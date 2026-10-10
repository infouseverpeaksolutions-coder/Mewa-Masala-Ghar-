const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const seededVariants = await prisma.productVariant.findMany({
    where: {
      sku: {
        contains: 'G-'
      }
    }
  });

  console.log(`Found ${seededVariants.length} auto-seeded variants to remove.`);

  for (const v of seededVariants) {
    try {
      await prisma.cartItem.deleteMany({ where: { productVariantId: v.id } });
      await prisma.orderItem.deleteMany({ where: { variantId: v.id } });
      await prisma.bundleItem.deleteMany({ where: { variantId: v.id } });
      await prisma.productVariant.delete({ where: { id: v.id } });
    } catch (e) {
      console.log(`Could not delete variant ${v.id} (${v.sku}):`, e.message);
    }
  }

  // Also verify user's product variants
  const products = await prisma.product.findMany({
    include: { variants: true }
  });

  for (const p of products) {
    if (p.variants.some(v => v.sku && v.sku.includes('680306'))) {
      console.log('User Product:', p.name, 'variants:');
      console.log(p.variants.map(v => ({ id: v.id, sku: v.sku, weight: v.weightGrams, price: v.price })));
    }
  }

  console.log('Done cleaning variants!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
