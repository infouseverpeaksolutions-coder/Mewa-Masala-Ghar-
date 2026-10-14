/**
 * Shipping Service Interface + Providers
 * - ShiprocketShippingProvider: Official Shiprocket API integration (v1/external)
 * - ManualShippingProvider: Admin manually inputs courier details
 */

import { ENV } from '../config/env';
import { shiprocketService, ShiprocketCreateOrderPayload } from './shiprocketService';

export interface ShipmentResult {
  courier: string;
  awbNo: string;
  trackingUrl: string | null;
  expectedDelivery: Date | null;
  shipmentId?: number;
  shiprocketOrderId?: number;
}

export interface ShippingProvider {
  name: string;
  createShipment(orderData: any): Promise<ShipmentResult>;
}

/**
 * Packaging specifications based on weight tier:
 * - 70g & 100g: 20 x 10 x 10 (cm), Dead wt: ~0.16 - 0.19 Kg (Volumetric: 0.40 Kg)
 * - 200g: 11 x 11 x 9 (cm), Dead wt: 0.29 Kg (Volumetric: 0.217 Kg)
 * - 250g - 500g: 20 x 15 x 10 (cm), Dead wt: ~0.35 - 0.60 Kg (Volumetric: 0.60 Kg)
 * - 1 kg (1000g+): 20 x 30 x 10 (cm), Dead wt: ~1.15 Kg (Volumetric: 1.20 Kg)
 */
export function getPackagingSpecs(totalWeightGrams: number): {
  length: number;
  width: number;
  height: number;
  deadWeightKg: number;
  volumetricWeightKg: number;
} {
  // Tier 1: 70 grams and 100 grams -> 20 x 10 x 10 (cm)
  if (totalWeightGrams <= 120) {
    const l = 20, w = 10, h = 10;
    const deadWeightKg = totalWeightGrams <= 80 ? 0.16 : 0.19;
    return {
      length: l,
      width: w,
      height: h,
      deadWeightKg,
      volumetricWeightKg: 0.40,
    };
  }

  // Tier 2: 200 grams -> 11 x 11 x 9 (cm), Dead wt: 0.29 Kg, Volumetric wt: 0.217 Kg
  if (totalWeightGrams <= 250) {
    const l = 11, w = 11, h = 9;
    return {
      length: l,
      width: w,
      height: h,
      deadWeightKg: 0.29,
      volumetricWeightKg: 0.217,
    };
  }

  // Tier 3: 250g - 500g
  if (totalWeightGrams <= 600) {
    const l = 20, w = 15, h = 10;
    const deadWeightKg = Number(((totalWeightGrams + 90) / 1000).toFixed(2));
    return {
      length: l,
      width: w,
      height: h,
      deadWeightKg,
      volumetricWeightKg: 0.60,
    };
  }

  // Tier 4: 1 kg (1000g+) -> 20 x 30 x 10 (cm)
  const l = 20, w = 30, h = 10;
  const deadWeightKg = Number(Math.max(1.15, (totalWeightGrams + 150) / 1000).toFixed(2));
  return {
    length: l,
    width: w,
    height: h,
    deadWeightKg,
    volumetricWeightKg: 1.20,
  };
}

/**
 * Production Shiprocket Shipping Provider
 * Seamlessly interfaces with Shiprocket Logistics Gateway
 */
export class ShiprocketShippingProvider implements ShippingProvider {
  name = 'shiprocket';

