import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ASSETS_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\assets';
const BANNERS_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners';

function getBase64Image(filename) {
  const fullPath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(fullPath)) return '';
  const buf = fs.readFileSync(fullPath);
  return 'data:image/jpeg;base64,' + buf.toString('base64');
}

async function renderBanner(page, config) {
  const {
    outputFilename,
    headline,
    subtitle,
    ctaText,
    items, // array of { title, subtitle, badge, imageBase64, isCenter }
  } = config;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 420px;
    overflow: hidden;
    background: #FDFBF7;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    display: flex;
  }
  
  /* Sunlit kitchen ambient background */
  .bg-kitchen {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 75% 30%, #FFFDF8 0%, #F7EFE4 45%, #EBE0D2 100%);
    z-index: 1;
  }

  /* Wooden Tabletop across the bottom */
  .wooden-table {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 135px;
    background: linear-gradient(180deg, #D6B58F 0%, #C6A177 30%, #B28B62 70%, #9C744A 100%);
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 -4px 12px rgba(0,0,0,0.06);
    z-index: 2;
  }
  .wooden-table::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(90deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 60px, rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 120px);
    opacity: 0.7;
  }

  /* Left content area */
  .left-content {
    position: relative;
    z-index: 10;
    width: 530px;
    height: 100%;
    padding: 50px 0 50px 65px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 46px;
    font-weight: 700;
    color: #183B23;
    line-height: 1.12;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: #4A4A4A;
    margin-top: 14px;
    max-width: 440px;
    font-weight: 400;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #C88E2D;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 15px;
    padding: 12px 32px;
    border-radius: 9999px;
    margin-top: 22px;
    width: fit-content;
    box-shadow: 0 4px 14px rgba(200, 142, 45, 0.35);
  }

  /* Botanical leaves sprig at bottom left */
  .leaf-decor {
    position: absolute;
    bottom: -5px;
    left: -5px;
    z-index: 15;
    width: 120px;
    height: 120px;
    pointer-events: none;
    opacity: 0.85;
  }

  /* Right content area: Jars & Products */
  .right-content {
    position: absolute;
    top: 0;
    right: 35px;
    width: 610px;
    height: 420px;
    z-index: 5;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 22px;
    gap: 18px;
  }

  /* Product jar card */
  .jar-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 180px;
  }

  .jar-item.center-item {
    transform: translateY(-8px) scale(1.04);
    z-index: 6;
  }

  .jar-card {
    width: 175px;
    background: #FFFFFF;
    border-radius: 18px;
    overflow: hidden;
    border: 3px solid #FFFFFF;
    box-shadow: 0 16px 30px -8px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
  }

  .jar-item.center-item .jar-card {
    border-color: #F5D88C;
    box-shadow: 0 20px 35px -8px rgba(0,0,0,0.28), 0 0 15px rgba(217,164,65,0.2);
  }

  .jar-img {
    width: 100%;
    height: 175px;
    object-fit: cover;
    display: block;
  }

  .jar-info {
    padding: 8px 10px 10px;
    background: #FFFFFF;
    text-align: center;
  }

  .jar-badge {
    position: absolute;
    top: -10px;
    background: #183B23;
    color: #F5D88C;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 9999px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    letter-spacing: 0.04em;
    z-index: 8;
  }

  .jar-item.center-item .jar-badge {
    background: #C88E2D;
    color: #FFFFFF;
  }

  .jar-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 13px;
    font-weight: 700;
    color: #1A3D24;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .jar-sub {
    font-size: 11px;
    color: #6B5E51;
    font-weight: 500;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
