import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ASSETS_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\assets';
const BANNERS_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners';
const MOCKUP_IMG = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\.user_uploaded\\media_1789989156078.png';

function getBannerBase64(filename) {
  const fullPath = path.join(BANNERS_DIR, filename);
  const buf = fs.readFileSync(fullPath);
  return 'data:image/jpeg;base64,' + buf.toString('base64');
}

function getAssetBase64(filename) {
  const fullPath = path.join(ASSETS_DIR, filename);
  const ext = filename.endsWith('.png') ? 'png' : 'jpeg';
  const buf = fs.readFileSync(fullPath);
  return `data:image/${ext};base64,` + buf.toString('base64');
}

async function generateAll() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });

  // Template for realistic studio photo jars (Makhana, Seeds, Dry Fruits, Spices, Baby Food)
  async function renderPhotoBackground(filename, photoBase64, tableHeight = 90) {
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 420px;
    overflow: hidden;
    background: #FDFBF7;
    position: relative;
  }
  .bg-kitchen {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 75% 30%, #FFFDF8 0%, #F8F3EB 50%, #ECE1D2 100%);
    z-index: 1;
  }
  .wooden-table {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${tableHeight}px;
    background: linear-gradient(180deg, #D4B694 0%, #C3A078 40%, #AD875F 100%);
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.4);
    z-index: 2;
  }
  .photo-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 730px;
    height: 420px;
    overflow: hidden;
    z-index: 5;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 10%, black 22%, black 100%);
    mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 10%, black 22%, black 100%);
  }
  .photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center bottom;
    display: block;
  }
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
</style>
</head>
<body>
  <div class="bg-kitchen"></div>
  <div class="wooden-table"></div>
  <div class="photo-wrapper">
    <img src="${photoBase64}" class="photo-img"/>
  </div>
  <svg class="leaf-decor" viewBox="0 0 120 120" fill="none">
    <path d="M0 120 C 20 80, 40 50, 75 35 C 50 55, 30 85, 0 120 Z" fill="#183B23"/>
    <path d="M10 120 C 35 75, 65 60, 95 55 C 70 70, 45 95, 10 120 Z" fill="#2E5A36"/>
    <path d="M0 110 C 20 95, 45 90, 60 85 C 45 95, 25 105, 0 110 Z" fill="#1A4026"/>
    <path d="M25 120 C 45 85, 75 75, 110 70 C 85 85, 60 105, 25 120 Z" fill="#3D7347"/>
  </svg>
