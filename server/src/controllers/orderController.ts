import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { calculateGstInclusive } from '../utils/gst';
import { generateOrderNumber, generateInvoiceNumber, generateTrackingToken } from '../utils/orderNumber';
import { generateInvoiceHtml } from '../utils/invoiceTemplate';
import { razorpayClient } from '../config/razorpay';
import { ENV } from '../config/env';
import { sendEmail } from '../config/email';
import crypto from 'crypto';
import { OrderStatus, PaymentStatus, PaymentMethod, TrackingStatus } from '@prisma/client';

// Email Template Helper
const getEmailTemplate = (title: string, message: string) => `
<div style="font-family: Arial, sans-serif; background-color: #FAF6EC; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-top: 4px solid #2F5D3A; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 20px;">
        <h2 style="color: #2F5D3A; border-bottom: 2px solid #D9A441; padding-bottom: 10px;">${title}</h2>
        <div style="color: #333; line-height: 1.6; margin-top: 20px;">
            ${message}
        </div>
        <div style="margin-top: 30px; text-align: center; color: #777; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Mewa Masala Ghar. All rights reserved.</p>
        </div>
    </div>
</div>`;

// 1. createOrder
export const createOrder = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;

    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      customerNotes,
      customerName,
      customerEmail,
      customerPhone,
      customerGstin,
      guestEmail,
      guestPhone
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const orderData = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      let gstAmount = 0;
      let cgst = 0;
      let sgst = 0;
      let igst = 0;
      const orderItems = [];

      // A. Stock Validation and Price Recalculation
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });

        if (!variant || !variant.product) {
          throw new Error(`Variant or Product not found for variant ID: ${item.variantId}`);
        }

        if (variant.stockQty < item.quantity) {
          throw new Error(`Insufficient stock for ${variant.product.name} - ${variant.name}. Available: ${variant.stockQty}`);
        }

        // Decrement stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stockQty: { decrement: item.quantity } }
        });

        const unitPrice = Number(variant.price);
        const itemTotal = unitPrice * item.quantity;
        const effectiveGst = variant.gstPercent || variant.product.gstRate || 12;
        const buyerStateCode = shippingAddress?.stateCode || '27';
        const gstCalc = calculateGstInclusive(itemTotal, effectiveGst, buyerStateCode);

        subtotal += itemTotal;
        gstAmount += gstCalc.gstAmount;
        cgst += gstCalc.cgst;
        sgst += gstCalc.sgst;
        igst += gstCalc.igst;

        orderItems.push({
          productId: variant.productId,
          variantId: variant.id,
          productName: variant.product.name,
          variantName: variant.name,
          sku: variant.sku,
          unitPrice,
          quantity: item.quantity,
          hsnCode: variant.product.hsnCode || '0801',
          gstPercent: effectiveGst,
          gstAmount: gstCalc.gstAmount,
          subtotal: gstCalc.baseAmount,
          total: itemTotal
        });
      }

      // B. Coupon Validation
      let discountAmount = 0;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
        if (!coupon) throw new Error('Invalid coupon code');
        if (!coupon.isActive) throw new Error('Coupon is no longer active');
        if (coupon.startDate && new Date(coupon.startDate) > new Date()) throw new Error('Coupon is not yet valid');
        if (coupon.endDate && new Date(coupon.endDate) < new Date()) throw new Error('Coupon has expired');
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new Error('Coupon has expired');
        if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) throw new Error(`Minimum order value for this coupon is ${coupon.minOrderValue}`);
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new Error('Coupon usage limit exceeded');

        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
          if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
            discountAmount = Number(coupon.maxDiscount);
          }
        } else {
          discountAmount = Number(coupon.discountValue);
        }

        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } }
        });
      }

      // C. Shipping and Fees
      let freeShippingThreshold = 499;
      let defaultShippingFee = 50;

      const freeShippingSetting = await tx.setting.findUnique({ where: { key: 'free_shipping_threshold' } });
      if (freeShippingSetting) freeShippingThreshold = Number(freeShippingSetting.value);

      const shippingFeeSetting = await tx.setting.findUnique({ where: { key: 'shipping_fee' } });
      if (shippingFeeSetting) defaultShippingFee = Number(shippingFeeSetting.value);

      let shippingAmount = (subtotal - discountAmount) >= freeShippingThreshold ? 0 : defaultShippingFee;
      
      let codFee = 0;
      if (paymentMethod === PaymentMethod.COD) {
        const codFeeSetting = await tx.setting.findUnique({ where: { key: 'cod_fee' } });
        if (codFeeSetting) codFee = Number(codFeeSetting.value);
      }
      shippingAmount += codFee;

      const totalAmount = Number((subtotal - discountAmount + shippingAmount).toFixed(2));

      // D. Generate Identifiers
      const orderNumber = generateOrderNumber();
      const orderCount = await tx.order.count();
      const invoiceNumber = generateInvoiceNumber(orderCount + 1);
      const trackingToken = generateTrackingToken();

      const isRazorpay = paymentMethod === PaymentMethod.RAZORPAY;
      const initialStatus = isRazorpay ? OrderStatus.PENDING : OrderStatus.PLACED;
      const initialPaymentStatus = PaymentStatus.PENDING;

      // E. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          invoiceNumber,
          userId: userId || null,
          customerName,
          customerEmail,
          customerPhone,
          guestEmail,
          guestPhone,
          shippingAddressSnapshot: shippingAddress,
          billingAddressSnapshot: billingAddress,
          customerGstin,
          status: initialStatus,
          paymentMethod,
          paymentStatus: initialPaymentStatus,
          subtotal,
          discountAmount,
          gstAmount,
          cgst,
          sgst,
          igst,
          shippingAmount,
          totalAmount,
          couponCode,
          customerNotes,
          trackingToken,
          items: {
            create: orderItems
          },
          statusHistory: {
            create: {
              status: initialStatus,
              comment: 'Order initiated',
              createdBy: userId ? 'CUSTOMER' : 'GUEST'
            }
          },
          trackingEvents: {
            create: {
              status: TrackingStatus.PLACED,
              title: 'Order Placed',
              description: isRazorpay ? 'Awaiting payment' : 'Your order has been placed successfully.',
              createdBy: 'SYSTEM'
            }
          }
        }
      });

      // F. Razorpay Integration
      let razorpayOrderId = null;
      if (isRazorpay) {
        if (razorpayClient) {
          try {
            const rzpOrder = await razorpayClient.orders.create({
              amount: Math.round(totalAmount * 100),
              currency: 'INR',
              receipt: newOrder.orderNumber,
              payment_capture: true,
            });
            razorpayOrderId = rzpOrder.id;
          } catch (rpErr) {
            console.warn('[Razorpay] Creation failed, falling back to simulation:', (rpErr as any).message || rpErr);
            razorpayOrderId = `order_simulated_${Date.now()}`;
          }
        } else {
          razorpayOrderId = `order_simulated_${Date.now()}`;
        }

        await tx.order.update({
          where: { id: newOrder.id },
          data: { razorpayOrderId }
        });
      }

      // G. Payment Record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          method: paymentMethod,
          status: PaymentStatus.PENDING,
          amount: totalAmount,
          razorpayOrderId
        }
      });

      return {
        order: newOrder,
        razorpayOrderId
      };
    }, { timeout: 10000 }); // Increase timeout for external calls

    // Clear user cart if authenticated
    if (userId) {
      try {
        const cart = await prisma.cart.findFirst({ where: { userId } });
        if (cart) {
          await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    }

    // Async Email notification
    const emailTo = customerEmail || guestEmail;
    if (emailTo && orderData.order.status === OrderStatus.PLACED) {
      const emailHtml = getEmailTemplate(
        'Order Confirmation',
        `<p>Dear ${customerName},</p>
         <p>Thank you for shopping at Mewa Masala Ghar!</p>
         <p>Your order <strong>${orderData.order.orderNumber}</strong> has been placed successfully.</p>
         <p><strong>Total Amount:</strong> ₹${Number(orderData.order.totalAmount).toFixed(2)}</p>
          <p>You can track your order using this token: <strong>${orderData.order.trackingToken}</strong></p>`
      );
      sendEmail({
        to: emailTo,
        subject: 'Order Confirmation - Mewa Masala Ghar',
        html: emailHtml,
      }).catch(console.error);
    }

    res.status(201).json({
      success: true,
      order: orderData.order,
      razorpayOrderId: orderData.razorpayOrderId,
      razorpayKeyId: ENV.RAZORPAY_KEY_ID || 'simulated_key'
    });

  } catch (error: any) {
    console.error('Create Order Error:', error);
    res.status(400).json({ success: false, error: error.message || 'Failed to create order' });
  }
};

