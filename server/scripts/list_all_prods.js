const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { variants: true }
  });

  console.log(`Total Products: ${products.length}`);
  for (const p of products) {
    console.log(`\nPRODUCT: [${p.id}] "${p.name}" (slug: ${p.slug})`);
    for (const v of p.variants) {
      console.log(`   variant: [${v.id}] sku=${v.sku} weight=${v.weightGrams} price=${v.price}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
