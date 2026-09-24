import { Router } from 'express';
import {
  createOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
  getOrderById,
  getInvoiceHtml,
  trackOrder,
  getMyOrders,
  getMyOrderDetail,
  cancelOrder,
  retryPayment,
} from '../controllers/orderController';
import { optionalAuth, authenticate, rateLimitAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createOrderSchema,
  verifyRazorpayPaymentSchema,
  trackOrderSchema,
  cancelOrderSchema,
  retryPaymentSchema,
} from '../schemas/orderSchemas';

const router = Router();

// Rate limit for tracking endpoint (10 attempts per 15 min)
const trackingLimiter = rateLimitAuth(10, 15);

// Public: Create order (guests and logged-in users)
router.post('/', optionalAuth, validate(createOrderSchema), createOrder);

// Public: Track order (by order number + email/phone or tracking token)
router.post('/track', trackingLimiter, validate(trackOrderSchema), trackOrder);

// Public: Verify Razorpay payment
router.post('/verify-payment', validate(verifyRazorpayPaymentSchema), verifyRazorpayPayment);

// Public: Handle payment failure
router.post('/payment-failed', handlePaymentFailure);

// Public: Retry payment for failed orders
router.post('/retry-payment', validate(retryPaymentSchema), retryPayment);

// Authenticated: Get my orders (paginated)
router.get('/my-orders', authenticate, getMyOrders);

// Authenticated: Get my single order detail
router.get('/my-orders/:orderNumber', authenticate, getMyOrderDetail);

// Authenticated/Public: Cancel order
router.post('/:id/cancel', optionalAuth, validate(cancelOrderSchema), cancelOrder);

// Public: Get order by id/orderNumber/trackingToken
router.get('/:id', optionalAuth, getOrderById);

// Public: Get invoice HTML
router.get('/:id/invoice', getInvoiceHtml);

export default router;
