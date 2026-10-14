const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(process.cwd(), 'server/.env') });
dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEMO_SLUGS = [
  'pratham-aahar-sprouted-ragi-baby-porridge',
  'pratham-aahar-sprouted-moong-rice-cereal',
  'daily-poshan-nari-shakti-womens-blend',
  'daily-poshan-yuva-energy-mix',
  'daily-poshan-vridh-poshan-elders-evening-diet',
  'garbh-poshan-trimester-care-dry-fruit-nourishment',
  'premium-export-quality-multani-mitti',
  'gentle-rose-pink-multani-mitti',
  'dead-sea-mineral-mud-mask-pack',
];

async function main() {
  console.log('Finding demo products for Jimmi Jaggu (baby/care)...');

  // Find products that match demo slugs or have unsplash demo images under baby/care/jimmi-jaggu
  const demoProducts = await prisma.product.findMany({
    where: {
      OR: [
        { slug: { in: DEMO_SLUGS } },
        {
          AND: [
            {
              OR: [
                { brand: { slug: 'jimmi-jaggu' } },
                { store: { slug: { in: ['baby', 'care', 'jimmi-jaggu'] } } }
              ]
            },
            {
              images: {
                some: {
                  url: { contains: 'unsplash' }
                }
              }
            }
          ]
        }
      ]
    },
    include: {
      images: true,
      variants: true,
    }
  });

  console.log(`Found ${demoProducts.length} demo product(s) to remove:`);
  demoProducts.forEach(p => console.log(`- [${p.id}] ${p.name} (slug: ${p.slug})`));

  for (const prod of demoProducts) {
    // Delete wishlist, reviews, cartItems, orderItems if any
    await prisma.cartItem.deleteMany({ where: { variant: { productId: prod.id } } }).catch(() => {});
    await prisma.review.deleteMany({ where: { productId: prod.id } }).catch(() => {});
    await prisma.wishlist.deleteMany({ where: { productId: prod.id } }).catch(() => {});
    await prisma.productImage.deleteMany({ where: { productId: prod.id } }).catch(() => {});
    await prisma.productVariant.deleteMany({ where: { productId: prod.id } }).catch(() => {});
    await prisma.product.delete({ where: { id: prod.id } });
    console.log(`Deleted demo product: ${prod.name}`);
  }

  console.log('\nDemo products removed successfully!');
}

main()
  .catch(err => {
    console.error('Error removing demo products:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
