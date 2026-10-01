export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN';
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  weightGrams?: number | null;
  mrp: number;
  price: number;
  stock?: number;
  stockQty?: number;
  packQty?: number;
  gstPercent?: number;
  sku: string;
  isDefault: boolean;
  isActive?: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  ingredients?: string;
  storageInfo?: string;
  shelfLife?: string;
  fssaiNumber?: string;
  hsnCode: string;
  gstRate: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isActive?: boolean;
  dietaryTags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  rating: number;
  reviewCount: number;
  images: Array<{ id?: string; url: string; isPrimary: boolean; altText?: string }>;
  variants: ProductVariant[];
  brandId?: string;
  store?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string; primaryColor?: string; accentColor?: string };
  category?: { id: string; name: string; slug: string };
}


export interface OrderItem {
  id: string;
  productName: string;
  variantName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  hsnCode: string;
  gstRate: number;
  gstAmount: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  invoiceNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  shippingAddressSnapshot?: any;
  customerGstin?: string;
  status:
    | 'PENDING'
    | 'PLACED'
    | 'CONFIRMED'
    | 'PACKED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURNED';
  paymentMethod: 'COD' | 'RAZORPAY';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  shippingAmount: number;
  totalAmount: number;
  trackingNumber?: string;
  courierName?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  _count?: { orders: number };
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt?: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface Banner {
  id: string;
  storeId?: string | null;
  title: string;
  subtitle?: string | null;
  ctaText?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  store?: { id: string; name: string; slug: string } | null;
}

