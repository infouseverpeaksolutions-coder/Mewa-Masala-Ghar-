import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BANNER = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\makhana_banner_full.png';
const OUT = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\test_inpainted_makhana.png';

async function inpaintMakhana() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const b64 = 'data:image/png;base64,' + fs.readFileSync(BANNER).toString('base64');
  
  await page.setContent(`
<!DOCTYPE html>
<html>
<body>
<canvas id="c" width="1004" height="320"></canvas>
<img id="src" src="${b64}" />
<script>
  const img = document.getElementById('src');
  img.onload = () => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // 1. Replace the gold button (x: 40 to 205, y: 208 to 260) with the wood texture right beside it (x: 215 to 380, y: 208 to 260)
    // We blend it horizontally so there is no hard seam
    const btnW = 165;
    const btnH = 52;
    const srcX = 220;
    const dstX = 42;
    const dstY = 208;

    // Draw wood slice
    ctx.save();
    ctx.drawImage(img, srcX, dstY, btnW, btnH, dstX, dstY, btnW, btnH);
    ctx.restore();

    // 2. Now let's remove text in the wall region (x: 20 to 440, y: 20 to 208)
    // The background wall in makhana_banner_full.png has a soft blurred kitchen gradient.
    // Let's create an offscreen canvas to sample the background without text:
    const idata = ctx.getImageData(0, 0, c.width, c.height);
    const data = idata.data;

    // For any pixel in the text region (x: 30 to 430, y: 20 to 205), if it's text (dark green / charcoal):
    for (let y = 20; y < 205; y++) {
      for (let x = 30; x < 430; x++) {
        const idx = (y * c.width + x) * 4;
        const r = data[idx];
        const g = data[idx+1];
        const b = data[idx+2];
        
        // Text is dark: r < 120 && g < 120 && b < 100
        const isDark = (r < 130 && g < 135 && b < 115);
        if (isDark) {
          // Replace with a smooth blend of neighboring non-dark pixels or horizontal interpolation
          // Look above and below for non-dark
          let sampleY = y;
          let found = false;
          for (let dy = 1; dy < 35; dy++) {
            if (y - dy >= 15) {
              const upIdx = ((y - dy) * c.width + x) * 4;
              if (data[upIdx] > 180 && data[upIdx+1] > 160) {
                data[idx] = data[upIdx];
                data[idx+1] = data[upIdx+1];
                data[idx+2] = data[upIdx+2];
                found = true;
                break;
              }
            }
            if (y + dy < 205) {
              const downIdx = ((y + dy) * c.width + x) * 4;
              if (data[downIdx] > 180 && data[downIdx+1] > 160) {
                data[idx] = data[downIdx];
                data[idx+1] = data[downIdx+1];
                data[idx+2] = data[downIdx+2];
                found = true;
                break;
              }
            }
          }
        }
      }
    }
    ctx.putImageData(idata, 0, 0);

    // 3. Apply a very soft, smooth Gaussian-like blur only to the wall text area (x: 35 to 420, y: 25 to 202)
    // so any letter remnant becomes completely invisible and silky smooth
    const blurC = document.createElement('canvas');
    blurC.width = c.width;
    blurC.height = c.height;
    const bctx = blurC.getContext('2d');
    bctx.filter = 'blur(12px)';
    bctx.drawImage(c, 0, 0);

    ctx.save();
    ctx.beginPath();
    ctx.rect(38, 28, 385, 172);
    ctx.clip();
    ctx.drawImage(blurC, 0, 0);
    ctx.restore();

    // 4. Soft blur over the wood button patch edges (x: 40 to 210, y: 206 to 262)
    const woodBlurC = document.createElement('canvas');
    woodBlurC.width = c.width;
    woodBlurC.height = c.height;
    const wbctx = woodBlurC.getContext('2d');
    wbctx.filter = 'blur(4px)';
    wbctx.drawImage(c, 0, 0);

    ctx.save();
    ctx.beginPath();
    // Blur only seam borders
    ctx.rect(38, 206, 8, 56); // left edge
    ctx.rect(202, 206, 8, 56); // right edge
    ctx.rect(42, 206, 164, 5); // top edge
    ctx.rect(42, 258, 164, 5); // bottom edge
    ctx.clip();
    ctx.drawImage(woodBlurC, 0, 0);
    ctx.restore();
  };
</script>
</body>
</html>
  `);

  await page.evaluate(() => new Promise(r => {
    const img = document.getElementById('src');
    if (img.complete) r(); else img.onload = r;
  }));
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: OUT });
  console.log('Saved', OUT);
  await browser.close();
}

inpaintMakhana().catch(console.error);
