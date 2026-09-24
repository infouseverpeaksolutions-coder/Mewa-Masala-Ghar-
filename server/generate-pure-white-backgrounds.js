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

  // 1. SLIDE 1: MAKHANA (From reference photo, right side only, left 100% white)
  console.log('Generating pure white clean_bg_makhana.png...');
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
    background: #FFFFFF;
    position: relative;
  }
  .crop-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 720px;
    height: 420px;
    overflow: hidden;
    z-index: 5;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 10%, rgba(0,0,0,0.7) 22%, black 35%, black 100%);
    mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 10%, rgba(0,0,0,0.7) 22%, black 35%, black 100%);
  }
  .crop-img {
    position: absolute;
    width: 1361px;
    height: auto;
    top: -188px;
    right: -14px;
    display: block;
  }
</style>
</head>
<body>
  <div class="crop-wrapper">
    <img src="${mockupBase64}" class="crop-img" />
  </div>
</body>
</html>
  `, { waitUntil: 'load', timeout: 10000 });
  await page.screenshot({ path: path.join(BANNERS_DIR, 'clean_bg_makhana.png') });
  console.log('✅ Generated pure white clean_bg_makhana.png');

  // Helper for photo backgrounds (Seeds, Dryfruits, Spices, Baby food)
  async function renderPhotoPureWhite(filename, photoBase64) {
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
    background: #FFFFFF;
    position: relative;
  }
  .photo-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 720px;
    height: 420px;
    overflow: hidden;
    z-index: 5;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 10%, rgba(0,0,0,0.7) 22%, black 35%, black 100%);
    mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 10%, rgba(0,0,0,0.7) 22%, black 35%, black 100%);
  }
  .photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center bottom;
    display: block;
  }
</style>
</head>
<body>
  <div class="photo-wrapper">
    <img src="${photoBase64}" class="photo-img"/>
  </div>
</body>
</html>
    `;
    await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
    await page.screenshot({ path: path.join(BANNERS_DIR, filename) });
    console.log('✅ Generated pure white:', filename);
  }

  // 2. Seeds
  await renderPhotoPureWhite('clean_bg_seeds.png', getBannerBase64('seed_jars.jpg'));

  // 3. Dry Fruits
  await renderPhotoPureWhite('clean_bg_dryfruits.png', getBannerBase64('dryfruits_jars.jpg'));

  // 4. Spices
  await renderPhotoPureWhite('clean_bg_spices.png', getBannerBase64('spices_jars.jpg'));

  // 5. Baby Food & Poshan
  await renderPhotoPureWhite('clean_bg_baby.png', getBannerBase64('baby_jars.jpg'));

  // Helper for Card Backgrounds (Pregnancy & Care)
  async function renderCardsPureWhite(filename, items) {
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
    background: #FFFFFF;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
  }
  .right-content {
    position: absolute;
    top: 0;
    right: 40px;
    width: 610px;
    height: 420px;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
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
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 16px 30px -8px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
  }
  .jar-item.center-item .jar-card {
    border-color: #F5D88C;
    box-shadow: 0 20px 35px -8px rgba(0,0,0,0.2), 0 0 15px rgba(217,164,65,0.2);
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
    console.log('✅ Generated pure white card bg:', filename);
  }

  // 6. Pregnancy Care
  await renderCardsPureWhite('clean_bg_pregnancy.png', [
    { title: 'Kashmiri Badam', subtitle: 'High Natural Vitamin E (250g)', badge: 'Natural Vitamin E', imageBase64: getAssetBase64('crop_badam.png') },
    { title: 'Garbh Poshan Mix', subtitle: 'Gondh, Kesar & Nuts (400g)', badge: 'Trimester Care', imageBase64: getAssetBase64('pregnancy_mom.png'), isCenter: true },
    { title: 'Shahi Panch Mewa', subtitle: 'Rich in Minerals (500g)', badge: 'Natural Iron', imageBase64: getAssetBase64('crop_mewa.png') },
  ]);

  // 7. Personal Care
  await renderCardsPureWhite('clean_bg_care.png', [
    { title: 'Premium Multani', subtitle: 'Triple-Sifted 300 Mesh', badge: '1. Export Quality', imageBase64: getAssetBase64('bowl_multani.png') },
    { title: 'Pink Multani Mitti', subtitle: 'Infused with Wild Rose Petals', badge: '2. Pink Multani', imageBase64: getAssetBase64('bowl_pink.png'), isCenter: true },
    { title: 'Dead Sea Mud', subtitle: '21 Natural Active Minerals', badge: '3. Dead Sea Mud', imageBase64: getAssetBase64('bowl_deadsea.png') },
  ]);

  await browser.close();
  console.log('🎉 All 7 pure-white background plates generated successfully!');
}

generateAll().catch(console.error);
