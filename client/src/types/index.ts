export interface Store {
  id: string;
  slug: 'foods' | 'baby' | 'care' | string;
  name: string;
  tagline?: string;
  description?: string;
  themeKey: 'theme-foods' | 'theme-baby' | 'theme-care' | string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  fssaiNumber?: string;
  categories?: Category[];
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  weightGrams?: number;
  mrp: number;
  price: number;
  stock: number;
  sku: string;
  isDefault: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
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
  nutritionFacts?: Record<string, any>;
  benefits?: string[];
  howToUse?: string;
  safetyNotice?: string;
  fssaiNumber?: string;
  hsnCode: string;
  gstRate: number;
  isCombo: boolean;
  comboCount?: number;
  dietaryTags?: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  store?: Store;
  category?: Category;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface UserAddress {
  id?: string;
  name: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  addresses?: UserAddress[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  hsnCode: string;
  gstRate: number;
  gstAmount: number;
  subtotal: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  invoiceNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: UserAddress;
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
  cgst: number;
  sgst: number;
  igst: number;
  shippingAmount: number;
  totalAmount: number;
  couponCode?: string;
  trackingToken?: string;
  trackingNumber?: string;
  courierName?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  stateCode: string;
  isServiceable: boolean;
  estimatedDays: number;
  isCodAvailable: boolean;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  message: string;
}
