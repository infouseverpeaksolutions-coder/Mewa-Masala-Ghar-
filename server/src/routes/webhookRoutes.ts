import { Router } from 'express';
import { razorpayWebhook, shippingWebhook } from '../controllers/webhookController';

const router = Router();

// Razorpay payment webhooks (no auth - signature verified in handler)
router.post('/razorpay', razorpayWebhook);

// Shipping provider webhooks (no auth - validated in handler)
router.post('/shipping', shippingWebhook);

export default router;
