import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5173';

async function autoScroll(page) {
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
}

async function capture() {
  console.log('🚀 Starting Task 2 UI Upgrade Visual Verification Captures...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();

  const pagesToCapture = [
    {
      name: 'ui_upgrade_foods_1440.png',
      url: `${BASE_URL}/foods`,
      viewport: { width: 1440, height: 900 },
      fullPage: true,
      scroll: true,
    },
    {
      name: 'ui_upgrade_foods_390.png',
      url: `${BASE_URL}/foods`,
      viewport: { width: 390, height: 844 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_baby_nutrition_1440.png',
      url: `${BASE_URL}/baby-nutrition`,
      viewport: { width: 1440, height: 900 },
      fullPage: true,
      scroll: true,
    },
    {
      name: 'ui_upgrade_baby_nutrition_390.png',
      url: `${BASE_URL}/baby-nutrition`,
      viewport: { width: 390, height: 844 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_personal_care_1440.png',
      url: `${BASE_URL}/personal-care`,
      viewport: { width: 1440, height: 900 },
      fullPage: true,
      scroll: true,
    },
    {
      name: 'ui_upgrade_personal_care_390.png',
      url: `${BASE_URL}/personal-care`,
      viewport: { width: 390, height: 844 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_shop_listing_1440.png',
      url: `${BASE_URL}/shop`,
      viewport: { width: 1440, height: 900 },
      fullPage: true,
      scroll: true,
    },
    {
      name: 'ui_upgrade_shop_listing_390.png',
      url: `${BASE_URL}/shop`,
      viewport: { width: 390, height: 844 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_search_page_1440.png',
      url: `${BASE_URL}/search?q=makhana`,
      viewport: { width: 1440, height: 900 },
      fullPage: true,
      scroll: true,
    },
    {
      name: 'ui_upgrade_product_detail_1440.png',
      url: `${BASE_URL}/product/organic-brown-flax-seeds`,
      viewport: { width: 1440, height: 900 },
      fullPage: true,
      scroll: true,
    },
    {
      name: 'ui_upgrade_product_detail_390.png',
      url: `${BASE_URL}/product/organic-brown-flax-seeds`,
      viewport: { width: 390, height: 844 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_cart_page_1440.png',
      url: `${BASE_URL}/cart`,
      viewport: { width: 1440, height: 900 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_checkout_page_1440.png',
      url: `${BASE_URL}/checkout`,
      viewport: { width: 1440, height: 900 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_order_success_1440.png',
      url: `${BASE_URL}/order-success/MMG-2026-689270`,
      viewport: { width: 1440, height: 900 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_login_page_1440.png',
      url: `${BASE_URL}/login`,
      viewport: { width: 1440, height: 900 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_track_order_1440.png',
      url: `${BASE_URL}/track-order`,
      viewport: { width: 1440, height: 900 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_account_page_1440.png',
      url: `${BASE_URL}/account`,
      viewport: { width: 1440, height: 900 },
      fullPage: false,
      scroll: false,
    },
    {
      name: 'ui_upgrade_about_us_1440.png',
      url: `${BASE_URL}/about-us`,
      viewport: { width: 1440, height: 900 },
      fullPage: true,
      scroll: true,
    },
    {
      name: 'ui_upgrade_contact_us_1440.png',
      url: `${BASE_URL}/contact-us`,
      viewport: { width: 1440, height: 900 },
      fullPage: true,
      scroll: true,
    },
    {
      name: 'ui_upgrade_faq_page_1440.png',
      url: `${BASE_URL}/faq`,
      viewport: { width: 1440, height: 900 },
      fullPage: true,
      scroll: true,
    },
    {
      name: 'ui_upgrade_not_found_1440.png',
      url: `${BASE_URL}/this-page-does-not-exist`,
      viewport: { width: 1440, height: 900 },
      fullPage: false,
      scroll: false,
    },
  ];

  for (const item of pagesToCapture) {
    try {
      console.log(`📸 Capturing ${item.name} (${item.url})...`);
      await page.setViewport(item.viewport);
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 });
      if (item.scroll) {
        await autoScroll(page);
      }
      await new Promise((r) => setTimeout(r, 1200));
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, item.name),
        fullPage: item.fullPage,
      });
      console.log(`✅ Saved ${item.name}`);
    } catch (err) {
      console.error(`❌ Failed capturing ${item.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('🎉 Finished Task 2 captures!');
}

capture().catch((e) => {
  console.error('Fatal error during capture:', e);
  process.exit(1);
});
