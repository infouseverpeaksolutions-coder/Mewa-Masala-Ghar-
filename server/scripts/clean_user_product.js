const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { variants: true }
  });

  for (const p of products) {
    const userVar = p.variants.find(v => v.sku && v.sku.includes('680306'));
    if (userVar) {
      console.log('USER PRODUCT FOUND:', p.id, p.name);
      console.log('Variants:');
      for (const v of p.variants) {
        console.log(`- ${v.id} | ${v.sku} | ${v.name} | ${v.weightGrams}g | ₹${v.price}`);
        // Delete all variants except the original one (MMG-680306-1)
        if (v.id !== userVar.id) {
          console.log(`Deleting extra variant ${v.id}...`);
          await prisma.productVariant.delete({ where: { id: v.id } });
        }
      }
    }
  }

  // Also remove all variants across all products that have sku containing 'G-' from the seed script
  const seeded = await prisma.productVariant.findMany({
    where: { sku: { contains: 'G-' } }
  });

  console.log(`Remaining auto-seeded variants to delete: ${seeded.length}`);
  for (const v of seeded) {
    try {
      await prisma.productVariant.delete({ where: { id: v.id } });
    } catch (e) {
      console.log(`Skip ${v.sku}: ${e.message}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
