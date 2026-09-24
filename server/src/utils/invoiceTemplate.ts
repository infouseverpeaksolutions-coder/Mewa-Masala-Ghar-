import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env';

export interface InvoiceData {
  company?: {
    name?: string;
    address?: string;
    gstin?: string;
    fssai?: string;
    phone?: string;
    email?: string;
    stateCode?: string;
  };
  orderNumber: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  customerGstin?: string | null;
  items: Array<{
    productName: string;
    variantName: string;
    sku: string;
    hsnCode: string;
    quantity: number;
    unitPrice: number;
    gstRate: number;
    gstAmount: number;
    total: number;
  }>;
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

export function generateInvoiceHtml(data: InvoiceData): string {
  const isInterState = data.igst > 0;
  
  const itemsRows = data.items
    .map((item, index) => {
      const baseTotal = (item.total - item.gstAmount).toFixed(2);
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.productName}</strong><br/>
            <span style="font-size: 12px; color: #6b7280;">Variant: ${item.variantName} | SKU: ${item.sku}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.hsnCode}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(item.unitPrice / (1 + item.gstRate / 100)).toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${baseTotal}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.gstRate}% (₹${item.gstAmount.toFixed(2)})</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹${item.total.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  let logoImgHtml = '';
  try {
    const possiblePaths = [
      path.join(process.cwd(), '../client/public/logo.png'),
      path.join(process.cwd(), 'client/public/logo.png'),
      path.join(__dirname, '../../../client/public/logo.png'),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        const b64 = fs.readFileSync(p).toString('base64');
        logoImgHtml = `<img src="data:image/png;base64,${b64}" alt="Mewa Masala Ghar" style="height: 52px; width: auto; object-fit: contain; margin-bottom: 8px; display: block;" />`;
        break;
      }
    }
  } catch {}

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>GST Tax Invoice - ${data.invoiceNumber}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #2b2b2b; background: #faf6ec; padding: 24px; margin: 0; }
        .invoice-card { max-width: 860px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e7e0d0; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2F5D3A; padding-bottom: 20px; margin-bottom: 24px; }
        .brand-title { font-size: 26px; font-weight: bold; color: #2F5D3A; margin: 0 0 6px 0; font-family: Georgia, serif; }
        .tax-invoice-title { font-size: 20px; font-weight: bold; color: #D9A441; text-align: right; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px; }
        .badge { display: inline-block; padding: 3px 8px; font-size: 11px; font-weight: 600; border-radius: 4px; background: #eef2ff; color: #3730a3; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 13px; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; }
        th { background: #2F5D3A; color: #ffffff; padding: 10px; text-align: left; font-weight: 600; }
        .summary-box { width: 340px; margin-left: auto; font-size: 13px; line-height: 1.8; }
        .summary-row { display: flex; justify-content: space-between; border-bottom: 1px dashed #e5e7eb; padding: 4px 0; }
        .summary-row.total { font-size: 16px; font-weight: bold; color: #2F5D3A; border-top: 2px solid #2F5D3A; border-bottom: none; padding-top: 8px; margin-top: 4px; }
        .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #e7e0d0; font-size: 11px; color: #6b7280; text-align: center; line-height: 1.6; }
        @media print {
          body { background: #ffffff; padding: 0; }
          .invoice-card { border: none; box-shadow: none; padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div style="max-width: 860px; margin: 0 auto 16px auto; text-align: right;" class="no-print">
        <button onclick="window.print()" style="background: #2F5D3A; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div class="invoice-card">
        <div class="header">
          <div>
            ${logoImgHtml}
            <h1 class="brand-title">${data.company?.name || ENV.COMPANY_NAME}</h1>
            <div style="font-size: 13px; color: #4b5563; max-width: 380px;">
              ${data.company?.address || ENV.COMPANY_ADDRESS}<br/>
              <strong>GSTIN:</strong> ${data.company?.gstin || ENV.COMPANY_GSTIN} | <strong>State Code:</strong> ${data.company?.stateCode || ENV.COMPANY_STATE_CODE}<br/>
              <strong>FSSAI Lic. No:</strong> ${data.company?.fssai || ENV.COMPANY_FSSAI}<br/>
              <strong>Email:</strong> ${data.company?.email || ENV.COMPANY_EMAIL} | <strong>Phone:</strong> ${data.company?.phone || ENV.COMPANY_PHONE}
            </div>
          </div>
          <div style="text-align: right;">
            <div class="tax-invoice-title">TAX INVOICE</div>
            <div style="font-size: 13px; margin-bottom: 4px;"><strong>Invoice No:</strong> ${data.invoiceNumber}</div>
            <div style="font-size: 13px; margin-bottom: 4px;"><strong>Order ID:</strong> ${data.orderNumber}</div>
            <div style="font-size: 13px; margin-bottom: 4px;"><strong>Invoice Date:</strong> ${data.date}</div>
            <div class="badge">${data.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid via Razorpay'}</div>
          </div>
        </div>

        <div class="details-grid">
          <div>
            <strong style="color: #2F5D3A; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">Billed & Shipped To:</strong><br/>
            <strong>${data.customerName}</strong><br/>
            ${data.shippingAddress.addressLine || ''}<br/>
            ${data.shippingAddress.city || ''}, ${data.shippingAddress.state || ''} - ${data.shippingAddress.pincode || ''}<br/>
            <strong>Phone:</strong> ${data.customerPhone}<br/>
            <strong>Email:</strong> ${data.customerEmail}
            ${data.customerGstin ? `<br/><strong>Customer GSTIN:</strong> ${data.customerGstin}` : ''}
          </div>
          <div>
            <strong style="color: #2F5D3A; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">Dispatch Details:</strong><br/>
            <strong>Place of Supply:</strong> ${data.shippingAddress.state || 'Maharashtra'} (State Code: ${data.shippingAddress.stateCode || '27'})<br/>
            <strong>Payment Status:</strong> <span style="color: ${data.paymentStatus === 'PAID' ? '#15803d' : '#b45309'}; font-weight: bold;">${data.paymentStatus}</span><br/>
            <strong>Reverse Charge:</strong> No<br/>
            <strong>FSSAI Registration:</strong> Verified Food Business Operator
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: center; width: 40px;">#</th>
              <th>Description of Goods</th>
              <th style="text-align: center;">HSN</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Taxable</th>
              <th style="text-align: right;">Taxable Val</th>
              <th style="text-align: right;">GST Rate</th>
              <th style="text-align: right;">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="summary-box">
          <div class="summary-row">
            <span>Subtotal (Taxable Value):</span>
            <span>₹${(data.totalAmount - data.gstAmount - data.shippingAmount + data.discountAmount).toFixed(2)}</span>
          </div>
          ${data.discountAmount > 0 ? `
            <div class="summary-row" style="color: #16a34a;">
              <span>Discount Applied:</span>
              <span>-₹${data.discountAmount.toFixed(2)}</span>
            </div>
          ` : ''}
          ${!isInterState ? `
            <div class="summary-row">
              <span>CGST (${(data.gstAmount > 0 ? (data.cgst / (data.totalAmount - data.gstAmount) * 100).toFixed(0) : 0)}%):</span>
              <span>₹${data.cgst.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>SGST (${(data.gstAmount > 0 ? (data.sgst / (data.totalAmount - data.gstAmount) * 100).toFixed(0) : 0)}%):</span>
              <span>₹${data.sgst.toFixed(2)}</span>
            </div>
          ` : `
            <div class="summary-row">
              <span>IGST:</span>
              <span>₹${data.igst.toFixed(2)}</span>
            </div>
          `}
          <div class="summary-row">
            <span>Shipping & Handling:</span>
            <span>${data.shippingAmount === 0 ? 'FREE' : '₹' + data.shippingAmount.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span>Grand Total (INR):</span>
            <span>₹${data.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>
            <strong>Terms & Conditions:</strong> Goods once sold are covered under Mewa Masala Ghar Quality Guarantee.
            All food and nutrition items are packed in an FSSAI certified facility (Lic. No. ${ENV.COMPANY_FSSAI}).
            For queries or returns, please reach out to ${ENV.COMPANY_EMAIL} or call ${ENV.COMPANY_PHONE}.
          </p>
          <p>This is a computer-generated tax invoice and does not require a physical signature.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
