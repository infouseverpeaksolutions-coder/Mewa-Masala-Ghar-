import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const USER_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\.user_uploaded';
const OUTPUT_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\assets';

async function cropMockupAssets() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  const filePath = path.join(USER_DIR, 'media_1789891435751.jpg');
  const base64Img = 'data:image/jpeg;base64,' + fs.readFileSync(filePath).toString('base64');

  const html = `
<!DOCTYPE html>
<html>
<body>
<img id="srcImg" src="${base64Img}" />
<script>
  function crop(x, y, w, h) {
    const img = document.getElementById('srcImg');
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    return canvas.toDataURL('image/png');
  }
</script>
</body>
</html>
  `;

  await page.setContent(html);
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const img = document.getElementById('srcImg');
      if (img.complete) resolve();
      else img.onload = resolve;
    });
  });

  const crops = await page.evaluate(() => {
    return {
      comboPack: crop(390, 455, 160, 65),       // Combo Packs 2/4/6
      dryFruitBowl: crop(35, 455, 65, 55),      // Dry fruits bowl
      spicesBowl: crop(305, 455, 75, 55),       // Spices bowls
      prathamBaby: crop(25, 625, 155, 70),      // Pratham Aahar with baby
      dailyPoshan: crop(185, 625, 195, 70),     // Daily Poshan family
      pregnancyDiet: crop(385, 625, 165, 70),   // Pregnancy diet
      multaniExport: crop(25, 715, 170, 55),    // Premium Multani Mitti
      pinkMultani: crop(200, 715, 170, 55),     // Pink Multani
      deadSeaMud: crop(380, 715, 170, 55),      // Dead Sea Mud
    };
  });

  for (const [name, dataUrl] of Object.entries(crops)) {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const outPath = path.join(OUTPUT_DIR, `${name}.png`);
    fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
    console.log('✅ Saved crop:', name);
  }

  await browser.close();
}

cropMockupAssets().catch(console.error);
