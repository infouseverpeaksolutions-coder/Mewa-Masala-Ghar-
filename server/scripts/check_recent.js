const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Total products: ${products.length}`);
  for (const p of products.slice(0, 5)) {
    console.log(`ID: ${p.id} | Name: ${p.name} | Slug: ${p.slug} | CreatedAt: ${p.createdAt}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