</body>
</html>
    `;
    await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
    await page.screenshot({ path: path.join(BANNERS_DIR, filename) });
    console.log('✅ Generated photo bg:', filename);
  }

  // 1. Makhana
  console.log('Generating clean_bg_makhana.png...');
  const mockupBase64 = 'data:image/png;base64,' + fs.readFileSync(MOCKUP_IMG).toString('base64');
  await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 420px;
    overflow: hidden;
    background: #FDFBF7;
    position: relative;
  }
  .bg-kitchen {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 75% 30%, #FFFDF8 0%, #F8F3EB 50%, #ECE1D2 100%);
    z-index: 1;
  }
  .wooden-table {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(180deg, #D4B694 0%, #C3A078 40%, #AD875F 100%);
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.4);
    z-index: 2;
  }
  .crop-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 740px;
    height: 420px;
    overflow: hidden;
    z-index: 5;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 8%, black 22%, black 100%);
    mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 8%, black 22%, black 100%);
  }
  .crop-img {
    position: absolute;
    width: 1361px;
    height: auto;
    top: -188px;
    right: -14px;
    display: block;
  }
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
</style>
</head>
<body>
  <div class="bg-kitchen"></div>
  <div class="wooden-table"></div>
  <div class="crop-wrapper">
    <img src="${mockupBase64}" class="crop-img"/>
  </div>
  <svg class="leaf-decor" viewBox="0 0 120 120" fill="none">
    <path d="M0 120 C 20 80, 40 50, 75 35 C 50 55, 30 85, 0 120 Z" fill="#183B23"/>
    <path d="M10 120 C 35 75, 65 60, 95 55 C 70 70, 45 95, 10 120 Z" fill="#2E5A36"/>
    <path d="M0 110 C 20 95, 45 90, 60 85 C 45 95, 25 105, 0 110 Z" fill="#1A4026"/>
    <path d="M25 120 C 45 85, 75 75, 110 70 C 85 85, 60 105, 25 120 Z" fill="#3D7347"/>
  </svg>
</body>
</html>
  `, { waitUntil: 'load', timeout: 10000 });
  await page.screenshot({ path: path.join(BANNERS_DIR, 'clean_bg_makhana.png') });
  console.log('✅ Generated clean_bg_makhana.png');

  // 2. Seeds
  await renderPhotoBackground('clean_bg_seeds.png', getBannerBase64('seed_jars.jpg'), 110);

  // 3. Dry Fruits
  await renderPhotoBackground('clean_bg_dryfruits.png', getBannerBase64('dryfruits_jars.jpg'), 90);

  // 4. Spices
  await renderPhotoBackground('clean_bg_spices.png', getBannerBase64('spices_jars.jpg'), 90);

  // 5. Baby Food & Poshan
  await renderPhotoBackground('clean_bg_baby.png', getBannerBase64('baby_jars.jpg'), 80);

  // 6 & 7: Template for Cards (Pregnancy & Personal Care)
  async function renderCardBackground(filename, items) {
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 420px;
    overflow: hidden;
    background: #FDFBF7;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
  }
  .bg-kitchen {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 75% 30%, #FFFDF8 0%, #F7EFE4 45%, #EBE0D2 100%);
    z-index: 1;
  }
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
  .right-content {
    position: absolute;
    top: 0;
    right: 40px;
    width: 610px;
    height: 420px;
    z-index: 5;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 22px;
    gap: 18px;
  }
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
  <svg class="leaf-decor" viewBox="0 0 120 120" fill="none">
    <path d="M0 120 C 20 80, 40 50, 75 35 C 50 55, 30 85, 0 120 Z" fill="#183B23"/>
    <path d="M10 120 C 35 75, 65 60, 95 55 C 70 70, 45 95, 10 120 Z" fill="#2E5A36"/>
    <path d="M0 110 C 20 95, 45 90, 60 85 C 45 95, 25 105, 0 110 Z" fill="#1A4026"/>
    <path d="M25 120 C 45 85, 75 75, 110 70 C 85 85, 60 105, 25 120 Z" fill="#3D7347"/>
  </svg>
  <div class="right-content">
    ${items.map(it => `
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
    `).join('')}
  </div>
</body>
</html>
    `;
    await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
    try { await page.evaluateHandle('document.fonts.ready'); } catch(e) {}
    await page.screenshot({ path: path.join(BANNERS_DIR, filename) });
    console.log('✅ Generated card bg:', filename);
  }

  // 6. Pregnancy Care
  await renderCardBackground('clean_bg_pregnancy.png', [
    { title: 'Kashmiri Badam', subtitle: 'High Natural Vitamin E (250g)', badge: 'Natural Vitamin E', imageBase64: getAssetBase64('crop_badam.png') },
    { title: 'Garbh Poshan Mix', subtitle: 'Gondh, Kesar & Nuts (400g)', badge: 'Trimester Care', imageBase64: getAssetBase64('pregnancy_mom.png'), isCenter: true },
    { title: 'Shahi Panch Mewa', subtitle: 'Rich in Minerals (500g)', badge: 'Natural Iron', imageBase64: getAssetBase64('crop_mewa.png') },
  ]);

  // 7. Personal Care
  await renderCardBackground('clean_bg_care.png', [
    { title: 'Premium Multani', subtitle: 'Triple-Sifted 300 Mesh', badge: '1. Export Quality', imageBase64: getAssetBase64('bowl_multani.png') },
    { title: 'Pink Multani Mitti', subtitle: 'Infused with Wild Rose Petals', badge: '2. Pink Multani', imageBase64: getAssetBase64('bowl_pink.png'), isCenter: true },
    { title: 'Dead Sea Mud', subtitle: '21 Natural Active Minerals', badge: '3. Dead Sea Mud', imageBase64: getAssetBase64('bowl_deadsea.png') },
  ]);

  await browser.close();
  console.log('🎉 All 7 clean studio background plates rendered successfully!');
}

generateAll().catch(console.error);
