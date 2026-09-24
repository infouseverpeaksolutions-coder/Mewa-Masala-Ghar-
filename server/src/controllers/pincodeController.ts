import { Request, Response } from 'express';
import prisma from '../config/db';

export const checkPincode = async (req: Request, res: Response) => {
  try {
    const pincode = String(req.body?.pincode || req.query?.pincode || req.params?.pincode || '').trim();

    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'A valid 6-digit Indian PIN code is required.',
      });
    }

    // Check database first
    const record = await prisma.pincode.findUnique({
      where: { pincode },
    });


    if (record) {
      return res.json({
        success: true,
        data: {
          pincode: record.pincode,
          city: record.city,
          state: record.state,
          stateCode: record.stateCode,
          isServiceable: record.isServiceable,
          estimatedDays: record.estimatedDays,
          isCodAvailable: record.isCodAvailable,
          deliveryCharge: record.deliveryCharge,
          freeDeliveryThreshold: 499,
          message: record.isServiceable
            ? `Serviceable in ${record.city}, ${record.state}. Estimated delivery in ${record.estimatedDays} business days.`
            : `Currently not serviceable to ${pincode}.`,
        },
      });
    }

    // Dynamic Indian Pincode heuristic if not in seed list
    // 11xxxx: Delhi, 40xxxx: Mumbai/Maharashtra, 56xxxx: Bangalore, 70xxxx: Kolkata, 60xxxx: Chennai, etc.
    const firstTwo = parseInt(pincode.slice(0, 2), 10);
    let state = 'India';
    let city = 'Regional Hub';
    let stateCode = '27';
    let estimatedDays = 4;

    if (firstTwo >= 40 && firstTwo <= 44) {
      state = 'Maharashtra';
      stateCode = '27';
      city = firstTwo === 40 ? 'Mumbai Region' : 'Pune / Maharashtra';
      estimatedDays = 2;
    } else if (firstTwo >= 11 && firstTwo <= 13) {
      state = 'Delhi NCR';
      stateCode = '07';
      city = 'New Delhi';
      estimatedDays = 3;
    } else if (firstTwo >= 56 && firstTwo <= 59) {
      state = 'Karnataka';
      stateCode = '29';
      city = 'Bengaluru';
      estimatedDays = 3;
    } else if (firstTwo >= 50 && firstTwo <= 53) {
      state = 'Telangana / AP';
      stateCode = '36';
      city = 'Hyderabad';
      estimatedDays = 3;
    } else if (firstTwo >= 60 && firstTwo <= 64) {
      state = 'Tamil Nadu';
      stateCode = '33';
      city = 'Chennai';
      estimatedDays = 3;
    } else if (firstTwo >= 70 && firstTwo <= 74) {
      state = 'West Bengal';
      stateCode = '19';
      city = 'Kolkata';
      estimatedDays = 4;
    } else if (firstTwo >= 38 && firstTwo <= 39) {
      state = 'Gujarat';
      stateCode = '24';
      city = 'Ahmedabad';
      estimatedDays = 3;
    } else if (firstTwo >= 20 && firstTwo <= 28) {
      state = 'Uttar Pradesh';
      stateCode = '09';
      city = 'Lucknow / Noida';
      estimatedDays = 3;
    }

    return res.json({
      success: true,
      data: {
        pincode,
        city,
        state,
        stateCode,
        isServiceable: true,
        estimatedDays,
        isCodAvailable: true,
        deliveryCharge: 0,
        freeDeliveryThreshold: 499,
        message: `Standard delivery to ${city}, ${state} within ${estimatedDays}-${estimatedDays + 1} days.`,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
