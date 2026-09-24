import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runJourneyAndScreenshots() {
  console.log('🚀 Starting Phase 3 Browser Journey & Visual Verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Home Page Desktop (1440px)
  console.log('📸 1. Capturing Home Page (Desktop 1440px)...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_homepage_1440.png'),
    fullPage: false,
  });

  // 2. Home Page Mobile (390px)
  console.log('📸 2. Capturing Home Page (Mobile 390px)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_homepage_390.png'),
    fullPage: false,
  });

  // Reset to Desktop
  await page.setViewport({ width: 1440, height: 900 });

  // 3. Foods Store Page
  console.log('📸 3. Capturing Foods Store Page...');
  await page.goto('http://localhost:5173/foods', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_foods_store.png'),
    fullPage: false,
  });

  // 4. Baby Nutrition Store Page
  console.log('📸 4. Capturing Baby Nutrition Store Page...');
  await page.goto('http://localhost:5173/baby-nutrition', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_baby_store.png'),
    fullPage: false,
  });

  // 5. Personal Care Store Page
  console.log('📸 5. Capturing Personal Care Store Page...');
  await page.goto('http://localhost:5173/personal-care', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_care_store.png'),
    fullPage: false,
  });

  // 6. Shop Listing Page with Filters
  console.log('📸 6. Capturing Shop Listing Page with Filters...');
  await page.goto('http://localhost:5173/shop?store=foods&category=spices-masalas', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_shop_page.png'),
    fullPage: false,
  });

  // 7. Product Detail Page
  console.log('📸 7. Capturing Product Detail Page...');
  await page.goto('http://localhost:5173/product/royal-shahi-garam-masala-stone-ground', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_product_detail.png'),
    fullPage: false,
  });

  // 8. Add Item & Open Mini-Cart Drawer
  console.log('🛒 8. Adding product to cart & capturing Mini-Cart Drawer...');
  try {
    const addBtn = await page.$('button:has-text("Add to Cart"), button:has-text("Add To Cart")');
    if (addBtn) {
      await addBtn.click();
      await new Promise((r) => setTimeout(r, 1500));
    }
  } catch (e) {
    // Mini cart
  }
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_cart_drawer.png'),
    fullPage: false,
  });

  // 9. Cart Page with Coupon
  console.log('📸 9. Capturing Cart Page...');
  await page.goto('http://localhost:5173/cart', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_cart_page.png'),
    fullPage: false,
  });

  // 10. Login Page
  console.log('📸 10. Capturing Login Page (Two-Column)...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_login_page.png'),
    fullPage: false,
  });

  // 11. Sign Up Page
  console.log('📸 11. Capturing Sign Up Page (Two-Column)...');
  await page.goto('http://localhost:5173/signup', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_signup_page.png'),
    fullPage: false,
  });

  // 12. Forgot Password Page
  console.log('📸 12. Capturing Forgot Password Page...');
  await page.goto('http://localhost:5173/forgot-password', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_forgot_password.png'),
    fullPage: false,
  });

  // 13. Customer Account Page (Logged in)
  console.log('📸 13. Logging in and capturing Customer Account Page...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2', timeout: 30000 });
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aarav@example.com', password: 'Customer@12345' }),
  }).then((r) => r.json());
  
  if (loginRes.data?.accessToken) {
    await page.evaluate((token, user) => {
      localStorage.setItem('mmg_access_token', token);
    }, loginRes.data.accessToken, loginRes.data.user);
  }

  await page.goto('http://localhost:5173/account', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_customer_account.png'),
    fullPage: false,
  });

  // 14. About Us Page
  console.log('📸 14. Capturing About Us Page...');
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_about_us.png'),
    fullPage: false,
  });

  // 15. Contact Us Page
  console.log('📸 15. Capturing Contact Us Page...');
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_contact_us.png'),
    fullPage: false,
  });

  // 16. FAQ Page
  console.log('📸 16. Capturing FAQ Page...');
  await page.goto('http://localhost:5173/faq', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_faq_page.png'),
    fullPage: false,
  });

  // 17. 404 Not Found Page
  console.log('📸 17. Capturing 404 Not Found Page...');
  await page.goto('http://localhost:5173/non-existent-sample-page', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_404_page.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('🎉 All Phase 3 visual screenshots captured successfully!');
}

runJourneyAndScreenshots().catch((e) => {
  console.error('Screenshot capture error:', e);
  process.exit(1);
});
