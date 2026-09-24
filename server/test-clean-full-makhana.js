import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BANNER = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\makhana_banner_full.png';
const OUT = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\test_clean_full_makhana.png';

async function cleanFullBanner() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const b64 = 'data:image/png;base64,' + fs.readFileSync(BANNER).toString('base64');
  
  await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 1004px; height: 320px; overflow: hidden; position: relative; background: #fff; }
  #canvas { width: 1004px; height: 320px; display: block; }
</style>
</head>
<body>
<canvas id="canvas" width="1004" height="320"></canvas>
<img id="src" src="${b64}" style="display:none;" />
<script>
  const img = document.getElementById('src');
  img.onload = () => {
    const c = document.getElementById('canvas');
    const ctx = c.getContext('2d');
    
    // 1. Draw original banner
    ctx.drawImage(img, 0, 0);

    // In makhana_banner_full.png:
    // Left side:
    // Top background (y: 0 to 220, x: 25 to 440) contains:
    // 'Pure. Natural.' (y: 35-85)
    // 'Wholesome.' (y: 85-140)
    // 'Premium dry fruits...' (y: 145-195)
    
    // Notice the background behind this text is an ambient gradient.
    // Let's create a smooth radial/linear gradient patch for the top wall:
    const wallGrad = ctx.createLinearGradient(0, 0, 440, 220);
    wallGrad.addColorStop(0, 'rgba(244, 226, 198, 0.98)');
    wallGrad.addColorStop(0.3, 'rgba(252, 242, 227, 0.98)');
    wallGrad.addColorStop(0.7, 'rgba(250, 238, 218, 0.95)');
    wallGrad.addColorStop(1, 'rgba(240, 217, 181, 0)');
    
    // Fill text area on the wall
    ctx.save();
    ctx.beginPath();
    ctx.rect(30, 25, 410, 185);
    ctx.fillStyle = wallGrad;
    ctx.fill();
    ctx.restore();

    // 2. Button area (y: 215 to 275, x: 40 to 200)
    // Behind the button is the wooden table!
    // The wooden table at y: 220-320 has wood grain that runs horizontally.
    // Let's clone wood texture from x: 210-380, y: 220-280 onto x: 40-200, y: 220-280:
    ctx.save();
    // We can draw a horizontal strip of wood from the right of the button:
    ctx.drawImage(img, 210, 220, 180, 60, 42, 220, 168, 60);
    ctx.restore();

    // 3. Smooth blur/blend the borders of the patches
    // Let's add a very soft ambient light over the left content area
    const softLight = ctx.createRadialGradient(180, 120, 20, 180, 120, 280);
    softLight.addColorStop(0, 'rgba(255, 253, 248, 0.3)');
    softLight.addColorStop(1, 'rgba(255, 253, 248, 0)');
    ctx.fillStyle = softLight;
    ctx.fillRect(0, 0, 460, 220);
  };
</script>
</body>
</html>
  `);

  await page.evaluate(() => new Promise(r => {
    const img = document.getElementById('src');
    if (img.complete) r(); else img.onload = r;
  }));
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: OUT });
  console.log('Saved', OUT);
  await browser.close();
}

cleanFullBanner().catch(console.error);
