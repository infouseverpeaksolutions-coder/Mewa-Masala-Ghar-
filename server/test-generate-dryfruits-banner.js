import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'c:\\Users\\Hasnain Ansari\\OneDrive\\Desktop\\mewa-masala-ghar\\client\\public\\banners';

async function generateSlide3DryFruits() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 420px;
    overflow: hidden;
    background: #FDFBF7;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    display: flex;
  }
  
  /* Sunlit kitchen background */
  .bg-kitchen {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 75% 30%, #FFFDF8 0%, #F6ECE0 50%, #EDE1D2 100%);
    z-index: 1;
  }

  /* Wooden Tabletop across the bottom */
  .wooden-table {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 135px;
    background: linear-gradient(180deg, #D6B58F 0%, #C6A177 30%, #B28B62 70%, #9C744A 100%);
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 -4px 12px rgba(0,0,0,0.06);
    z-index: 2;
  }
  .wooden-table::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(90deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 60px, rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 120px);
    opacity: 0.7;
  }

  /* Left content area */
  .left-content {
    position: relative;
    z-index: 10;
    width: 530px;
    height: 100%;
    padding: 50px 0 50px 65px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .headline {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 46px;
    font-weight: 700;
    color: #183B23;
    line-height: 1.12;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    line-height: 1.5;
    color: #4A4A4A;
    margin-top: 14px;
    max-width: 440px;
    font-weight: 400;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #C88E2D;
    color: #FFFFFF;
    font-weight: 600;
    font-size: 15px;
    padding: 12px 32px;
    border-radius: 9999px;
    margin-top: 22px;
    width: fit-content;
    box-shadow: 0 4px 14px rgba(200, 142, 45, 0.35);
  }

  /* Botanical leaves sprig at bottom left */
  .leaf-decor {
    position: absolute;
    bottom: -5px;
    left: -5px;
    z-index: 15;
    width: 120px;
    height: 120px;
    pointer-events: none;
    opacity: 0.85;
  }

  /* Right content area: Jars & Bowls */
  .right-content {
    position: absolute;
    top: 0;
    right: 30px;
    width: 620px;
    height: 420px;
    z-index: 5;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 25px;
    gap: 20px;
  }

  /* Product jar card */
  .jar-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .jar-img {
    width: 170px;
    height: 250px;
    object-fit: cover;
    border-radius: 16px;
    border: 3px solid #FFF;
    box-shadow: 0 16px 30px -8px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.1);
    background: #FFF;
  }

  .jar-badge {
    position: absolute;
    top: -10px;
    background: #183B23;
    color: #F5D88C;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 9999px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    letter-spacing: 0.05em;
  }

  .jar-label {
    margin-top: 8px;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 14px;
    font-weight: 700;
    color: #2F1E0E;
    text-align: center;
  }

  .jar-sub {
    font-size: 12px;
    color: #5C4533;
    font-weight: 600;
  }

  /* Center hero combo box */
  .combo-item {
    transform: translateY(-10px) scale(1.04);
    z-index: 6;
  }
</style>
</head>
<body>
  <div class="bg-kitchen"></div>
  <div class="wooden-table"></div>

  <div class="left-content">
    <h1 class="headline">Royal Mewa &amp;<br/>Festive Combos.</h1>
    <p class="subtitle">Kajoo, Pista, Anjeer, Akhrot, Kismis &amp; Jumbo California Badam. Curated gift hampers in packs of 2, 4 &amp; 6.</p>
    <div class="cta-btn">
      Shop Dry Fruits <span>&rarr;</span>
    </div>
  </div>

  <svg class="leaf-decor" viewBox="0 0 120 120" fill="none">
    <path d="M0 120 C 20 80, 40 50, 75 35 C 50 55, 30 85, 0 120 Z" fill="#183B23"/>
    <path d="M10 120 C 35 75, 65 60, 95 55 C 70 70, 45 95, 10 120 Z" fill="#2E5A36"/>
    <path d="M0 110 C 20 95, 45 90, 60 85 C 45 95, 25 105, 0 110 Z" fill="#1A4026"/>
    <path d="M25 120 C 45 85, 75 75, 110 70 C 85 85, 60 105, 25 120 Z" fill="#3D7347"/>
  </svg>

  <div class="right-content">
    <!-- Item 1: California Badam -->
    <div class="jar-item">
      <span class="jar-badge">Bestseller</span>
      <img src="https://images.unsplash.com/photo-1508061252445-5350f3777130?auto=format&fit=crop&w=400&q=80" class="jar-img"/>
      <p class="jar-label">Royal Badam</p>
      <p class="jar-sub">Jumbo California (500g)</p>
    </div>

    <!-- Item 2: Combo of 4 Royal Box (Center) -->
    <div class="jar-item combo-item">
      <span class="jar-badge" style="background:#C88E2D; color:#FFF;">Combos (2, 4, 6)</span>
      <img src="https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=400&q=80" class="jar-img" style="border-color:#F5D88C;"/>
      <p class="jar-label">Shahi 4-Jar Hamper</p>
      <p class="jar-sub">Badam • Kaju • Pista • Anjeer</p>
    </div>

    <!-- Item 3: King Size W240 Kaju -->
    <div class="jar-item">
      <span class="jar-badge">100% Whole</span>
      <img src="https://images.unsplash.com/photo-1536591375315-1b8389650b4a?auto=format&fit=crop&w=400&q=80" class="jar-img"/>
      <p class="jar-label">King Size Kaju</p>
      <p class="jar-sub">Grade W240 Whole (500g)</p>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const outPath = path.join(OUTPUT_DIR, 'dryfruits_banner_full.png');
  await page.screenshot({ path: outPath });
  console.log('✅ Generated dry fruits banner at:', outPath);
  await browser.close();
}

generateSlide3DryFruits().catch(console.error);
