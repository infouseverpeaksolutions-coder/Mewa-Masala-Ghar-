import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BANNERS_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners';
const ASSETS_DIR = path.join(BANNERS_DIR, 'assets');

function getBase64(filename, isAssets = true) {
  const fullPath = isAssets ? path.join(ASSETS_DIR, filename) : path.join(BANNERS_DIR, filename);
  const buf = fs.readFileSync(fullPath);
  const ext = filename.endsWith('.png') ? 'png' : 'jpeg';
  return `data:image/${ext};base64,` + buf.toString('base64');
}

async function renderPregnancyBanner() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });

  // Let's crop the Badam jar from dryfruits_jars.jpg for card 1 and mixed dry fruits for card 3
  const dfBase64 = getBase64('dryfruits_jars.jpg', false);
  const momBase64 = getBase64('pregnancy_mom.png', true);

  const html = `
<!DOCTYPE html>
<html>
<body>
<img id="srcImg" src="${dfBase64}" />
<script>
  function crop(x, y, w, h) {
    const img = document.getElementById('srcImg');
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    return canvas.toDataURL('image/png');
  }
</script>
</body>
</html>
  `;

  await page.setContent(html);
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const img = document.getElementById('srcImg');
      if (img.complete) resolve();
      else img.onload = resolve;
    });
  });

  // natural dimensions of dryfruits_jars.jpg are ~1792 x 1008
  const { badamJar, anjeerJar } = await page.evaluate(() => {
    const img = document.getElementById('srcImg');
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    // Left jar is at roughly 18% to 38% width
    // Right jar is at roughly 62% to 82% width
    return {
      badamJar: crop(nw * 0.18, nh * 0.25, nw * 0.22, nh * 0.65),
      anjeerJar: crop(nw * 0.40, nh * 0.25, nw * 0.22, nh * 0.65),
    };
  });

  fs.writeFileSync(path.join(ASSETS_DIR, 'crop_badam.png'), Buffer.from(badamJar.replace(/^data:image\/png;base64,/, ''), 'base64'));
  fs.writeFileSync(path.join(ASSETS_DIR, 'crop_mewa.png'), Buffer.from(anjeerJar.replace(/^data:image\/png;base64,/, ''), 'base64'));

  // Now render the full banner
  const bannerHtml = `
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
    right: 35px;
    width: 610px;
    height: 420px;
    z-index: 5;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 25px;
    gap: 18px;
  }

  .jar-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 185px;
  }

  .jar-item.center-item {
    transform: translateY(-8px) scale(1.04);
    z-index: 6;
  }

  .jar-card {
    width: 180px;
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
    background: #FAF7F2;
  }

  .jar-info {
    padding: 9px 10px 11px;
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
    padding: 3px 11px;
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
    font-size: 13.5px;
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
    <h1 class="headline">Nourishing &amp; Safe.<br/>Maternal Nutrition.</h1>
    <p class="subtitle">Iron, Calcium &amp; Folate-rich dry fruit blends and pregnancy diet essentials for healthy moms &amp; babies.</p>
    <div class="cta-btn">
      Shop Pregnancy Diet <span>&rarr;</span>
    </div>
  </div>

  <svg class="leaf-decor" viewBox="0 0 120 120" fill="none">
    <path d="M0 120 C 20 80, 40 50, 75 35 C 50 55, 30 85, 0 120 Z" fill="#183B23"/>
    <path d="M10 120 C 35 75, 65 60, 95 55 C 70 70, 45 95, 10 120 Z" fill="#2E5A36"/>
    <path d="M0 110 C 20 95, 45 90, 60 85 C 45 95, 25 105, 0 110 Z" fill="#1A4026"/>
    <path d="M25 120 C 45 85, 75 75, 110 70 C 85 85, 60 105, 25 120 Z" fill="#3D7347"/>
  </svg>

  <div class="right-content">
    <!-- Card 1: Kashmiri Badam Jar -->
    <div class="jar-item">
      <span class="jar-badge">Natural Vitamin E</span>
      <div class="jar-card">
        <img src="${badamJar}" class="jar-img"/>
        <div class="jar-info">
          <p class="jar-title">Kashmiri Badam</p>
          <p class="jar-sub">High Vitamin E (250g)</p>
        </div>
      </div>
    </div>

    <!-- Card 2: Garbh Poshan Maternal Care (Center) -->
    <div class="jar-item center-item">
      <span class="jar-badge">Trimester Care</span>
      <div class="jar-card">
        <img src="${momBase64}" class="jar-img"/>
        <div class="jar-info">
          <p class="jar-title">Garbh Poshan Mix</p>
          <p class="jar-sub">Gondh, Kesar &amp; Nuts (400g)</p>
        </div>
      </div>
    </div>

    <!-- Card 3: Shahi Panch Mewa Jar -->
    <div class="jar-item">
      <span class="jar-badge">Natural Iron</span>
      <div class="jar-card">
        <img src="${anjeerJar}" class="jar-img"/>
        <div class="jar-info">
          <p class="jar-title">Shahi Panch Mewa</p>
          <p class="jar-sub">Rich in Minerals (500g)</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(bannerHtml, { waitUntil: 'load', timeout: 10000 });
  try {
    await page.evaluateHandle('document.fonts.ready');
  } catch (e) {}

  const outPath = path.join(BANNERS_DIR, 'pregnancy_banner_full.png');
  await page.screenshot({ path: outPath });
  console.log('✅ Generated refined pregnancy banner at:', outPath);
  await browser.close();
}

renderPregnancyBanner().catch(console.error);
