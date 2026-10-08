import { ENV } from '../config/env';

/**
 * ============================================================================
 * Shiprocket Logistics API Service
 * Official External API Integration for Mewa Masala Ghar
 * Document Reference: apiv2.shiprocket.in / apidocs.shiprocket.in
 * ============================================================================
 */

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
  hsn?: string;
}

export interface ShiprocketCreateOrderPayload {
  order_id: string;
  order_date: string; // YYYY-MM-DD HH:mm
  pickup_location: string;
  channel_id?: string;
  comment?: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: ShiprocketOrderItem[];
  payment_method: 'COD' | 'Prepaid';
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;
  length: number; // in cms
  breadth: number; // in cms
  height: number; // in cms
  weight: number; // in Kgs
}

export interface ShiprocketCreateOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now?: number;
  awb_code?: string;
  courier_company_id?: number;
  courier_name?: string;
}

export interface ShiprocketAwbResponse {
  response?: {
    data?: {
      awb_code?: string;
      courier_name?: string;
      shipment_id?: number;
      applied_weight?: number;
      assigned_date_time?: string;
    };
  };
  awb_code?: string;
  courier_name?: string;
}

export interface ShiprocketServiceabilityResponse {
  status: number;
  data: {
    available_courier_companies: Array<{
      courier_company_id: number;
      courier_name: string;
      city: string;
      rate: number;
      etd: string;
      estimated_delivery_days: string | number;
      cod: number;
    }>;
  };
}

export interface ShiprocketTrackingResponse {
  tracking_data?: {
    track_status?: number;
    shipment_status?: number;
    shipment_track?: Array<{
      id: number;
      awb_code: string;
      current_status: string;
      origin: string;
      destination: string;
      expected_date: string;
      order_id: string;
    }>;
    shipment_track_activities?: Array<{
      date: string;
      status: string;
      activity: string;
      location: string;
      'sr-status'?: string;
    }>;
  };
}

export class ShiprocketService {
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiresAt: number = 0; // timestamp in ms

  constructor() {
    this.baseUrl = (ENV.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external').replace(/\/+$/, '');
  }

  /**
   * 1. POST /auth/login
   * Authenticate and obtain 240-hour (10-day) Bearer token
   */
  async login(): Promise<string> {
    const email = ENV.SHIPROCKET_EMAIL;
    const password = ENV.SHIPROCKET_PASSWORD;

    if (!email || !password) {
      throw new Error('Shiprocket credentials (SHIPROCKET_EMAIL & SHIPROCKET_PASSWORD) are not configured');
    }

    console.log(`[Shiprocket] Authenticating user: ${email}`);
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data: any = await res.json();
    if (!res.ok || !data.token) {
      const errMsg = data.message || data.error || 'Shiprocket authentication failed';
      throw new Error(errMsg);
    }

    this.token = data.token;
    // Cache for 9 days (token valid for 10 days / 240 hours)
    this.tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;
    console.log('[Shiprocket] Token generated successfully');
    return this.token as string;
  }

  /**
   * Ensure active authentication token is ready
   */
  private async getToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiresAt) {
      return this.token;
    }
    return this.login();
  }

  /**
   * Authenticated HTTP request wrapper with automatic 401 retry
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    let token = await this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...((options.headers as Record<string, string>) || {}),
    };

    console.log(`[Shiprocket API] ${options.method || 'GET'} ${url}`);

    let res = await fetch(url, { ...options, headers });

    // Handle token expiry / 401 re-authentication
    if (res.status === 401) {
      console.warn('[Shiprocket] Token expired (401). Refreshing token and retrying...');
      token = await this.login();
      headers['Authorization'] = `Bearer ${token}`;
      res = await fetch(url, { ...options, headers });
    }

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      const errMsg = data.message || data.error || `Shiprocket request failed with HTTP ${res.status}`;
      throw new Error(errMsg);
    }

    return data as T;
  }

  /**
   * 2. GET /courier/serviceability/
   * Check serviceable couriers and shipping rates
   */
  async checkServiceability(params: {
    pickup_postcode: string;
    delivery_postcode: string;
    weight: number;
    cod: 0 | 1;
  }): Promise<ShiprocketServiceabilityResponse> {
    const qs = new URLSearchParams({
      pickup_postcode: params.pickup_postcode,
      delivery_postcode: params.delivery_postcode,
      weight: String(params.weight),
      cod: String(params.cod),
    }).toString();

    return this.request<ShiprocketServiceabilityResponse>(`/courier/serviceability/?${qs}`, {
      method: 'GET',
    });
  }

  /**
   * 3. POST /orders/create/adhoc
   * Create custom adhoc order in Shiprocket
   */
  async createAdhocOrder(payload: ShiprocketCreateOrderPayload): Promise<ShiprocketCreateOrderResponse> {
    return this.request<ShiprocketCreateOrderResponse>('/orders/create/adhoc', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * 4. POST /courier/assign/awb
   * Assign courier and generate AWB code for a shipment
   */
  async assignAwb(shipmentId: number, courierId?: number): Promise<ShiprocketAwbResponse> {
    const body: any = { shipment_id: shipmentId };
    if (courierId) body.courier_id = courierId;

    return this.request<ShiprocketAwbResponse>('/courier/assign/awb', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * 5. POST /courier/generate/pickup
   * Request courier pickup from warehouse
   */
  async generatePickup(shipmentId: number | number[]): Promise<any> {
    const ids = Array.isArray(shipmentId) ? shipmentId : [shipmentId];
    return this.request<any>('/courier/generate/pickup', {
      method: 'POST',
      body: JSON.stringify({ shipment_id: ids }),
    });
  }

  /**
   * 6. POST /manifests/generate
   * Generate manifest for shipments
   */
  async generateManifest(shipmentId: number | number[]): Promise<any> {
    const ids = Array.isArray(shipmentId) ? shipmentId : [shipmentId];
    return this.request<any>('/manifests/generate', {
      method: 'POST',
      body: JSON.stringify({ shipment_id: ids }),
    });
  }

  /**
   * 7. POST /manifests/print
   * Get PDF URL of the manifest
   */
  async printManifest(orderIds: number[]): Promise<{ manifest_url: string }> {
    return this.request<{ manifest_url: string }>('/manifests/print', {
      method: 'POST',
      body: JSON.stringify({ order_ids: orderIds }),
    });
  }

  /**
   * 8. POST /courier/generate/label
   * Generate shipping label PDF URL
   */
  async generateLabel(shipmentIds: number[]): Promise<{ label_created: number; label_url: string }> {
    return this.request<{ label_created: number; label_url: string }>('/courier/generate/label', {
      method: 'POST',
      body: JSON.stringify({ shipment_id: shipmentIds }),
    });
  }

  /**
   * 9. POST /orders/print/invoice
   * Print official tax invoice PDF URL
   */
  async printInvoice(orderIds: number[]): Promise<{ is_invoice_created: boolean; invoice_url: string }> {
    return this.request<{ is_invoice_created: boolean; invoice_url: string }>('/orders/print/invoice', {
      method: 'POST',
      body: JSON.stringify({ ids: orderIds }),
    });
  }

  /**
   * 10. GET /courier/track/awb/{awb_code}
   * Live AWB tracking details and milestone scans
   */
  async trackByAwb(awbCode: string): Promise<ShiprocketTrackingResponse> {
    return this.request<ShiprocketTrackingResponse>(`/courier/track/awb/${encodeURIComponent(awbCode)}`, {
      method: 'GET',
    });
  }
}

export const shiprocketService = new ShiprocketService();