// 2. verifyRazorpayPayment
export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    const order = await prisma.order.findFirst({
      where: { razorpayOrderId },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let isValid = false;

    if (razorpayOrderId.startsWith('order_simulated_')) {
      isValid = true; // Skip signature check for simulated payments
    } else {
      if (!razorpaySignature) {
        return res.status(400).json({ error: 'Missing signature' });
      }
      const generatedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');
      
      isValid = generatedSignature === razorpaySignature;
    }

    if (isValid) {
      const updatedOrder = await prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.PLACED,
            paymentStatus: PaymentStatus.PAID,
            razorpayPaymentId
          }
        });

        await tx.payment.create({
          data: {
            orderId: order.id,
            method: PaymentMethod.RAZORPAY,
            status: PaymentStatus.PAID,
            amount: order.totalAmount,
            transactionId: razorpayPaymentId,
            razorpayOrderId,
            razorpayPaymentId
          }
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: OrderStatus.PLACED,
            comment: 'Payment verified successfully',
            createdBy: 'SYSTEM'
          }
        });

        await tx.trackingEvent.create({
          data: {
            orderId: order.id,
            status: OrderStatus.PLACED,
            title: 'Payment Received',
            description: 'Your payment was successful and the order is placed.',
            createdBy: 'SYSTEM'
          }
        });

        return updated;
      });

      const emailTo = order.customerEmail || order.guestEmail;
      if (emailTo) {
        const emailHtml = getEmailTemplate(
          'Payment Successful & Order Confirmed',
          `<p>Dear ${order.customerName},</p>
           <p>We have received your payment for order <strong>${order.orderNumber}</strong>.</p>
           <p><strong>Total Amount:</strong> ₹${Number(order.totalAmount).toFixed(2)}</p>
            <p>Your order will be processed shortly.</p>`
        );
        sendEmail({
          to: emailTo,
          subject: 'Payment Successful - Mewa Masala Ghar',
          html: emailHtml,
        }).catch(console.error);
      }

      return res.status(200).json({ success: true, order: updatedOrder });
    } else {
      // Verification failed
      await handlePaymentFailureLogic(order.id, razorpayOrderId, razorpayPaymentId, 'Signature verification failed');
      return res.status(400).json({ success: false, error: 'Payment verification failed' });
    }

  } catch (error: any) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during payment verification' });
  }
};

