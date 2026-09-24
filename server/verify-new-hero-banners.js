import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

async function verifyHero() {
  console.log('🚀 Starting New Hero Banner Visual Verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Standard Desktop 1440x900 - Slide 1 (Makhana / Pure. Natural. Wholesome.)
  console.log('📸 1. Desktop 1440x900 - Slide 1 (Makhana)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));

  const heroDesktopPath = path.join(ARTIFACT_DIR, 'new_hero_desktop_1440_slide1.png');
  await page.screenshot({ path: heroDesktopPath });
  console.log('Saved:', heroDesktopPath);

  // 2. Wide Screen 1920x1080
  console.log('📸 2. Wide Screen 1920x1080...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
  const heroWidePath = path.join(ARTIFACT_DIR, 'new_hero_wide_1920.png');
  await page.screenshot({ path: heroWidePath });
  console.log('Saved:', heroWidePath);

  // 3. Mobile Viewport 390x844
  console.log('📸 3. Mobile Viewport 390x844...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
  const heroMobilePath = path.join(ARTIFACT_DIR, 'new_hero_mobile_390.png');
  await page.screenshot({ path: heroMobilePath });
  console.log('Saved:', heroMobilePath);

  // 4. Capture other slides on Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));

  // Click next button to capture Slide 2 (Seeds)
  console.log('📸 4. Slide 2 (Seeds)...');
  await page.click('button[aria-label="Next banner"]');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_hero_slide2_seeds.png') });

  // Click next button to capture Slide 3 (Dry Fruits)
  console.log('📸 5. Slide 3 (Dry Fruits)...');
  await page.click('button[aria-label="Next banner"]');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_hero_slide3_dryfruits.png') });

  // Click next button to capture Slide 4 (Spices)
  console.log('📸 6. Slide 4 (Spices)...');
  await page.click('button[aria-label="Next banner"]');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_hero_slide4_spices.png') });

  // Click next button to capture Slide 5 (Baby Poshan)
  console.log('📸 7. Slide 5 (Baby Poshan)...');
  await page.click('button[aria-label="Next banner"]');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_hero_slide5_baby.png') });

  // Click next button to capture Slide 6 (Pregnancy)
  console.log('📸 8. Slide 6 (Pregnancy)...');
  await page.click('button[aria-label="Next banner"]');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_hero_slide6_pregnancy.png') });

  // Click next button to capture Slide 7 (Personal Care)
  console.log('📸 9. Slide 7 (Personal Care)...');
  await page.click('button[aria-label="Next banner"]');
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1000)));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'new_hero_slide7_care.png') });

  console.log('🎉 All verification screenshots captured successfully!');
  await browser.close();
}

verifyHero().catch(console.error);
