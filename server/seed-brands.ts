import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBrands() {
  console.log('Seeding Brands and mapping categories and products...');

  // 1. Upsert Mewa Masala Ghar Brand
  const mewaBrand = await prisma.brand.upsert({
    where: { slug: 'mewa-masala-ghar' },
    update: {
      name: 'Mewa Masala Ghar',
      tagline: 'Pure Indian Goodness, Rooted in Tradition',
      description: 'Finest royal dry fruits, super seeds, slow-roasted makhana snacks, and authentic aromatic Indian spices and stone-ground flours.',
      logo: '/logo.png',
      primaryColor: '#2F5D3A',
      accentColor: '#D9A441',
      bgColor: '#FAF6EC',
      textColor: '#2B2B2B',
      fssaiNumber: '10021051000123',
      isActive: true,
    },
    create: {
      slug: 'mewa-masala-ghar',
      name: 'Mewa Masala Ghar',
      tagline: 'Pure Indian Goodness, Rooted in Tradition',
      description: 'Finest royal dry fruits, super seeds, slow-roasted makhana snacks, and authentic aromatic Indian spices and stone-ground flours.',
      logo: '/logo.png',
      primaryColor: '#2F5D3A',
      accentColor: '#D9A441',
      bgColor: '#FAF6EC',
      textColor: '#2B2B2B',
      fssaiNumber: '10021051000123',
      isActive: true,
    },
  });

  // 2. Upsert Jimmi Jaggu Brand
  const jimmiBrand = await prisma.brand.upsert({
    where: { slug: 'jimmi-jaggu' },
    update: {
      name: 'Jimmi Jaggu',
      tagline: 'From Our Store to Your Home',
      description: 'Exclusive family wellness and skincare sub-brand crafted with ancestral Indian care. Doctor-formulated baby nutrition, maternal poshan, and pristine volcanic and herbal skincare.',
      logo: '/brands/jimmi_jaggu_logo.png',
      primaryColor: '#2A2A2A',
      accentColor: '#D9A9A0',
      bgColor: '#FAF7F2',
      textColor: '#2A2A2A',
      fssaiNumber: '10021051000123',
      isActive: true,
    },
    create: {
      slug: 'jimmi-jaggu',
      name: 'Jimmi Jaggu',
      tagline: 'From Our Store to Your Home',
      description: 'Exclusive family wellness and skincare sub-brand crafted with ancestral Indian care. Doctor-formulated baby nutrition, maternal poshan, and pristine volcanic and herbal skincare.',
      logo: '/brands/jimmi_jaggu_logo.png',
      primaryColor: '#2A2A2A',
      accentColor: '#D9A9A0',
      bgColor: '#FAF7F2',
      textColor: '#2A2A2A',
      fssaiNumber: '10021051000123',
      isActive: true,
    },
  });

  console.log(`Brands ready: ${mewaBrand.name} and ${jimmiBrand.name}`);

  // 3. Find or Create Stores if needed for legacy FK
  let foodsStore = await prisma.store.findUnique({ where: { slug: 'foods' } });
  if (!foodsStore) {
    foodsStore = await prisma.store.create({
      data: {
        slug: 'foods',
        name: 'Mewa & Healthy Foods',
        themeKey: 'theme-foods',
      },
    });
  }

  let babyStore = await prisma.store.findUnique({ where: { slug: 'baby' } });
  if (!babyStore) {
    babyStore = await prisma.store.create({
      data: {
        slug: 'baby',
        name: 'Baby & Family Nutrition',
        themeKey: 'theme-baby',
      },
    });
  }

  let careStore = await prisma.store.findUnique({ where: { slug: 'care' } });
  if (!careStore) {
    careStore = await prisma.store.create({
      data: {
        slug: 'care',
        name: 'Personal Care & Natural Clays',
        themeKey: 'theme-care',
      },
    });
  }

  // 4. Upsert Required Categories
  // Mewa Masala Ghar Categories: Dry Fruits, Seeds, Makhana, Spices, Aataa (Flour)
  const mewaCategories = [
    { name: 'Dry Fruits', slug: 'dry-fruits', displayOrder: 1, image: '/banners/hero_slide_dryfruits.png', description: 'Royal California Badam, King Cashews, Kashmiri Walnuts, and Afghan Anjeer.' },
    { name: 'Seeds', slug: 'seeds', displayOrder: 2, image: '/banners/hero_slide_seeds.png', description: 'Raw and roasted pumpkin seeds, chia seeds, flax seeds, and sunflower seeds.' },
    { name: 'Makhana', slug: 'makhana', displayOrder: 3, image: '/foods/makhana/makhana_peri_peri.jpg', description: 'Slow-roasted jumbo fox nuts seasoned with artisanal herbs and spices.' },
    { name: 'Spices', slug: 'spices', displayOrder: 4, image: '/categories/combo_packs.jpg', description: 'Authentic stone-ground Indian spices, turmeric, and whole garam masalas.' },
    { name: 'Aataa (Flour)', slug: 'aataa-flour', displayOrder: 5, image: '/categories/flour_aata.jpg', description: 'Traditional stone-ground whole wheat, multigrain, and specialty nutritious flours.' },
  ];

  for (const cat of mewaCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        brandId: mewaBrand.id,
        storeId: foodsStore.id,
        displayOrder: cat.displayOrder,
        image: cat.image,
        description: cat.description,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        brandId: mewaBrand.id,
        storeId: foodsStore.id,
        displayOrder: cat.displayOrder,
        image: cat.image,
        description: cat.description,
      },
    });
  }

  // Jimmi Jaggu Categories: Baby Products, Skincare & Personal Care, Pregnancy Products
  const jimmiCategories = [
    { name: 'Baby Products', slug: 'baby-products', displayOrder: 1, image: '/categories/baby_products.jpg', storeId: babyStore.id, description: 'Pratham Aahar, sprouted ragi porridge, and wholesome first foods for 6+ months.' },
    { name: 'Skincare & Personal Care', slug: 'skincare-personal-care', displayOrder: 2, image: '/categories/skin_care.jpg', storeId: careStore.id, description: '300-Mesh Multani Mitti, French Pink Clay, herbal face packs, and Dead Sea minerals.' },
    { name: 'Pregnancy Products', slug: 'pregnancy-products', displayOrder: 3, image: '/banners/hero_slide_pregnancy.png', storeId: babyStore.id, description: 'Maternal nutrition, ayurvedic dry fruit laddoo flour, and gentle postpartum wellness.' },
  ];

  for (const cat of jimmiCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        brandId: jimmiBrand.id,
        storeId: cat.storeId,
        displayOrder: cat.displayOrder,
        image: cat.image,
        description: cat.description,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        brandId: jimmiBrand.id,
        storeId: cat.storeId,
        displayOrder: cat.displayOrder,
        image: cat.image,
        description: cat.description,
      },
    });
  }

  // 5. Update existing categories: assign brandId
  // Also link legacy slugs to appropriate brand
  await prisma.category.updateMany({
    where: {
      slug: { in: ['pratham-aahar', 'daily-poshan', 'pregnancy-care', 'pregnancy-diet', 'baby-maternal-poshan', 'multani-mitti-clays', 'rose-petal-herbal', 'dead-sea-mud'] },
    },
    data: { brandId: jimmiBrand.id },
  });

  await prisma.category.updateMany({
    where: {
      brandId: null,
      storeId: { in: [babyStore.id, careStore.id] },
    },
    data: { brandId: jimmiBrand.id },
  });

  await prisma.category.updateMany({
    where: {
      brandId: null,
    },
    data: { brandId: mewaBrand.id },
  });

  // 6. Map all products to brandId
  // Baby & Care products to Jimmi Jaggu
  await prisma.product.updateMany({
    where: {
      OR: [
        { storeId: babyStore.id },
        { storeId: careStore.id },
        { category: { brandId: jimmiBrand.id } },
      ],
    },
    data: { brandId: jimmiBrand.id },
  });

  // All other products to Mewa Masala Ghar
  await prisma.product.updateMany({
    where: { brandId: null },
    data: { brandId: mewaBrand.id },
  });

  // 7. Map Banners to Brands
  await prisma.banner.updateMany({
    where: {
      OR: [
        { storeId: babyStore.id },
        { storeId: careStore.id },
        { title: { contains: 'Baby' } },
        { title: { contains: 'Pregnancy' } },
        { title: { contains: 'Clay' } },
      ],
    },
    data: { brandId: jimmiBrand.id },
  });

  await prisma.banner.updateMany({
    where: { brandId: null },
    data: { brandId: mewaBrand.id },
  });

  const mewaProdCount = await prisma.product.count({ where: { brandId: mewaBrand.id } });
  const jimmiProdCount = await prisma.product.count({ where: { brandId: jimmiBrand.id } });

  console.log(`Brand mapping complete! Mewa Masala Ghar products: ${mewaProdCount}, Jimmi Jaggu products: ${jimmiProdCount}`);
}

seedBrands()
  .catch((e) => {
    console.error('Seed brands error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