  async createShipment(orderData: any): Promise<ShipmentResult> {
    const shippingAddress = orderData.shippingAddressSnapshot || orderData.shippingAddress || {};
    const items = orderData.items || [];

    // Calculate total shipment weight in Kgs
    let totalWeightGrams = 0;
    const orderItemsPayload = items.map((item: any) => {
      let weightPerItem = item.variant?.weightGrams || item.weightGrams;
      if (!weightPerItem && (item.variantName || item.productName)) {
        const text = `${item.variantName || ''} ${item.productName || ''}`.toLowerCase();
        if (text.includes('1 kg') || text.includes('1kg') || text.includes('1000g') || text.includes('1000 g')) {
          weightPerItem = 1000;
        } else if (text.includes('500g') || text.includes('500 g')) {
          weightPerItem = 500;
        } else if (text.includes('250g') || text.includes('250 g')) {
          weightPerItem = 250;
        } else if (text.includes('200g') || text.includes('200 g')) {
          weightPerItem = 200;
        } else if (text.includes('100g') || text.includes('100 g')) {
          weightPerItem = 100;
        } else if (text.includes('70g') || text.includes('70 g')) {
          weightPerItem = 70;
        }
      }
      if (!weightPerItem) weightPerItem = 200;

      totalWeightGrams += weightPerItem * (item.quantity || 1);

      return {
        name: item.productName || item.name || 'Dry Fruits & Spices',
        sku: item.sku || 'SKU-DEFAULT',
        units: item.quantity,
        selling_price: Number(item.unitPrice || item.price || 0),
        discount: 0,
        tax: Number(item.gstPercent || 12),
        hsn: item.hsnCode || '0801',
      };
    });

    // Auto-calculate package specs based on weight tiers (70g, 100g, 200g, 1kg, etc.)
    const packageSpecs = getPackagingSpecs(totalWeightGrams);

    const lengthCm = Number(orderData.length || packageSpecs.length);
    const widthCm = Number(orderData.width || packageSpecs.width);
    const heightCm = Number(orderData.height || packageSpecs.height);
    const shipmentWeightKg = Number(orderData.weight || packageSpecs.deadWeightKg);

    const isCod = orderData.paymentMethod === 'COD';
    const totalAmount = Number(orderData.totalAmount || 0);

    // Format date as YYYY-MM-DD HH:mm
    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const rawName = orderData.customerName || `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Customer';
    const nameParts = rawName.split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload: ShiprocketCreateOrderPayload = {
      order_id: orderData.orderNumber || `ORD-${Date.now()}`,
      order_date: dateFormatted,
      pickup_location: orderData.pickupLocation || ENV.SHIPROCKET_PICKUP_LOCATION || 'Primary',
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: shippingAddress.addressLine || shippingAddress.street || shippingAddress.address || 'Address Line 1',
      billing_address_2: shippingAddress.landmark || '',
      billing_city: shippingAddress.city || 'Balotra',
      billing_pincode: String(shippingAddress.pincode || '344022').trim(),
      billing_state: shippingAddress.state || 'Rajasthan',
      billing_country: 'India',
      billing_email: orderData.customerEmail || shippingAddress.email || 'care@mewamasalaghar.com',
      billing_phone: (orderData.customerPhone || shippingAddress.phone || '9876543210').replace(/\D/g, '').slice(-10),
      shipping_is_billing: true,
      order_items: orderItemsPayload,
      payment_method: isCod ? 'COD' : 'Prepaid',
      shipping_charges: Number(orderData.shippingAmount || 0),
      sub_total: totalAmount,
      length: lengthCm,
      breadth: widthCm,
      height: heightCm,
      weight: shipmentWeightKg,
    };

    console.log(`[Shiprocket] Creating adhoc order for: ${payload.order_id}`);
    const orderRes = await shiprocketService.createAdhocOrder(payload);

    if (!orderRes.shipment_id) {
      throw new Error(`Failed to create Shiprocket shipment: ${JSON.stringify(orderRes)}`);
    }

    console.log(`[Shiprocket] Shipment created (ID: ${orderRes.shipment_id}). Assigning AWB...`);
    let awbCode = orderRes.awb_code;
    let courierName = orderRes.courier_name || 'Shiprocket Partner';

    try {
      const awbRes = await shiprocketService.assignAwb(orderRes.shipment_id, orderData.courierId);
      if (awbRes?.response?.data?.awb_code) {
        awbCode = awbRes.response.data.awb_code;
        courierName = awbRes.response.data.courier_name || courierName;
      } else if (awbRes?.awb_code) {
        awbCode = awbRes.awb_code;
        courierName = awbRes.courier_name || courierName;
      }
    } catch (awbErr: any) {
      console.warn(`[Shiprocket] AWB auto-assignment deferred: ${awbErr.message}`);
    }

    const finalAwb = awbCode || `SR-${orderRes.shipment_id}`;
    const trackingUrl = `https://shiprocket.co/tracking/${finalAwb}`;
    const expectedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

    return {
      courier: courierName,
      awbNo: finalAwb,
      trackingUrl,
      expectedDelivery,
      shipmentId: orderRes.shipment_id,
      shiprocketOrderId: orderRes.order_id,
    };
  }
}

