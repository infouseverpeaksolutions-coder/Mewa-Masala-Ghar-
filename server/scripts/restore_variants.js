const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Processing ${products.length} products...`);

  // Default seed mapping based on seed.ts
  const seedVariantsMap = {
    'royal-california-badam-almonds': [
      { name: '250g Pouch', weightGrams: 250, mrp: 380, price: 299, stockQty: 120, sku: 'MMG-DF-BDM-250', isDefault: false },
      { name: '500g Value Pack', weightGrams: 500, mrp: 720, price: 569, stockQty: 150, sku: 'MMG-DF-BDM-500', isDefault: true },
      { name: '1kg Mega Saver', weightGrams: 1000, mrp: 1400, price: 1099, stockQty: 65, sku: 'MMG-DF-BDM-1000', isDefault: false },
    ],
    'king-size-w240-kaju-cashews': [
      { name: '250g Zip Lock', weightGrams: 250, mrp: 440, price: 349, stockQty: 100, sku: 'MMG-DF-KJU-250', isDefault: true },
      { name: '500g Family Pack', weightGrams: 500, mrp: 820, price: 649, stockQty: 80, sku: 'MMG-DF-KJU-500', isDefault: false },
    ],
    'afghan-roasted-salted-pista': [
      { name: '200g Pet Can', weightGrams: 200, mrp: 400, price: 320, stockQty: 90, sku: 'MMG-DF-PST-200', isDefault: true },
      { name: '500g Pouch', weightGrams: 500, mrp: 950, price: 780, stockQty: 60, sku: 'MMG-DF-PST-500', isDefault: false },
    ],
    'sun-dried-turkish-anjeer-figs': [
      { name: '250g Ring Pack', weightGrams: 250, mrp: 480, price: 379, stockQty: 85, sku: 'MMG-DF-ANJ-250', isDefault: true },
      { name: '500g Ring Pack', weightGrams: 500, mrp: 920, price: 729, stockQty: 50, sku: 'MMG-DF-ANJ-500', isDefault: false },
    ],
    'kashmiri-snow-white-akhrot-giri-walnuts': [
      { name: '250g Vacuum Pack', weightGrams: 250, mrp: 490, price: 389, stockQty: 75, sku: 'MMG-DF-AKH-250', isDefault: true },
      { name: '500g Value Pack', weightGrams: 500, mrp: 940, price: 749, stockQty: 60, sku: 'MMG-DF-AKH-500', isDefault: false },
    ],
    'golden-long-afghan-kismis-raisins': [
      { name: '250g Pouch', weightGrams: 250, mrp: 220, price: 169, stockQty: 110, sku: 'MMG-DF-KSM-250', isDefault: true },
      { name: '500g Pouch', weightGrams: 500, mrp: 410, price: 319, stockQty: 95, sku: 'MMG-DF-KSM-500', isDefault: false },
    ],
    'royal-panch-mewa-dry-fruit-mix': [
      { name: '400g Royal Canister', weightGrams: 400, mrp: 620, price: 499, stockQty: 70, sku: 'MMG-CB-PNC-400', isDefault: true },
      { name: '800g Grand Pack', weightGrams: 800, mrp: 1180, price: 949, stockQty: 45, sku: 'MMG-CB-PNC-800', isDefault: false },
    ],
    'royal-dry-fruit-duo-pack-of-2': [
      { name: 'Pack of 2 (500g Total)', weightGrams: 500, mrp: 850, price: 699, stockQty: 50, sku: 'MMG-CB-DUO-500', isDefault: true },
    ],
    'shahi-mewa-samrat-pack-of-4': [
      { name: 'Pack of 4 (800g Total)', weightGrams: 800, mrp: 1650, price: 1349, stockQty: 40, sku: 'MMG-CB-SMR-800', isDefault: true },
    ],
    'maha-mewa-mahotsav-pack-of-6': [
      { name: 'Pack of 6 (900g Total)', weightGrams: 900, mrp: 2200, price: 1799, stockQty: 30, sku: 'MMG-CB-MHT-900', isDefault: true },
    ],
    'organic-roasted-brown-flax-seeds-200g': [
      { name: '200g Zip Pouch', weightGrams: 200, mrp: 130, price: 99, stockQty: 120, sku: 'MMG-SD-FLX-200', isDefault: true },
    ],
    'raw-hulled-sunflower-seeds-200g': [
      { name: '200g Zip Pouch', weightGrams: 200, mrp: 165, price: 129, stockQty: 85, sku: 'MMG-SD-SNF-200', isDefault: true },
    ],
    'organic-black-chia-seeds-200g': [
      { name: '200g Jar', weightGrams: 200, mrp: 190, price: 149, stockQty: 100, sku: 'MMG-SD-CHI-200', isDefault: true },
    ],
    'roasted-white-sesame-seeds-til-200g': [
      { name: '200g Jar', weightGrams: 200, mrp: 140, price: 109, stockQty: 95, sku: 'MMG-SD-TIL-200', isDefault: true },
    ],
    'aaa-grade-green-pumpkin-seeds-200g': [
      { name: '200g Zip Pouch', weightGrams: 200, mrp: 240, price: 189, stockQty: 110, sku: 'MMG-SD-PMK-200', isDefault: true },
    ],
    'peeled-magaz-watermelon-seeds-200g': [
      { name: '200g Zip Pouch', weightGrams: 200, mrp: 180, price: 139, stockQty: 90, sku: 'MMG-SD-WML-200', isDefault: true },
    ],
    '7-in-1-daily-super-seed-mix-200g': [
      { name: '200g Shaker Bottle', weightGrams: 200, mrp: 220, price: 169, stockQty: 90, sku: 'MMG-SD-7MX-200', isDefault: true },
    ],
    'spicy-peri-peri-roasted-makhana-80g': [
      { name: '80g Nitrogen Pouch', weightGrams: 80, mrp: 150, price: 119, stockQty: 140, sku: 'MMG-MK-PRP-80', isDefault: true },
    ],
    'refreshing-pudina-mint-punch-makhana-80g': [
      { name: '80g Nitrogen Pouch', weightGrams: 80, mrp: 150, price: 119, stockQty: 130, sku: 'MMG-MK-MNT-80', isDefault: true },
    ],
    'cream-and-onion-gourmet-makhana-80g': [
      { name: '80g Nitrogen Pouch', weightGrams: 80, mrp: 150, price: 119, stockQty: 125, sku: 'MMG-MK-CNO-80', isDefault: true },
    ],
    'raw-6-suta-jumbo-phool-makhana-250g': [
      { name: '250g Value Pack', weightGrams: 250, mrp: 340, price: 279, stockQty: 100, sku: 'MMG-MK-RAW-250', isDefault: true },
    ],
    'high-curcumin-lakadong-haldi-powder': [
      { name: '250g Jar', weightGrams: 250, mrp: 260, price: 199, stockQty: 90, sku: 'MMG-SP-HLD-250', isDefault: true },
    ],
    'authentic-kashmiri-degi-lal-mirch-powder': [
      { name: '200g Jar', weightGrams: 200, mrp: 240, price: 189, stockQty: 110, sku: 'MMG-SP-MRC-200', isDefault: true },
    ],
    'cold-pounded-green-dhaniya-powder': [
      { name: '250g Jar', weightGrams: 250, mrp: 160, price: 125, stockQty: 85, sku: 'MMG-SP-DHN-250', isDefault: true },
    ],
    'royal-shahi-garam-masala-stone-ground': [
      { name: '100g Glass Jar', weightGrams: 100, mrp: 220, price: 169, stockQty: 75, sku: 'MMG-SP-GRM-100', isDefault: true },
    ],
    // The user's uploaded product: ONLY 200g @ ₹300
    'organic-brown-flax-seeds': [
      { name: '200g Pack', weightGrams: 200, mrp: 350, price: 300, stockQty: 50, sku: 'MMG-680306-1', isDefault: true },
    ],
  };

  for (const product of products) {
    const list = seedVariantsMap[product.slug] || [
      {
        name: `${product.name} - Standard Pack`,
        weightGrams: 250,
        mrp: 350,
        price: 299,
        stockQty: 50,
        sku: `MMG-${product.slug.substring(0, 8).toUpperCase()}-250`,
        isDefault: true,
      }
    ];

    for (let idx = 0; idx < list.length; idx++) {
      const v = list[idx];
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: v.name,
          weightGrams: v.weightGrams,
          mrp: v.mrp,
          price: v.price,
          stockQty: v.stockQty || 50,
          packQty: 1,
          gstPercent: product.gstRate || 12.0,
          sku: v.sku,
          isDefault: v.isDefault !== undefined ? v.isDefault : idx === 0,
          isActive: true,
        }
      });
    }
    console.log(`Created ${list.length} variants for ${product.name}`);
  }

  console.log('Finished restoring exact variants!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
