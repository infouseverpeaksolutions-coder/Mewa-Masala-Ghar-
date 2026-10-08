import { Router } from 'express';
import {
  checkServiceability,
  shipOrderWithShiprocket,
  assignAwb,
  generatePickup,
  generateLabel,
  generateManifest,
  printManifest,
  printInvoice,
  trackShipment,
} from '../controllers/shippingController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// ==========================================
// Public Customer Operations
// ==========================================

// Check pincode serviceability & rates
router.get('/serviceability', checkServiceability);
router.post('/serviceability', checkServiceability);

// Live AWB tracking
router.get('/track/:awbCode', trackShipment);

// ==========================================
// Protected Admin Operations
// ==========================================

// Create order and dispatch through Shiprocket
router.post('/orders/:orderId/ship', authenticate, requireAdmin, shipOrderWithShiprocket);

// Assign AWB
router.post('/courier/assign/awb', authenticate, requireAdmin, assignAwb);

// Generate courier pickup
router.post('/courier/generate/pickup', authenticate, requireAdmin, generatePickup);

// Generate shipping label PDF URL
router.post('/courier/generate/label', authenticate, requireAdmin, generateLabel);

// Manifest generate & print
router.post('/manifests/generate', authenticate, requireAdmin, generateManifest);
router.post('/manifests/print', authenticate, requireAdmin, printManifest);

// Print invoice PDF URL
router.post('/orders/print/invoice', authenticate, requireAdmin, printInvoice);

export default router;