// Internal Logic for Payment Failure
const handlePaymentFailureLogic = async (orderId: string, razorpayOrderId?: string, razorpayPaymentId?: string, reason?: string) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });
    
    if (!order) throw new Error('Order not found');

    const updated = await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.FAILED
      }
    });

    // Restore stock
    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stockQty: { increment: item.quantity } }
      });
    }

    // Restore coupon
    if (order.couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: order.couponCode } });
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { decrement: 1 } }
        });
      }
    }

    await tx.payment.create({
      data: {
        orderId: order.id,
        method: PaymentMethod.RAZORPAY,
        status: PaymentStatus.FAILED,
        amount: order.totalAmount,
        razorpayOrderId,
        razorpayPaymentId,
        transactionId: razorpayPaymentId
      }
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: order.status,
        comment: `Payment failed. ${reason || ''}`,
        createdBy: 'SYSTEM'
      }
    });

    return updated;
  });
};

// 3. handlePaymentFailure
export const handlePaymentFailure = async (req: Request, res: Response) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, reason } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const updatedOrder = await handlePaymentFailureLogic(orderId, razorpayOrderId, razorpayPaymentId, reason);
    
    res.status(200).json({ success: true, order: updatedOrder, message: 'Payment failure recorded and stock restored' });
  } catch (error: any) {
    console.error('Handle Payment Failure Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to handle payment failure' });
  }
};

