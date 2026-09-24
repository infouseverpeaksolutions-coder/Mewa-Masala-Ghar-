import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import pincodeRoutes from './routes/pincodeRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import uploadRoutes from './routes/uploadRoutes';
import couponRoutes from './routes/couponRoutes';
import settingRoutes from './routes/settingRoutes';
import cartRoutes from './routes/cartRoutes';
import reviewRoutes from './routes/reviewRoutes';
import publicRoutes from './routes/publicRoutes';
import webhookRoutes from './routes/webhookRoutes';

const app = express();

// Security and middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: [ENV.CLIENT_URL, ENV.ADMIN_URL, 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static uploads folder for dev fallback
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    brand: ENV.COMPANY_NAME,
    fssai: ENV.COMPANY_FSSAI,
    gstin: ENV.COMPANY_GSTIN,
    timestamp: new Date().toISOString(),
  });
});

import {
  getStores,
  getCategories,
  getBundles,
  getSearchSuggestions,
  getBestsellers,
} from './controllers/productController';

// Direct Catalog Aliases
app.get('/api/stores', getStores);
app.get('/api/categories', getCategories);
app.get('/api/categories/tree', getCategories);
app.get('/api/bundles', getBundles);
app.get('/api/search/suggestions', getSearchSuggestions);
app.get('/api/bestsellers', getBestsellers);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pincode', pincodeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', publicRoutes);
app.use('/api/webhooks', webhookRoutes);


// Error handling middleware
app.use(errorHandler);

const PORT = parseInt(ENV.PORT, 10) || 5000;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  🌿 Mewa Masala Ghar Backend API Started`);
  console.log(`  🌐 Server listening on http://localhost:${PORT}`);
  console.log(`  📜 FSSAI Lic. No.: ${ENV.COMPANY_FSSAI}`);
  console.log(`  🧾 GSTIN: ${ENV.COMPANY_GSTIN}`);
  console.log(`==================================================`);
});
