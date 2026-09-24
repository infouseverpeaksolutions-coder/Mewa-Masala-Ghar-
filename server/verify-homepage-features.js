const puppeteer = require('puppeteer-core');
const path = require('path');
const http = require('http');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

async function verify() {
  console.log('🚀 Starting Puppeteer Verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    // 1. Log in to Admin Portal by calling API to get token, then setting in localStorage
    console.log('🔑 Authenticating admin...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@mewamasalaghar.com', password: 'Admin@12345' }),
    });
    const loginData = await loginRes.json();
    console.log('Admin login status:', loginData.success);
    const token = loginData?.data?.accessToken;

    // Open Admin App and set token
    await page.goto('http://localhost:5174/login', { waitUntil: 'domcontentloaded' });
    await page.evaluate((t) => {
      localStorage.setItem('mmg_admin_token', t);
    }, token);

    // Navigate to Homepage Manager
    console.log('🖼️ Navigating to /homepage-manager...');
    await page.goto('http://localhost:5174/homepage-manager', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));

    // Capture Admin Homepage Manager
    const adminPath = path.join(ARTIFACT_DIR, 'admin_homepage_manager.png');
    await page.screenshot({ path: adminPath, fullPage: false });
    console.log(`📸 Admin Manager screenshot captured: ${adminPath}`);

    // Click "Add New Banner Slide" button
    console.log('✨ Opening Add Banner Slide modal...');
    const addBtn = await page.$('button ::-p-text(Add New Banner Slide)');
    if (addBtn) {
      await addBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
      const modalPath = path.join(ARTIFACT_DIR, 'admin_banner_modal_preview.png');
      await page.screenshot({ path: modalPath, fullPage: false });
      console.log(`📸 Admin Banner Modal screenshot captured: ${modalPath}`);
    }

    // 2. Storefront Desktop Verification
    console.log('🛒 Loading Storefront (http://localhost:5173/)...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2500));

    // Capture Header & Dynamic Hero Carousel
    const heroPath = path.join(ARTIFACT_DIR, 'storefront_hero_and_home_button.png');
    await page.screenshot({ path: heroPath, fullPage: false });
    console.log(`📸 Storefront Hero & Home button captured: ${heroPath}`);

    // Scroll to Categories section
    console.log('📦 Scrolling to Categories section...');
    await page.evaluate(() => {
      window.scrollTo(0, 480);
    });
    await new Promise((r) => setTimeout(r, 1200));

    const categoriesPath = path.join(ARTIFACT_DIR, 'storefront_categories_section.png');
    await page.screenshot({ path: categoriesPath, fullPage: false });
    console.log(`📸 Categories Section captured: ${categoriesPath}`);

    // 3. Mobile Viewport Verification (390x844)
    console.log('📱 Testing Mobile Viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));

    const mobilePath = path.join(ARTIFACT_DIR, 'storefront_mobile_view.png');
    await page.screenshot({ path: mobilePath, fullPage: false });
    console.log(`📸 Mobile Viewport captured: ${mobilePath}`);

    // Scroll to mobile categories
    await page.evaluate(() => {
      window.scrollTo(0, 270);
    });
    await new Promise((r) => setTimeout(r, 1000));
    const mobileCategoriesPath = path.join(ARTIFACT_DIR, 'storefront_mobile_categories.png');
    await page.screenshot({ path: mobileCategoriesPath, fullPage: false });
    console.log(`📸 Mobile Categories captured: ${mobileCategoriesPath}`);

    console.log('🎉 Verification completed successfully!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
}

verify();
