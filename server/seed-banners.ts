import prisma from './src/config/db';

const defaultBanners = [
  {
    title: 'Royal Handpicked Dry Fruits, Nuts & Festive Combos',
    subtitle:
      'Direct from APMC Mandi — California Badam, King W240 Kaju, Afghan Anjeer & Walnuts packed fresh with zero preservatives for daily family vitality and royal gifting.',
    ctaText: 'Shop Royal Mewa',
    imageUrl: '/banners/hero_slide_dryfruits.png',
    linkUrl: '/foods',
    displayOrder: 1,
    isActive: true,
  },
  {
    title: 'Wholesome Nutrient-Rich Super Seeds & Vitality Mixes',
    subtitle:
      'High in Plant Protein, Omega-3 & Essential Fiber — Slow-roasted flax, raw chia, jumbo pumpkin, sunflower & 7-in-1 signature mixes to energize your daily health naturally.',
    ctaText: 'Shop Super Seeds',
    imageUrl: '/banners/hero_slide_seeds.png',
    linkUrl: '/shop?store=foods&category=seeds-mixes',
    displayOrder: 2,
    isActive: true,
  },
  {
    title: 'Traditional Sprouted Baby Food & Wholesome Daily Poshan',
    subtitle:
      'Ayurvedic & Motherly Care — Sprouted Ragi & Badam Pratham Aahaar for infants (6+ months), nourishing blends for active women, and gentle bone & vitality poshan for elders.',
    ctaText: 'Shop Baby & Poshan',
    imageUrl: '/banners/hero_slide_baby_poshan.png',
    linkUrl: '/baby-nutrition',
    displayOrder: 3,
    isActive: true,
  },
  {
    title: 'Doctor-Curated Ayurvedic Pregnancy Care & Maternal Nutrition',
    subtitle:
      'Nutrient-dense care for mother and baby — Organic dry fruit laddoo flour, natural plant iron, calcium, and essential minerals supporting vitality, fetal growth, and postpartum recovery.',
    ctaText: 'Shop Pregnancy Care',
    imageUrl: '/banners/hero_slide_pregnancy.png',
    linkUrl: '/baby-nutrition',
    displayOrder: 4,
    isActive: true,
  },
  {
    title: 'Export Grade Volcanic Clays, Mineral Mud & Herbal Care',
    subtitle:
      'Ancient Earth Radiance — Ultra-fine 300-mesh Multani Mitti, soothing French Rose Pink Clay, and mineral-rich Dead Sea Mud for deep pore detoxification, oil control, and natural glow.',
    ctaText: 'Shop Personal Care',
    imageUrl: '/banners/hero_slide_personal_care.png',
    linkUrl: '/personal-care',
    displayOrder: 5,
    isActive: true,
  },
];

async function seed() {
  console.log('Seeding hero banners into database...');
  await prisma.banner.deleteMany({});

  for (const b of defaultBanners) {
    await prisma.banner.create({
      data: b,
    });
  }
  console.log(`Successfully seeded ${defaultBanners.length} banners into the database.`);
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error('Error seeding banners:', err);
  process.exit(1);
});
