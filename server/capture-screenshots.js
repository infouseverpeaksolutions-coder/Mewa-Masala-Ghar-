import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log('Launching browser with puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Foods Store Landing Page (/foods)
  console.log('Capturing Foods Store Landing Page...');
  await page.goto('http://localhost:5173/foods', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_foods_landing.png'),
    fullPage: false,
  });

  // 2. Baby Nutrition Landing Page (/baby-nutrition)
  console.log('Capturing Baby Nutrition Store Landing Page...');
  await page.goto('http://localhost:5173/baby-nutrition', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_baby_landing.png'),
    fullPage: false,
  });

  // 3. Personal Care Landing Page (/personal-care)
  console.log('Capturing Personal Care Store Landing Page...');
  await page.goto('http://localhost:5173/personal-care', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_care_landing.png'),
    fullPage: false,
  });

  // 4. Full Cart Page (/cart)
  console.log('Capturing Full Cart Page...');
  await page.goto('http://localhost:5173/cart', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_cart_full.png'),
    fullPage: false,
  });

  // 5. Search Page (/search?q=makhana)
  console.log('Capturing Search Page...');
  await page.goto('http://localhost:5173/search?q=makhana', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_search_page.png'),
    fullPage: false,
  });

  // 6. Track Order Page (/track)
  console.log('Capturing Track Order Page...');
  await page.goto('http://localhost:5173/track', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_track_page.png'),
    fullPage: false,
  });

  // 7. FAQ Policy Page (/faq)
  console.log('Capturing FAQ Policy Page...');
  await page.goto('http://localhost:5173/faq', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_faq_page.png'),
    fullPage: false,
  });

  // 8. Admin Settings Page (/settings)
  console.log('Capturing Admin Settings Page...');
  await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle2', timeout: 30000 });
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@mewamasalaghar.com', password: 'Admin@12345' }),
  }).then((r) => r.json());
  const token = loginRes.data.accessToken;
  await page.evaluate((t) => {
    localStorage.setItem('mmg_admin_token', t);
  }, token);

  await page.goto('http://localhost:5174/settings', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'screenshot_admin_settings.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((e) => {
  console.error('Screenshot capture error:', e);
  process.exit(1);
});
