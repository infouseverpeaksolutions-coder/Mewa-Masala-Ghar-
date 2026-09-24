import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Full name is required'),
    customerEmail: z.string().email('Valid email is required'),
    customerPhone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
    shippingAddress: z.object({
      addressLine: z.string().min(5, 'Address line is required'),
      landmark: z.string().optional(),
      city: z.string().min(2, 'City is required'),
      state: z.string().min(2, 'State is required'),
      stateCode: z.string().default('27'),
      pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit Indian PIN code'),
    }),
    billingAddress: z.object({
      addressLine: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    customerGstin: z.string().optional(),
    items: z.array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive('Quantity must be at least 1'),
      })
    ).min(1, 'Cart cannot be empty'),
    paymentMethod: z.enum(['COD', 'RAZORPAY']),
    couponCode: z.string().optional(),
    customerNotes: z.string().optional(),
    addressId: z.string().optional(), // For saved addresses
  }),
});

export const verifyRazorpayPaymentSchema = z.object({
  body: z.object({
    orderId: z.string(),
    razorpayOrderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string(),
  }),
});

export const trackOrderSchema = z.object({
  body: z.object({
    orderNumber: z.string().optional(),
    emailOrPhone: z.string().optional(),
    trackingToken: z.string().optional(),
  }).refine(
    (data) => data.trackingToken || (data.orderNumber && data.emailOrPhone),
    { message: 'Provide either trackingToken or both orderNumber and email/phone' }
  ),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      'PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED',
      'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED',
    ]),
    comment: z.string().optional(),
    courier: z.string().optional(),
    awbNo: z.string().optional(),
    trackingUrl: z.string().optional(),
    expectedDelivery: z.string().optional(),
  }),
});

export const cancelOrderSchema = z.object({
  body: z.object({
    reason: z.string().optional(),
  }),
});

export const retryPaymentSchema = z.object({
  body: z.object({
    orderId: z.string(),
  }),
});
