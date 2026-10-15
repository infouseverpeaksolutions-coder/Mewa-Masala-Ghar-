const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(process.cwd(), 'server/.env') });
dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- UPDATING FSSAI AND FREE SHIPPING SETTINGS ---');

  const updates = [
    { key: 'fssai', value: '22226048000212, 22226007002022', group: 'compliance' },
    { key: 'free_shipping_threshold', value: '999', group: 'shipping' },
  ];

  for (const item of updates) {
    const existing = await prisma.setting.findFirst({ where: { key: item.key } });
    if (existing) {
      await prisma.setting.update({
        where: { id: existing.id },
        data: { value: item.value },
      });
      console.log(`Updated setting: ${item.key} -> ${item.value}`);
    } else {
      await prisma.setting.create({
        data: item,
      });
      console.log(`Created setting: ${item.key} -> ${item.value}`);
    }
  }

  // Update stores fssaiNumber
  await prisma.store.updateMany({
    data: { fssaiNumber: '22226048000212, 22226007002022' },
  });
  console.log('Updated stores fssaiNumber');

  // Update brands fssaiNumber
  await prisma.brand.updateMany({
    data: { fssaiNumber: '22226048000212, 22226007002022' },
  });
  console.log('Updated brands fssaiNumber');

  console.log('\n--- SUCCESS: FSSAI and Free Shipping threshold set to 999! ---');
}

main()
  .catch((err) => {
    console.error('Error updating settings:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