/** Active provider - admin manually inputs courier details */
export class ManualShippingProvider implements ShippingProvider {
  name = 'manual';

  async createShipment(orderData: any): Promise<ShipmentResult> {
    const expectedDelivery = orderData.expectedDeliveryDays
      ? new Date(Date.now() + orderData.expectedDeliveryDays * 24 * 60 * 60 * 1000)
      : null;

    return {
      courier: orderData.courier || 'Manual Courier',
      awbNo: orderData.awbNo || `MANUAL-${Date.now()}`,
      trackingUrl: orderData.trackingUrl || null,
      expectedDelivery,
    };
  }
}

/** Status mapping from courier webhooks to platform statuses */
export const COURIER_STATUS_MAP: Record<string, { orderStatus: string; trackingStatus: string }> = {
  pickup_scheduled: { orderStatus: 'PACKED', trackingStatus: 'PACKED' },
  picked_up: { orderStatus: 'SHIPPED', trackingStatus: 'SHIPPED' },
  in_transit: { orderStatus: 'SHIPPED', trackingStatus: 'SHIPPED' },
  out_for_delivery: { orderStatus: 'OUT_FOR_DELIVERY', trackingStatus: 'OUT_FOR_DELIVERY' },
  delivered: { orderStatus: 'DELIVERED', trackingStatus: 'DELIVERED' },
  rto_initiated: { orderStatus: 'RETURNED', trackingStatus: 'RETURNED' },
  rto_delivered: { orderStatus: 'RETURNED', trackingStatus: 'RETURNED' },
  cancelled: { orderStatus: 'CANCELLED', trackingStatus: 'CANCELLED' },

  // Shiprocket uppercase & variation statuses
  'PICKED UP': { orderStatus: 'SHIPPED', trackingStatus: 'SHIPPED' },
  'IN TRANSIT': { orderStatus: 'SHIPPED', trackingStatus: 'SHIPPED' },
  'OUT FOR DELIVERY': { orderStatus: 'OUT_FOR_DELIVERY', trackingStatus: 'OUT_FOR_DELIVERY' },
  'DELIVERED': { orderStatus: 'DELIVERED', trackingStatus: 'DELIVERED' },
  'RTO INITIATED': { orderStatus: 'RETURNED', trackingStatus: 'RETURNED' },
  'RTO DELIVERED': { orderStatus: 'RETURNED', trackingStatus: 'RETURNED' },
  'CANCELED': { orderStatus: 'CANCELLED', trackingStatus: 'CANCELLED' },
};

/** Valid order status transitions */
export const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PLACED', 'CONFIRMED', 'CANCELLED'],
  PLACED: ['CONFIRMED', 'PACKED', 'SHIPPED', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'SHIPPED', 'CANCELLED'],
  PACKED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED'],
  CANCELLED: [],
  RETURNED: [],
  PROCESSING: ['CONFIRMED', 'PACKED', 'SHIPPED', 'CANCELLED'],
};

export function isValidTransition(currentStatus: string, newStatus: string): boolean {
  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed) return false;
  return allowed.includes(newStatus);
}

/** Get active shipping provider */
export function getShippingProvider(): ShippingProvider {
  if (ENV.SHIPROCKET_EMAIL && ENV.SHIPROCKET_PASSWORD) {
    return new ShiprocketShippingProvider();
  }
  return new ManualShippingProvider();
}
