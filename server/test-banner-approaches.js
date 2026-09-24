import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BANNER_MAK = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\makhana_banner_full.png';
const OUT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

async function testExactButtonOverlay() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600, deviceScaleFactor: 2 });

  const makBase64 = 'data:image/png;base64,' + fs.readFileSync(BANNER_MAK).toString('base64');

  const html = `
<!DOCTYPE html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #faf6ec; padding: 40px; display: flex; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; }
  .banner-container {
    position: relative;
    width: 1004px;
    height: 320px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }
  .bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  /* Exact position covering the baked-in button perfectly */
  .overlay-btn {
    position: absolute;
    left: 4.45%;
    top: 66.2%;
    width: 15.0%;
    height: 12.6%;
    min-width: 148px;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #C88E2D;
    color: white;
    font-size: 14.5px;
    font-weight: 600;
    border-radius: 9999px;
    box-shadow: 0 4px 14px rgba(200, 142, 45, 0.4);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }
  
  /* Shimmer sweep effect */
  .shimmer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.7s ease-in-out;
    pointer-events: none;
  }
  
  .overlay-btn:hover .shimmer {
    transform: translateX(100%);
  }

  .arrow-icon {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  .overlay-btn:hover .arrow-icon {
    transform: translateX(4px);
  }

  /* Hover state: lux forest green transition and lift */
  .overlay-btn:hover {
    background: #183B23;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px rgba(24, 59, 35, 0.45);
  }
</style>
</head>
<body>
  <div class="banner-container">
    <img src="${makBase64}" class="bg-img" />
    <a href="#" class="overlay-btn" id="btn">
      <span class="shimmer"></span>
      <span>Shop Now</span>
      <span class="arrow-icon">&rarr;</span>
    </a>
  </div>
</body>
</html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: path.join(OUT_DIR, 'test_exact_overlay_normal.png') });
  
  // Hover state
  await page.hover('#btn');
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.join(OUT_DIR, 'test_exact_overlay_hover.png') });

  console.log('Saved exact overlay screenshots');
  await browser.close();
}

testExactButtonOverlay().catch(console.error);
