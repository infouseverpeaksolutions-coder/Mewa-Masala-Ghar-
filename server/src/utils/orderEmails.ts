import { ENV } from '../config/env';

const EMAIL_WRAPPER = (content: string) => `
<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px; border: 1px solid #D9A441;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="color: #2F5D3A; margin: 0; font-size: 24px;">Mewa Masala Ghar</h1>
    <p style="color: #8C7B65; margin: 4px 0 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Pure Indian Goodness, Rooted in Tradition</p>
  </div>
  <div style="background: white; padding: 28px; border-radius: 8px; border: 1px solid #E6DEC8;">
    ${content}
  </div>
  <div style="text-align: center; margin-top: 24px; color: #8C7B65; font-size: 12px;">
    <p style="margin: 4px 0;">FSSAI Lic. No.: ${ENV.COMPANY_FSSAI} • GSTIN: ${ENV.COMPANY_GSTIN}</p>
    <p style="margin: 4px 0;">${ENV.COMPANY_ADDRESS}</p>
    <p style="margin: 4px 0;">Customer Support: ${ENV.COMPANY_EMAIL} • ${ENV.COMPANY_PHONE}</p>
  </div>
</div>
`;

export function orderConfirmationEmail(order: {
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  trackingToken: string;
  items: Array<{ productName: string; variantName: string; quantity: number; unitPrice: number }>;
}): { subject: string; html: string } {
  const itemRows = order.items.map(item =>
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #E6DEC8; color: #2B2B2B; font-size: 14px;">${item.productName} (${item.variantName})</td>
      <td style="padding: 8px; border-bottom: 1px solid #E6DEC8; text-align: center; color: #2B2B2B; font-size: 14px;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #E6DEC8; text-align: right; color: #2B2B2B; font-size: 14px;">₹${(item.unitPrice * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const trackingUrl = `${ENV.CLIENT_URL}/track-order?token=${order.trackingToken}`;

  return {
    subject: `Order Confirmed: ${order.orderNumber} — Mewa Masala Ghar`,
    html: EMAIL_WRAPPER(`
      <h2 style="color: #2B2B2B; margin-top: 0;">Namaste ${order.customerName},</h2>
      <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6;">
        Thank you for shopping with <strong>Mewa Masala Ghar</strong>! Your order <strong style="color: #2F5D3A;">${order.orderNumber}</strong> has been placed successfully.
      </p>
      <div style="background: #F5F0E5; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #D9A441; color: #2F5D3A; font-size: 13px;">Item</th>
              <th style="padding: 8px; text-align: center; border-bottom: 2px solid #D9A441; color: #2F5D3A; font-size: 13px;">Qty</th>
              <th style="padding: 8px; text-align: right; border-bottom: 2px solid #D9A441; color: #2F5D3A; font-size: 13px;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>
      <p style="color: #2B2B2B; font-size: 16px; font-weight: bold; text-align: right;">
        Total: ₹${order.totalAmount.toFixed(2)} (${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'})
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${trackingUrl}" style="background: #2F5D3A; color: #FAF6EC; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block; border: 1px solid #D9A441;">
          Track Your Order
        </a>
      </div>
    `),
  };
}

export function orderStatusEmail(order: {
  customerName: string;
  orderNumber: string;
  status: string;
  comment?: string;
  courier?: string;
  awbNo?: string;
  trackingUrl?: string;
  trackingToken: string;
}): { subject: string; html: string } {
  const statusLabels: Record<string, { label: string; emoji: string; message: string }> = {
    CONFIRMED: {
      label: 'Confirmed',
      emoji: '✅',
      message: 'Your order has been confirmed and is being processed. We will pack it shortly.',
    },
    PACKED: {
      label: 'Packed',
      emoji: '📦',
      message: 'Your order has been packed and is ready for dispatch.',
    },
    SHIPPED: {
      label: 'Shipped',
      emoji: '🚚',
      message: `Your order has been shipped!${order.courier ? ` Courier: <strong>${order.courier}</strong>` : ''}${order.awbNo ? ` | AWB: <strong>${order.awbNo}</strong>` : ''}`,
    },
    OUT_FOR_DELIVERY: {
      label: 'Out for Delivery',
      emoji: '🏍️',
      message: 'Your order is out for delivery and will arrive today!',
    },
    DELIVERED: {
      label: 'Delivered',
      emoji: '🎉',
      message: 'Your order has been delivered! We hope you enjoy your purchase.',
    },
    CANCELLED: {
      label: 'Cancelled',
      emoji: '❌',
      message: `Your order has been cancelled.${order.comment ? ` Reason: ${order.comment}` : ''} If you have any questions, please contact our support team.`,
    },
    RETURNED: {
      label: 'Returned',
      emoji: '↩️',
      message: 'Your order return has been processed. Refund will be initiated shortly.',
    },
  };

  const info = statusLabels[order.status] || { label: order.status, emoji: '📋', message: 'Your order status has been updated.' };
  const trackUrl = `${ENV.CLIENT_URL}/track-order?token=${order.trackingToken}`;

  let courierSection = '';
  if (order.status === 'SHIPPED' && (order.courier || order.awbNo)) {
    courierSection = `
      <div style="background: #F5F0E5; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="color: #2F5D3A; font-weight: bold; margin: 0 0 8px 0;">Shipping Details:</p>
        ${order.courier ? `<p style="color: #2B2B2B; margin: 4px 0;">Courier: <strong>${order.courier}</strong></p>` : ''}
        ${order.awbNo ? `<p style="color: #2B2B2B; margin: 4px 0;">Tracking Number: <strong>${order.awbNo}</strong></p>` : ''}
        ${order.trackingUrl ? `<p style="margin: 4px 0;"><a href="${order.trackingUrl}" style="color: #2F5D3A;">Track on courier website →</a></p>` : ''}
      </div>
    `;
  }

  return {
    subject: `Order ${info.label}: ${order.orderNumber} — Mewa Masala Ghar`,
    html: EMAIL_WRAPPER(`
      <h2 style="color: #2B2B2B; margin-top: 0;">Namaste ${order.customerName},</h2>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 48px;">${info.emoji}</span>
        <h3 style="color: #2F5D3A; margin: 8px 0;">Order ${info.label}</h3>
        <p style="color: #8C7B65; font-size: 14px;">Order: ${order.orderNumber}</p>
      </div>
      <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6;">${info.message}</p>
      ${courierSection}
      <div style="text-align: center; margin: 24px 0;">
        <a href="${trackUrl}" style="background: #2F5D3A; color: #FAF6EC; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block; border: 1px solid #D9A441;">
          View Order Details
        </a>
      </div>
    `),
  };
}
