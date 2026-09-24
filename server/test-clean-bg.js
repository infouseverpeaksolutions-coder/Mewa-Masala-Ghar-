import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const MOCKUP_IMG = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\.user_uploaded\\media_1789989156078.png';
const SEED_IMG = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\seed_jars.jpg';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 420 });

  const mockupBase64 = 'data:image/png;base64,' + fs.readFileSync(MOCKUP_IMG).toString('base64');
  const seedBase64 = 'data:image/jpeg;base64,' + fs.readFileSync(SEED_IMG).toString('base64');

  // Let's inspect the dimensions of the mockup image in page
  await page.setContent(`
    <html>
      <body>
        <img id="m" src="${mockupBase64}" />
      </body>
    </html>
  `);

  const info = await page.evaluate(() => {
    const img = document.getElementById('m');
    return { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
  });

  console.log('Mockup natural size:', info);
  await browser.close();
}

test().catch(console.error);
