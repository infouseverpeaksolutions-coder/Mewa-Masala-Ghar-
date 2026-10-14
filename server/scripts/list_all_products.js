const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(process.cwd(), 'server/.env') });
dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      brand: { select: { name: true, slug: true } },
      store: { select: { name: true, slug: true } },
      images: { select: { url: true } },
    }
  });

  console.log(`Total products in database: ${products.length}`);
  products.forEach(p => {
    console.log(`- [${p.id}] ${p.name} | Brand: ${p.brand?.slug || 'none'} | Store: ${p.store?.slug || 'none'} | Images: ${p.images.length}`);
  });
}

main().finally(() => prisma.$disconnect());
