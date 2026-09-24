import Razorpay from 'razorpay';
import { ENV } from './env';

export const razorpayClient = (ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET)
  ? new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET,
    })
  : null;
