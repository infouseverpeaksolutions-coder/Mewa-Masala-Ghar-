import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BANNERS_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners';

const banners = [
  'makhana_banner_full.png',
  'seed_banner_full.png',
  'dryfruits_banner_full.png',
  'spices_banner_full.png',
  'baby_banner_full.png',
  'pregnancy_banner_full.png',
  'care_banner_full.png'
];

async function findAllButtons() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  for (const b of banners) {
    const fullPath = path.join(BANNERS_DIR, b);
    const b64 = 'data:image/png;base64,' + fs.readFileSync(fullPath).toString('base64');
    await page.setContent(`<html><body><img id="img" src="${b64}"/><canvas id="c"></canvas></body></html>`);
    const res = await page.evaluate(() => {
      const img = document.getElementById('img');
      const c = document.getElementById('c');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      
      let minX = c.width, maxX = 0, minY = c.height, maxY = 0;
      for (let y = Math.floor(c.height * 0.5); y < Math.floor(c.height * 0.85); y++) {
        for (let x = Math.floor(c.width * 0.02); x < Math.floor(c.width * 0.3); x++) {
          const idx = (y * c.width + x) * 4;
          const r = data[idx];
          const g = data[idx+1];
          const b = data[idx+2];
          // Gold color
          if (r > 160 && r < 240 && g > 110 && g < 180 && b > 20 && b < 80) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      return {
        w: c.width,
        h: c.height,
        left: (minX / c.width * 100).toFixed(2) + '%',
        top: (minY / c.height * 100).toFixed(2) + '%',
        btnW: ((maxX - minX) / c.width * 100).toFixed(2) + '%',
        btnH: ((maxY - minY) / c.height * 100).toFixed(2) + '%'
      };
    });
    console.log(b, res);
  }
  await browser.close();
}
findAllButtons().catch(console.error);
