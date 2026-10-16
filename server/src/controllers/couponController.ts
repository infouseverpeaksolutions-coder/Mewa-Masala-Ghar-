import { Request, Response } from 'express';
import prisma from '../config/db';

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const rawCode = req.body.code;
    const rawAmount = req.body.cartAmount ?? req.body.cartTotal ?? req.body.subtotal ?? 0;
    const cartTotal = Number(parseFloat(String(rawAmount))) || 0;

    if (!rawCode) {
      return res.status(400).json({ success: false, message: 'Please provide a promo code.' });
    }

    const code = String(rawCode).toUpperCase().trim();

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Invalid or expired promo code.' });
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return res.status(400).json({ success: false, message: 'This promo code is not active yet.' });
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return res.status(400).json({ success: false, message: 'This promo code has expired.' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return res.status(400).json({ success: false, message: 'This promo code has expired.' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'This promo code usage limit has been reached.' });
    }

    const minOrderVal = Number(coupon.minOrderValue) || 0;
    if (cartTotal < minOrderVal) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${minOrderVal} required for coupon ${coupon.code}.`,
      });
    }

    let discount = 0;
    const discountVal = Number(coupon.discountValue) || 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (cartTotal * discountVal) / 100;
      if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
        discount = Number(coupon.maxDiscount);
      }
    } else {
      discount = discountVal;
    }

    // Discount cannot exceed cart total
    discount = Math.min(discount, cartTotal);
    const finalDiscount = Number(discount.toFixed(2));

    return res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      data: {
        code: coupon.code,
        discount: finalDiscount,
        discountAmount: finalDiscount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: coupons });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscount, expiresAt } = req.body;

    const coupon = await prisma.coupon.create({
      data: {
        code: String(code).toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return res.status(201).json({ success: true, message: 'Coupon created.', data: coupon });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
