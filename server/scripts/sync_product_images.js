const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(process.cwd(), 'server/.env') });
dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRODUCT_IMAGE_MAP = [
  // Dry Fruits
  { match: ['almond', 'badam'], url: '/products/dry-fruits/almonds_badam.jpg', alt: 'California Almonds (Badam)' },
  { match: ['cashew', 'kaju'], url: '/products/dry-fruits/cashews_kaju.jpg', alt: 'Cashew (Kaju Jumbo)' },
  { match: ['pista', 'pistachio'], url: '/products/dry-fruits/pistachios_pista.jpg', alt: 'Pista (Jumbo Lip)' },
  { match: ['anjeer', 'fig'], url: '/products/dry-fruits/figs_anjeer.jpg', alt: 'Anjeer (Tyer)' },
  { match: ['raisin', 'kismis', 'kishmish'], url: '/products/dry-fruits/raisins_kismis.jpg', alt: 'Raisins (Kismis Long)' },
  { match: ['walnut', 'akhrot'], url: '/products/dry-fruits/walnuts_akhrot.jpg', alt: 'Walnuts (Akhrot)' },
  { match: ['breakfast punch', 'punch'], url: '/products/dry-fruits/dry_fruit_duo_pack_of_2.jpg', alt: 'Breakfast Punch' },
  { match: ['mix dry fruit', 'panch mewa'], url: '/products/dry-fruits/royal_panch_mewa.jpg', alt: 'Mix Dry Fruits' },

  // Spices
  { match: ['turmeric', 'haldi'], url: '/products/spices/haldi.jpg', alt: 'Turmeric Powder (Haldi)' },
  { match: ['red chilli', 'chilli', 'mirch'], url: '/products/spices/lal_mirch.jpg', alt: 'Red Chilli Powder (Lal Mirch)' },
  { match: ['coriander', 'dhaniya'], url: '/products/spices/dhaniya.jpg', alt: 'Coriander Powder (Dhaniya)' },

  // Seeds
  { match: ['chia'], url: '/products/seeds-aata/chia_seeds.jpg', alt: 'Chia Seeds' },
  { match: ['flax', 'alsi'], url: '/products/seeds-aata/flax_seeds.jpg', alt: 'Flax Seeds' },
  { match: ['pumpkin'], url: '/products/seeds-aata/pumpkin_seeds.jpg', alt: 'Pumpkin Seeds' },
  { match: ['sunflower'], url: '/products/seeds-aata/sunflower_seeds.jpg', alt: 'Sunflower Seeds' },
  { match: ['mix seed'], url: '/products/seeds-aata/mix_seeds.jpg', alt: 'Mix Seeds' },

  // Makhana
  { match: ['peri peri', 'peri-peri'], url: '/foods/makhana/makhana_peri_peri.jpg', alt: 'Peri Peri Makhana' },
  { match: ['cream onion', 'cream & onion'], url: '/foods/makhana/makhana_cream_onion.jpg', alt: 'Cream Onion Makhana' },
  { match: ['mint', 'pudina'], url: '/foods/makhana/makhana_mint_punch.jpg', alt: 'Mint Makhana' },
  { match: ['raw makhana', 'makhana'], url: '/foods/foods_makhana.jpg', alt: 'Phool Makhana' },

  // Personal Care / Skincare
  { match: ['dead sea'], url: '/assets/jimmi-jaggu/prod_dead_sea_mud.jpg', alt: 'Dead Sea Mineral Mud Mask' },
  { match: ['pink multani'], url: '/assets/jimmi-jaggu/cat_ayurvedic_powder.jpg', alt: 'Pink Multani Mitti' },
  { match: ['multani mitti', 'mitti'], url: '/assets/jimmi-jaggu/prod_dead_sea_mud.jpg', alt: 'Premium Multani Mitti' },
];

function resolveProductImage(name, categoryName) {
  const n = (name || '').toLowerCase();
  for (const item of PRODUCT_IMAGE_MAP) {
    if (item.match.some(m => n.includes(m))) {
      return item;
    }
  }
  return null;
}

async function main() {
  console.log('🔄 Checking all products for missing images in database...');

  const products = await prisma.product.findMany({
    include: {
      images: true,
      category: true,
    },
  });

  console.log(`Found ${products.length} products in database.`);

  let updatedCount = 0;
  for (const product of products) {
    // If product already has images (e.g. uploaded via admin), keep them intact!
    if (product.images && product.images.length > 0) {
      console.log(`✓ [${product.name}] already has ${product.images.length} image(s). Keeping existing: ${product.images[0].url}`);
      continue;
    }

    const matched = resolveProductImage(product.name, product.category?.name);
    if (matched) {
      console.log(`+ Adding authentic image for "${product.name}": ${matched.url}`);
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: matched.url,
          altText: matched.alt || `${product.name} image`,
          isPrimary: true,
          displayOrder: 0,
        },
      });
      updatedCount++;
    } else {
      console.log(`⚠ No image rule matched for "${product.name}"`);
    }
  }

  console.log(`\n🎉 Image synchronization complete! Assigned images to ${updatedCount} products.`);
}

main()
  .catch(err => {
    console.error('Error syncing product images:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
