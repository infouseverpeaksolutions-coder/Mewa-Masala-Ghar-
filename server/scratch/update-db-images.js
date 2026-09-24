import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Updating product images in database to ensure authentic, appetizing photos...');

  // 1. Pratham Aahar: replace medicine pill photo with baby cereal porridge
  const prathamProduct = await prisma.product.findFirst({
    where: { name: { contains: 'Pratham Aahar' } },
  });
  if (prathamProduct) {
    await prisma.productImage.deleteMany({ where: { productId: prathamProduct.id } });
    await prisma.productImage.create({
      data: {
        productId: prathamProduct.id,
        url: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80',
        altText: prathamProduct.name,
        isPrimary: true,
        displayOrder: 1,
      },
    });
    console.log('Updated Pratham Aahar image.');
  }

  // 2. Organic Brown Flax Seeds: ensure it has an image
  const flaxProduct = await prisma.product.findFirst({
    where: { name: { contains: 'Flax Seeds' } },
  });
  if (flaxProduct) {
    const existing = await prisma.productImage.findFirst({ where: { productId: flaxProduct.id } });
    if (!existing) {
      await prisma.productImage.create({
        data: {
          productId: flaxProduct.id,
          url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
          altText: flaxProduct.name,
          isPrimary: true,
          displayOrder: 1,
        },
      });
      console.log('Created Flax Seeds image.');
    }
  }

  // 3. Daily Poshan: update salad image to healthy grain blend / porridge
  const dailyPoshan = await prisma.product.findFirst({
    where: { name: { contains: 'Daily Poshan' } },
  });
  if (dailyPoshan) {
    await prisma.productImage.deleteMany({ where: { productId: dailyPoshan.id } });
    await prisma.productImage.create({
      data: {
        productId: dailyPoshan.id,
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        altText: dailyPoshan.name,
        isPrimary: true,
        displayOrder: 1,
      },
    });
    console.log('Updated Daily Poshan image.');
  }

  console.log('Finished updating product images.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
