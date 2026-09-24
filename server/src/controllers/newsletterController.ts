import { Request, Response } from 'express';
import prisma from '../config/db';

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // Upsert - if already subscribed, just return success
    await prisma.newsletterSubscriber.upsert({
      where: { email: email.trim().toLowerCase() },
      update: {}, // No update needed
      create: { email: email.trim().toLowerCase() },
    });

    return res.json({
      success: true,
      message: 'Thank you for subscribing! You\'ll receive our latest updates and offers.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
