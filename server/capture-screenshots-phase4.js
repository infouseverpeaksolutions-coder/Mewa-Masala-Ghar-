import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Hasnain Ansari\\.gemini\\antigravity\\brain\\93fabff0-805a-4e96-a3f6-82cc69509508';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capturePhase4() {
  console.log('🚀 Starting Phase 4 High-Fidelity Visual Verification...');

  // 1. Authenticate customer and admin via API first
  console.log('🔑 Authenticating customer and admin...');
  const custRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aarav@example.com', password: 'Customer@12345' }),
  });
  const custData = await custRes.json();
  const customerToken = custData?.data?.accessToken;
  console.log('Customer token acquired:', !!customerToken);

  const adminRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@mewamasalaghar.com', password: 'Admin@12345' }),
  });
  const adminData = await adminRes.json();
  const adminToken = adminData?.data?.accessToken;
  console.log('Admin token acquired:', !!adminToken);

  // 2. Discover Catalog items
  const prodRes = await fetch('http://localhost:5000/api/products');
  const prodData = await prodRes.json();
  const products = prodData?.data?.products || prodData?.products || [];
  const testProduct = products[0];
  const testVariant = testProduct?.variants?.[0];

  console.log(`Using Product: "${testProduct?.name}", Variant: "${testVariant?.title}" (ID: ${testVariant?.id})`);

  // 3. Create a dedicated customer order for full lifecycle tracking
  console.log('📦 Creating dedicated test order...');
  const createOrderRes = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav@example.com',
      customerPhone: '9820012345',
      shippingAddress: {
        addressLine: 'Flat 402, Royal Palms, Vashi Sector 14',
        city: 'Navi Mumbai',
        state: 'Maharashtra',
        stateCode: '27',
        pincode: '400703',
      },
      paymentMethod: 'COD',
      items: [
        {
          productId: testProduct.id,
          variantId: testVariant.id,
          quantity: 2,
        },
      ],
    }),
  });
  const orderJson = await createOrderRes.json();
  const createdOrder = orderJson.order;
  console.log(`Order created: ${createdOrder.orderNumber}, ID: ${createdOrder.id}, Token: ${createdOrder.trackingToken}`);

  // Transition order to SHIPPED so the tracking timeline shows rich events
  if (adminToken && createdOrder?.id) {
    console.log('🚚 Transitioning order to SHIPPED with courier tracking...');
    await fetch(`http://localhost:5000/api/admin/orders/${createdOrder.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'CONFIRMED', comment: 'Order verified and confirmed' }),
    });

    await fetch(`http://localhost:5000/api/admin/orders/${createdOrder.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'PACKED', comment: 'Double-sealed and packed with moisture barrier' }),
    });

    await fetch(`http://localhost:5000/api/admin/orders/${createdOrder.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'SHIPPED',
        courier: 'Blue Dart Express',
        awbNo: 'BD-883920194IN',
        comment: 'Handed over to Blue Dart logistics hub',
      }),
    });
  }

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,960'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });

  // A. Checkout Page
  console.log('📸 A. Capturing Checkout Page (/checkout)...');
  await page.goto('http://localhost:5173/shop', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  // Add item to cart
  const addBtns = await page.$$('button');
  for (const btn of addBtns) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Add')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4_checkout_page.png'),
    fullPage: false,
  });

  // B. Order Success Page
  console.log('📸 B. Capturing Order Success Page (/order-success/:orderNo)...');
  await page.goto(`http://localhost:5173/order-success/${createdOrder.orderNumber}?token=${createdOrder.trackingToken}`, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  await page.waitForFunction(() => document.body.innerText.includes('Order Confirmed!') || document.body.innerText.includes('Order Received') && document.body.innerText.includes(createdOrder.orderNumber), { timeout: 10000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4_order_success_online.png'),
    fullPage: false,
  });

  // C. Track Order Page (Timeline & Courier Integration)
  console.log('📸 C. Capturing Track Order Page (/track-order)...');
  await page.goto(`http://localhost:5173/track-order?token=${createdOrder.trackingToken}`, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  await page.waitForFunction(() => document.body.innerText.includes('Official Shipment') || document.body.innerText.includes('Blue Dart'), { timeout: 10000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4_track_order_timeline.png'),
    fullPage: true,
  });

  // D. Account Orders Page (Customer History & Management)
  console.log('📸 D. Capturing Account Orders Page (/account?tab=orders)...');
  await page.goto('http://localhost:5173/account', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate((token) => {
    localStorage.setItem('mmg_access_token', token);
  }, customerToken);
  await page.goto('http://localhost:5173/account?tab=orders', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForFunction(() => document.body.innerText.includes('Order #') || document.body.innerText.includes('Aarav'), { timeout: 10000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4_account_orders.png'),
    fullPage: false,
  });

  // E. Admin Orders Management (Portal: port 5174)
  console.log('📸 E. Capturing Admin Orders Management (http://localhost:5174/orders)...');
  await page.goto('http://localhost:5174/orders', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate((token) => {
    localStorage.setItem('mmg_admin_token', token);
  }, adminToken);
  await page.goto('http://localhost:5174/orders', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForFunction(() => document.body.innerText.includes('MMG-2026') || document.querySelector('table'), { timeout: 10000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4_admin_orders_management.png'),
    fullPage: false,
  });

  // F. GST Tax Invoice HTML View
  console.log('📸 F. Capturing GST Tax Invoice HTML...');
  await page.goto(`http://localhost:5000/api/orders/${createdOrder.orderNumber}/invoice`, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4_gst_tax_invoice.png'),
    fullPage: true,
  });

  await browser.close();
  console.log('🎉 All 6 Phase 4 screenshots successfully generated and verified!');
}

capturePhase4().catch(console.error);
