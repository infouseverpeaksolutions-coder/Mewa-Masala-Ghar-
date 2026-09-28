import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 80);
    });
  });
}

async function runVerification() {
  console.log('🚀 Starting Puppeteer Verification for Mewa Masala Ghar Homepage...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
  });

  const consoleErrors = [];

  // ==========================================
  // 1. DESKTOP VERIFICATION (1440px)
  // ==========================================
  console.log('\n📸 1. Capturing Desktop (1440px)...');
  const desktopPage = await browser.newPage();
  desktopPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error 1440px]: ${msg.text()}`);
    }
  });

  await desktopPage.setViewport({ width: 1440, height: 900 });
  await desktopPage.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 20000 });
  await autoScroll(desktopPage);
  await new Promise((r) => setTimeout(r, 1000));

  // Hero section screenshot at 1440px
  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage_desktop_1440px_hero.png'),
    fullPage: false,
  });

  // Full page screenshot at 1440px
  await desktopPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage_desktop_1440px_full.png'),
    fullPage: true,
  });

  // Inspect video element at 1440px
  const desktopVideoInfo = await desktopPage.evaluate(() => {
    const video = document.querySelector('video');
    return {
      exists: !!video,
      currentSrc: video ? video.currentSrc : null,
      paused: video ? video.paused : null,
      muted: video ? video.muted : null,
      poster: video ? video.poster : null,
    };
  });
  console.log('Desktop Video Info:', desktopVideoInfo);

  // ==========================================
  // 2. TABLET VERIFICATION (768px)
  // ==========================================
  console.log('\n📸 2. Capturing Tablet (768px)...');
  const tabletPage = await browser.newPage();
  await tabletPage.setViewport({ width: 768, height: 1024 });
  await tabletPage.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 20000 });
  await autoScroll(tabletPage);
  await new Promise((r) => setTimeout(r, 1000));

  await tabletPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage_tablet_768px_hero.png'),
    fullPage: false,
  });

  await tabletPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage_tablet_768px_full.png'),
    fullPage: true,
  });

  // ==========================================
  // 3. MOBILE VERIFICATION (390px)
  // ==========================================
  console.log('\n📸 3. Capturing Mobile (390px)...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true });
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 20000 });
  await autoScroll(mobilePage);
  await new Promise((r) => setTimeout(r, 1000));

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage_mobile_390px_hero.png'),
    fullPage: false,
  });

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage_mobile_390px_full.png'),
    fullPage: true,
  });

  const mobileVideoInfo = await mobilePage.evaluate(() => {
    const video = document.querySelector('video');
    const bottomNav = document.querySelector('nav.md\\:hidden');
    return {
      videoExists: !!video,
      currentSrc: video ? video.currentSrc : null,
      bottomNavExists: !!bottomNav,
    };
  });
  console.log('Mobile Video & Nav Info:', mobileVideoInfo);

  // ==========================================
  // 4. PREFERS-REDUCED-MOTION VERIFICATION
  // ==========================================
  console.log('\n📸 4. Capturing Prefers-Reduced-Motion Mode...');
  const motionPage = await browser.newPage();
  await motionPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await motionPage.setViewport({ width: 1440, height: 900 });
  await motionPage.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1000));

  await motionPage.screenshot({
    path: path.join(ARTIFACT_DIR, 'homepage_reduced_motion_poster.png'),
    fullPage: false,
  });

  const reducedMotionInfo = await motionPage.evaluate(() => {
    const video = document.querySelector('video');
    const posterImg = document.querySelector('img[src*="hero-poster"]');
    return {
      videoPresent: !!video,
      posterImgPresent: !!posterImg,
      posterSrc: posterImg ? posterImg.src : null,
    };
  });
  console.log('Reduced Motion Verification:', reducedMotionInfo);

  await browser.close();

  console.log('\n==========================================');
  console.log('Console Errors Reported:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.log('  ⚠️', e));
  } else {
    console.log('  ✅ ZERO console errors detected!');
  }
  console.log('==========================================\n');
}

runVerification().catch(console.error);
