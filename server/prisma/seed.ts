import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Mewa Masala Ghar database with complete catalog & settings...');

  // 1. Clean existing records in reverse dependency order
  // 1. Clean existing records in reverse dependency order
  await prisma.trackingEvent.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.bundleItem.deleteMany();
  await prisma.bundle.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.page.deleteMany();
  await prisma.store.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.pincode.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.emailVerification.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Settings (Dynamic placeholders for phone, email, address, GSTIN, FSSAI, business hours, WhatsApp)
  await prisma.setting.createMany({
    data: [
      { key: 'company_name', value: 'Mewa Masala Ghar Private Limited', group: 'general' },
      { key: 'tagline', value: 'Pure Indian Goodness, Rooted in Tradition', group: 'general' },
      { key: 'phone', value: '+91 98200 12345', group: 'contact' },
      { key: 'email', value: 'care@mewamasalaghar.com', group: 'contact' },
      { key: 'address', value: 'Shop 14, APMC Grain Market, Sector 19, Vashi, Navi Mumbai, Maharashtra 400703', group: 'contact' },
      { key: 'business_hours', value: 'Monday to Saturday: 9:00 AM – 8:00 PM IST', group: 'contact' },
      { key: 'whatsapp_number', value: '+919820012345', group: 'contact' },
      { key: 'gstin', value: '27AABCM1234F1Z5', group: 'compliance' },
      { key: 'fssai', value: '10021051000123', group: 'compliance' },
      { key: 'state_code', value: '27', group: 'compliance' },
      { key: 'state_name', value: 'Maharashtra', group: 'compliance' },
      { key: 'free_shipping_threshold', value: '499', group: 'shipping' },
      { key: 'standard_delivery_fee', value: '49', group: 'shipping' },
      { key: 'cod_charge', value: '0', group: 'shipping' },
    ],
  });
  console.log('Settings seeded successfully.');

  // 3. Create Users with roles: super_admin, manager, staff, customer
  const adminPassword = await bcrypt.hash('Admin@12345', 10);
  const managerPassword = await bcrypt.hash('Manager@12345', 10);
  const staffPassword = await bcrypt.hash('Staff@12345', 10);
  const customerPassword = await bcrypt.hash('Customer@12345', 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Mewa Masala Super Admin',
      email: 'admin@mewamasalaghar.com',
      password: adminPassword,
      phone: '+919820012345',
      role: 'SUPER_ADMIN',
      emailVerified: true,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Operations Manager',
      email: 'manager@mewamasalaghar.com',
      password: managerPassword,
      phone: '+919820012346',
      role: 'MANAGER',
      emailVerified: true,
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: 'Dispatch Staff',
      email: 'staff@mewamasalaghar.com',
      password: staffPassword,
      phone: '+919820012347',
      role: 'STAFF',
      emailVerified: true,
      permissions: ['products', 'orders', 'inventory'],
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      password: customerPassword,
      phone: '+919876543210',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: customer.id,
      name: 'Aarav Sharma',
      phone: '+919876543210',
      addressLine1: 'Flat 402, Golden Heights, Palm Beach Road',
      addressLine2: 'Sector 19, Near Seawoods Station',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      stateCode: '27',
      pincode: '400706',
      isDefault: true,
    },
  });
  console.log('Users created: Super Admin, Manager, Staff & Customer');

  // 4. Create Stores
  const storeFoods = await prisma.store.create({
    data: {
      slug: 'foods',
      name: 'Mewa & Healthy Foods',
      tagline: 'Handpicked Dry Fruits, Roasted Makhana, Wholesome Seeds & Stone-Ground Spices',
      description: 'Finest royal dry fruits, super seeds, slow-roasted makhana snacks, and authentic aromatic Indian spices with zero adulteration.',
      themeKey: 'theme-foods',
      primaryColor: '#2F5D3A',
      accentColor: '#D9A441',
      bgColor: '#FAF6EC',
      fssaiNumber: '10021051000123',
    },
  });

  const storeBaby = await prisma.store.create({
    data: {
      slug: 'baby',
      name: 'Baby & Family Nutrition',
      tagline: 'Wholesome First Foods, Motherhood Nutrition & Age-Specific Poshan Blends',
      description: 'Ancient Ayurvedic recipes meet modern nutrition: traditional sprouted grain baby cereals, pregnancy care mixes, and restorative nutrition for youngsters and elders.',
      themeKey: 'theme-baby',
      primaryColor: '#5DB4D6',
      accentColor: '#F4A261',
      bgColor: '#F5FAFC',
      fssaiNumber: '10021051000123',
    },
  });

  const storeCare = await prisma.store.create({
    data: {
      slug: 'care',
      name: 'Personal Care & Natural Clays',
      tagline: 'Sun-Drenched Mineral Clays, Organic Multani Mitti & Ayurvedic Body Packs',
      description: 'Triple-sifted authentic cosmetic grade Multani Mitti, therapeutic Pink Multani, and mineral-rich Dead Sea mud for pure, glowing skin without synthetic additives.',
      themeKey: 'theme-care',
      primaryColor: '#D47A88',
      accentColor: '#C7926B',
      bgColor: '#FCF7F7',
      fssaiNumber: '10021051000123',
    },
  });

  // 5. Create Categories with parent_id hierarchy
  // Store 1: Foods & Spices categories
  const parentFoodsNuts = await prisma.category.create({
    data: { storeId: storeFoods.id, name: 'Dry Fruits & Nuts', slug: 'dry-fruits-nuts', displayOrder: 1 },
  });
  const catDryFruits = await prisma.category.create({
    data: { storeId: storeFoods.id, parentId: parentFoodsNuts.id, name: 'Dry Fruits & Combos', slug: 'dry-fruits-combos', displayOrder: 1 },
  });

  const parentFoodsSeeds = await prisma.category.create({
    data: { storeId: storeFoods.id, name: 'Seeds & Makhana', slug: 'seeds-makhana', displayOrder: 2 },
  });
  const catSeeds = await prisma.category.create({
    data: { storeId: storeFoods.id, parentId: parentFoodsSeeds.id, name: 'Super Seeds', slug: 'super-seeds', displayOrder: 1 },
  });
  const catMakhana = await prisma.category.create({
    data: { storeId: storeFoods.id, parentId: parentFoodsSeeds.id, name: 'Gourmet Makhana', slug: 'gourmet-makhana', displayOrder: 2 },
  });

  const parentFoodsSpices = await prisma.category.create({
    data: { storeId: storeFoods.id, name: 'Authentic Spices', slug: 'authentic-spices', displayOrder: 3 },
  });
  const catSpices = await prisma.category.create({
    data: { storeId: storeFoods.id, parentId: parentFoodsSpices.id, name: 'Pure Spices', slug: 'pure-spices', displayOrder: 1 },
  });

  // Store 2: Baby & Family Nutrition categories
  const parentBabyNutrition = await prisma.category.create({
    data: { storeId: storeBaby.id, name: 'Baby & Maternal Poshan', slug: 'baby-maternal-poshan', displayOrder: 1 },
  });
  const catBabyFood = await prisma.category.create({
    data: { storeId: storeBaby.id, parentId: parentBabyNutrition.id, name: 'Pratham Aahar (Baby)', slug: 'pratham-aahar', displayOrder: 1 },
  });
  const catDailyPoshan = await prisma.category.create({
    data: { storeId: storeBaby.id, parentId: parentBabyNutrition.id, name: 'Daily Poshan (Family)', slug: 'daily-poshan', displayOrder: 2 },
  });
  const catPregnancy = await prisma.category.create({
    data: { storeId: storeBaby.id, parentId: parentBabyNutrition.id, name: 'Pregnancy Care', slug: 'pregnancy-care', displayOrder: 3 },
  });

  // Store 3: Personal Care categories
  const parentCareClays = await prisma.category.create({
    data: { storeId: storeCare.id, name: 'Natural Clays & Skincare', slug: 'natural-clays-skincare', displayOrder: 1 },
  });
  const catMultani = await prisma.category.create({
    data: { storeId: storeCare.id, parentId: parentCareClays.id, name: 'Multani Mitti & Clays', slug: 'multani-mitti-clays', displayOrder: 1 },
  });

  // 6. Comprehensive Product Catalog
  const products = [
    // --- 1. DRY FRUITS ---
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'Royal California Badam (Almonds)',
      slug: 'royal-california-badam-almonds',
      shortDescription: '100% Jumbo Grade California Almonds with rich oil content and natural crunch.',
      description: 'Hand-selected for uniform size, sweet nutty flavor, and crunchy texture. Packed with Vitamin E, plant protein, dietary fiber, and healthy monounsaturated fats.',
      ingredients: '100% Raw California Almonds (Prunus dulcis).',
      nutritionFacts: { servingSize: '100g', energy: '579 kcal', protein: '21.15 g', carbs: '21.55 g', fat: '49.93 g', fiber: '12.5 g' },
      benefits: ['Rich in Vitamin E for radiant skin', 'Heart-healthy monounsaturated fatty acids', 'Natural plant protein'],
      howToUse: 'Soak 6-8 kernels overnight and enjoy peel-free in the morning.',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 148,
      dietaryTags: ['100% Natural', 'Gluten Free', 'Zero Added Sugar', 'Vegan'],
      imageUrl: 'https://images.unsplash.com/photo-1508061252445-5350f3777130?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '250g Pouch', weightGrams: 250, mrp: 380, price: 299, stock: 120, sku: 'MMG-DF-BDM-250', isDefault: false },
        { name: '500g Value Pack', weightGrams: 500, mrp: 720, price: 569, stock: 150, sku: 'MMG-DF-BDM-500', isDefault: true },
        { name: '1kg Mega Saver', weightGrams: 1000, mrp: 1400, price: 1099, stock: 65, sku: 'MMG-DF-BDM-1000', isDefault: false },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'King Size W240 Kaju (Cashews)',
      slug: 'king-size-w240-kaju-cashews',
      shortDescription: 'Creamy, buttery whole white cashews harvested from certified coastal groves.',
      description: 'Grade W240 Whole Cashews known for their creamy mouthfeel and natural sweetness. Free from bleaching and artificial polishing.',
      ingredients: '100% Raw Whole Cashew Nuts (Anacardium occidentale).',
      nutritionFacts: { energy: '553 kcal', protein: '18.22 g', carbs: '30.19 g', fat: '43.85 g' },
      benefits: ['Supports energy levels with iron and magnesium', 'Natural buttery flavor with zero additives'],
      howToUse: 'Ideal for healthy snacking, making cashew milk, or rich traditional curries.',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 92,
      dietaryTags: ['100% Natural', 'Vegan'],
      imageUrl: 'https://images.unsplash.com/photo-1536591375315-1b8389650b4a?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '250g Pouch', weightGrams: 250, mrp: 420, price: 349, stock: 90, sku: 'MMG-DF-KJU-250', isDefault: false },
        { name: '500g Pack', weightGrams: 500, mrp: 800, price: 649, stock: 110, sku: 'MMG-DF-KJU-500', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'Afghan Roasted & Lightly Salted Pista',
      slug: 'afghan-roasted-salted-pista',
      shortDescription: 'Naturally open in-shell pistachios roasted to crisp perfection with pink salt.',
      description: 'Slow dry-roasted with a kiss of Himalayan pink rock salt. Bursting flavors packed with lutein, zeaxanthin, and dietary fiber.',
      ingredients: 'In-shell Pistachios (99%), Himalayan Rock Salt (1%).',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 76,
      dietaryTags: ['Roasted', 'Gluten Free'],
      imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Pack', weightGrams: 200, mrp: 390, price: 320, stock: 80, sku: 'MMG-DF-PST-200', isDefault: true },
        { name: '500g Jar', weightGrams: 500, mrp: 950, price: 780, stock: 45, sku: 'MMG-DF-PST-500', isDefault: false },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'Sun-Dried Turkish Anjeer (Figs)',
      slug: 'sun-dried-turkish-anjeer-figs',
      shortDescription: 'Plump, naturally sweet, fiber-loaded figs strung together in traditional rings.',
      description: '100% naturally dried without added sugar or preservatives. Packed with bioavailable iron, calcium, and dietary potassium.',
      ingredients: '100% Whole Dried Figs (Ficus carica).',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      rating: 4.9,
      reviewCount: 64,
      dietaryTags: ['Zero Added Sugar', 'High Fiber', 'Vegan'],
      imageUrl: 'https://images.unsplash.com/photo-1601379327928-bedfa9da3f94?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '250g Ring', weightGrams: 250, mrp: 450, price: 379, stock: 70, sku: 'MMG-DF-ANJ-250', isDefault: true },
        { name: '500g Value Pack', weightGrams: 500, mrp: 880, price: 729, stock: 55, sku: 'MMG-DF-ANJ-500', isDefault: false },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'Kashmiri Snow White Akhrot Giri (Walnuts)',
      slug: 'kashmiri-snow-white-akhrot-giri-walnuts',
      shortDescription: 'Extra light half-kernel Kashmiri walnuts rich in brain-boosting ALA Omega-3.',
      description: 'Hand-cracked in Kashmir valleys. Extra-light halves retaining natural crispness without bitter taste.',
      ingredients: '100% Raw Walnut Kernels.',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      rating: 4.8,
      reviewCount: 88,
      dietaryTags: ['Omega 3', 'Kashmiri Origin'],
      imageUrl: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '250g Vacuum Pack', weightGrams: 250, mrp: 480, price: 389, stock: 65, sku: 'MMG-DF-AKH-250', isDefault: true },
        { name: '500g Pack', weightGrams: 500, mrp: 920, price: 749, stock: 40, sku: 'MMG-DF-AKH-500', isDefault: false },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'Golden Long Afghan Kismis (Raisins)',
      slug: 'golden-long-afghan-kismis-raisins',
      shortDescription: 'Naturally shade-dried elongated sweet golden raisins from Kandahar vines.',
      description: 'Sweet, seedless, and naturally plump. Zero artificial sulfur bleaching; retains wholesome fructose, iron, and fiber.',
      ingredients: '100% Natural Golden Raisins.',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      rating: 4.7,
      reviewCount: 52,
      dietaryTags: ['100% Natural', 'Zero Added Sugar'],
      imageUrl: 'https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '250g Pouch', weightGrams: 250, mrp: 220, price: 169, stock: 100, sku: 'MMG-DF-KSM-250', isDefault: true },
        { name: '500g Pack', weightGrams: 500, mrp: 410, price: 319, stock: 80, sku: 'MMG-DF-KSM-500', isDefault: false },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'Royal Panch Mewa Dry Fruit Mix',
      slug: 'royal-panch-mewa-dry-fruit-mix',
      shortDescription: 'Balanced energy mix of Badam, Kaju, Pista, Akhrot & Black Afghan Raisins.',
      description: 'Masterfully curated proportion of premium dry fruits formulated for daily morning nutrition and vitality.',
      ingredients: 'Almonds (25%), Cashews (25%), Pistachios (15%), Walnuts (15%), Raisins (20%).',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 110,
      dietaryTags: ['High Protein', 'Daily Energy'],
      imageUrl: 'https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '400g Jar', weightGrams: 400, mrp: 650, price: 499, stock: 85, sku: 'MMG-DF-MIX-400', isDefault: true },
        { name: '800g Value Tub', weightGrams: 800, mrp: 1250, price: 949, stock: 50, sku: 'MMG-DF-MIX-800', isDefault: false },
      ],
    },
    // --- DRY FRUIT COMBOS (2, 4, 6) ---
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'Royal Dry Fruit Duo (Pack of 2 Festive Jars)',
      slug: 'royal-dry-fruit-duo-pack-of-2',
      shortDescription: 'Twin jar festive combo: Jumbo California Badam (250g) + W240 Kaju (250g).',
      description: 'Elegant golden gift box with two airtight glass-finish jars packed with crunchy almonds and buttery cashews. Perfect for gifting and festive pujas.',
      ingredients: 'California Almonds (250g), W240 Cashews (250g).',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      isCombo: true,
      comboCount: 2,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 68,
      dietaryTags: ['Festive Gift Box', 'Duo Pack'],
      imageUrl: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: 'Pack of 2 (500g Total)', weightGrams: 500, mrp: 850, price: 699, stock: 60, sku: 'MMG-CMB-2-500', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'Shahi Mewa Samrat (Pack of 4 Royal Jars)',
      slug: 'shahi-mewa-samrat-pack-of-4',
      shortDescription: 'Signature 4-Jar Gift Hamper: Badam, Kaju, Afghan Pista & Turkish Anjeer.',
      description: 'Four curated 200g jars in an ornate forest green and gold magnetic presentation box. The premier corporate and wedding gift in India.',
      ingredients: 'Almonds (200g), Cashews (200g), Roasted Pista (200g), Turkish Anjeer (200g).',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      isCombo: true,
      comboCount: 4,
      isFeatured: true,
      rating: 5.0,
      reviewCount: 95,
      dietaryTags: ['Luxury Gift Hamper', 'Pack of 4'],
      imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: 'Pack of 4 (800g Total)', weightGrams: 800, mrp: 1650, price: 1349, stock: 40, sku: 'MMG-CMB-4-800', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catDryFruits.id,
      name: 'Maha Mewa Mahotsav (Pack of 6 Grand Gift Box)',
      slug: 'maha-mewa-mahotsav-pack-of-6',
      shortDescription: 'Grand 6-Jar Imperial Feast: Badam, Kaju, Pista, Anjeer, Akhrot & Kismis.',
      description: 'The ultimate royal Indian assortment. Six premium 150g canisters presented in an imperial gold-foiled wooden box.',
      ingredients: 'Badam, Kaju, Pista, Anjeer, Akhrot, Kismis (150g each).',
      fssaiNumber: '10021051000123',
      hsnCode: '0801',
      gstRate: 12.0,
      isCombo: true,
      comboCount: 6,
      rating: 5.0,
      reviewCount: 43,
      dietaryTags: ['Imperial Hamper', 'Pack of 6'],
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: 'Pack of 6 (900g Total)', weightGrams: 900, mrp: 2200, price: 1799, stock: 30, sku: 'MMG-CMB-6-900', isDefault: true },
      ],
    },

    // --- 2. SEEDS (200g) ---
    {
      storeId: storeFoods.id,
      categoryId: catSeeds.id,
      name: 'Organic Roasted Brown Flax Seeds (Alsi)',
      slug: 'organic-roasted-brown-flax-seeds-200g',
      shortDescription: 'Slow-roasted nutty flax seeds rich in dietary lignans and plant Omega-3.',
      description: 'Stone-roasted at low temperatures for enhanced digestibility and a nutty crunch. Supports heart health and natural digestion.',
      ingredients: '100% Certified Organic Brown Flax Seeds (Linum usitatissimum).',
      fssaiNumber: '10021051000123',
      hsnCode: '1204',
      gstRate: 5.0,
      rating: 4.8,
      reviewCount: 71,
      dietaryTags: ['High Fiber', 'Omega 3', 'Keto Friendly'],
      imageUrl: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Zip Pouch', weightGrams: 200, mrp: 130, price: 99, stock: 140, sku: 'MMG-SD-FLX-200', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catSeeds.id,
      name: 'Raw Hulled Sunflower Seeds (Surajmukhi)',
      slug: 'raw-hulled-sunflower-seeds-200g',
      shortDescription: 'Crisp whole kernel sunflower seeds packed with Vitamin E and selenium.',
      description: 'Carefully dehusked raw kernels retaining natural oils, minerals, and healthy fats. Excellent addition to oats, salads, and smoothie bowls.',
      ingredients: '100% Hulled Sunflower Seeds (Helianthus annuus).',
      fssaiNumber: '10021051000123',
      hsnCode: '1206',
      gstRate: 5.0,
      rating: 4.7,
      reviewCount: 45,
      dietaryTags: ['Raw', 'Gluten Free'],
      imageUrl: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Zip Pouch', weightGrams: 200, mrp: 160, price: 129, stock: 110, sku: 'MMG-SD-SNF-200', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catSeeds.id,
      name: 'Organic Black Chia Seeds',
      slug: 'organic-black-chia-seeds-200g',
      shortDescription: '100% Raw whole chia seeds with high gelatinizing fiber and hydration support.',
      description: 'Super-dense superfood expanding up to 10x in liquids. Loaded with soluble fiber, calcium, and antioxidant polyphenols.',
      ingredients: '100% Raw Black Chia Seeds (Salvia hispanica).',
      fssaiNumber: '10021051000123',
      hsnCode: '1207',
      gstRate: 5.0,
      rating: 4.9,
      reviewCount: 92,
      dietaryTags: ['Superfood', 'Hydrophilic Fiber'],
      imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Zip Pouch', weightGrams: 200, mrp: 190, price: 149, stock: 125, sku: 'MMG-SD-CHA-200', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catSeeds.id,
      name: 'Roasted White Sesame Seeds (Safed Til)',
      slug: 'roasted-white-sesame-seeds-til-200g',
      shortDescription: 'Aromatic roasted Indian sesame seeds loaded with plant-based calcium.',
      description: 'Traditional slow-roasted white til seeds with a warm nutty aroma. Ancient source of bone-supporting calcium and healthy sesamol.',
      ingredients: '100% Roasted White Sesame (Sesamum indicum).',
      fssaiNumber: '10021051000123',
      hsnCode: '1207',
      gstRate: 5.0,
      rating: 4.8,
      reviewCount: 38,
      dietaryTags: ['High Calcium', 'Traditional'],
      imageUrl: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Jar', weightGrams: 200, mrp: 140, price: 109, stock: 95, sku: 'MMG-SD-TIL-200', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catSeeds.id,
      name: 'AAA Grade Green Pumpkin Seeds (Kaddu Beej)',
      slug: 'aaa-grade-green-pumpkin-seeds-200g',
      shortDescription: 'Plump dark green pumpkin kernels rich in zinc and restorative magnesium.',
      description: 'Pristine raw pumpkin pepitas prized for muscle repair, deep sleep regulation via tryptophan, and immune health.',
      ingredients: '100% Raw Green Pumpkin Seed Kernels (Cucurbita pepo).',
      fssaiNumber: '10021051000123',
      hsnCode: '1207',
      gstRate: 5.0,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 104,
      dietaryTags: ['High Zinc', 'Keto Approved'],
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Zip Pouch', weightGrams: 200, mrp: 240, price: 189, stock: 110, sku: 'MMG-SD-PMK-200', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catSeeds.id,
      name: 'Peeled Magaz Watermelon Seeds (Tarbooz Beej)',
      slug: 'peeled-magaz-watermelon-seeds-200g',
      shortDescription: 'Crisp ivory white peeled watermelon kernels for energy and gravies.',
      description: 'Dehusked high-protein melon seeds popular in royal Mughlai curries, thandai, and daily trail mixes. Rich in B vitamins and copper.',
      ingredients: '100% Hulled Watermelon Seeds (Citrullus lanatus).',
      fssaiNumber: '10021051000123',
      hsnCode: '1207',
      gstRate: 5.0,
      rating: 4.7,
      reviewCount: 39,
      dietaryTags: ['High Protein', 'Traditional Magaz'],
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Zip Pouch', weightGrams: 200, mrp: 180, price: 139, stock: 90, sku: 'MMG-SD-WML-200', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catSeeds.id,
      name: '7-in-1 Daily Super Seed Roasted Mix',
      slug: '7-in-1-daily-super-seed-mix-200g',
      shortDescription: 'Crunchy roasted mix of Flax, Chia, Pumpkin, Sunflower, Sesame, Watermelon & Muskmelon.',
      description: 'Formulated by nutritionists for complete daily mineral intake. Lightly dry-roasted without a single drop of oil.',
      ingredients: 'Pumpkin (20%), Sunflower (20%), Flax (15%), Chia (15%), Watermelon (10%), Sesame (10%), Muskmelon (10%).',
      fssaiNumber: '10021051000123',
      hsnCode: '1207',
      gstRate: 5.0,
      isFeatured: true,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 135,
      dietaryTags: ['7 Super Seeds', 'Zero Oil', 'Heart Care'],
      imageUrl: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Jar', weightGrams: 200, mrp: 220, price: 169, stock: 150, sku: 'MMG-SD-MIX-200', isDefault: true },
      ],
    },

    // --- 3. MAKHANA (FOX NUTS) ---
    {
      storeId: storeFoods.id,
      categoryId: catMakhana.id,
      name: 'Spicy Peri-Peri Roasted Fox Nut Makhana (80g)',
      slug: 'spicy-peri-peri-roasted-makhana-80g',
      shortDescription: 'Slow-roasted jumbo fox nuts tossed in fiery African bird\'s eye chili and herbs.',
      description: 'Air-popped jumbo lotus seeds roasted with pure olive oil and dusted with savory peri-peri spice. Low calorie, zero trans-fat crunch.',
      ingredients: 'Makhana / Fox Nuts (80%), Cold-Pressed Olive Oil, Peri-Peri Seasoning (Red Chili, Garlic, Onion, Salt, Oregano).',
      fssaiNumber: '10021051000123',
      hsnCode: '1904',
      gstRate: 12.0,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 142,
      dietaryTags: ['Low Calorie', 'Gluten Free', 'Zero Trans Fat'],
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '80g Pouch', weightGrams: 80, mrp: 149, price: 119, stock: 120, sku: 'MMG-MK-PERI-80', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catMakhana.id,
      name: 'Refreshing Pudina Mint Punch Makhana (80g)',
      slug: 'refreshing-pudina-mint-punch-makhana-80g',
      shortDescription: 'Crisp roasted makhana coated with cooling handpicked garden mint and chaat spice.',
      description: 'Tangy and cooling sensation with pure dried mint leaf powder, amchur, and black rock salt. Ideal tea-time accompaniment.',
      ingredients: 'Fox Nuts (80%), Olive Oil, Mint Powder, Black Salt, Dry Mango, Cumin.',
      fssaiNumber: '10021051000123',
      hsnCode: '1904',
      gstRate: 12.0,
      rating: 4.8,
      reviewCount: 89,
      dietaryTags: ['Cooling Mint', 'Digestive'],
      imageUrl: 'https://images.unsplash.com/photo-1608797178974-15b35a643c16?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '80g Pouch', weightGrams: 80, mrp: 149, price: 119, stock: 95, sku: 'MMG-MK-MINT-80', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catMakhana.id,
      name: 'Cream & Onion Gourmet Roasted Makhana (80g)',
      slug: 'cream-and-onion-gourmet-makhana-80g',
      shortDescription: 'Velvety smooth sour cream and sweet spring onion roasted makhana crunch.',
      description: 'A gourmet delight blending rich dairy notes with aromatic chives and sweet spring onion. A healthy replacement for fried chips.',
      ingredients: 'Fox Nuts (80%), Olive Oil, Milk Solids, Onion Powder, Parsley, Sea Salt.',
      fssaiNumber: '10021051000123',
      hsnCode: '1904',
      gstRate: 12.0,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 115,
      dietaryTags: ['Gourmet Snack', 'Gluten Free'],
      imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '80g Pouch', weightGrams: 80, mrp: 149, price: 119, stock: 110, sku: 'MMG-MK-CRM-80', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catMakhana.id,
      name: 'Raw 6-Suta Jumbo Phool Makhana (Fox Nuts)',
      slug: 'raw-6-suta-jumbo-phool-makhana-250g',
      shortDescription: 'Unroasted AAA grade Bihar hand-harvested jumbo lotus seeds for home cooking.',
      description: 'Pure, unseasoned, natural phool makhana directly from Darbhanga wetlands. Hand-sorted for big fluffy blooms with zero bitter black husks.',
      ingredients: '100% Raw Lotus Seeds (Euryale ferox).',
      fssaiNumber: '10021051000123',
      hsnCode: '1904',
      gstRate: 5.0,
      rating: 4.9,
      reviewCount: 78,
      dietaryTags: ['Raw', 'Fasting Food', 'Pure Purity'],
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '250g Value Pack', weightGrams: 250, mrp: 350, price: 279, stock: 130, sku: 'MMG-MK-RAW-250', isDefault: true },
      ],
    },

    // --- 4. SPICES ---
    {
      storeId: storeFoods.id,
      categoryId: catSpices.id,
      name: 'High-Curcumin Lakadong Haldi (Turmeric) Powder',
      slug: 'high-curcumin-lakadong-haldi-powder',
      shortDescription: 'Meghalaya harvested turmeric with guaranteed 7.5%+ natural curcumin potency.',
      description: 'Grown in the pristine hills of Jaintia, Meghalaya. Stone-ground at sub-35°C to preserve volatile essential oils and strong therapeutic properties.',
      ingredients: '100% Pure Lakadong Turmeric Root.',
      fssaiNumber: '10021051000123',
      hsnCode: '0910',
      gstRate: 5.0,
      isFeatured: true,
      rating: 5.0,
      reviewCount: 164,
      dietaryTags: ['7.5% Curcumin', 'Sub-Zero Cold Pounded'],
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '250g Jar', weightGrams: 250, mrp: 260, price: 199, stock: 90, sku: 'MMG-SP-HLD-250', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catSpices.id,
      name: 'Authentic Kashmiri Degi Lal Mirch Powder',
      slug: 'authentic-kashmiri-degi-lal-mirch-powder',
      shortDescription: 'Vibrant natural crimson chili with mild heat and rich aroma without artificial dyes.',
      description: 'Stemless whole Kashmiri red chillies ground slowly to yield deep ruby color and fruity spice. Free from Sudan red and synthetic colorants.',
      ingredients: '100% Whole Kashmiri Red Chilies.',
      fssaiNumber: '10021051000123',
      hsnCode: '0910',
      gstRate: 5.0,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 110,
      dietaryTags: ['Zero Artificial Color', 'Mild Heat'],
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Jar', weightGrams: 200, mrp: 240, price: 189, stock: 110, sku: 'MMG-SP-MRC-200', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catSpices.id,
      name: 'Cold-Pounded Green Dhaniya (Coriander) Powder',
      slug: 'cold-pounded-green-dhaniya-powder',
      shortDescription: 'Lush green freshly picked coriander seeds pounded gently to preserve essential linalool.',
      description: 'Unlike commercial burnt brown powders, our green coriander retains its floral sweetness and cooling digestive attributes.',
      ingredients: '100% Green Coriander Seeds (Coriandrum sativum).',
      fssaiNumber: '10021051000123',
      hsnCode: '0910',
      gstRate: 5.0,
      rating: 4.8,
      reviewCount: 65,
      dietaryTags: ['Cold Pounded', 'Aromatic'],
      imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '250g Jar', weightGrams: 250, mrp: 160, price: 125, stock: 85, sku: 'MMG-SP-DHN-250', isDefault: true },
      ],
    },
    {
      storeId: storeFoods.id,
      categoryId: catSpices.id,
      name: 'Royal Shahi Garam Masala (Stone-Ground 16 Spices)',
      slug: 'royal-shahi-garam-masala-stone-ground',
      shortDescription: 'Regal formulation of 16 whole spices including Mace, Green Cardamom, Star Anise & Nutmeg.',
      description: 'Slow dry-roasted and pounded in stone mortars according to a 100-year-old Lucknowi family recipe.',
      ingredients: 'Black Cardamom, Green Cardamom, Cloves, Cinnamon, Mace, Nutmeg, Star Anise, Black Pepper, Cumin, Bay Leaf.',
      fssaiNumber: '10021051000123',
      hsnCode: '0910',
      gstRate: 5.0,
      isFeatured: true,
      rating: 5.0,
      reviewCount: 98,
      dietaryTags: ['16 Whole Spices', 'Shahi Recipe'],
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '100g Glass Jar', weightGrams: 100, mrp: 210, price: 169, stock: 75, sku: 'MMG-SP-GRM-100', isDefault: true },
      ],
    },

    // --- STORE 2: BABY & FAMILY NUTRITION ---
    {
      storeId: storeBaby.id,
      categoryId: catBabyFood.id,
      name: 'Pratham Aahar: Sprouted Ragi & Almond Shishu Porridge (6+ Months)',
      slug: 'pratham-aahar-sprouted-ragi-almond-porridge',
      shortDescription: 'Sprouted finger millet baby cereal enhanced with peeled sweet almond meal.',
      description: 'Sprouted for 48 hours to activate enzymes and enhance iron absorption. Easily digestible, gentle on tiny stomachs, and 100% free from added sugar, salt, milk solids, or preservatives.',
      ingredients: 'Organic Sprouted Ragi (85%), Peeled California Almond Powder (14%), Green Cardamom (1%).',
      safetyNotice: 'NON-MEDICINAL TRADITIONAL NUTRITION: Formulated for infants aged 6 months and older as a complementary food alongside continued breastfeeding. Not a substitute for breast milk. Please consult your pediatrician before introducing new solids to baby\'s diet.',
      fssaiNumber: '10021051000123',
      hsnCode: '1901',
      gstRate: 18.0,
      isFeatured: true,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 180,
      dietaryTags: ['6+ Months', 'Sprouted Grain', 'Zero Sugar', 'Doctor Safe'],
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Pack', weightGrams: 200, mrp: 299, price: 249, stock: 100, sku: 'MMG-BN-RAGI-200', isDefault: false },
        { name: '400g Duo Pack (2x200g)', weightGrams: 400, mrp: 580, price: 469, stock: 75, sku: 'MMG-BN-RAGI-400', isDefault: true },
      ],
    },
    {
      storeId: storeBaby.id,
      categoryId: catBabyFood.id,
      name: 'Pratham Aahar: Sprouted Moong, Rice & Cumin Cereal (6+ Months)',
      slug: 'pratham-aahar-sprouted-moong-rice-cereal',
      shortDescription: 'Gentle, savory sprouted green gram & parboiled red rice cereal for tiny tummies.',
      description: 'Traditional Indian khichdi reimagined for weaning infants. Sprouted yellow moong and heritage red rice ground into a silky powder with roasted jeera to prevent colic.',
      ingredients: 'Sprouted Yellow Moong Dal (50%), Parboiled Red Rice (48%), Roasted Jeera Powder (2%).',
      safetyNotice: 'COMPLEMENTARY FEEDING NOTICE: Recommended from 6 months of age alongside mother\'s milk. Cook thoroughly in water or breast milk. Always consult your pediatrician regarding your child\'s nutritional stages.',
      fssaiNumber: '10021051000123',
      hsnCode: '1901',
      gstRate: 18.0,
      rating: 4.9,
      reviewCount: 88,
      dietaryTags: ['Easy Digestion', 'Sprouted Moong', 'No Preservatives'],
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Pack', weightGrams: 200, mrp: 280, price: 229, stock: 90, sku: 'MMG-BN-MNG-200', isDefault: true },
      ],
    },
    {
      storeId: storeBaby.id,
      categoryId: catDailyPoshan.id,
      name: 'Daily Poshan: Nari Shakti (Women\'s Daily Nutrition Blend)',
      slug: 'daily-poshan-nari-shakti-womens-blend',
      shortDescription: 'Ayurvedic superfood mix of Shatavari, Moringa, Sprouted Pulses, Dates & Walnuts.',
      description: 'Crafted for modern women managing demanding careers and home life. Provides natural iron, phytoestrogens, and calcium for bone density, sustained stamina, and hormonal equilibrium.',
      ingredients: 'Sprouted Ragi, Sprouted Green Moong, Shatavari Extract, Moringa Leaf, Walnut Meal, Roasted Flax Seeds, Date Powder, Cardamom.',
      safetyNotice: 'GENERAL WELLNESS FOOD: This product is a dietary botanical food blend and is not intended to diagnose, treat, cure, or prevent any clinical condition. Consult your physician if pregnant, lactating, or on prescription medications.',
      fssaiNumber: '10021051000123',
      hsnCode: '1901',
      gstRate: 18.0,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 120,
      dietaryTags: ['Women Wellness', '100% Ayurvedic Nutrition', 'Natural Iron'],
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '300g Tin', weightGrams: 300, mrp: 550, price: 449, stock: 85, sku: 'MMG-FN-NARI-300', isDefault: true },
      ],
    },
    {
      storeId: storeBaby.id,
      categoryId: catDailyPoshan.id,
      name: 'Daily Poshan: Yuva Energy Mix (Youngsters\' Strength & Focus Blend)',
      slug: 'daily-poshan-yuva-energy-mix',
      shortDescription: 'Plant protein & memory botanicals with Brahmi, Shankhpushpi, Almonds & Saffron.',
      description: 'Designed for growing teens and college students. Delivers clean plant protein and nervous system tonics to sharpen cognitive focus and athletic endurance.',
      ingredients: 'Roasted Almond Flour, Pumpkin Seed Protein, Ashwagandha Root, Brahmi, Shankhpushpi, Raw Cacao, Organic Jaggery.',
      safetyNotice: 'DIETARY SUPPLEMENT NOTICE: Store in a cool dry place. Not intended for therapeutic clinical use. Consult a registered dietitian or healthcare practitioner for personalized guidance.',
      fssaiNumber: '10021051000123',
      hsnCode: '1901',
      gstRate: 18.0,
      rating: 4.8,
      reviewCount: 58,
      dietaryTags: ['Memory & Focus', 'High Plant Protein'],
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '350g Tin', weightGrams: 350, mrp: 580, price: 469, stock: 80, sku: 'MMG-FN-YUVA-350', isDefault: true },
      ],
    },
    {
      storeId: storeBaby.id,
      categoryId: catDailyPoshan.id,
      name: 'Daily Poshan: Vridh Poshan (Elders\' Gentle Evening Diet)',
      slug: 'daily-poshan-vridh-poshan-elders-evening-diet',
      shortDescription: 'Easily assimilable digestive evening porridge with roasted oats, makhana, cumin & ajwain.',
      description: 'Specially created for senior family members. Low glycemic, gentle on the gut, and comforting for nighttime digestion and joint comfort.',
      ingredients: 'Roasted Steel-Cut Oats, Fox Nut Flour, Roasted Cumin, Ajwain, Black Pepper, Himalayan Pink Salt.',
      safetyNotice: 'TRADITIONAL ELDER CARE FOOD: Wholesome dietary nourishment for mature adults. Not a medicinal treatment for chronic diseases. Consult your attending geriatrician or family physician regarding specific dietary restrictions.',
      fssaiNumber: '10021051000123',
      hsnCode: '1901',
      gstRate: 18.0,
      rating: 4.8,
      reviewCount: 65,
      dietaryTags: ['Senior Care', 'Easy Digestion', 'No Added Sugar'],
      imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '350g Jar', weightGrams: 350, mrp: 499, price: 399, stock: 70, sku: 'MMG-FN-ELDR-350', isDefault: true },
      ],
    },
    {
      storeId: storeBaby.id,
      categoryId: catPregnancy.id,
      name: 'Garbh Poshan: Trimester Care Dry Fruit & Herb Nourishment',
      slug: 'garbh-poshan-trimester-care-dry-fruit-nourishment',
      shortDescription: 'Traditional nutritional laddu mix with gondh, dry fruits, saffron & cardamom.',
      description: 'Time-tested Ayurvedic formulation for expectant mothers. Contains edible tragacanth gum (gondh), Kashmiri Mamra almonds, and saffron to nourish maternal tissues and fetal bone development.',
      ingredients: 'Edible Gum (Gondh), Kashmiri Almonds, Walnuts, Makhana Flour, Pure Cow Ghee, Saffron, Organic Jaggery, Green Cardamom.',
      safetyNotice: 'MATERNITY DIETARY CAUTION: Formulated as a traditional food accompaniment during pregnancy and postpartum confinement. Always consult your obstetrician or gynecologist before consuming herbal food preparations during pregnancy.',
      fssaiNumber: '10021051000123',
      hsnCode: '1901',
      gstRate: 18.0,
      isFeatured: true,
      rating: 5.0,
      reviewCount: 89,
      dietaryTags: ['Maternity Care', 'Gondh & Kesar', 'Ayurvedic Recipe'],
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '400g Artisanal Tin', weightGrams: 400, mrp: 750, price: 599, stock: 60, sku: 'MMG-BN-PRG-400', isDefault: true },
      ],
    },

    // --- STORE 3: PERSONAL CARE & NATURAL CLAYS ---
    {
      storeId: storeCare.id,
      categoryId: catMultani.id,
      name: 'Premium Export Quality Triple-Sifted Multani Mitti',
      slug: 'premium-export-quality-multani-mitti',
      shortDescription: 'Micro-fine 300-mesh Fuller\'s Earth mined from pristine desert mineral beds.',
      description: 'The royal beauty secret of Indian queens. Sun-dried and triple-sifted through micro-mesh cloths to ensure zero grit. Deeply purifies pores, absorbs excess sebum, and cools the skin naturally.',
      ingredients: '100% Pure Fuller\'s Earth (Solum Fullonum / Multani Mitti).',
      safetyNotice: 'COSMETIC CAUTION: For external cosmetic use only. Not for internal consumption. Always perform a patch test on your inner forearm 24 hours prior to full facial application. Discontinue use if irritation occurs.',
      fssaiNumber: 'Ayush & Cosmetic Compliant',
      hsnCode: '3304',
      gstRate: 18.0,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 215,
      dietaryTags: ['300 Mesh Ultra Fine', 'Chemical Free', '100% Mineral Clay'],
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Eco Pouch', weightGrams: 200, mrp: 180, price: 139, stock: 150, sku: 'MMG-PC-MLT-200', isDefault: false },
        { name: '500g Jar with Wooden Scoop', weightGrams: 500, mrp: 380, price: 289, stock: 110, sku: 'MMG-PC-MLT-500', isDefault: true },
      ],
    },
    {
      storeId: storeCare.id,
      categoryId: catMultani.id,
      name: 'Gentle Rose Pink Multani Mitti (Sensitive Skin Glow)',
      slug: 'gentle-rose-pink-multani-mitti',
      shortDescription: 'Gentle iron-rich pink earthen clay blended with wild Indian rose petal dust.',
      description: 'Specially formulated for normal to dry skin types. Infused with natural wild damascena rose petals to infuse radiant moisture while purifying pores.',
      ingredients: 'Natural Pink Clay, Triple-Sifted Fuller\'s Earth, Shade-Dried Rose Petal Powder.',
      safetyNotice: 'COSMETIC CAUTION: For external cosmetic use only. Keep away from eyes. Conduct patch test before application. Consult a dermatologist if you have active dermatitis.',
      fssaiNumber: 'Ayush & Cosmetic Compliant',
      hsnCode: '3304',
      gstRate: 18.0,
      rating: 4.8,
      reviewCount: 94,
      dietaryTags: ['Sensitive Skin', 'Real Rose Petals'],
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '200g Jar', weightGrams: 200, mrp: 260, price: 199, stock: 95, sku: 'MMG-PC-PNK-200', isDefault: true },
      ],
    },
    {
      storeId: storeCare.id,
      categoryId: catMultani.id,
      name: 'Dead Sea Mineral Mud Mask & Body Detox Pack',
      slug: 'dead-sea-mineral-mud-mask-pack',
      shortDescription: 'Imported authentic therapeutic Dead Sea mud loaded with 21 essential minerals.',
      description: 'Sourced from the deepest saline waters of the Dead Sea. Enriched with magnesium, potassium, and calcium to stimulate cellular renewal and skin elasticity.',
      ingredients: '100% Natural Dead Sea Mud, Organic Aloe Vera Extract.',
      safetyNotice: 'COSMETIC CAUTION: External cosmetic application only. Avoid broken skin. Slight tingling sensation is normal due to high mineral content. Consult your dermatologist if allergic to saline minerals.',
      fssaiNumber: 'Ayush & Cosmetic Compliant',
      hsnCode: '3304',
      gstRate: 18.0,
      rating: 4.9,
      reviewCount: 78,
      dietaryTags: ['21 Minerals', 'Spa Quality'],
      imageUrl: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80',
      variants: [
        { name: '250g Jar', weightGrams: 250, mrp: 499, price: 389, stock: 80, sku: 'MMG-PC-DSM-250', isDefault: true },
      ],
    },
  ];

  for (const p of products) {
    const { imageUrl, variants, ...productData } = p;
    await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: [{ url: imageUrl, isPrimary: true, displayOrder: 0 }],
        },
        variants: {
          create: variants.map((v: any) => ({
            name: v.name,
            sku: v.sku,
            weightGrams: v.weightGrams,
            packQty: v.packQty || 1,
            mrp: v.mrp,
            price: v.price,
            gstPercent: v.gstPercent || productData.gstRate || 12.0,
            stockQty: v.stockQty ?? v.stock ?? 50,
            isDefault: v.isDefault ?? false,
          })),
        },
      },
    });
  }

  console.log(`Seeded ${products.length} products across 3 stores.`);

  // 7. Seed Bundles & Bundle Items for Combos (2, 4, 6)
  const varBadam250 = await prisma.productVariant.findUnique({ where: { sku: 'MMG-DF-BDM-250' } });
  const varKaju250 = await prisma.productVariant.findUnique({ where: { sku: 'MMG-DF-KJU-250' } });
  const varPista200 = await prisma.productVariant.findUnique({ where: { sku: 'MMG-DF-PST-200' } });
  const varAnjeer250 = await prisma.productVariant.findUnique({ where: { sku: 'MMG-DF-ANJ-250' } });
  const varAkhrot250 = await prisma.productVariant.findUnique({ where: { sku: 'MMG-DF-AKH-250' } });
  const varKismis250 = await prisma.productVariant.findUnique({ where: { sku: 'MMG-DF-KSM-250' } });

  if (varBadam250 && varKaju250) {
    const bundleDuo = await prisma.bundle.create({
      data: {
        name: 'Royal Dry Fruit Duo (Almonds & Cashews)',
        slug: 'royal-dry-fruit-duo-bundle',
        description: 'Curated 2-in-1 pairing of jumbo California almonds and W240 creamy cashews.',
        price: 699,
        mrp: 850,
        items: {
          create: [
            { productVariantId: varBadam250.id, quantity: 1 },
            { productVariantId: varKaju250.id, quantity: 1 },
          ],
        },
      },
    });

    if (varPista200 && varAnjeer250) {
      await prisma.bundle.create({
        data: {
          name: 'Shahi Mewa Samrat 4-Jar Hamper',
          slug: 'shahi-mewa-samrat-bundle',
          description: 'Prestigious 4-jar assortment: Badam, Kaju, Afghan Pista, and Turkish Anjeer.',
          price: 1349,
          mrp: 1650,
          items: {
            create: [
              { productVariantId: varBadam250.id, quantity: 1 },
              { productVariantId: varKaju250.id, quantity: 1 },
              { productVariantId: varPista200.id, quantity: 1 },
              { productVariantId: varAnjeer250.id, quantity: 1 },
            ],
          },
        },
      });

      if (varAkhrot250 && varKismis250) {
        await prisma.bundle.create({
          data: {
            name: 'Maha Mewa Mahotsav Grand 6-Jar Gift Box',
            slug: 'maha-mewa-mahotsav-bundle',
            description: 'Grand festive imperial feast box with 6 royal dried fruits and nuts.',
            price: 1799,
            mrp: 2200,
            items: {
              create: [
                { productVariantId: varBadam250.id, quantity: 1 },
                { productVariantId: varKaju250.id, quantity: 1 },
                { productVariantId: varPista200.id, quantity: 1 },
                { productVariantId: varAnjeer250.id, quantity: 1 },
                { productVariantId: varAkhrot250.id, quantity: 1 },
                { productVariantId: varKismis250.id, quantity: 1 },
              ],
            },
          },
        });
      }
    }
  }
  console.log('Bundles and Bundle Items seeded.');

  // 8. Seed Banners for all 3 departments
  await prisma.banner.createMany({
    data: [
      {
        storeId: storeFoods.id,
        title: 'Pure Royal Harvest — California Badam & W240 Kaju',
        subtitle: 'Handpicked Grade A nuts with natural crunch and zero chemical polishing.',
        imageUrl: 'https://images.unsplash.com/photo-1508061252445-5350f3777130?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/store/foods',
        displayOrder: 1,
        isActive: true,
      },
      {
        storeId: storeFoods.id,
        title: 'Shahi Festive Gift Hampers (Sets of 2, 4 & 6)',
        subtitle: 'Handcrafted luxury keepsake boxes for weddings, corporate gifting and Diwali celebrations.',
        imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/store/foods?category=dry-fruits-combos',
        displayOrder: 2,
        isActive: true,
      },
      {
        storeId: storeBaby.id,
        title: 'Pratham Aahar — Sprouted Ancient Grain Cereals',
        subtitle: '100% natural, doctor-advised first foods made with sprouted ragi, almond flour & zero sugar.',
        imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/store/baby',
        displayOrder: 1,
        isActive: true,
      },
      {
        storeId: storeCare.id,
        title: 'Authentic Mined Fuller\'s Earth (Multani Mitti)',
        subtitle: 'Triple-sifted 300-mesh cosmetic clays for royal skin rejuvenation and detoxification.',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
        linkUrl: '/store/care',
        displayOrder: 1,
        isActive: true,
      },
    ],
  });
  console.log('Sample banners seeded for all 3 departments.');

  // 9. Seed Pages (About Us, Contact Us, FAQ, and Policy pages)
  await prisma.page.createMany({
    data: [
      {
        slug: 'about-us',
        title: 'About Mewa Masala Ghar',
        metaTitle: 'About Us | Mewa Masala Ghar - Heritage of Purity',
        metaDescription: 'Discover the story behind Mewa Masala Ghar, serving pure dry fruits, freshly ground spices, and natural wellness since 1994.',
        content: `
# Welcome to Mewa Masala Ghar

Founded in the heart of Navi Mumbai at the APMC Grain Market, **Mewa Masala Ghar** is dedicated to bringing authentic, preservative-free Indian dry fruits, stone-ground spices, traditional baby poshan, and earth-born clays to households across the nation.

### Our Three Guiding Principles
1. **Uncompromised Purity**: We never bleach, artificially polish, or add synthetic preservatives to our dry fruits or spices.
2. **Fair Farmer Partnerships**: Direct sourcing from certified orchardists in California, Kashmir, Kerala, and Rajasthan.
3. **Tradition Meets Modern Hygiene**: Meticulous triple-sifting and vacuum-sealed food-grade packaging that retains vital aromatics and healthy oils.
        `.trim(),
      },
      {
        slug: 'contact-us',
        title: 'Contact Us',
        metaTitle: 'Contact Us | Mewa Masala Ghar',
        metaDescription: 'Get in touch with Mewa Masala Ghar for inquiries, bulk orders, or customer support.',
        content: `
# Get in Touch

We would love to hear from you. For inquiries, corporate gift hampers, or assistance with your orders:

- **Customer Care Phone**: +91 98200 12345
- **WhatsApp Support**: +91 98200 12345 (9:00 AM – 8:00 PM IST)
- **Official Email**: care@mewamasalaghar.com
- **Store & Warehouse**: Shop 14, APMC Grain Market, Sector 19, Vashi, Navi Mumbai, Maharashtra 400703
- **FSSAI License**: 10021051000123
- **GSTIN**: 27AABCM1234F1Z5
        `.trim(),
      },
      {
        slug: 'faq',
        title: 'Frequently Asked Questions',
        metaTitle: 'FAQ | Mewa Masala Ghar',
        metaDescription: 'Answers to frequently asked questions about delivery, packaging, quality standards, and ordering.',
        content: `
# Frequently Asked Questions

### 1. Where do you ship?
We ship across all 28 states and 8 union territories in India with expedited courier partners including Blue Dart and Delhivery.

### 2. What are the delivery charges?
Shipping is completely **FREE** on all orders above ₹499. For orders below ₹499, a flat nominal delivery fee of ₹49 applies.

### 3. Is Cash on Delivery (COD) available?
Yes! Cash on Delivery is available for serviceable pincodes across India at zero additional surcharge.

### 4. Are your spices and baby foods lab-tested?
Yes, every batch is certified by FSSAI-accredited laboratories for heavy metals, aflatoxins, and microbial safety.
        `.trim(),
      },
      {
        slug: 'shipping-policy',
        title: 'Shipping & Delivery Policy',
        metaTitle: 'Shipping Policy | Mewa Masala Ghar',
        metaDescription: 'Learn about our delivery timelines, shipping rates, and packaging guarantees.',
        content: `
# Shipping & Delivery Policy

All orders placed before 2:00 PM IST are dispatched on the same business day from our climate-controlled Navi Mumbai fulfillment center.

- **Mumbai & MMR**: 1 - 2 business days
- **Metro Cities (Delhi, Bengaluru, Hyderabad, Chennai, Kolkata)**: 2 - 3 business days
- **Rest of India**: 3 - 5 business days
- **Tracking**: Every order receives real-time live tracking updates via SMS, email, and our Track Order portal.
        `.trim(),
      },
      {
        slug: 'returns-policy',
        title: 'Returns & Refund Policy',
        metaTitle: 'Returns & Refund Policy | Mewa Masala Ghar',
        metaDescription: 'Our 7-day hassle-free replacement policy for food and personal care items.',
        content: `
# Returns & Refund Policy

Because we sell consumable food and cosmetic clay items, we maintain stringent hygiene protocols:

- **7-Day Replacement**: If your parcel arrives damaged, unsealed, or defective, contact us within 7 days of delivery with photos for an immediate free replacement or full refund.
- **Refund Processing**: Prepaid refunds are credited to the original payment method within 3-5 business days.
        `.trim(),
      },
      {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        metaTitle: 'Privacy Policy | Mewa Masala Ghar',
        metaDescription: 'How Mewa Masala Ghar protects your personal data and privacy.',
        content: `
# Privacy Policy

We value your trust. We collect only the information necessary to fulfill your orders, provide customer service, and communicate tracking milestones. We never sell, rent, or trade your personal data to third-party marketing companies. All payment credentials are encrypted under Razorpay PCI-DSS Level 1 compliance.
        `.trim(),
      },
      {
        slug: 'terms-of-service',
        title: 'Terms of Service',
        metaTitle: 'Terms of Service | Mewa Masala Ghar',
        metaDescription: 'Terms and conditions governing the use of the Mewa Masala Ghar website and purchases.',
        content: `
# Terms of Service

By accessing or making a purchase on the Mewa Masala Ghar platform, you agree to be bound by these Terms of Service. All prices listed are inclusive of applicable Indian Goods and Services Tax (GST). Any legal disputes shall be subject to the exclusive jurisdiction of the courts of Navi Mumbai / Thane, Maharashtra.
        `.trim(),
      },
    ],
  });
  console.log('Pages seeded: About Us, Contact Us, FAQ, and all Policy pages.');

  // 10. Seed Indian Pincodes
  await prisma.pincode.createMany({
    data: [
      { pincode: '400703', city: 'Navi Mumbai', state: 'Maharashtra', stateCode: '27', estimatedDays: 2, isCodAvailable: true },
      { pincode: '400706', city: 'Navi Mumbai', state: 'Maharashtra', stateCode: '27', estimatedDays: 2, isCodAvailable: true },
      { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', stateCode: '27', estimatedDays: 2, isCodAvailable: true },
      { pincode: '400050', city: 'Mumbai', state: 'Maharashtra', stateCode: '27', estimatedDays: 2, isCodAvailable: true },
      { pincode: '411001', city: 'Pune', state: 'Maharashtra', stateCode: '27', estimatedDays: 2, isCodAvailable: true },
      { pincode: '110001', city: 'New Delhi', state: 'Delhi', stateCode: '07', estimatedDays: 3, isCodAvailable: true },
      { pincode: '560001', city: 'Bengaluru', state: 'Karnataka', stateCode: '29', estimatedDays: 3, isCodAvailable: true },
      { pincode: '500001', city: 'Hyderabad', state: 'Telangana', stateCode: '36', estimatedDays: 3, isCodAvailable: true },
      { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', stateCode: '33', estimatedDays: 3, isCodAvailable: true },
      { pincode: '700001', city: 'Kolkata', state: 'West Bengal', stateCode: '19', estimatedDays: 4, isCodAvailable: true },
      { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat', stateCode: '24', estimatedDays: 3, isCodAvailable: true },
      { pincode: '302001', city: 'Jaipur', state: 'Rajasthan', stateCode: '08', estimatedDays: 3, isCodAvailable: true },
      { pincode: '226001', city: 'Lucknow', state: 'Uttar Pradesh', stateCode: '09', estimatedDays: 3, isCodAvailable: true },
    ],
  });

  // 11. Seed Coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', discountType: 'PERCENTAGE', discountValue: 10, minOrderValue: 499, maxDiscount: 200, isActive: true },
      { code: 'MEWA100', discountType: 'FLAT', discountValue: 100, minOrderValue: 999, isActive: true },
      { code: 'FESTIVE15', discountType: 'PERCENTAGE', discountValue: 15, minOrderValue: 1499, maxDiscount: 500, isActive: true },
    ],
  });

  // 12. Seed Sample Activity Log & Contact Message
  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.review.create({
      data: {
        productId: firstProduct.id,
        userId: customer.id,
        userName: 'Aarav Sharma',
        rating: 5,
        title: 'Unbelievable freshness and crunch!',
        comment: 'I ordered the California almonds and W240 cashews. The quality is noticeably superior to regular store-bought packets. Will subscribe monthly!',
        isVerified: true,
        isApproved: true,
      },
    });

    await prisma.wishlist.create({
      data: {
        userId: customer.id,
        productId: firstProduct.id,
      },
    });
  }

  await prisma.contactMessage.create({
    data: {
      name: 'Pooja Kulkarni',
      email: 'pooja.k@example.com',
      phone: '+919811223344',
      subject: 'Inquiry for Diwali Corporate Gift Hampers (150 boxes)',
      message: 'Hello team, we are looking to order 150 boxes of the Shahi Mewa Samrat 4-Jar Hamper for our employees in Pune. Kindly share custom branding and bulk pricing options.',
      status: 'NEW',
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: superAdmin.id,
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'STORE',
      entityId: storeFoods.id,
      metadata: { note: 'Initial Phase 1 database seed completed successfully with all 27 tables.' },
    },
  });

  console.log('Database seeding successfully finished with 100% full catalog and all Phase 1 requirements!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
