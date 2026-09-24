import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const MOCKUP = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\.user_uploaded\\media_1789989156078.png';
const OUT = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\makhana_banner_full.png';

async function generateMakhana1200() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });

  const b64 = 'data:image/png;base64,' + fs.readFileSync(MOCKUP).toString('base64');

  // In media_1789989156078.png (1024 x 461):
  // The banner starts below the 3 tabs:
  // Top of banner is at y = 143px
  // Height of banner is 316px
  // Left: 11px, Right: 1013px (width: 1002px)
  // Ratio: 1002 / 316 = 3.17
  // In a 1200x420 canvas:
  const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 420px;
    overflow: hidden;
    position: relative;
    background: #FAF6EC;
  }
  .banner-crop {
    position: absolute;
    width: 1330px;
    height: auto;
    top: -190px;
    left: -15px;
    display: block;
  }
</style>
</head>
<body>
  <img src="${b64}" class="banner-crop" />
</body>
</html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: OUT });
  console.log('Saved 1200x420 makhana_banner_full.png');
  await browser.close();
}

generateMakhana1200().catch(console.error);
