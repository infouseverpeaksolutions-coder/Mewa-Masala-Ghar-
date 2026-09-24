import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BANNER = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\makhana_banner_full.png';

async function checkPixels() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const b64 = 'data:image/png;base64,' + fs.readFileSync(BANNER).toString('base64');
  await page.setContent(`<html><body><img id="img" src="${b64}"/><canvas id="c"></canvas></body></html>`);
  const data = await page.evaluate(() => {
    const img = document.getElementById('img');
    const c = document.getElementById('c');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const pts = [
      [50, 30], [200, 30], [350, 30],
      [50, 80], [250, 80], [380, 80],
      [50, 180], [250, 180], [380, 180],
      [50, 240], [200, 240], [350, 240],
      [50, 280], [200, 280], [350, 280]
    ];
    return pts.map(([x, y]) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return { x, y, hex: '#' + [p[0], p[1], p[2]].map(v => v.toString(16).padStart(2, '0')).join('') };
    });
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}
checkPixels().catch(console.error);
