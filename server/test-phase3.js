// test-phase3.js - Automated Test Suite for Phase 3 Backend Endpoints
const http = require('http');

const BASE_URL = 'http://localhost:5000';

function request(options, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.url || BASE_URL + (options.path || ''));
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'x-test-suite': 'true',
        ...(options.headers || {}),
      },
    };

    if (data && typeof data === 'object' && !(data instanceof Buffer) && !reqOptions.headers['Content-Type']) {
      reqOptions.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch {
          // not JSON
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body,
          json,
        });
      });
    });

    req.on('error', reject);

    if (data) {
      if (typeof data === 'string' || data instanceof Buffer) {
        req.write(data);
      } else {
        req.write(JSON.stringify(data));
      }
    }
    req.end();
  });
}

function parseCookie(setCookieHeaders, cookieName) {
  if (!setCookieHeaders) return null;
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  for (const h of headers) {
    const parts = h.split(';');
    const [name, val] = parts[0].split('=');
    if (name.trim() === cookieName) {
      return val ? val.trim() : null;
    }
  }
  return null;
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('  🧪 RUNNING PHASE 3 AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  // Test Group 1: Public Home & Content Endpoints
  console.log('▶ TEST GROUP 1: Public Aggregated & Content APIs');
  
  const homeRes = await request({ path: '/api/home' });
  assert(homeRes.status === 200, 'GET /api/home returns 200 OK');
  assert(homeRes.json?.data?.heroBanners?.length > 0, 'Home returns hero banners array');
  assert(homeRes.json?.data?.stores?.length === 3, 'Home returns 3 active department stores');
  assert(homeRes.json?.data?.featuredByStore?.foods !== undefined, 'Home returns featured products grouped by store');
  assert(homeRes.json?.data?.bestsellers?.length > 0, 'Home returns bestsellers list');
  assert(Array.isArray(homeRes.json?.data?.reviews), 'Home returns customer reviews array');
  assert(homeRes.json?.data?.settings?.company_name !== undefined, 'Home returns settings key-value map');

  // Banners
  const bannersRes = await request({ path: '/api/banners' });
  assert(bannersRes.status === 200, 'GET /api/banners returns 200');
  assert(bannersRes.json?.data?.length > 0, 'Returns active banners');

  // Pages by slug
  const aboutPageRes = await request({ path: '/api/pages/about-us' });
  assert(aboutPageRes.status === 200, 'GET /api/pages/about-us returns 200');
  assert(aboutPageRes.json?.data?.slug === 'about-us', 'Returns about-us page data');
  assert(aboutPageRes.json?.data?.content?.length > 0, 'Returns full about-us page HTML/content');

  const faqPageRes = await request({ path: '/api/pages/faq' });
  assert(faqPageRes.status === 200, 'GET /api/pages/faq returns 200');

  // Test Group 2: Newsletter & Contact Submissions
  console.log('\n▶ TEST GROUP 2: Newsletter & Contact Message APIs');
  
  const newsRes = await request(
    { path: '/api/newsletter/subscribe', method: 'POST' },
    { email: `subscriber_${Date.now()}@example.com` }
  );
  assert(newsRes.status === 200, 'POST /api/newsletter/subscribe returns 200');
  assert(newsRes.json?.success === true, 'Newsletter subscription succeeds');

  // Duplicate email subscription is idempotent
  const dupNewsRes = await request(
    { path: '/api/newsletter/subscribe', method: 'POST' },
    { email: `subscriber_${Date.now()}@example.com` }
  );
  assert(dupNewsRes.status === 200, 'Duplicate newsletter subscribe handled gracefully (idempotent)');

  // Contact form submission
  const contactRes = await request(
    { path: '/api/contact', method: 'POST' },
    {
      name: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@example.com',
      phone: '9876543210',
      subject: 'Bulk Corporate Gifting Inquiry',
      message: 'Looking to order 50 Dry Fruit Gift Hampers for Diwali.',
    }
  );
  assert(contactRes.status === 200, 'POST /api/contact returns 200');
  assert(contactRes.json?.success === true, 'Contact form saved and responded');
  assert(contactRes.json?.data?.id !== undefined, 'Contact message saved with DB id');

  // Contact form with honeypot rejection
  const botRes = await request(
    { path: '/api/contact', method: 'POST' },
    {
      name: 'Bot Spammer',
      email: 'bot@spam.com',
      subject: 'Spam Subject',
      message: 'Buy our links',
      website: 'http://spam-link.com', // Honeypot field filled
    }
  );
  assert(botRes.status === 200, 'Bot submission caught by honeypot safely');

  // Test Group 3: Cart CRUD & Stock Validation
  console.log('\n▶ TEST GROUP 3: Cart Operations & Stock Validation');

  // Get a test product and variant
  const prodsRes = await request({ path: '/api/products?limit=2' });
  const testProd = prodsRes.json?.data?.products?.[0];
  const testVariant = testProd?.variants?.[0];
  assert(!!testVariant, 'Found valid test product variant');

  // 1. Add item to guest cart (creates session)
  const addRes = await request(
    { path: '/api/cart/items', method: 'POST' },
    { variantId: testVariant.id, quantity: 2 }
  );
  assert(addRes.status === 200, 'Add item to guest cart returns 200');
  const sessionCookie = parseCookie(addRes.headers['set-cookie'], 'mmg_session_id');
  assert(!!sessionCookie, 'Session cookie issued for guest cart');
  assert(addRes.json?.data?.items?.length === 1, 'Cart has 1 item');
  const cartItemId = addRes.json?.data?.items?.[0]?.id;

  // 2. Read cart with session cookie
  const getCartRes = await request({
    path: '/api/cart',
    headers: { Cookie: `mmg_session_id=${sessionCookie}` },
  });
  assert(getCartRes.status === 200, 'GET /api/cart returns 200');
  assert(getCartRes.json?.data?.items?.[0]?.quantity === 2, 'Cart reflects 2 units of variant');

  // 3. Update quantity
  const updateQtyRes = await request(
    {
      path: `/api/cart/items/${cartItemId}`,
      method: 'PUT',
      headers: { Cookie: `mmg_session_id=${sessionCookie}` },
    },
    { quantity: 4 }
  );
  assert(updateQtyRes.status === 200, 'Update quantity to 4 returns 200');
  assert(updateQtyRes.json?.data?.items?.[0]?.quantity === 4, 'Cart quantity updated to 4');

  // 4. Overstock protection check
  const overstockRes = await request(
    {
      path: `/api/cart/items/${cartItemId}`,
      method: 'PUT',
      headers: { Cookie: `mmg_session_id=${sessionCookie}` },
    },
    { quantity: 99999 } // Exceeds stock
  );
  assert(overstockRes.status === 400, 'Requesting stock > available returns 400 Bad Request');

  // 5. Customer Login & Cart Merge
  console.log('\n▶ TEST GROUP 4: Guest-to-User Cart Merge on Login');
  
  // Login as customer
  const loginRes = await request(
    { path: '/api/auth/login', method: 'POST' },
    { email: 'aarav@example.com', password: 'Customer@12345' }
  );
  assert(loginRes.status === 200, 'Customer login succeeds');
  const customerToken = loginRes.json?.data?.accessToken;

  // Merge guest cart into user account
  const mergeRes = await request({
    path: '/api/cart/merge',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${customerToken}`,
      Cookie: `mmg_session_id=${sessionCookie}`,
    },
  });
  assert(mergeRes.status === 200, 'POST /api/cart/merge returns 200');
  assert(mergeRes.json?.data?.items?.length > 0, 'Merged cart contains items under customer account');

  // Verify customer's cart
  const userCartRes = await request({
    path: '/api/cart',
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  assert(userCartRes.status === 200, 'GET /api/cart with user token returns user cart');
  assert(userCartRes.json?.data?.items?.length > 0, 'User cart has merged items');

  // Clean up user cart
  const clearRes = await request({
    path: '/api/cart',
    method: 'DELETE',
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  assert(clearRes.status === 200, 'DELETE /api/cart clears all items');
  assert(clearRes.json?.data?.items?.length === 0, 'Cart is now empty');

  // Test Group 5: Review Submission & Listing
  console.log('\n▶ TEST GROUP 5: Product Reviews & Rating Summary');

  // Submit review as customer
  const submitRevRes = await request(
    {
      path: '/api/reviews',
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
    },
    {
      productId: testProd.id,
      rating: 5,
      title: 'Crisp, fresh and delicious!',
      comment: 'Absolutely highest quality dry fruits. Clean packaging and fast delivery to Navi Mumbai.',
    }
  );
  assert(submitRevRes.status === 201, 'POST /api/reviews returns 201 Created');
  assert(submitRevRes.json?.data?.isApproved === false, 'New review starts as isApproved: false (moderation)');

  // Get product reviews
  const getRevRes = await request({ path: `/api/reviews/${testProd.id}` });
  assert(getRevRes.status === 200, `GET /api/reviews/${testProd.id} returns 200`);
  assert(getRevRes.json?.data?.summary?.averageRating !== undefined, 'Summary includes average rating');
  assert(getRevRes.json?.data?.summary?.breakdown !== undefined, 'Summary includes 1-5 star breakdown');

  console.log('\n====================================================');
  console.log(`  📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
