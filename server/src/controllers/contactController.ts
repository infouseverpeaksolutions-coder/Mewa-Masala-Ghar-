import { Request, Response } from 'express';
import prisma from '../config/db';
import { sendEmail } from '../config/email';

// In-memory rate limit for contact form
const contactRateMap = new Map<string, { count: number; resetTime: number }>();

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message, website } = req.body;

    // Honeypot check: if 'website' field is filled, it's a bot
    if (website) {
      // Silently accept to not tip off the bot
      return res.json({ success: true, message: 'Thank you for contacting us! We will respond within 24 hours.' });
    }

    // Rate limiting: 3 per 15 minutes per IP
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    let record = contactRateMap.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      contactRateMap.set(ip, record);
    } else {
      record.count++;
      if (record.count > 3) {
        return res.status(429).json({
          success: false,
          message: 'Too many contact submissions. Please try again later.',
        });
      }
    }

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        status: 'NEW',
      },
    });

    // Send notification email to store
    try {
      const settingsList = await prisma.setting.findMany();
      const settingsMap: Record<string, string> = {};
      settingsList.forEach((s) => { settingsMap[s.key] = s.value; });
      const storeEmail = settingsMap.email || 'care@mewamasalaghar.com';

      await sendEmail({
        to: storeEmail,
        subject: `New Contact Form: ${subject}`,
        html: `
          <h2>New Contact Message from ${name}</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr>
          <p>${message}</p>
        `,
      });
    } catch (emailErr) {
      console.log('[Contact] Email notification failed (non-critical):', emailErr);
    }

    return res.json({
      success: true,
      message: 'Thank you for contacting us! We will respond within 24 hours.',
      data: { id: contactMessage.id },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
