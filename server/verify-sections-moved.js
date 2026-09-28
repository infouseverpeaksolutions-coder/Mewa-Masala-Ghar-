import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
  });

  // 1. Jimmi Jaggu Page (Desktop - Scrolled to Baby and Personal Care cards)
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1440, height: 900 });
  await page1.goto('http://localhost:5173/jimmi-jaggu', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page1.evaluate(() => window.scrollBy(0, 480));
  await new Promise((r) => setTimeout(r, 1000));
  await page1.screenshot({
    path: path.join(ARTIFACT_DIR, 'jimmi_jaggu_cards_moved_verified.png'),
    fullPage: false,
  });

  // 2. Homepage (Desktop - Showing Jimmi Jaggu Banner leading into Bestsellers)
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1440, height: 900 });
  await page2.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page2.evaluate(() => {
    const el = document.getElementById('jimmi-jaggu-showcase');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page2.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage_without_baby_care_shelves.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('Verification screenshots captured!');
}

capture().catch(console.error);
