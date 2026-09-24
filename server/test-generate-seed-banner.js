import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners';

async function testGenerate() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });

  const seedJarsBuffer = fs.readFileSync(path.join(OUTPUT_DIR, 'seed_jars.jpg'));
  const seedJarsSrc = 'data:image/jpeg;base64,' + seedJarsBuffer.toString('base64');

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
  }
  
  /* Full photo positioned on the right, perfectly showing the 3 jars */
  .bg-photo {
    position: absolute;
    top: 0;
    right: 15px;
    width: 680px;
    height: 420px;
    object-fit: cover;
    object-position: center bottom;
    z-index: 1;
  }

  /* Seamless soft blend from left background into the photo without obscuring the left jar */
  .fade-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #FBF8F2 0%, #FBF8F2 42%, rgba(251, 248, 242, 0.95) 46%, rgba(251, 248, 242, 0) 52%);
    z-index: 2;
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
</style>
</head>
<body>
  <img src="${seedJarsSrc}" class="bg-photo"/>
  <div class="fade-overlay"></div>

  <div class="left-content">
    <h1 class="headline">Pure. Wholesome.<br/>Daily Energy.</h1>
    <p class="subtitle">High Omega-3 Flax seeds, Chia, Raw Pumpkin, Sunflower, Sesame &amp; 7-in-1 Daily Power Mix.</p>
    <div class="cta-btn">
      Shop Seeds <span>&rarr;</span>
    </div>
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

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const outPath = path.join(OUTPUT_DIR, 'seed_banner_full.png');
  await page.screenshot({ path: outPath });
  console.log('✅ Generated seed banner at:', outPath);
  await browser.close();
}

testGenerate().catch(console.error);
