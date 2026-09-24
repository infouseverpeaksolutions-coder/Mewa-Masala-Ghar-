import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const USER_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508\\.user_uploaded';
const OUTPUT_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners\\assets';

async function cropCareBowls() {
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
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, x, y, w, h, 0, 0, w * 2, h * 2);
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

  // y: 732 starts well below "Personal Care" text
  const bowls = await page.evaluate(() => {
    return {
      bowl_multani: crop(35, 731, 80, 42),
      bowl_pink: crop(210, 731, 80, 42),
      bowl_deadsea: crop(388, 731, 80, 42),
      pregnancy_mom: crop(388, 626, 75, 66),
    };
  });

  for (const [name, dataUrl] of Object.entries(bowls)) {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const outPath = path.join(OUTPUT_DIR, `${name}.png`);
    fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
    console.log('✅ Saved bowl crop:', name);
  }

  await browser.close();
}

cropCareBowls().catch(console.error);
