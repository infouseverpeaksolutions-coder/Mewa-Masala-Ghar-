import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const MOCKUP_IMG = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\.user_uploaded\\media_1789989156078.png';
const OUT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

async function testPerfectCrop() {
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
    background: #F8F4EE;
    position: relative;
  }

  /* Table background matching mockup wood tone exactly */
  .table-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 85px;
    background: linear-gradient(180deg, #D5B695 0%, #C4A17B 50%, #B08B65 100%);
    z-index: 1;
  }
  .table-bg::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255,255,255,0.4);
  }

  /* Kitchen soft blur ambient background matching mockup */
  .kitchen-bg {
    position: absolute;
    inset: 0;
    bottom: 85px;
    background: radial-gradient(ellipse at 80% 40%, #FFFDF8 0%, #F8F3EA 50%, #EFE7DA 100%);
    z-index: 0;
  }

  /* Makhana jars container */
  .crop-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 700px;
    height: 420px;
    overflow: hidden;
    z-index: 5;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.8) 12%, black 25%, black 100%);
    mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.8) 12%, black 25%, black 100%);
  }

  .crop-img {
    position: absolute;
    /* In 1024x461 original: banner is at top: 142px, height: 316px, right: 11px */
    /* Scaling to 420px height: 420 / 316 = 1.329 */
    /* width: 1024 * 1.329 = 1361px */
    /* top: -142 * 1.329 = -188.7px */
    /* right: -11 * 1.329 = -14.6px */
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
    width: 110px;
    height: 110px;
    pointer-events: none;
    opacity: 0.8;
  }
</style>
</head>
<body>
  <div class="kitchen-bg"></div>
  <div class="table-bg"></div>

  <div class="crop-wrapper">
    <img src="${mockupBase64}" class="crop-img" />
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
  const outPath = path.join(OUT_DIR, 'test_makhana_clean_perfect.png');
  await page.screenshot({ path: outPath });
  console.log('Saved test_makhana_clean_perfect.png');
  await browser.close();
}

testPerfectCrop().catch(console.error);
