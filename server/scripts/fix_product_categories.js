const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Checking and organizing product categories...');

  const categories = await prisma.category.findMany();
  const dryFruitsCat = categories.find(c => c.slug === 'dry-fruits') || categories.find(c => c.slug === 'dry-fruits-nuts');
  const seedsCat = categories.find(c => c.slug === 'seeds') || categories.find(c => c.slug === 'super-seeds');
  const makhanaCat = categories.find(c => c.slug === 'makhana') || categories.find(c => c.slug === 'gourmet-makhana');
  const spicesCat = categories.find(c => c.slug === 'spices') || categories.find(c => c.slug === 'pure-spices');
  const aataaCat = categories.find(c => c.slug === 'aataa-flour');

  const products = await prisma.product.findMany({
    include: { category: true }
  });

  let fixedCount = 0;
  for (const p of products) {
    const nameLower = p.name.toLowerCase();
    let targetCatId = null;

    if (nameLower.includes('coriander') || nameLower.includes('dhaniya') || nameLower.includes('haldi') || nameLower.includes('turmeric') || nameLower.includes('mirch') || nameLower.includes('chilli') || nameLower.includes('garam masala') || nameLower.includes('powder')) {
      if (spicesCat && p.categoryId !== spicesCat.id) targetCatId = spicesCat.id;
    } else if (nameLower.includes('makhana') || nameLower.includes('peri-peri') || nameLower.includes('mint') || nameLower.includes('pudina') || nameLower.includes('cream & onion')) {
      if (makhanaCat && p.categoryId !== makhanaCat.id) targetCatId = makhanaCat.id;
    } else if (nameLower.includes('seed') || nameLower.includes('alsi') || nameLower.includes('chia') || nameLower.includes('til') || nameLower.includes('magaz')) {
      if (seedsCat && p.categoryId !== seedsCat.id) targetCatId = seedsCat.id;
    } else if (nameLower.includes('aata') || nameLower.includes('flour') || nameLower.includes('chakki')) {
      if (aataaCat && p.categoryId !== aataaCat.id) targetCatId = aataaCat.id;
    }

    if (targetCatId) {
      console.log(`✅ Fixed [${p.name}]: was "${p.category?.name}" -> now assigned to correct category.`);
      await prisma.product.update({
        where: { id: p.id },
        data: { categoryId: targetCatId }
      });
      fixedCount++;
    }
  }

  // Also ensure settings for company name, phone, address
  await prisma.setting.upsert({
    where: { key: 'company_name' },
    update: { value: 'Jagriti Trading Company' },
    create: { key: 'company_name', value: 'Jagriti Trading Company' }
  });
  await prisma.setting.upsert({
    where: { key: 'phone' },
    update: { value: '+91 70717 04506' },
    create: { key: 'phone', value: '+91 70717 04506' }
  });
  await prisma.setting.upsert({
    where: { key: 'phone_secondary' },
    update: { value: '+91 94603 02825' },
    create: { key: 'phone_secondary', value: '+91 94603 02825' }
  });
  await prisma.setting.upsert({
    where: { key: 'address' },
    update: { value: 'HANWANT COLONY GANDHIPURA BALOTRA (RAJASTHAN) -344022' },
    create: { key: 'address', value: 'HANWANT COLONY GANDHIPURA BALOTRA (RAJASTHAN) -344022' }
  });

  console.log(`\n🎉 Completed! Organized ${fixedCount} products into their exact categories, and updated footer settings.`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
