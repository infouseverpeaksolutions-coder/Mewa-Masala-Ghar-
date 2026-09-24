import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runBrowserFlow() {
  console.log('Launching browser to test interactive customer journey...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Visit Product Detail
  console.log('1. Navigating to product page...');
  await page.goto('http://localhost:5173/product/royal-california-badam-almonds', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  // 2. Test PIN code delivery checker
  console.log('2. Testing PIN code delivery checker (400001)...');
  await page.type('input[placeholder*="400703"]', '400001');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const checkBtn = btns.find((b) => b.textContent?.includes('Check'));
    if (checkBtn) checkBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_pincode_checked.png'),
  });

  // 3. Click Add to Cart
  console.log('3. Adding item to shopping basket...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addBtn = btns.find((b) => b.textContent?.includes('Add to Shopping Basket'));
    if (addBtn) addBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1500));

  // 4. Open Cart Drawer & Check Cart
  console.log('4. Viewing Cart Drawer...');
  // The cart drawer opens automatically or can be opened via the cart icon
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_cart_drawer.png'),
  });

  // 5. Navigate to Checkout
  console.log('5. Navigating to Checkout...');
  await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_checkout_page.png'),
  });

  // 6. Click Place COD Order
  console.log('6. Submitting checkout form via Place COD Order...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const placeBtn = btns.find((b) => b.textContent?.includes('Place COD Order') || b.textContent?.includes('Place Order'));
    if (placeBtn) placeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 4000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_order_success.png'),
  });

  // 7. Visit Admin Orders page
  console.log('7. Logging into Admin and Checking Orders Management...');
  await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle2' });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 2000));
  await page.goto('http://localhost:5174/orders', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_admin_orders.png'),
  });

  // 8. Visit Admin Inventory page
  console.log('8. Checking Admin Inventory Management...');
  await page.goto('http://localhost:5174/inventory', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_admin_inventory.png'),
  });

  await browser.close();
  console.log('✅ End-to-end browser user journey completed!');
}

runBrowserFlow().catch((e) => {
  console.error('Browser journey error:', e);
  process.exit(1);
});
