const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pCount = await prisma.product.count();
  const vCount = await prisma.productVariant.count();
  console.log(`Products in DB: ${pCount}, Variants in DB: ${vCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
