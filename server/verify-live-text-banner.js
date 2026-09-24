import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 20000 });
  await page.waitForSelector('h1');

  // 1. Desktop Slide 1 (Normal)
  console.log('Capturing Slide 1 Normal...');
  await page.screenshot({ path: path.join(OUT_DIR, 'live_banner_slide1_normal.png') });

  // 2. Button Hover State (Demonstrating hover animation & color change)
  console.log('Hovering over CTA button...');
  const ctaBtn = await page.$('a[aria-label^="Shop Now"]');
  if (ctaBtn) {
    await ctaBtn.hover();
    await new Promise(r => setTimeout(r, 400)); // wait for transition
    await page.screenshot({ path: path.join(OUT_DIR, 'live_banner_slide1_hover.png') });
    console.log('Captured button hover state!');
  }

  // 3. Click Next to go to Slide 2 (Seeds)
  console.log('Navigating to Slide 2...');
  const nextBtn = await page.$('button[aria-label="Next banner slide"]');
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 800)); // wait for slide transition
    await page.screenshot({ path: path.join(OUT_DIR, 'live_banner_slide2_seeds.png') });

    // Hover over Seeds button
    const seedsBtn = await page.$('a[aria-label^="Shop Seeds"]');
    if (seedsBtn) {
      await seedsBtn.hover();
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(OUT_DIR, 'live_banner_slide2_hover.png') });
    }
  }

  // 4. Click Next to go to Slide 3 (Dry Fruits)
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUT_DIR, 'live_banner_slide3_dryfruits.png') });
  }

  // 5. Mobile viewport (390x844)
  console.log('Testing Mobile Viewport...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, 'live_banner_mobile_390.png') });

  await browser.close();
  console.log('🎉 Verification screenshots captured successfully!');
}

verify().catch(console.error);
