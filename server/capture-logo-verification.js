import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('🚀 Capturing Logo Verification Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Storefront Header with Logo
  console.log('📸 1. Capturing Storefront Header with Logo (1440px)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'logo_verification_header_1440.png'),
    clip: { x: 0, y: 0, width: 1440, height: 260 },
  });

  // 2. Storefront Footer with Logo
  console.log('📸 2. Capturing Storefront Footer with Logo (1440px)...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'logo_verification_footer_1440.png'),
    fullPage: false,
  });

  // 3. Login Page with Logo
  console.log('📸 3. Capturing Login Page with Logo (1440px)...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'logo_verification_login_1440.png'),
    fullPage: false,
  });

  // 4. Mobile Header with Logo (390px)
  console.log('📸 4. Capturing Mobile Header with Logo (390px)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'logo_verification_mobile_390.png'),
    clip: { x: 0, y: 0, width: 390, height: 260 },
  });

  // 5. Admin Console Sidebar with Logo
  console.log('📸 5. Capturing Admin Console with Logo (1440px)...');
  await page.setViewport({ width: 1440, height: 900 });
  // Login to admin or goto admin login
  await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'logo_verification_admin_login_1440.png'),
    fullPage: false,
  });

  // 6. Tax Invoice with Logo
  console.log('📸 6. Capturing Tax Invoice with Logo...');
  await page.goto('http://localhost:5000/api/orders/MMG-2026-689270/invoice', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'logo_verification_tax_invoice.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('🎉 All logo verification screenshots captured!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
