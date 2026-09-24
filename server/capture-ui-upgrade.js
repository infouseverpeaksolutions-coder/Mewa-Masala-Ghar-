import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log('🚀 Starting UI Upgrade Visual Verification Captures...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();

  // 1. Desktop (1440px) - Full Homepage
  console.log('📸 1. Capturing Desktop Full Homepage (1440px)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  // Scroll through page to trigger all image rendering
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'ui_upgrade_homepage_1440.png'),
    fullPage: true,
  });

  // 2. Desktop (1440px) - Header with Mega-Menu Open
  console.log('📸 2. Capturing Header with Mega-Menu Open (1440px)...');
  // Click on "Mewa & Healthy Foods" store tab to toggle mega menu
  try {
    const storeTabs = await page.$$('header button');
    for (const tab of storeTabs) {
      const text = await page.evaluate((el) => el.textContent, tab);
      if (text && text.includes('Mewa & Healthy Foods')) {
        await tab.click();
        break;
      }
    }
  } catch (e) {
    console.warn('Could not click store tab:', e);
  }
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'ui_upgrade_header_megamenu_1440.png'),
    clip: { x: 0, y: 0, width: 1440, height: 480 },
  });

  // 3. Desktop (1440px) - Mini-Cart Drawer Open
  console.log('📸 3. Capturing Mini-Cart Drawer Open (1440px)...');
  // Close mega menu by clicking elsewhere or backdrop, then open cart
  await page.mouse.click(10, 10);
  await new Promise((r) => setTimeout(r, 500));
  try {
    const cartBtn = await page.$('button[aria-label="Shopping Cart"]');
    if (cartBtn) {
      await cartBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
    }
  } catch (e) {
    console.warn('Could not open cart drawer:', e);
  }
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'ui_upgrade_cart_drawer_1440.png'),
    fullPage: false,
  });

  // Close cart drawer
  try {
    const closeBtn = await page.$('button[aria-label="Close Cart"]');
    if (closeBtn) await closeBtn.click();
    else await page.mouse.click(50, 50);
  } catch {}
  await new Promise((r) => setTimeout(r, 500));

  // 4. Desktop (1440px) - Footer View
  console.log('📸 4. Capturing Footer View (1440px)...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'ui_upgrade_footer_1440.png'),
    fullPage: false,
  });

  // 5. Tablet (768px) - Homepage
  console.log('📸 5. Capturing Tablet Homepage (768px)...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'ui_upgrade_homepage_768.png'),
    fullPage: true,
  });

  // 6. Mobile (390px) - iPhone / Mobile Viewport
  console.log('📸 6. Capturing Mobile Homepage (390px)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'ui_upgrade_homepage_390.png'),
    fullPage: true,
  });

  await browser.close();
  console.log('✨ All UI Upgrade responsive screenshots captured successfully!');
}

capture().catch(console.error);
