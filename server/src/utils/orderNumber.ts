import crypto from 'crypto';

let sequenceCounter = 0;

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomInt(100000, 999999);
  sequenceCounter++;
  return `MMG-${year}-${String(randomPart).padStart(6, '0')}`;
}

export function generateInvoiceNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `GST/${year}/${String(sequence).padStart(5, '0')}`;
}

export function generateTrackingToken(): string {
  return crypto.randomBytes(24).toString('hex');
}
