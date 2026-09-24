import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:5174',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'mewa_masala_jwt_access_secret_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'mewa_masala_jwt_refresh_secret_2026',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  COMPANY_NAME: process.env.COMPANY_NAME || 'Mewa Masala Ghar',
  COMPANY_GSTIN: process.env.COMPANY_GSTIN || '27AABCM1234F1Z5',
  COMPANY_FSSAI: process.env.COMPANY_FSSAI || '10021051000123',
  COMPANY_STATE_CODE: process.env.COMPANY_STATE_CODE || '27',
  COMPANY_ADDRESS: process.env.COMPANY_ADDRESS || 'Shop 12-14, Heritage Spices Market, APMC Complex, Vashi, Navi Mumbai, Maharashtra 400703',
  COMPANY_EMAIL: process.env.COMPANY_EMAIL || 'support@mewamasalaghar.com',
  COMPANY_PHONE: process.env.COMPANY_PHONE || '+91 98200 12345',
  
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_mewamasala2026',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'mewamasalasecretkey2026',
  
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'Mewa Masala Ghar <support@mewamasalaghar.com>'
};
