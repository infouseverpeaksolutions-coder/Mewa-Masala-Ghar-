import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BANNERS_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners';
const OUT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

const slides = [
  {
    id: 'makhana',
    title: 'Gourmet Roasted Makhana',
    file: 'makhana_banner_full.png',
    link: '/foods',
    ctaText: 'Shop Now',
    btnLeft: '4.71%',
    btnTop: '62.38%',
    btnWidth: '16.33%',
    btnHeight: '12.74%',
  },
  {
    id: 'seeds',
    title: 'Wholesome Super Seeds',
    file: 'seed_banner_full.png',
    link: '/shop?store=foods&category=seeds-mixes',
    ctaText: 'Shop Seeds',
    btnLeft: '5.35%',
    btnTop: '66.8%',
    btnWidth: '14.8%',
    btnHeight: '10.5%',
  },
  {
    id: 'dryfruits',
    title: 'Royal Dry Fruits & Combos',
    file: 'dryfruits_banner_full.png',
    link: '/foods',
    ctaText: 'Shop Royal Mewa',
    btnLeft: '5.35%',
    btnTop: '66.8%',
    btnWidth: '18.2%',
    btnHeight: '10.5%',
  },
  {
    id: 'spices',
    title: 'Stone-Ground Pure Spices',
    file: 'spices_banner_full.png',
    link: '/shop?store=foods&category=spices-seasonings',
    ctaText: 'Shop Pure Spices',
    btnLeft: '5.35%',
    btnTop: '66.8%',
    btnWidth: '18.0%',
    btnHeight: '10.5%',
  },
  {
    id: 'baby',
    title: 'Baby Food & Daily Family Poshan',
    file: 'baby_banner_full.png',
    link: '/baby-nutrition',
    ctaText: 'Shop Baby & Poshan',
    btnLeft: '5.35%',
    btnTop: '66.8%',
    btnWidth: '19.8%',
    btnHeight: '10.5%',
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy Care & Maternal Nutrition',
    file: 'pregnancy_banner_full.png',
    link: '/baby-nutrition',
    ctaText: 'Shop Pregnancy Diet',
    btnLeft: '5.35%',
    btnTop: '66.8%',
    btnWidth: '20.2%',
    btnHeight: '10.5%',
  },
  {
    id: 'care',
    title: 'Natural Clays & Skincare',
    file: 'care_banner_full.png',
    link: '/personal-care',
    ctaText: 'Shop Personal Care',
    btnLeft: '5.35%',
    btnTop: '66.8%',
    btnWidth: '19.2%',
    btnHeight: '10.5%',
  },
];

async function testAll() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 550, deviceScaleFactor: 2 });

  for (const s of slides) {
    const fullPath = path.join(BANNERS_DIR, s.file);
    const b64 = 'data:image/png;base64,' + fs.readFileSync(fullPath).toString('base64');

    const html = `
<!DOCTYPE html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #faf6ec; padding: 30px; display: flex; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; }
  .banner-outer {
    position: relative;
    width: 1200px;
    aspect-ratio: 1200 / 420;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.07);
    border: 1px solid rgba(0,0,0,0.05);
  }
  .bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
  .overlay-btn {
    position: absolute;
    left: ${s.btnLeft};
    top: ${s.btnTop};
    width: ${s.btnWidth};
    height: ${s.btnHeight};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #C88E2D;
    color: white;
    font-size: 15px;
    font-weight: 600;
    border-radius: 9999px;
    box-shadow: 0 4px 14px rgba(200, 142, 45, 0.4);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }
  .overlay-btn:hover {
    background: #183B23;
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 25px rgba(24, 59, 35, 0.45);
  }
  .arrow { display: inline-block; transition: transform 0.3s ease; }
  .overlay-btn:hover .arrow { transform: translateX(4px); }
</style>
</head>
<body>
  <div class="banner-outer">
    <img src="${b64}" class="bg-img" />
    <a href="${s.link}" class="overlay-btn" id="btn">
      <span>${s.ctaText}</span>
      <span class="arrow">&rarr;</span>
    </a>
  </div>
</body>
</html>
    `;

    await page.setContent(html);
    await page.screenshot({ path: path.join(OUT_DIR, `full_banner_${s.id}_normal.png`) });
    
    // Test hover on slide 1
    if (s.id === 'makhana') {
      await page.hover('#btn');
      await new Promise(r => setTimeout(r, 200));
      await page.screenshot({ path: path.join(OUT_DIR, `full_banner_${s.id}_hover.png`) });
    }
    console.log(`✅ Verified banner: ${s.id}`);
  }

  await browser.close();
}

testAll().catch(console.error);
