const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { variants: true, images: true }
  });
  console.log(`Checking all ${products.length} products...`);
  for (const p of products) {
    if (p.images && p.images.some(img => img.url.includes('uploads') || img.url.includes('blob') || !img.url.includes('/foods/'))) {
      console.log('UPLOADED PRODUCT:', p.id, p.name, p.slug, p.images.map(i => i.url));
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
