import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';

async function capture5HeroSlides() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // Capture Slide 1 (Dry fruits)
  await page.screenshot({
    path: path.join(OUT_DIR, 'hero_5slide_1_dryfruits.png'),
    fullPage: false
  });
  console.log('Saved hero_5slide_1_dryfruits.png');

  // Hover on Slide 1 CTA button
  const btn1 = await page.$('a[aria-label^="Shop Royal Mewa"]');
  if (btn1) {
    const box = await btn1.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({
        path: path.join(OUT_DIR, 'hero_5slide_1_hover.png'),
        fullPage: false
      });
      console.log('Saved hero_5slide_1_hover.png');
    }
  }

  // Next slide helper
  const nextBtn = await page.$('button[aria-label="Next banner slide"]');

  // Slide 2: Seeds
  await page.mouse.move(0, 0);
  if (nextBtn) await nextBtn.click();
  await new Promise(r => setTimeout(r, 1000)); // wait for smooth transition
  await page.screenshot({
    path: path.join(OUT_DIR, 'hero_5slide_2_seeds.png'),
    fullPage: false
  });
  console.log('Saved hero_5slide_2_seeds.png');

  // Slide 3: Baby & Poshan
  if (nextBtn) await nextBtn.click();
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(OUT_DIR, 'hero_5slide_3_baby_poshan.png'),
    fullPage: false
  });
  console.log('Saved hero_5slide_3_baby_poshan.png');

  // Slide 4: Pregnancy
  if (nextBtn) await nextBtn.click();
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(OUT_DIR, 'hero_5slide_4_pregnancy.png'),
    fullPage: false
  });
  console.log('Saved hero_5slide_4_pregnancy.png');

  // Slide 5: Personal Care
  if (nextBtn) await nextBtn.click();
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(OUT_DIR, 'hero_5slide_5_personal_care.png'),
    fullPage: false
  });
  console.log('Saved hero_5slide_5_personal_care.png');

  // Mobile View
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  await mobilePage.screenshot({
    path: path.join(OUT_DIR, 'hero_5slide_mobile_view.png'),
    fullPage: false
  });
  console.log('Saved hero_5slide_mobile_view.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture5HeroSlides().catch(console.error);
