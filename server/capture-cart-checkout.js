import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const pRes = await fetch('http://localhost:5000/api/products/organic-brown-flax-seeds');
  const pData = await pRes.json();
  const product = pData.data?.product || pData.product;
  const variant = product.variants[0];

  const cartItem = {
    product: product,
    variant: variant,
    quantity: 2,
  };

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument((item) => {
    localStorage.setItem('mmg_cart', JSON.stringify([item]));
  }, cartItem);

  // 1. Populated Cart Page
  await page.goto('http://localhost:5173/cart', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ui_upgrade_cart_page_1440.png'), fullPage: false });

  // 2. Populated Checkout Page
  await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ui_upgrade_checkout_page_1440.png'), fullPage: false });

  await browser.close();
  console.log('Cart and Checkout re-captured with items!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
