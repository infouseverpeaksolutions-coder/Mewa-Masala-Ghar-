const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING DATABASE BRAND & STORE ISOLATION SYNC ---');

  // 1. Ensure master stores exist
  let foodsStore = await prisma.store.findFirst({ where: { slug: 'foods' } });
  if (!foodsStore) {
    foodsStore = await prisma.store.create({
      data: {
        slug: 'foods',
        name: 'Mewa & Healthy Foods',
        tagline: 'Handpicked Dry Fruits, Roasted Makhana, Wholesome Seeds & Stone-Ground Spices',
        description: 'Finest royal dry fruits, super seeds, slow-roasted makhana snacks, and authentic aromatic Indian spices.',
        themeKey: 'theme-foods',
        primaryColor: '#2F5D3A',
        accentColor: '#D9A441',
        bgColor: '#FAF6EC',
        fssaiNumber: '10021051000123',
        isActive: true,
      },
    });
    console.log('Created missing foods store:', foodsStore.id);
  }

  let jimmiStore = await prisma.store.findFirst({
    where: { slug: { in: ['jimmi-jaggu', 'baby', 'care'] } },
  });
  if (!jimmiStore) {
    jimmiStore = await prisma.store.create({
      data: {
        slug: 'jimmi-jaggu',
        name: 'Jimmi Jaggu',
        tagline: 'From Our Store to Your Home',
        description: 'Pure, wholesome botanicals crafted for happy babies, healthy skin and a healthier tomorrow.',
        themeKey: 'theme-baby',
        primaryColor: '#B97375',
        accentColor: '#6D8B74',
        bgColor: '#FFFDF9',
        fssaiNumber: '10021051000123',
        isActive: true,
      },
    });
    console.log('Created missing jimmi-jaggu store:', jimmiStore.id);
  }

  // 2. Ensure master brands exist
  let mewaBrand = await prisma.brand.findFirst({ where: { slug: 'mewa-masala-ghar' } });
  if (!mewaBrand) {
    mewaBrand = await prisma.brand.create({
      data: {
        slug: 'mewa-masala-ghar',
        name: 'Mewa Masala Ghar',
        tagline: 'Pure Indian Goodness, Rooted in Tradition',
        logo: '/logo.png',
        primaryColor: '#2F5D3A',
        accentColor: '#D9A441',
        bgColor: '#FAF6EC',
        textColor: '#2B2B2B',
        fssaiNumber: '10021051000123',
        isActive: true,
      },
    });
    console.log('Created missing mewa-masala-ghar brand:', mewaBrand.id);
  }

  let jimmiBrand = await prisma.brand.findFirst({ where: { slug: 'jimmi-jaggu' } });
  if (!jimmiBrand) {
    jimmiBrand = await prisma.brand.create({
      data: {
        slug: 'jimmi-jaggu',
        name: 'Jimmi Jaggu',
        tagline: 'From Our Store to Your Home',
        logo: '/brands/jimmi_jaggu_logo.png',
        primaryColor: '#B97375',
        accentColor: '#6D8B74',
        bgColor: '#FFFDF9',
        textColor: '#2A2A2A',
        fssaiNumber: '10021051000123',
        isActive: true,
      },
    });
    console.log('Created missing jimmi-jaggu brand:', jimmiBrand.id);
  }

  console.log(`Master references:`);
  console.log(`- Foods Store: ${foodsStore.id} (${foodsStore.slug})`);
  console.log(`- Jimmi Store: ${jimmiStore.id} (${jimmiStore.slug})`);
  console.log(`- Mewa Brand: ${mewaBrand.id} (${mewaBrand.slug})`);
  console.log(`- Jimmi Brand: ${jimmiBrand.id} (${jimmiBrand.slug})`);

  // 3. Sync Categories:
  // Any Jimmi category (Personal Care, Skincare, Baby care, Clays, Multani Mitti) -> jimmiStore and jimmiBrand
  const allCategories = await prisma.category.findMany({
    include: { store: true, brand: true },
  });

  let jimmiCatCount = 0;
  let mewaCatCount = 0;

  for (const cat of allCategories) {
    const slugLower = (cat.slug || '').toLowerCase();
    const nameLower = (cat.name || '').toLowerCase();
    const isJimmi =
      cat.brand?.slug === 'jimmi-jaggu' ||
      cat.store?.slug === 'jimmi-jaggu' ||
      cat.store?.slug === 'baby' ||
      cat.store?.slug === 'care' ||
      slugLower.includes('baby') ||
      nameLower.includes('baby') ||
      slugLower.includes('skincare') ||
      nameLower.includes('skincare') ||
      slugLower.includes('personal-care') ||
      nameLower.includes('personal care') ||
      slugLower.includes('mitti') ||
      slugLower.includes('clay') ||
      nameLower.includes('clay');

    if (isJimmi) {
      await prisma.category.update({
        where: { id: cat.id },
        data: {
          storeId: jimmiStore.id,
          brandId: jimmiBrand.id,
        },
      });
      jimmiCatCount++;
    } else {
      await prisma.category.update({
        where: { id: cat.id },
        data: {
          storeId: foodsStore.id,
          brandId: mewaBrand.id,
        },
      });
      mewaCatCount++;
    }
  }

  console.log(`Synced Categories: ${mewaCatCount} Mewa Masala categories, ${jimmiCatCount} Jimmi Jaggu categories.`);

  // 4. Sync Products:
  // Match products based on their category, name, or existing store/brand
  const allProducts = await prisma.product.findMany({
    include: { category: true, store: true, brand: true },
  });

  let mewaProdCount = 0;
  let jimmiProdCount = 0;

  for (const prod of allProducts) {
    const catSlug = (prod.category?.slug || '').toLowerCase();
    const catName = (prod.category?.name || '').toLowerCase();
    const prodName = (prod.name || '').toLowerCase();
    const prodSlug = (prod.slug || '').toLowerCase();

    const isJimmi =
      prod.brand?.slug === 'jimmi-jaggu' ||
      prod.store?.slug === 'jimmi-jaggu' ||
      prod.store?.slug === 'baby' ||
      prod.store?.slug === 'care' ||
      catSlug.includes('baby') ||
      catName.includes('baby') ||
      catSlug.includes('personal-care') ||
      catName.includes('personal care') ||
      catSlug.includes('skincare') ||
      catName.includes('skincare') ||
      catSlug.includes('clay') ||
      catName.includes('clay') ||
      catSlug.includes('mitti') ||
      prodName.includes('multani') ||
      prodSlug.includes('multani') ||
      prodName.includes('dead sea') ||
      prodSlug.includes('dead-sea');

    if (isJimmi) {
      await prisma.product.update({
        where: { id: prod.id },
        data: {
          storeId: jimmiStore.id,
          brandId: jimmiBrand.id,
        },
      });
      jimmiProdCount++;
    } else {
      await prisma.product.update({
        where: { id: prod.id },
        data: {
          storeId: foodsStore.id,
          brandId: mewaBrand.id,
        },
      });
      mewaProdCount++;
    }
  }

  console.log(`Synced Products: ${mewaProdCount} Mewa Masala products, ${jimmiProdCount} Jimmi Jaggu products.`);
  console.log('--- DATABASE SYNC COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error('Error during DB isolation sync:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
