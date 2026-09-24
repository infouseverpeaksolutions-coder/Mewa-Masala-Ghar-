/**
 * Phase 4 Test Suite: Checkout, Payments, Orders, Tracking, Shipping, and Invoices
 * Run with: node test-phase4.js
 */

const http = require('http');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:5000/api';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-test-suite': 'true', // Bypass rate limiters in tests
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = body;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('\n==================================================');
  console.log('  🧪 STARTING PHASE 4 INTEGRATION TEST SUITE');
  console.log('==================================================\n');

  try {
    // 0. Check Health
    const health = await request('/health');
    assert(health.status === 200, 'Server health endpoint reachable');

    // 1. Authenticate Admin and Customer
    console.log('\n--- 1. Authentication for Testing ---');
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: { identifier: 'admin@mewamasalaghar.com', password: 'Admin@12345' },
    });
    assert(adminLogin.status === 200, 'Admin logged in successfully');
    const adminToken = adminLogin.data?.data?.accessToken;

    const custLogin = await request('/auth/login', {
      method: 'POST',
      body: { identifier: 'aarav@example.com', password: 'Customer@12345' },
    });
    assert(custLogin.status === 200, 'Customer logged in successfully');
    const custToken = custLogin.data?.data?.accessToken;

    // 2. Fetch a Product and Variant to test with
    console.log('\n--- 2. Catalog Discovery ---');
    const productsRes = await request('/products?limit=5');
    assert(productsRes.status === 200, 'Products listed');
    const products = productsRes.data?.data?.products || [];
    assert(products.length > 0, 'Found at least one product');

    const testProduct = products[0];
    assert(testProduct.variants && testProduct.variants.length > 0, 'Test product has variants');
    const testVariant = testProduct.variants[0];
    const originalStock = testVariant.stockQty;
    console.log(`     Using variant: ${testVariant.name} (SKU: ${testVariant.sku}, Price: ₹${testVariant.price}, Stock: ${originalStock})`);

    // 3. Price Recalculation & Server Authority
    console.log('\n--- 3. Price Recalculation & Server Authority ---');
    // Client attempts to send forged price of ₹1
    const forgedOrderPayload = {
      customerName: 'Test Guest',
      customerEmail: 'guest.test@example.com',
      customerPhone: '9820011111',
      shippingAddress: {
        addressLine: '123 Market Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        stateCode: '27',
        pincode: '400001',
      },
      paymentMethod: 'COD',
      items: [
        {
          productId: testProduct.id,
          variantId: testVariant.id,
          quantity: 2,
          price: 1, // Forged client price!
        },
      ],
    };

    const forgedRes = await request('/orders', {
      method: 'POST',
      body: forgedOrderPayload,
    });
    assert(forgedRes.status === 201, 'Order created successfully with server calculation');
    const createdOrder = forgedRes.data?.data?.order || forgedRes.data?.order;
    assert(createdOrder != null, 'Order object returned');

    // Expected total: variant.price * 2 + shipping
    const expectedSubtotal = testVariant.price * 2;
    const expectedShipping = expectedSubtotal >= 499 ? 0 : 50;
    const expectedTotal = expectedSubtotal + expectedShipping;
    assert(
      Math.abs(Number(createdOrder.totalAmount) - expectedTotal) < 0.01,
      `Server rejected forged client price (Expected ₹${expectedTotal}, got ₹${createdOrder.totalAmount})`
    );

    // Verify orderNumber format: MMG-YYYY-XXXXXX
    const orderNumRegex = /^MMG-\d{4}-\d{6}$/;
    assert(orderNumRegex.test(createdOrder.orderNumber), `Order number matches MMG-YYYY-XXXXXX format: ${createdOrder.orderNumber}`);
    assert(createdOrder.trackingToken != null && createdOrder.trackingToken.length > 10, 'Order has unique trackingToken');

    // 4. Stock Decrement Verification
    console.log('\n--- 4. Stock Decrement Verification ---');
    const variantCheckRes = await request(`/products/${testProduct.slug}`);
    const updatedVariants = variantCheckRes.data?.data?.product?.variants || variantCheckRes.data?.data?.variants || [];
    const updatedVariant = updatedVariants.find((v) => v.id === testVariant.id);
    assert(
      updatedVariant && updatedVariant.stockQty === originalStock - 2,
      `Stock decremented from ${originalStock} to ${updatedVariant?.stockQty}`
    );

    // 5. Insufficient Stock Handling
    console.log('\n--- 5. Insufficient Stock Protection ---');
    const excessOrderPayload = {
      ...forgedOrderPayload,
      items: [
        {
          productId: testProduct.id,
          variantId: testVariant.id,
          quantity: 999999, // Impossible quantity
        },
      ],
    };
    const excessRes = await request('/orders', {
      method: 'POST',
      body: excessOrderPayload,
    });
    assert(excessRes.status === 400, 'Order with insufficient stock rejected with 400 Bad Request');

    // 6. Razorpay Flow (Simulated & Signature Verification)
    console.log('\n--- 6. Online Payment (Razorpay Flow) ---');
    const razorpayPayload = {
      ...forgedOrderPayload,
      customerEmail: 'razorpay.test@example.com',
      paymentMethod: 'RAZORPAY',
      items: [
        {
          productId: testProduct.id,
          variantId: testVariant.id,
          quantity: 1,
        },
      ],
    };
    const rzpOrderRes = await request('/orders', {
      method: 'POST',
      body: razorpayPayload,
    });
    assert(rzpOrderRes.status === 201, 'Razorpay order created');
    const rzpOrder = rzpOrderRes.data?.data?.order || rzpOrderRes.data?.order;
    const rzpOrderId = rzpOrderRes.data?.razorpayOrderId || rzpOrderRes.data?.data?.razorpayOrderId || rzpOrder?.razorpayOrderId;
    assert(rzpOrderId != null, `Razorpay order ID generated: ${rzpOrderId}`);
    assert(rzpOrder.paymentStatus === 'PENDING', 'Initial payment status is PENDING');

    // Verify simulated payment verification endpoint
    const verifyRes = await request('/orders/verify-payment', {
      method: 'POST',
      body: {
        orderId: rzpOrder.id,
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: 'pay_simulated_test_' + Date.now(),
        razorpaySignature: 'simulated_signature_hash',
      },
    });
    assert(verifyRes.status === 200, 'Simulated Razorpay payment verification succeeded');
    const verifiedOrder = verifyRes.data?.data || verifyRes.data?.order;
    assert(verifiedOrder?.paymentStatus === 'PAID', 'Payment status updated to PAID');

    // 7. Webhook Idempotency Test
    console.log('\n--- 7. Webhook Idempotency ---');
    // Send simulated webhook for captured payment
    const webhookPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_webhook_test_' + Date.now(),
            order_id: rzpOrderId,
            status: 'captured',
          },
        },
      },
    });

    const secret = 'mewamasalasecretkey2026';
    const hmac = crypto.createHmac('sha256', secret).update(webhookPayload).digest('hex');

    const webhookRes1 = await request('/webhooks/razorpay', {
      method: 'POST',
      headers: { 'x-razorpay-signature': hmac },
      body: webhookPayload,
    });
    assert(webhookRes1.status === 200, 'Razorpay webhook processed');

    // Second duplicate webhook call (idempotency check)
    const webhookRes2 = await request('/webhooks/razorpay', {
      method: 'POST',
      headers: { 'x-razorpay-signature': hmac },
      body: webhookPayload,
    });
    assert(webhookRes2.status === 200, 'Repeated Razorpay webhook returned 200 (idempotent)');

    // 8. Public Order Tracking (Credentials & Token)
    console.log('\n--- 8. Order Tracking & Privacy ---');
    // Track via tracking token
    const trackTokenRes = await request('/orders/track', {
      method: 'POST',
      body: { trackingToken: createdOrder.trackingToken },
    });
    assert(trackTokenRes.status === 200, 'Track order via trackingToken succeeded');
    const trackedData = trackTokenRes.data?.data || trackTokenRes.data?.order;
    assert(trackedData?.orderNumber === createdOrder.orderNumber, 'Tracked order matches order number');

    // Track via orderNumber + email
    const trackCredsRes = await request('/orders/track', {
      method: 'POST',
      body: {
        orderNumber: createdOrder.orderNumber,
        emailOrPhone: 'guest.test@example.com',
      },
    });
    assert(trackCredsRes.status === 200, 'Track order via OrderNumber + Email succeeded');

    // Track with WRONG credentials (security check: generic error)
    const trackWrongRes = await request('/orders/track', {
      method: 'POST',
      body: {
        orderNumber: createdOrder.orderNumber,
        emailOrPhone: 'wrong.person@example.com',
      },
    });
    assert(
      trackWrongRes.status === 400 || trackWrongRes.status === 403 || trackWrongRes.status === 404,
      'Track order with wrong email correctly rejected'
    );

    // 9. Admin Status Transitions & Shipping Assignment
    console.log('\n--- 9. Admin Order Lifecycle & Shipping ---');
    // Invalid transition test: PLACED -> DELIVERED (skipping CONFIRMED/PACKED/SHIPPED)
    const invalidTransRes = await request(`/admin/orders/${createdOrder.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'DELIVERED' },
    });
    assert(invalidTransRes.status === 400, 'Admin cannot jump directly from PLACED to DELIVERED');

    // Step 1: PLACED -> CONFIRMED
    const step1Res = await request(`/admin/orders/${createdOrder.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'CONFIRMED', comment: 'Stock verified in warehouse' },
    });
    assert(step1Res.status === 200, 'Transition PLACED -> CONFIRMED succeeded');

    // Step 2: CONFIRMED -> PACKED
    const step2Res = await request(`/admin/orders/${createdOrder.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'PACKED', comment: 'Packed in tamper-proof box' },
    });
    assert(step2Res.status === 200, 'Transition CONFIRMED -> PACKED succeeded');

    // Step 3: PACKED -> SHIPPED (with courier details)
    const step3Res = await request(`/admin/orders/${createdOrder.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        status: 'SHIPPED',
        courier: 'Delhivery',
        awbNo: 'DEL-2026-999888',
        trackingUrl: 'https://delhivery.com/track/DEL-2026-999888',
        expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
    assert(step3Res.status === 200, 'Transition PACKED -> SHIPPED succeeded with AWB and courier');

    // Step 4: SHIPPED -> OUT_FOR_DELIVERY
    const step4Res = await request(`/admin/orders/${createdOrder.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'OUT_FOR_DELIVERY', comment: 'Out for doorstep delivery' },
    });
    assert(step4Res.status === 200, 'Transition SHIPPED -> OUT_FOR_DELIVERY succeeded');

    // Step 5: OUT_FOR_DELIVERY -> DELIVERED
    const step5Res = await request(`/admin/orders/${createdOrder.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'DELIVERED', comment: 'Delivered and signed by customer' },
    });
    assert(step5Res.status === 200, 'Transition OUT_FOR_DELIVERY -> DELIVERED succeeded');

    // 10. Order Cancellation & Stock Restoration
    console.log('\n--- 10. Order Cancellation & Stock Restoration ---');
    // Create an order to cancel
    const cancelOrderRes = await request('/orders', {
      method: 'POST',
      body: {
        ...forgedOrderPayload,
        customerEmail: 'cancel.test@example.com',
        items: [
          {
            productId: testProduct.id,
            variantId: testVariant.id,
            quantity: 3,
          },
        ],
      },
    });
    assert(cancelOrderRes.status === 201, 'Order to cancel created (quantity 3)');
    const orderToCancel = cancelOrderRes.data?.data?.order || cancelOrderRes.data?.order;

    // Check intermediate stock
    const preCancelRes = await request(`/products/${testProduct.slug}`);
    const preVariants = preCancelRes.data?.data?.product?.variants || preCancelRes.data?.data?.variants || [];
    const preCancelStock = preVariants.find((v) => v.id === testVariant.id)?.stockQty;

    // Cancel the order
    const doCancelRes = await request(`/orders/${orderToCancel.id}/cancel`, {
      method: 'POST',
      body: { trackingToken: orderToCancel.trackingToken, reason: 'Customer requested cancellation' },
    });
    assert(doCancelRes.status === 200, 'Order successfully cancelled');

    // Verify stock is restored (+3)
    const postCancelRes = await request(`/products/${testProduct.slug}`);
    const postVariants = postCancelRes.data?.data?.product?.variants || postCancelRes.data?.data?.variants || [];
    const postCancelStock = postVariants.find((v) => v.id === testVariant.id)?.stockQty;
    assert(
      postCancelStock === preCancelStock + 3,
      `Stock correctly restored by 3 (from ${preCancelStock} to ${postCancelStock})`
    );

    // 11. HTML Tax Invoice Verification
    console.log('\n--- 11. GST Tax Invoice Generation ---');
    const invoiceRes = await request(`/orders/${createdOrder.id}/invoice`);
    assert(invoiceRes.status === 200, 'GST Invoice generated successfully');
    assert(
      typeof invoiceRes.data === 'string' &&
        invoiceRes.data.includes('TAX INVOICE') &&
        invoiceRes.data.includes(createdOrder.orderNumber),
      'Invoice HTML contains TAX INVOICE header and order number'
    );

    // 12. Authenticated User Orders & History
    console.log('\n--- 12. Authenticated User Order History ---');
    // Create order as logged-in customer
    const userOrderRes = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${custToken}` },
      body: {
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav@example.com',
        customerPhone: '9820012345',
        shippingAddress: {
          addressLine: 'Flat 402, Greenfield Residency',
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
            quantity: 1,
          },
        ],
      },
    });
    assert(userOrderRes.status === 201, 'User order created');

    const myOrdersRes = await request('/orders/my-orders', {
      headers: { Authorization: `Bearer ${custToken}` },
    });
    assert(myOrdersRes.status === 200, 'Customer fetched order list');
    const myOrdersList = myOrdersRes.data?.data?.orders || myOrdersRes.data?.data || myOrdersRes.data;
    assert(Array.isArray(myOrdersList) && myOrdersList.length > 0, 'Customer has at least one order in history');

    // Summary
    console.log('\n==================================================');
    console.log(`  🎉 PHASE 4 TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
    console.log('==================================================\n');

    process.exit(testsFailed > 0 ? 1 : 0);
  } catch (err) {
    console.error('\n❌ Unhandled error during test run:', err);
    process.exit(1);
  }
}

runTests();
