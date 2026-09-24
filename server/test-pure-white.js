import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const MOCKUP_IMG = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\.user_uploaded\\media_1789989156078.png';
const OUT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

async function testPureWhite() {
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
    background: #FFFFFF;
    position: relative;
  }

  /* Makhana jars container with soft feather fade into pure white */
  .crop-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 720px;
    height: 420px;
    overflow: hidden;
    z-index: 5;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 10%, rgba(0,0,0,0.7) 22%, black 35%, black 100%);
    mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 10%, rgba(0,0,0,0.7) 22%, black 35%, black 100%);
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
  <!-- Clean pure white background, NO wooden-table div on left, NO leaf-decor -->
  <div class="crop-wrapper">
    <img src="${mockupBase64}" class="crop-img" />
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
  const outPath = path.join(OUT_DIR, 'test_pure_white_makhana.png');
  await page.screenshot({ path: outPath });
  console.log('Saved test_pure_white_makhana.png');
  await browser.close();
}

testPureWhite().catch(console.error);
