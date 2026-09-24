import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const USER_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\.user_uploaded';

async function inspectFullMockup() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  const filePath = 'file:///' + path.join(USER_DIR, 'media_1789891435751.jpg').replace(/\\/g, '/');
  await page.goto(filePath);

  const dimensions = await page.evaluate(() => {
    const img = document.querySelector('img');
    return { width: img.naturalWidth, height: img.naturalHeight };
  });

  console.log('Mockup natural dimensions:', dimensions);
  await browser.close();
}

inspectFullMockup().catch(console.error);
