import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const MOCKUP_IMG = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\.user_uploaded\\media_1789989156078.png';
const OUT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

async function testComposite() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });

  const mockupBase64 = 'data:image/png;base64,' + fs.readFileSync(MOCKUP_IMG).toString('base64');

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

  /* Makhana jars container from mockup */
  .makhana-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 680px;
    height: 420px;
    overflow: hidden;
    z-index: 5;
    /* Soft gradient mask on left edge so it blends into the clean background */
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 15%, black 100%);
  }

  /* The mockup image cropped to show right side */
  .makhana-img {
    position: absolute;
    top: -140px;
    right: 0;
    width: 1250px;
    height: auto;
  }
</style>
</head>
<body>
  <div class="bg-kitchen"></div>
  <div class="wooden-table"></div>

  <div class="makhana-container">
    <img src="${mockupBase64}" class="makhana-img" />
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
  const outPath = path.join(OUT_DIR, 'test_makhana_clean_bg.png');
  await page.screenshot({ path: outPath });
  console.log('Saved test_makhana_clean_bg.png to', outPath);
  await browser.close();
}

testComposite().catch(console.error);
