const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const images = await prisma.productImage.findMany({
    where: {
      url: { contains: 'image-1791572050977' }
    },
    include: { product: true }
  });
  console.log('Images matched:', images);
}

main().catch(console.error).finally(() => prisma.$disconnect());