// 4. getOrderById
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const identifier = req.params.identifier || req.params.id; // Can be id, orderNumber, or trackingToken
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: identifier },
          { orderNumber: identifier },
          { trackingToken: identifier }
        ]
      },
      include: {
        items: true,
        statusHistory: true,
        payments: true,
        shipments: {
          include: { trackingEvents: true }
        },
        trackingEvents: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Security check:
    // Allow if user is authenticated and is owner or staff, OR if identifier is trackingToken,
    // OR if identifier is orderNumber, OR if query token matches trackingToken
    const queryToken = (req.query.token as string) || (req.headers['x-tracking-token'] as string);
    const isStaffOrOwner = userId && (order.userId === userId || ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'].includes(authReq.user?.role || ''));
    const isTokenMatch = (queryToken && queryToken === order.trackingToken) || order.trackingToken === identifier;
    const isOrderNumberMatch = order.orderNumber === identifier;

    if (!isStaffOrOwner && !isTokenMatch && !isOrderNumberMatch) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error: any) {
    console.error('Get Order By Id Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
};

// 5. getInvoiceHtml
export const getInvoiceHtml = async (req: Request, res: Response) => {
  try {
    const id = req.params.orderId || req.params.id;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).send('<h1>Invoice Not Found</h1>');
    }

    const settingsList = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    const html = generateInvoiceHtml({
      company: {
        name: settingsMap['company_name'],
        address: settingsMap['address'],
        gstin: settingsMap['gstin'],
        fssai: settingsMap['fssai'],
        phone: settingsMap['phone'],
        email: settingsMap['email'],
        stateCode: settingsMap['state_code'],
      },
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoiceNumber || 'GST/2026/00001',
      date: new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddressSnapshot,
      customerGstin: order.customerGstin,
      items: order.items.map((i) => ({
        productName: i.productName,
        variantName: i.variantName,
        sku: i.sku,
        hsnCode: i.hsnCode,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        gstRate: i.gstPercent,
        gstAmount: i.gstAmount,
        total: i.total,
      })),
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      gstAmount: order.gstAmount,
      cgst: order.cgst,
      sgst: order.sgst,
      igst: order.igst,
      shippingAmount: order.shippingAmount,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    });

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch (error: any) {
    console.error('Get Invoice HTML Error:', error);
    res.status(500).send('<h1>Error generating invoice</h1>');
  }
};

// 6. trackOrder
export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { trackingToken, orderNumber, emailOrPhone } = req.body;

    if (!trackingToken && !(orderNumber && emailOrPhone)) {
      return res.status(400).json({ error: 'Provide tracking token OR order number with email/phone' });
    }

    let order = null;

    if (trackingToken) {
      order = await prisma.order.findUnique({
        where: { trackingToken },
        include: {
          statusHistory: { orderBy: { createdAt: 'desc' } },
          trackingEvents: { orderBy: { eventTime: 'desc' } },
          shipments: true
        }
      });
    } else if (orderNumber && emailOrPhone) {
      order = await prisma.order.findFirst({
        where: {
          orderNumber,
          OR: [
            { customerEmail: emailOrPhone },
            { customerPhone: emailOrPhone },
            { guestEmail: emailOrPhone },
            { guestPhone: emailOrPhone }
          ]
        },
        include: {
          statusHistory: { orderBy: { createdAt: 'desc' } },
          trackingEvents: { orderBy: { eventTime: 'desc' } },
          shipments: true
        }
      });
    }

    // Generic error message to prevent enumeration
    if (!order) {
      return res.status(404).json({ error: 'Unable to find order with the provided details.' });
    }

    const sanitizedData = {
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      placedAt: order.createdAt,
      statusHistory: order.statusHistory.map(h => ({ status: h.status, comment: h.comment, time: h.createdAt })),
      trackingEvents: order.trackingEvents.map(t => ({ status: t.status, title: t.title, description: t.description, location: t.location, time: t.eventTime })),
      shipments: order.shipments.map(s => ({ courier: s.courier, awbNo: s.awbNo, trackingUrl: s.trackingUrl, expectedDelivery: s.expectedDelivery, status: s.status }))
    };

    res.status(200).json({ success: true, data: sanitizedData, tracking: sanitizedData });
  } catch (error: any) {
    console.error('Track Order Error:', error);
    res.status(500).json({ success: false, error: 'Failed to track order' });
  }
};

// 7. getMyOrders
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;
    const userEmail = authReq.user?.email;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as OrderStatus | undefined;

    const where: any = {
      ...(status ? { status } : {}),
      OR: [
        { userId },
        ...(userEmail ? [{ customerEmail: userEmail }, { guestEmail: userEmail }] : []),
      ],
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          statusHistory: true,
          shipments: true,
          trackingEvents: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};

// 8. getMyOrderDetail
export const getMyOrderDetail = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { orderNumber } = req.params;

    const order = await prisma.order.findFirst({
      where: { orderNumber, userId },
      include: {
        items: true,
        statusHistory: true,
        shipments: { include: { trackingEvents: true } },
        payments: true,
        trackingEvents: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error: any) {
    console.error('Get My Order Detail Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch order details' });
  }
};

