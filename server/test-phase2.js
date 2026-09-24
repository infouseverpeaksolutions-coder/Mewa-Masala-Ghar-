// test-phase2.js - Automated Test Suite for Phase 2 (Auth, Catalog & Admin)
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
  console.log('  🧪 RUNNING PHASE 2 AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Health check
  console.log('▶ TEST GROUP 1: Health & Root Aliases');
  const healthRes = await request({ path: '/api/health' });
  assert(healthRes.status === 200, 'Health endpoint returns 200 OK');
  assert(healthRes.json?.brand === 'Mewa Masala Ghar', 'Brand name is Mewa Masala Ghar');

  // Test 2: Auth Endpoints
  console.log('\n▶ TEST GROUP 2: Authentication & Security');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPhone = `98200${Math.floor(10000 + Math.random() * 90000)}`;

  // Register
  const regRes = await request(
    { path: '/api/auth/register', method: 'POST' },
    {
      name: 'Priya Sharma',
      email: testEmail,
      password: 'SecurePassword123!',
      phone: testPhone,
    }
  );
  assert(regRes.status === 201, 'Registration returns 201 Created');
  assert(regRes.json?.data?.accessToken, 'Access token is returned on register');
  assert(regRes.json?.data?.user?.emailVerified === false, 'User starts with emailVerified: false');
  const rawVerifyToken = regRes.json?.data?.verificationToken;
  assert(!!rawVerifyToken, 'Verification token received for email activation');
  const regRefreshCookie = parseCookie(regRes.headers['set-cookie'], 'refreshToken');
  assert(!!regRefreshCookie, 'httpOnly refreshToken cookie was set on registration');

  // Verify Email
  const verifyRes = await request(
    { path: '/api/auth/verify-email', method: 'POST' },
    { token: rawVerifyToken }
  );
  assert(verifyRes.status === 200, 'Email verification endpoint returns 200');
  assert(verifyRes.json?.success === true, 'Email successfully verified');

  // Login with Email
  const loginEmailRes = await request(
    { path: '/api/auth/login', method: 'POST' },
    { email: testEmail, password: 'SecurePassword123!' }
  );
  assert(loginEmailRes.status === 200, 'Login with email returns 200 OK');
  assert(loginEmailRes.json?.data?.user?.emailVerified === true, 'User emailVerified is now true');
  const customerToken = loginEmailRes.json?.data?.accessToken;
  const loginRefreshCookie = parseCookie(loginEmailRes.headers['set-cookie'], 'refreshToken');
  assert(!!loginRefreshCookie, 'Refresh token cookie issued upon login');

  // Login with Phone
  const loginPhoneRes = await request(
    { path: '/api/auth/login', method: 'POST' },
    { identifier: testPhone, password: 'SecurePassword123!' }
  );
  assert(loginPhoneRes.status === 200, 'Login with phone number identifier returns 200 OK');

  // Generic Error Check: Wrong password
  const wrongPassRes = await request(
    { path: '/api/auth/login', method: 'POST' },
    { email: testEmail, password: 'WrongPasswordXYZ' }
  );
  assert(wrongPassRes.status === 401, 'Wrong password returns 401 Unauthorized');
  assert(wrongPassRes.json?.message === 'Invalid credentials.', 'Generic error message prevents enumeration');

  // Generic Error Check: Non-existent user
  const nonExistentRes = await request(
    { path: '/api/auth/login', method: 'POST' },
    { email: 'nonexistent_person_12345@gmail.com', password: 'Password123' }
  );
  assert(nonExistentRes.status === 401, 'Non-existent user returns 401 Unauthorized');
  assert(nonExistentRes.json?.message === 'Invalid credentials.', 'Generic error message on non-existent account');

  // Refresh Token Rotation
  const refreshRes = await request({
    path: '/api/auth/refresh',
    method: 'POST',
    headers: {
      Cookie: `refreshToken=${loginRefreshCookie}`,
    },
  });
  assert(refreshRes.status === 200, 'Refresh endpoint returns 200 OK');
  assert(!!refreshRes.json?.data?.accessToken, 'New access token issued on refresh');
  const rotatedCookie = parseCookie(refreshRes.headers['set-cookie'], 'refreshToken');
  assert(!!rotatedCookie && rotatedCookie !== loginRefreshCookie, 'Refresh token was rotated with new cookie value');

  // Old refresh token is now revoked
  const reuseOldTokenRes = await request({
    path: '/api/auth/refresh',
    method: 'POST',
    headers: {
      Cookie: `refreshToken=${loginRefreshCookie}`,
    },
  });
  assert(reuseOldTokenRes.status === 401, 'Reusing revoked old refresh token returns 401 (anti-replay protection)');

  // Forgot Password
  const forgotRes = await request(
    { path: '/api/auth/forgot-password', method: 'POST' },
    { email: testEmail }
  );
  assert(forgotRes.status === 200, 'Forgot password returns 200');
  const rawResetToken = forgotRes.json?.resetToken;
  assert(!!rawResetToken, 'Reset token generated (hashed in DB)');

  // Reset Password
  const resetRes = await request(
    { path: '/api/auth/reset-password', method: 'POST' },
    { token: rawResetToken, newPassword: 'NewUpdatedPassword2026!' }
  );
  assert(resetRes.status === 200, 'Password reset returns 200');

  // Login with new password
  const loginNewPass = await request(
    { path: '/api/auth/login', method: 'POST' },
    { email: testEmail, password: 'NewUpdatedPassword2026!' }
  );
  assert(loginNewPass.status === 200, 'Login with newly reset password succeeds');
  const updatedCustomerToken = loginNewPass.json?.data?.accessToken;

  // Change Password
  const changePassRes = await request(
    {
      path: '/api/auth/change-password',
      method: 'POST',
      headers: { Authorization: `Bearer ${updatedCustomerToken}` },
    },
    {
      oldPassword: 'NewUpdatedPassword2026!',
      newPassword: 'FinalPassword2026@#',
    }
  );
  assert(changePassRes.status === 200, 'Change password authenticated endpoint succeeds');

  // Get Profile (/api/auth/me)
  const meRes = await request({
    path: '/api/auth/me',
    headers: { Authorization: `Bearer ${updatedCustomerToken}` },
  });
  assert(meRes.status === 200, 'GET /api/auth/me returns 200');
  assert(meRes.json?.data?.name === 'Priya Sharma', 'Profile returns correct customer name');
  assert(meRes.json?.data?.emailVerified === true, 'Profile shows verified email status');

  // Test 3: RBAC & Permission Boundaries
  console.log('\n▶ TEST GROUP 3: RBAC & Staff Module Permissions');

  // Customer attempting to access admin endpoints -> 403 Forbidden
  const customerAdminRes = await request({
    path: '/api/admin/products',
    headers: { Authorization: `Bearer ${updatedCustomerToken}` },
  });
  assert(customerAdminRes.status === 403, 'Customer role receives 403 Forbidden on admin routes');

  // Log in as Super Admin
  const adminLoginRes = await request(
    { path: '/api/auth/login', method: 'POST' },
    { email: 'admin@mewamasalaghar.com', password: 'Admin@12345' }
  );
  assert(adminLoginRes.status === 200, 'Super admin login succeeds');
  const adminToken = adminLoginRes.json?.data?.accessToken;

  // Log in as Staff user (permissions: ['products', 'orders', 'inventory'])
  const staffLoginRes = await request(
    { path: '/api/auth/login', method: 'POST' },
    { email: 'staff@mewamasalaghar.com', password: 'Staff@12345' }
  );
  assert(staffLoginRes.status === 200, 'Staff user login succeeds');
  const staffToken = staffLoginRes.json?.data?.accessToken;

  // Staff accessing allowed module ('products') -> 200 OK
  const staffProductsRes = await request({
    path: '/api/admin/products',
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  assert(staffProductsRes.status === 200, 'Staff with "products" permission accesses /api/admin/products');

  // Staff accessing disallowed module ('marketing' -> coupons) -> 403 Forbidden
  const staffCouponsRes = await request({
    path: '/api/admin/coupons',
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  assert(staffCouponsRes.status === 403, 'Staff without "marketing" permission gets 403 on /api/admin/coupons');

  // Super Admin accessing coupons -> 200 OK
  const adminCouponsRes = await request({
    path: '/api/admin/coupons',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminCouponsRes.status === 200, 'Super Admin accesses coupons without restriction');

  // Test 4: Public Catalog API
  console.log('\n▶ TEST GROUP 4: Public Catalog & Search Engine');

  // Stores
  const storesRes = await request({ path: '/api/stores' });
  assert(storesRes.status === 200, 'GET /api/stores returns 200');
  assert(storesRes.json?.data?.length === 3, 'Returns all 3 department stores (foods, baby, care)');

  // Categories Tree
  const catsRes = await request({ path: '/api/categories/tree' });
  assert(catsRes.status === 200, 'GET /api/categories/tree returns 200');
  assert(Array.isArray(catsRes.json?.data), 'Returns tree structure of categories');
  assert(catsRes.json?.data?.[0]?.productCount !== undefined, 'Categories include live product counts');

  // Products with Filters
  const allProdsRes = await request({ path: '/api/products?limit=5' });
  assert(allProdsRes.status === 200, 'GET /api/products returns 200');
  assert(allProdsRes.json?.data?.products?.length > 0, 'Returns list of active products');

  // Filter by Store
  const foodsProdsRes = await request({ path: '/api/products?store=foods' });
  const allFoods = foodsProdsRes.json?.data?.products?.every((p) => p.store?.slug === 'foods');
  assert(allFoods, 'Filter by store=foods returns only foods store products');

  // Filter by Category
  const comboProdsRes = await request({ path: '/api/products?category=dry-fruits-combos' });
  assert(comboProdsRes.status === 200, 'Filter by category returns 200');

  // Filter by Price Range
  const priceRangeRes = await request({ path: '/api/products?minPrice=300&maxPrice=800' });
  assert(priceRangeRes.status === 200, 'Filter by minPrice and maxPrice returns 200');

  // Sorting
  const sortAscRes = await request({ path: '/api/products?sort=price_asc' });
  const pList = sortAscRes.json?.data?.products || [];
  let isSorted = true;
  for (let i = 0; i < pList.length - 1; i++) {
    const minA = Math.min(...pList[i].variants.map((v) => v.price));
    const minB = Math.min(...pList[i + 1].variants.map((v) => v.price));
    if (minA > minB) {
      isSorted = false;
      break;
    }
  }
  assert(isSorted, 'sort=price_asc correctly orders products by variant price ascending');

  // Search
  const searchRes = await request({ path: '/api/products?search=almond' });
  assert(searchRes.status === 200, 'Product search returns 200');
  assert(searchRes.json?.data?.products?.length > 0, 'Found almond products in search');

  // Product Detail by Slug
  const firstProd = allProdsRes.json?.data?.products?.[0];
  const detailRes = await request({ path: `/api/products/${firstProd.slug}` });
  assert(detailRes.status === 200, `GET /api/products/${firstProd.slug} returns 200`);
  assert(detailRes.json?.data?.product?.reviewSummary !== undefined, 'Includes review rating summary breakdown');
  assert(Array.isArray(detailRes.json?.data?.relatedProducts), 'Includes related products recommendation');

  // No Cost Leak Check: verify cost price / internal margins are not in public response
  const bodyText = JSON.stringify(detailRes.json);
  assert(!bodyText.includes('costPrice') && !bodyText.includes('internalMargin'), 'No cost price or margin leakage in public catalog');

  // Bundles / Combos
  const bundlesRes = await request({ path: '/api/bundles' });
  assert(bundlesRes.status === 200, 'GET /api/bundles returns 200');
  assert(bundlesRes.json?.data?.length > 0, 'Active bundles returned');
  assert(bundlesRes.json?.data?.[0]?.discountPercent !== undefined, 'Bundle calculates customer discount percentage');

  // Search Suggestions
  const suggestRes = await request({ path: '/api/search/suggestions?q=mewa' });
  assert(suggestRes.status === 200, 'GET /api/search/suggestions returns 200');
  assert(suggestRes.json?.data?.products !== undefined, 'Suggestions return matching products array');

  // Bestsellers
  const bestRes = await request({ path: '/api/bestsellers' });
  assert(bestRes.status === 200, 'GET /api/bestsellers returns 200');
  assert(bestRes.json?.data?.length > 0, 'Bestsellers list returned');

  // Pincode Serviceability
  const pinRes = await request({ path: '/api/pincode/serviceability?pincode=400703' });
  assert(pinRes.status === 200, 'GET /api/pincode/serviceability returns 200');
  assert(pinRes.json?.data?.city === 'Navi Mumbai', 'Pincode 400703 resolves to Navi Mumbai');
  assert(pinRes.json?.data?.isServiceable === true, 'Pincode marked serviceable with estimated delivery days');

  // Test 5: Admin Product Management & Activity Logging
  console.log('\n▶ TEST GROUP 5: Admin Product CRUD & Activity Logs');

  // Fetch a store and category ID
  const foodsStore = storesRes.json?.data?.find((s) => s.slug === 'foods');
  const catRes = await request({
    path: `/api/admin/categories?storeId=${foodsStore.id}`,
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const firstCatId = catRes.json?.data?.[0]?.id;

  // Create Product via Admin API with 3 variants and 2 images
  const createProdRes = await request(
    {
      path: '/api/admin/products',
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    },
    {
      storeId: foodsStore.id,
      categoryId: firstCatId,
      name: `Special Kashmiri Walnut Reserve ${Date.now()}`,
      shortDescription: 'Grown in the high valleys of Kashmir, cold-shell cracked',
      description: 'Super high omega-3 fatty acids, light half-kernel walnuts with buttery crunch.',
      ingredients: '100% Kashmiri Walnut Kernels',
      storageInfo: 'Store in an airtight jar in the refrigerator for maximum crunch.',
      shelfLife: '6 Months',
      hsnCode: '0802',
      gstRate: 12,
      isFeatured: true,
      isBestSeller: true,
      isActive: true,
      dietaryTags: ['Vegan', 'Keto-Friendly', '100% Organic'],
      metaTitle: 'Buy Kashmiri Walnuts Online | Mewa Masala Ghar',
      metaDescription: 'Fresh Kashmiri light walnuts rich in omega-3. Direct from APMC Navi Mumbai.',
      images: [
        { url: 'https://images.unsplash.com/photo-1543208541-00429edb185e?auto=format&fit=crop&w=800&q=80', isPrimary: true, altText: 'Walnut front view' },
        { url: 'https://images.unsplash.com/photo-1508061252445-5350f3777130?auto=format&fit=crop&w=800&q=80', isPrimary: false, altText: 'Walnut bowl view' },
      ],
      variants: [
        { name: '250g Pouch', weightGrams: 250, packQty: 1, mrp: 450, price: 390, stockQty: 40, sku: `WAL-250-${Date.now()}` },
        { name: '500g Value Pack', weightGrams: 500, packQty: 1, mrp: 850, price: 740, stockQty: 25, sku: `WAL-500-${Date.now()}` },
        { name: 'Pack of 2 (500g x 2)', weightGrams: 1000, packQty: 2, mrp: 1700, price: 1420, stockQty: 15, sku: `WAL-P2-${Date.now()}` },
      ],
    }
  );
  assert(createProdRes.status === 201, 'Admin creates product with 3 variants and 2 images');
  const createdProd = createProdRes.json?.data;
  assert(createdProd?.variants?.length === 3, 'All 3 variants created successfully');
  assert(createdProd?.images?.length === 2, 'Both gallery images uploaded');

  // Verify product appears in public catalog
  const publicCheckRes = await request({ path: `/api/products/${createdProd.slug}` });
  assert(publicCheckRes.status === 200, 'Newly created product immediately appears on public catalog');
  assert(publicCheckRes.json?.data?.product?.variants?.length === 3, 'Public catalog sees all active variants');

  // Update Variant Stock & Verify Activity Log
  const variantToAdjust = createdProd.variants[0];
  const adjustStockRes = await request(
    {
      path: `/api/admin/variants/${variantToAdjust.id}/stock`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    },
    {
      stockQty: 85,
      reason: 'Physical inventory restock batch ARR-2026-09',
    }
  );
  assert(adjustStockRes.status === 200, 'Inventory stock level adjusted via admin endpoint');
  assert(adjustStockRes.json?.data?.stockQty === 85, 'Stock quantity updated to 85 units');

  // Verify Activity Log entry in database
  const activityLogsRes = await request({
    path: '/api/admin/activity-logs',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(activityLogsRes.status === 200, 'Activity logs endpoint returns 200');
  const stockLog = activityLogsRes.json?.data?.find(
    (log) => log.action === 'STOCK_ADJUSTMENT' && log.entityId === variantToAdjust.id
  );
  assert(!!stockLog, 'Activity log successfully recorded STOCK_ADJUSTMENT action');
  assert(stockLog?.metadata?.newStock === 85, 'Activity log records new stock quantity (85)');
  assert(stockLog?.metadata?.reason?.includes('Physical inventory restock'), 'Activity log records audit reason');

  // Export CSV
  const exportCsvRes = await request({
    path: '/api/admin/products/export/csv',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(exportCsvRes.status === 200, 'GET /api/admin/products/export/csv returns 200');
  assert(exportCsvRes.headers['content-type']?.includes('text/csv'), 'Content-Type is text/csv');
  assert(exportCsvRes.body.includes('Store,Category,Product Name'), 'CSV includes expected header row');
  assert(exportCsvRes.body.includes(variantToAdjust.sku), 'Exported CSV contains newly created SKU');

  // Import CSV with validation report
  const csvPayload = [
    'Store,Category,Product Name,Slug,Short Description,Description,Ingredients,Dietary Tags,Featured,BestSeller,Active,Storage Info,Shelf Life,Meta Title,Meta Description,SKU,Variant Name,Weight(g),Pack Qty,MRP,Selling Price,GST%,Stock',
    `foods,${firstCatId},"Organic Brown Flax Seeds",organic-brown-flax-seeds,"Rich in lignans","Cold milled golden flax seeds","100% Flax Seeds","Vegan",TRUE,FALSE,TRUE,"Dry place","12 Months","Flax Seeds","Buy Flax Seeds",MMG-FLAX-500,"500g Jar",500,1,280,220,5,60`,
  ].join('\r\n');

  const importRes = await request(
    {
      path: '/api/admin/products/import/csv',
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    },
    { csv: csvPayload }
  );
  assert(importRes.status === 200, 'Product CSV import endpoint returns 200');
  assert(importRes.json?.data?.imported >= 1, 'CSV validation report confirms 1 product SKU imported successfully');
  assert(importRes.json?.data?.failed === 0, '0 errors in well-formatted CSV test');

  // Clean up created test product
  await request({
    path: `/api/admin/products/${createdProd.id}`,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

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
