import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function captureHero() {
  console.log('🚀 Starting Hero Banner & Navigation Visual Verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Wide Screen 1920x1080 - Direct comparison with user's uploaded screenshot
  console.log('📸 1. Wide Screen 1920x1080 viewport fit...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));

  const heroWidePath = path.join(ARTIFACT_DIR, 'hero_fitted_wide_1920.png');
  await page.screenshot({ path: heroWidePath });
  console.log('Saved:', heroWidePath);

  // 2. Desktop 1440x900 - Verify it fits comfortably on standard desktop
  console.log('📸 2. Desktop 1440x900 viewport fit...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  const heroDesktopPath = path.join(ARTIFACT_DIR, 'hero_fitted_desktop_1440.png');
  await page.screenshot({ path: heroDesktopPath });
  console.log('Saved:', heroDesktopPath);

  // 3. Standard Laptop 1366x768 - Verify fit on standard smaller laptop screen
  console.log('📸 3. Standard laptop 1366x768 viewport fit...');
  await page.setViewport({ width: 1366, height: 768 });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  const heroLaptopPath = path.join(ARTIFACT_DIR, 'hero_fitted_laptop_1366.png');
  await page.screenshot({ path: heroLaptopPath });
  console.log('Saved:', heroLaptopPath);

  // 3. Hover over "Mewa & Healthy Foods" store tab to verify dropdown opens on hover
  console.log('📸 3. Hovering over Mewa & Healthy Foods tab to reveal mega-menu...');
  await page.setViewport({ width: 1440, height: 900 });
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Mewa & Healthy Foods')) {
      await btn.hover();
      break;
    }
  }
  await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
  const hoverPath = path.join(ARTIFACT_DIR, 'hero_tab_hover_foods.png');
  await page.screenshot({ path: hoverPath });
  console.log('Saved:', hoverPath);

  // Move mouse away to close dropdown
  await page.mouse.move(10, 10);
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));

  // 4. Slide 3: Makhana & Roasted Snacks (index 2)
  console.log('📸 4. Navigating to Slide 3: Makhana...');
  const dots = await page.$$('div[role="tablist"] button');
  if (dots.length >= 3) {
    await dots[2].click();
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    const makhanaPath = path.join(ARTIFACT_DIR, 'hero_slide3_makhana.png');
    await page.screenshot({ path: makhanaPath });
    console.log('Saved:', makhanaPath);
  }

  // 5. Slide 5: Baby Food & Adult Poshan (index 4)
  console.log('📸 5. Navigating to Slide 5: Baby Food & Poshan...');
  if (dots.length >= 5) {
    await dots[4].click();
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    const babyPath = path.join(ARTIFACT_DIR, 'hero_slide5_baby.png');
    await page.screenshot({ path: babyPath });
    console.log('Saved:', babyPath);
  }

  // 6. Slide 7: Personal Care & Natural Clays (index 6)
  console.log('📸 6. Navigating to Slide 7: Personal Care & Clays...');
  if (dots.length >= 7) {
    await dots[6].click();
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
    const carePath = path.join(ARTIFACT_DIR, 'hero_slide7_care.png');
    await page.screenshot({ path: carePath });
    console.log('Saved:', carePath);
  }

  // 7. Mobile View 390x844
  console.log('📸 7. Capturing Mobile 390x844...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));
  const mobilePath = path.join(ARTIFACT_DIR, 'hero_fitted_mobile_390.png');
  await page.screenshot({ path: mobilePath });
  console.log('Saved:', mobilePath);

  await browser.close();
  console.log('✅ All screenshots captured successfully!');
}

captureHero().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