// 9. cancelOrder
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || req.body.orderNumber || req.body.orderId;
    const trackingToken = req.body.trackingToken;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;

    if (!id) {
      return res.status(400).json({ error: 'Order ID or number is required' });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Auth check: either must be the owner, or provide the correct trackingToken
    const isOwner = userId && (order.userId === userId || order.customerEmail === authReq.user?.email);
    const hasValidToken = trackingToken && order.trackingToken === trackingToken;

    if (!isOwner && !hasValidToken) {
      return res.status(403).json({ error: 'Unauthorized to cancel this order' });
    }

    if (order.status !== OrderStatus.PLACED && order.status !== OrderStatus.CONFIRMED && order.status !== OrderStatus.PENDING) {
      return res.status(400).json({ error: `Order cannot be cancelled in ${order.status} status` });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQty: { increment: item.quantity } }
        });
      }

      // Restore coupon usage
      if (order.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: order.couponCode } });
        if (coupon) {
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usageCount: { decrement: 1 } }
          });
        }
      }

      const newPaymentStatus = order.paymentStatus === PaymentStatus.PAID ? PaymentStatus.REFUNDED : order.paymentStatus;

      const cancelled = await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: newPaymentStatus
        }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: OrderStatus.CANCELLED,
          comment: 'Order cancelled by user',
          createdBy: userId ? 'CUSTOMER' : 'GUEST'
        }
      });

      await tx.trackingEvent.create({
        data: {
          orderId: order.id,
          status: OrderStatus.CANCELLED,
          title: 'Order Cancelled',
          description: 'Your order has been cancelled successfully.',
          createdBy: userId ? 'CUSTOMER' : 'GUEST'
        }
      });

      return cancelled;
    });

    // Send cancellation email
    const emailTo = order.customerEmail || order.guestEmail;
    if (emailTo) {
      const refundMsg = order.paymentStatus === PaymentStatus.PAID ? '<p>A refund will be initiated to your original payment method shortly.</p>' : '';
      const emailHtml = getEmailTemplate(
        'Order Cancelled',
        `<p>Dear ${order.customerName},</p>
         <p>Your order <strong>${order.orderNumber}</strong> has been cancelled.</p>
         ${refundMsg}
         <p>We hope to serve you again soon!</p>`
      );
      sendEmail({
        to: emailTo,
        subject: 'Order Cancellation - Mewa Masala Ghar',
        html: emailHtml,
      }).catch(console.error);
    }

    res.status(200).json({ success: true, order: updatedOrder, message: 'Order cancelled successfully' });
  } catch (error: any) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ success: false, error: 'Failed to cancel order' });
  }
};

// 10. retryPayment
export const retryPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentMethod !== PaymentMethod.RAZORPAY) {
      return res.status(400).json({ error: 'Only Razorpay orders can be retried' });
    }
    
    if (order.paymentStatus !== PaymentStatus.FAILED && order.paymentStatus !== PaymentStatus.PENDING) {
      return res.status(400).json({ error: 'Payment cannot be retried for this order status' });
    }

    // Re-validate stock before retrying
    for (const item of order.items) {
      const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
      if (!variant || variant.stockQty < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for item SKU: ${item.sku}. Please create a new order.` });
      }
    }

    // Decrease stock again since it was restored on failure
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQty: { decrement: item.quantity } }
        });
      }

      if (order.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: order.couponCode } });
        if (coupon) {
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usageCount: { increment: 1 } }
          });
        }
      }
    });

    let razorpayOrderId = null;
    if (razorpayClient) {
      const rzpOrder = await razorpayClient.orders.create({
        amount: Math.round(Number(order.totalAmount) * 100),
        currency: 'INR',
        receipt: order.orderNumber,
        payment_capture: true
      });
      razorpayOrderId = rzpOrder.id;
    } else {
      razorpayOrderId = `order_simulated_${Date.now()}`;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayOrderId,
        paymentStatus: PaymentStatus.PENDING
      }
    });

    res.status(200).json({
      success: true,
      order: updatedOrder,
      razorpayOrderId,
      razorpayKeyId: ENV.RAZORPAY_KEY_ID || 'simulated_key'
    });
  } catch (error: any) {
    console.error('Retry Payment Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to retry payment' });
  }
};
