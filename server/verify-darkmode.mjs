import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Emulate prefers-color-scheme: dark
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500));

  // Check if .dark class is on documentElement
  const isDarkApplied = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log('Auto Dark Mode (.dark class on html):', isDarkApplied);

  // Check if Spices section exists
  const hasSpices = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    return headings.some(h => h.textContent.trim() === 'Spices');
  });
  console.log('Spices section exists:', hasSpices);

  // Take screenshot in Dark Mode
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'homepage_dark_mode_top.png') });

  // Scroll to Seeds & Bestsellers in Dark Mode
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const target = headings.find(h => h.textContent.includes('Seeds'));
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'homepage_dark_mode_seeds.png') });

  // 2. Emulate prefers-color-scheme: light
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.evaluate(() => {
    localStorage.removeItem('mmg_theme_mode');
    window.location.reload();
  });
  await new Promise(r => setTimeout(r, 2000));

  const isLightApplied = await page.evaluate(() => !document.documentElement.classList.contains('dark'));
  console.log('Auto Light Mode (no .dark class on html):', isLightApplied);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'homepage_light_mode_seeds.png') });

  await browser.close();
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
