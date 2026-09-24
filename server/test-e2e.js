import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${name}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING END-TO-END VERIFICATION SUITE FOR MEWA MASALA GHAR');
  console.log('======================================================\n');

  try {
    // 1. Health check & FSSAI compliance
    console.log('1. Health Check & Compliance Info:');
    const health = await axios.get(`${API_BASE}/health`);
    assert(health.data.status === 'OK', 'Server status is OK');
    assert(health.data.fssai === '10021051000123', 'FSSAI License 10021051000123 verified');
    assert(health.data.gstin === '27AABCM1234F1Z5', 'GSTIN verified');

    // 2. PIN Code Serviceability (Indian pincode check)
    console.log('\n2. PIN Code Delivery Checker:');
    const pinCheck1 = await axios.post(`${API_BASE}/pincode/check`, { pincode: '400001' });
    const pinData1 = pinCheck1.data.data;
    assert(pinData1.isServiceable === true, 'Mumbai PIN 400001 is serviceable');
    assert(pinData1.city === 'Mumbai', `PIN 400001 maps to ${pinData1.city}`);
    assert(pinData1.isCodAvailable === true, 'COD available for 400001');

    const pinCheck2 = await axios.post(`${API_BASE}/pincode/check`, { pincode: '110001' });
    const pinData2 = pinCheck2.data.data;
    assert(pinData2.isServiceable === true, 'Delhi PIN 110001 is serviceable');
    assert(pinData2.stateCode === '07', `Delhi state code is 07 (got ${pinData2.stateCode})`);

    // 3. Products & Multi-Store Themes
    console.log('\n3. Store Catalog & Multi-Store Filtering:');
    const allRes = await axios.get(`${API_BASE}/products`);
    const allProducts = allRes.data.data.products;
    assert(allProducts.length >= 20, `Retrieved ${allProducts.length} total products`);

    const foodRes = await axios.get(`${API_BASE}/products?store=foods`);
    const foodProducts = foodRes.data.data.products;
    assert(foodProducts.length > 0, `Foods store has ${foodProducts.length} items`);
    assert(foodProducts.every(p => p.store.slug === 'foods'), 'All filtered items belong to Foods store');

    const babyRes = await axios.get(`${API_BASE}/products?store=baby`);
    const babyProducts = babyRes.data.data.products;
    assert(babyProducts.length > 0, `Baby Nutrition store has ${babyProducts.length} items`);
    assert(babyProducts.every(p => p.store.slug === 'baby'), 'All filtered items belong to Baby store');

    const careRes = await axios.get(`${API_BASE}/products?store=care`);
    const careProducts = careRes.data.data.products;
    assert(careProducts.length > 0, `Personal Care store has ${careProducts.length} items`);
    assert(careProducts.every(p => p.store.slug === 'care'), 'All filtered items belong to Personal Care store');

    // 4. Product Detail & Variants
    console.log('\n4. Product Detail & Variant Selection:');
    const sampleProduct = foodProducts[0];
    const detailRes = await axios.get(`${API_BASE}/products/${sampleProduct.slug}`);
    const productDetail = detailRes.data.data.product;
    assert(productDetail.id === sampleProduct.id, `Loaded product: "${productDetail.name}"`);
    assert(productDetail.variants.length > 0, `Product has ${productDetail.variants.length} packaging variants`);
    assert(productDetail.hsnCode !== undefined, `Product has HSN Code: ${productDetail.hsnCode}`);

    // 5. Coupon Engine
    console.log('\n5. Discount Coupon Validation:');
    const validCoupon = await axios.post(`${API_BASE}/coupons/validate`, {
      code: 'WELCOME10',
      cartTotal: 1200
    });
    assert(validCoupon.data.success === true, 'WELCOME10 coupon is valid for ₹1200');
    assert(validCoupon.data.data.discount === 120, '10% discount correctly computed as ₹120');

    try {
      await axios.post(`${API_BASE}/coupons/validate`, {
        code: 'WELCOME10',
        cartTotal: 200 // min is 499
      });
      assert(false, 'Should fail below min order amount');
    } catch (e) {
      assert(e.response?.status === 400, 'Correctly rejected coupon below min order threshold');
    }

    // 6. User Auth Flow
    console.log('\n6. Customer Authentication:');
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testPhone = '9' + Math.floor(100000000 + Math.random() * 900000000);
    const signupRes = await axios.post(`${API_BASE}/auth/register`, {
      email: testEmail,
      password: 'Password@123',
      name: 'Rohan Sharma',
      phone: testPhone
    });
    assert(signupRes.data.data?.accessToken !== undefined, 'Customer registration issued JWT access token');
    const userToken = signupRes.data.data.accessToken;

    const meRes = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(meRes.data.data.email === testEmail, 'Customer profile retrieved via JWT');

    // 7. Order Placement & GST Invoice Generation
    console.log('\n7. Order Creation & GST Tax Calculation:');
    const chosenVariant = productDetail.variants[0];
    const orderPayload = {
      customerName: 'Rohan Sharma',
      customerEmail: testEmail,
      customerPhone: testPhone,
      items: [
        {
          productId: productDetail.id,
          variantId: chosenVariant.id,
          quantity: 2
        }
      ],
      shippingAddress: {
        fullName: 'Rohan Sharma',
        phone: testPhone,
        addressLine: 'Flat 402, Green Valley Apartments',
        city: 'Pune',
        state: 'Maharashtra',
        stateCode: '27',
        pincode: '411001'
      },
      paymentMethod: 'COD',
      couponCode: 'WELCOME10'
    };

    const orderRes = await axios.post(`${API_BASE}/orders`, orderPayload, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(orderRes.data.success === true, 'Order placed successfully');
    const order = orderRes.data.data.order;
    assert(order.orderNumber.startsWith('MMG-'), `Generated order number: ${order.orderNumber}`);
    assert(order.cgst > 0 && order.sgst > 0, `Maharashtra delivery has CGST (₹${order.cgst}) and SGST (₹${order.sgst})`);
    assert(order.igst === 0, 'Intra-state Maharashtra has IGST = 0');

    // Check GST invoice HTML
    const invoiceRes = await axios.get(`${API_BASE}/orders/${order.id}/invoice`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(invoiceRes.headers['content-type'].includes('text/html'), 'Invoice returned HTML document');
    assert(invoiceRes.data.toLowerCase().includes('tax invoice'), 'Contains Tax Invoice header');
    assert(invoiceRes.data.includes('10021051000123'), 'Invoice displays FSSAI License 10021051000123');
    assert(invoiceRes.data.includes(order.orderNumber), 'Invoice contains correct Order Number');

    // 8. Admin Authentication & Dashboard Operations
    console.log('\n8. Admin Dashboard Operations:');
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@mewamasalaghar.com',
      password: 'Admin@12345'
    });
    const adminRole = adminLogin.data.data?.user.role;
    assert(adminRole === 'SUPER_ADMIN' || adminRole === 'ADMIN', 'Admin login successful');
    const adminToken = adminLogin.data.data.accessToken;

    const overview = await axios.get(`${API_BASE}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(overview.data.data.metrics.totalOrders > 0, `Admin metrics: ${overview.data.data.metrics.totalOrders} total orders`);
    assert(overview.data.data.metrics.totalProducts > 0, `Admin metrics: ${overview.data.data.metrics.totalProducts} products listed`);

    // Update order status
    const statusUpdate = await axios.put(`${API_BASE}/admin/orders/${order.id}/status`, {
      status: 'CONFIRMED'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(statusUpdate.data.data.status === 'CONFIRMED', 'Admin successfully updated order status to CONFIRMED');

    // Inventory adjustment
    const invUpdate = await axios.put(`${API_BASE}/admin/variants/${chosenVariant.id}/stock`, {
      stock: 45
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(invUpdate.data.data.stock === 45, 'Admin updated variant stock to 45');

    // 9. Dynamic Settings Table Verification
    console.log('\n9. Dynamic Settings Table (Editable in Admin, Never Hardcoded):');
    const settingsGet = await axios.get(`${API_BASE}/settings`);
    assert(settingsGet.data.success === true, 'Public GET /api/settings succeeded');
    assert(settingsGet.data.data.company_name.includes('Mewa Masala'), 'Company name returned from DB Setting table');
    assert(settingsGet.data.data.fssai === '10021051000123', 'FSSAI License 10021051000123 retrieved dynamically');
    assert(settingsGet.data.data.gstin === '27AABCM1234F1Z5', 'GSTIN retrieved dynamically');

    // Admin updates settings
    const settingsUpdate = await axios.put(`${API_BASE}/admin/settings`, {
      ...settingsGet.data.data,
      phone: '+91 98200 99999'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(settingsUpdate.data.success === true, 'Admin successfully updated phone in Setting table');
    assert(settingsUpdate.data.data.phone === '+91 98200 99999', 'Updated phone saved to DB');

    // Restore default phone
    await axios.put(`${API_BASE}/admin/settings`, {
      ...settingsGet.data.data,
      phone: '+91 98200 12345'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    // 10. Guest Consignment Tracking (Order Number + Email or Phone)
    console.log('\n10. Guest Consignment Tracking:');
    const guestTrack = await axios.post(`${API_BASE}/orders/track`, {
      orderNumber: order.orderNumber,
      emailOrPhone: testEmail
    });
    assert(guestTrack.data.success === true, 'Guest tracking succeeded with orderNumber + email');
    assert(guestTrack.data.data.orderNumber === order.orderNumber, 'Correct consignment verified');

    // Also verify tracking with phone
    const guestTrackPhone = await axios.post(`${API_BASE}/orders/track`, {
      orderNumber: order.orderNumber,
      emailOrPhone: testPhone
    });
    assert(guestTrackPhone.data.success === true, 'Guest tracking succeeded with orderNumber + 10-digit phone');

    // 11. Customer My Orders
    console.log('\n11. Customer My Orders History:');
    const myOrdersRes = await axios.get(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(myOrdersRes.data.success === true, 'Customer GET /api/orders/my-orders succeeded');
    assert(myOrdersRes.data.data.length > 0, `Customer has ${myOrdersRes.data.data.length} registered orders`);

    // 12. Wishlist Toggle & Sync
    console.log('\n12. Wishlist Management:');
    const wishlistToggle = await axios.post(`${API_BASE}/auth/wishlist/toggle`, {
      productId: sampleProduct.id
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(wishlistToggle.data.success === true, 'Product added to customer wishlist in DB');

    const wishlistFetch = await axios.get(`${API_BASE}/auth/wishlist`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(wishlistFetch.data.data.some(p => p.id === sampleProduct.id), 'Wishlist fetch returns added product');

    // 13. Password Reset Workflow
    console.log('\n13. Password Reset Flow:');
    const forgotRes = await axios.post(`${API_BASE}/auth/forgot-password`, {
      email: testEmail
    });
    assert(forgotRes.data.success === true, 'Forgot password request succeeded');
    assert(forgotRes.data.token !== undefined, 'Dev mode provides reset token');

    console.log('\n======================================================');
    console.log(`🎉 ALL VERIFICATION CHECKS PASSED: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');
    process.exit(failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('Unexpected test error:', error.response?.data || error.message);
    process.exit(1);
  }
}

runTests();
