import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BANNERS_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners';

const banners = [
  { id: 'makhana', file: 'makhana_banner_full.png' },
  { id: 'seeds', file: 'seed_banner_full.png' },
  { id: 'dryfruits', file: 'dryfruits_banner_full.png' },
  { id: 'spices', file: 'spices_banner_full.png' },
  { id: 'baby', file: 'baby_banner_full.png' },
  { id: 'pregnancy', file: 'pregnancy_banner_full.png' },
  { id: 'care', file: 'care_banner_full.png' }
];

async function measureButtons() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const results = {};

  for (const b of banners) {
    const fullPath = path.join(BANNERS_DIR, b.file);
    const b64 = 'data:image/png;base64,' + fs.readFileSync(fullPath).toString('base64');
    await page.setContent(`<html><body><img id="img" src="${b64}"/><canvas id="c"></canvas></body></html>`);
    const coords = await page.evaluate(() => {
      const img = document.getElementById('img');
      const c = document.getElementById('c');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height).data;

      // Find gold pill button pixels: RGB around (200, 142, 45)
      // specifically looking for pure button fill (r: 180-220, g: 130-160, b: 35-65)
      let minX = c.width, maxX = 0, minY = c.height, maxY = 0;
      for (let y = Math.floor(c.height * 0.5); y < Math.floor(c.height * 0.9); y++) {
        for (let x = Math.floor(c.width * 0.03); x < Math.floor(c.width * 0.35); x++) {
          const idx = (y * c.width + x) * 4;
          const r = data[idx];
          const g = data[idx+1];
          const b = data[idx+2];
          if (r >= 185 && r <= 215 && g >= 130 && g <= 155 && b >= 35 && b <= 60) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      return {
        width: c.width,
        height: c.height,
        minX, maxX, minY, maxY,
        btnWidthPx: maxX - minX,
        btnHeightPx: maxY - minY,
        leftPct: (minX / c.width * 100).toFixed(2),
        topPct: (minY / c.height * 100).toFixed(2),
        wPct: ((maxX - minX) / c.width * 100).toFixed(2),
        hPct: ((maxY - minY) / c.height * 100).toFixed(2)
      };
    });
    results[b.id] = coords;
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

measureButtons().catch(console.error);