</head>
<body>
  <div class="bg-kitchen"></div>
  <div class="wooden-table"></div>

  <div class="left-content">
    <h1 class="headline">${headline}</h1>
    <p class="subtitle">${subtitle}</p>
    <div class="cta-btn">
      ${ctaText} <span>&rarr;</span>
    </div>
  </div>

  <svg class="leaf-decor" viewBox="0 0 120 120" fill="none">
    <path d="M0 120 C 20 80, 40 50, 75 35 C 50 55, 30 85, 0 120 Z" fill="#183B23"/>
    <path d="M10 120 C 35 75, 65 60, 95 55 C 70 70, 45 95, 10 120 Z" fill="#2E5A36"/>
    <path d="M0 110 C 20 95, 45 90, 60 85 C 45 95, 25 105, 0 110 Z" fill="#1A4026"/>
    <path d="M25 120 C 45 85, 75 75, 110 70 C 85 85, 60 105, 25 120 Z" fill="#3D7347"/>
  </svg>

  <div class="right-content">
    ${items
      .map(
        (it) => `
      <div class="jar-item ${it.isCenter ? 'center-item' : ''}">
        ${it.badge ? `<span class="jar-badge">${it.badge}</span>` : ''}
        <div class="jar-card">
          <img src="${it.imageBase64}" class="jar-img"/>
          <div class="jar-info">
            <p class="jar-title">${it.title}</p>
            <p class="jar-sub">${it.subtitle}</p>
          </div>
        </div>
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
  try {
    await page.evaluateHandle('document.fonts.ready');
  } catch (e) {
    console.log('Font wait skipped');
  }

  const outPath = path.join(BANNERS_DIR, outputFilename);
  await page.screenshot({ path: outPath });
  console.log('✅ Generated:', outputFilename);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });

  // 1. Dry Fruits & Combos
  console.log('Generating dryfruits_banner_full.png...');
  await renderBanner(page, {
    outputFilename: 'dryfruits_banner_full.png',
    headline: 'Royal Mewa &<br/>Festive Combos.',
    subtitle: 'Kajoo, Pista, Anjeer, Akhrot, Kismis & Jumbo California Badam. Curated gift hampers in packs of 2, 4 & 6.',
    ctaText: 'Shop Royal Mewa',
    items: [
      {
        title: 'Royal Badam',
        subtitle: 'Jumbo California (500g)',
        badge: 'Bestseller',
        imageBase64: getBase64Image('almonds.jpg'),
      },
      {
        title: 'Shahi 4-Jar Hamper',
        subtitle: 'Badam • Kaju • Pista • Anjeer',
        badge: 'Combos of 2, 4, 6',
        imageBase64: getBase64Image('combo_hamper.jpg'),
        isCenter: true,
      },
      {
        title: 'King Size Kaju',
        subtitle: 'Grade W240 Whole (500g)',
        badge: '100% Whole',
        imageBase64: getBase64Image('cashews.jpg'),
      },
    ],
  });

  // 2. Artisanal Spices
  console.log('Generating spices_banner_full.png...');
  await renderBanner(page, {
    outputFilename: 'spices_banner_full.png',
    headline: 'Aromatic & Pure.<br/>Cold-Ground Spices.',
    subtitle: 'High-curcumin Lakadong Haldi, Stemless Guntur Lal Mirch, Malabar Dhaniya & royal garam masala.',
    ctaText: 'Shop Pure Spices',
    items: [
      {
        title: 'Lakadong Haldi',
        subtitle: '7%+ Active Curcumin (200g)',
        badge: 'Single-Origin',
        imageBase64: getBase64Image('haldi.jpg'),
      },
      {
        title: 'Shahi Garam Masala',
        subtitle: '16 Roasted Spices (100g)',
        badge: 'Stone Ground',
        imageBase64: getBase64Image('spices_mix.jpg'),
        isCenter: true,
      },
      {
        title: 'Guntur Lal Mirch',
        subtitle: 'Fiery & Stemless (200g)',
        badge: 'Zero Polish',
        imageBase64: getBase64Image('chili.jpg'),
      },
    ],
  });

  // 3. Baby Food & Daily Poshan
  console.log('Generating baby_banner_full.png...');
  await renderBanner(page, {
    outputFilename: 'baby_banner_full.png',
    headline: 'Gentle & Pure.<br/>Daily Family Poshan.',
    subtitle: 'Pratham Aahaar 6+ Month sprouted cereals & specialized daily poshan blends for women, youth and elders.',
    ctaText: 'Shop Baby & Poshan',
    items: [
      {
        title: 'Pratham Aahaar',
        subtitle: 'Sprouted Ragi & Badam (6+M)',
        badge: 'Doctor Safe',
        imageBase64: getBase64Image('baby_cereal.jpg'),
      },
      {
        title: 'Nari Shakti Blend',
        subtitle: 'Women Daily Stamina (300g)',
        badge: '100% Ayurvedic',
        imageBase64: getBase64Image('poshan_family.jpg'),
        isCenter: true,
      },
      {
        title: 'Moong Rice Porridge',
        subtitle: 'Easy Digestion Weaning (6+M)',
        badge: 'Zero Sugar',
        imageBase64: getBase64Image('baby_cereal.jpg'),
      },
    ],
  });

  // 4. Pregnancy Nutrition Diet
  console.log('Generating pregnancy_banner_full.png...');
  await renderBanner(page, {
    outputFilename: 'pregnancy_banner_full.png',
    headline: 'Nourishing & Safe.<br/>Maternal Superfoods.',
    subtitle: 'Iron, Calcium and Folate-rich dry fruit blends, Gondh laddu mixes & pregnancy nutrition for healthy mom and baby.',
    ctaText: 'Shop Pregnancy Care',
    items: [
      {
        title: 'Kashmiri Almonds',
        subtitle: 'High Natural Vitamin E (250g)',
        badge: 'Maternal Pure',
        imageBase64: getBase64Image('almonds.jpg'),
      },
      {
        title: 'Garbh Poshan Laddu',
        subtitle: 'Gondh, Kesar & Nuts (400g)',
        badge: 'Ayurvedic Recipe',
        imageBase64: getBase64Image('pregnancy_diet.jpg'),
        isCenter: true,
      },
      {
        title: 'Turkish Anjeer',
        subtitle: 'Rich in Natural Iron (250g)',
        badge: 'Natural Folate',
        imageBase64: getBase64Image('combo_hamper.jpg'),
      },
    ],
  });

  // 5. Personal Care & Natural Clays
  console.log('Generating care_banner_full.png...');
  await renderBanner(page, {
    outputFilename: 'care_banner_full.png',
    headline: 'Ancient Earth.<br/>Pure Mineral Clays.',
    subtitle: 'Export-Grade 300-Mesh Multani Mitti, Pink Clay with rose petals & therapeutic Dead Sea Mineral Mud.',
    ctaText: 'Shop Natural Care',
    items: [
      {
        title: 'Export Multani Mitti',
        subtitle: 'Triple-Sifted 300-Mesh (500g)',
        badge: 'Export Quality',
        imageBase64: getBase64Image('multani_mitti.jpg'),
      },
      {
        title: 'Dead Sea Mud Mask',
        subtitle: '21 Natural Minerals (250g)',
        badge: 'Spa Grade',
        imageBase64: getBase64Image('dead_sea_mud.jpg'),
        isCenter: true,
      },
      {
        title: 'Pink Multani Mitti',
        subtitle: 'Rose Petal Infusion (200g)',
        badge: 'Glow Clay',
        imageBase64: getBase64Image('multani_mitti.jpg'),
      },
    ],
  });

  await browser.close();
  console.log('🎉 All banners generated successfully!');
}

main().catch(console.error);
