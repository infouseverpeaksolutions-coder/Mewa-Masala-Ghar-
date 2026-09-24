import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

async function captureLive() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Desktop 1440x900
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Find the first button
  const button = await page.$('a[aria-label="Shop Now - Gourmet Roasted Makhana"]');
  if (button) {
    const box = await button.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({
        path: path.join(OUT_DIR, 'live_homepage_desktop_slide1_hover.png'),
        fullPage: false
      });
      console.log('Saved live_homepage_desktop_slide1_hover.png');
    }
  }

  // 2. Mobile 390x844
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  await mobilePage.screenshot({
    path: path.join(OUT_DIR, 'live_homepage_mobile_slide1.png'),
    fullPage: false
  });
  console.log('Saved live_homepage_mobile_slide1.png');

  // Let's also capture slide 2 (Wholesome Super Seeds)
  // Click next arrow on desktop
  await page.mouse.move(0, 0); // Move away
  const nextBtn = await page.$('button[aria-label="Next banner slide"]');
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 800)); // wait for transition
    await page.screenshot({
      path: path.join(OUT_DIR, 'live_homepage_desktop_slide2.png'),
      fullPage: false
    });
    console.log('Saved live_homepage_desktop_slide2.png');
  }

  await browser.close();
}

captureLive().catch(console.error);
