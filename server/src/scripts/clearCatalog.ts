import prisma from '../config/db';

async function clearCatalog() {
  console.log('Clearing sample products and items...');

  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  const count = await prisma.product.deleteMany();

  console.log(`✅ Cleared ${count.count} products successfully. Catalog is now clean for fresh uploads.`);
}

clearCatalog()
  .catch((e) => {
    console.error('Error clearing catalog:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
