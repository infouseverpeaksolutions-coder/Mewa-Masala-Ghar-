/**
 * Shipping Service Interface + Providers
 * ManualShippingProvider: Admin enters courier, AWB, tracking URL
 * ShiprocketStub: Prepared for future Shiprocket integration
 */

export interface ShipmentResult {
  courier: string;
  awbNo: string;
  trackingUrl: string | null;
  expectedDelivery: Date | null;
}

export interface ShippingProvider {
  name: string;
  createShipment(orderData: any): Promise<ShipmentResult>;
}

/** Active provider - admin manually inputs courier details */
export class ManualShippingProvider implements ShippingProvider {
  name = 'manual';

  async createShipment(orderData: any): Promise<ShipmentResult> {
    const expectedDelivery = orderData.expectedDeliveryDays
      ? new Date(Date.now() + orderData.expectedDeliveryDays * 24 * 60 * 60 * 1000)
      : null;

    return {
      courier: orderData.courier || 'Manual',
      awbNo: orderData.awbNo || `MANUAL-${Date.now()}`,
      trackingUrl: orderData.trackingUrl || null,
      expectedDelivery,
    };
  }
}

/** Shiprocket stub - disabled until real credentials provided */
export class ShiprocketShippingProvider implements ShippingProvider {
  name = 'shiprocket';
  private apiUrl = 'https://apiv2.shiprocket.in/v1/external';
  private token: string | null = null;

  constructor(
    private email?: string,
    private password?: string
  ) {}

  private get isConfigured(): boolean {
    return !!(this.email && this.password);
  }

  async createShipment(orderData: any): Promise<ShipmentResult> {
    if (!this.isConfigured) {
      console.log('[Shiprocket] Not configured — returning simulated shipment');
      return {
        courier: 'Shiprocket (Simulated)',
        awbNo: `SIM-${Date.now()}`,
        trackingUrl: null,
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      };
    }

    // Real Shiprocket integration would go here:
    // 1. POST /auth/login to get token
    // 2. POST /orders/create/adhoc to create order
    // 3. POST /courier/assign/awb to assign AWB
    // 4. Return courier details

    console.log('[Shiprocket] Real integration placeholder — would create order for:', orderData.orderNumber);
    return {
      courier: 'Shiprocket (Stub)',
      awbNo: `SR-${Date.now()}`,
      trackingUrl: null,
      expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };
  }
}

/** Status mapping from courier webhooks to platform statuses */
export const COURIER_STATUS_MAP: Record<string, { orderStatus: string; trackingStatus: string }> = {
  'pickup_scheduled': { orderStatus: 'PACKED', trackingStatus: 'PACKED' },
  'picked_up': { orderStatus: 'SHIPPED', trackingStatus: 'SHIPPED' },
  'in_transit': { orderStatus: 'SHIPPED', trackingStatus: 'SHIPPED' },
  'out_for_delivery': { orderStatus: 'OUT_FOR_DELIVERY', trackingStatus: 'OUT_FOR_DELIVERY' },
  'delivered': { orderStatus: 'DELIVERED', trackingStatus: 'DELIVERED' },
  'rto_initiated': { orderStatus: 'RETURNED', trackingStatus: 'RETURNED' },
  'cancelled': { orderStatus: 'CANCELLED', trackingStatus: 'CANCELLED' },
};

/** Valid order status transitions */
export const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PLACED', 'CONFIRMED', 'CANCELLED'],
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'CANCELLED'],
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

/** Get shipping provider */
export function getShippingProvider(): ShippingProvider {
  // For now always returns ManualShippingProvider
  // When Shiprocket credentials are added, this can switch
  return new ManualShippingProvider();
}
