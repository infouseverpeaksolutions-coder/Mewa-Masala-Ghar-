const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updates = [
    { key: 'phone', value: '+91 70717 04506, +91 94603 02825', group: 'contact' },
    { key: 'email', value: 'mewamasalaghar26@gmail.com', group: 'contact' },
    { key: 'company_name', value: 'Jagriti Trading Company', group: 'general' },
    { key: 'address', value: 'HANWANT COLONY GANDHIPURA BALOTRA (RAJASTHAN) -344022', group: 'contact' },
    { key: 'fssai', value: '22226048000212, 22226007002022', group: 'compliance' },
    { key: 'whatsapp_number', value: '+917071704506', group: 'contact' },
    { key: 'phone_secondary', value: '+91 94603 02825', group: 'contact' },
  ];

  for (const item of updates) {
    const existing = await prisma.setting.findFirst({ where: { key: item.key } });
    if (existing) {
      await prisma.setting.update({
        where: { id: existing.id },
        data: { value: item.value }
      });
      console.log(`Updated setting: ${item.key} -> ${item.value}`);
    } else {
      await prisma.setting.create({
        data: item
      });
      console.log(`Created setting: ${item.key} -> ${item.value}`);
    }
  }

  console.log('\nAll contact settings updated successfully in database.');
}

main()
  .catch((err) => {
    console.error('Error updating settings:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
