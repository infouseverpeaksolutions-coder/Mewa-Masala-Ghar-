import { ENV } from '../config/env';

export interface GstCalculationResult {
  baseAmount: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  isInterState: boolean;
}

/**
 * Calculate Indian GST on an inclusive price (MRP/Selling Price includes GST)
 * Base = Total / (1 + Rate/100)
 * GST = Total - Base
 */
export function calculateGstInclusive(
  inclusiveTotal: number,
  gstRate: number,
  buyerStateCode: string = '27' // Default Maharashtra
): GstCalculationResult {
  const isInterState = buyerStateCode.trim() !== ENV.COMPANY_STATE_CODE.trim();
  const rateFraction = gstRate / 100;
  const baseAmount = Number((inclusiveTotal / (1 + rateFraction)).toFixed(2));
  const gstAmount = Number((inclusiveTotal - baseAmount).toFixed(2));

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterState) {
    igst = gstAmount;
  } else {
    cgst = Number((gstAmount / 2).toFixed(2));
    sgst = Number((gstAmount - cgst).toFixed(2));
  }

  return {
    baseAmount,
    gstAmount,
    cgst,
    sgst,
    igst,
    totalAmount: inclusiveTotal,
    isInterState,
  };
}

/**
 * Standard HSN codes and GST Rates for Mewa Masala Ghar
 */
export const HSN_RATES: Record<string, { hsn: string; rate: number }> = {
  dry_fruits: { hsn: '0801', rate: 12.0 },
  seeds: { hsn: '1209', rate: 12.0 },
  makhana: { hsn: '1904', rate: 12.0 },
  spices: { hsn: '0910', rate: 5.0 },
  baby_nutrition: { hsn: '1901', rate: 18.0 },
  family_nutrition: { hsn: '1901', rate: 18.0 },
  personal_care: { hsn: '3304', rate: 18.0 },
};
