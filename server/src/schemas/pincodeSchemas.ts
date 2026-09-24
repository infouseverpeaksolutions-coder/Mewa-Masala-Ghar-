import { z } from 'zod';

export const checkPincodeSchema = z.object({
  body: z.object({
    pincode: z.string().regex(/^\d{6}$/, 'Must be a 6-digit Indian pincode'),
  }),
});
