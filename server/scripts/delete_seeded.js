const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const seeded = await prisma.productVariant.findMany({
    where: { sku: { contains: 'G-' } }
  });

  console.log(`Found ${seeded.length} auto-seeded variants.`);
  let deleted = 0;
  for (const v of seeded) {
    try {
      await prisma.cartItem.deleteMany({ where: { productVariantId: v.id } });
      await prisma.productVariant.delete({ where: { id: v.id } });
      deleted++;
    } catch (e) {
      console.log('Error deleting', v.id, e.message);
    }
  }
  console.log(`Successfully deleted ${deleted} auto-seeded variants.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
