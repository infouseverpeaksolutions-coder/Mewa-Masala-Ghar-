import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 20000 });

  // Scroll to section
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const target = headings.find(h => h.textContent.includes('Jimmy'));
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'subbrand_banners_desktop.png') });
  console.log('Saved subbrand_banners_desktop.png');

  // Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const target = headings.find(h => h.textContent.includes('Jimmy'));
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'subbrand_banners_mobile.png') });
  console.log('Saved subbrand_banners_mobile.png');

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
