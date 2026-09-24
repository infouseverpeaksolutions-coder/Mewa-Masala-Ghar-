import { Router } from 'express';
import {
  getDashboardStats,
  getAdminStores,
  createAdminStore,
  updateAdminStore,
  deleteAdminStore,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductVariant,
  updateVariant,
  deleteVariant,
  updateVariantStock,
  getInventory,
  addProductImage,
  reorderProductImages,
  deleteProductImage,
  setPrimaryProductImage,
  getAdminBundles,
  createAdminBundle,
  updateAdminBundle,
  deleteAdminBundle,
  exportProductsCSV,
  importProductsCSV,
  getAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  deleteAdminBanner,
  getAllCustomers,
  getActivityLogs,
} from '../controllers/adminController';
import { getCoupons, createCoupon } from '../controllers/couponController';
import { getSettings, updateSettings } from '../controllers/settingController';
import { adminGetOrders, adminGetOrderDetail, adminUpdateOrderStatus } from '../controllers/webhookController';
import { authenticate, requireAdmin, requireStaffPermission } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();

// Base protection: must be logged in with an Admin/Manager/Staff role
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Orders module
router.get('/orders', requireStaffPermission('orders'), adminGetOrders);
router.get('/orders/:id', requireStaffPermission('orders'), adminGetOrderDetail);
router.put('/orders/:id/status', requireStaffPermission('orders'), adminUpdateOrderStatus);

// Stores CRUD (Products module)
router.get('/stores', requireStaffPermission('products'), getAdminStores);
router.post('/stores', requireStaffPermission('products'), createAdminStore);
router.put('/stores/:id', requireStaffPermission('products'), updateAdminStore);
router.delete('/stores/:id', requireStaffPermission('products'), deleteAdminStore);

// Categories CRUD (Products module)
router.get('/categories', requireStaffPermission('products'), getAdminCategories);
router.post('/categories', requireStaffPermission('products'), createAdminCategory);
router.put('/categories/:id', requireStaffPermission('products'), updateAdminCategory);
router.delete('/categories/:id', requireStaffPermission('products'), deleteAdminCategory);

// Products CRUD (Products module)
router.get('/products', requireStaffPermission('products'), getAdminProducts);
router.get('/products/export/csv', requireStaffPermission('products'), exportProductsCSV);
router.post('/products/import/csv', requireStaffPermission('products'), upload.single('file'), importProductsCSV);
router.get('/products/:id', requireStaffPermission('products'), getAdminProductById);
router.post('/products', requireStaffPermission('products'), createProduct);
router.put('/products/:id', requireStaffPermission('products'), updateProduct);
router.delete('/products/:id', requireStaffPermission('products'), deleteProduct);

// Variants CRUD
router.post('/products/:id/variants', requireStaffPermission('products'), addProductVariant);
router.put('/variants/:variantId', requireStaffPermission('products'), updateVariant);
router.delete('/variants/:variantId', requireStaffPermission('products'), deleteVariant);

// Product Images
router.post('/products/:id/images', requireStaffPermission('products'), upload.single('image'), addProductImage);
router.put('/products/:id/images/reorder', requireStaffPermission('products'), reorderProductImages);
router.delete('/images/:imageId', requireStaffPermission('products'), deleteProductImage);
router.put('/images/:imageId/primary', requireStaffPermission('products'), setPrimaryProductImage);

// Combos / Bundles
router.get('/bundles', requireStaffPermission('products'), getAdminBundles);
router.post('/bundles', requireStaffPermission('products'), createAdminBundle);
router.put('/bundles/:id', requireStaffPermission('products'), updateAdminBundle);
router.delete('/bundles/:id', requireStaffPermission('products'), deleteAdminBundle);

// Inventory & Stock adjustments (Inventory module)
router.get('/inventory', requireStaffPermission('inventory'), getInventory);
router.put('/variants/:variantId/stock', requireStaffPermission('inventory'), updateVariantStock);

// Banners (Homepage / Marketing module)
router.get('/banners', requireStaffPermission('settings'), getAdminBanners);
router.post('/banners', requireStaffPermission('settings'), createAdminBanner);
router.put('/banners/:id', requireStaffPermission('settings'), updateAdminBanner);
router.delete('/banners/:id', requireStaffPermission('settings'), deleteAdminBanner);

// Customers (Users module)
router.get('/customers', getAllCustomers);

// Coupons (Marketing module)
router.get('/coupons', requireStaffPermission('marketing'), getCoupons);
router.post('/coupons', requireStaffPermission('marketing'), createCoupon);

// Settings
router.get('/settings', requireStaffPermission('settings'), getSettings);
router.put('/settings', requireStaffPermission('settings'), updateSettings);

// Activity Logs
router.get('/activity-logs', getActivityLogs);

export default router;

