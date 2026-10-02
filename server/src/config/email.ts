import nodemailer from 'nodemailer';
import { ENV } from './env';

let transporter: nodemailer.Transporter;

if (ENV.SMTP_USER && ENV.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });
} else {
  // Development fallback: simulated email logger
  transporter = {
    sendMail: async (mailOptions: any) => {
      console.log('--- [SIMULATED EMAIL DISPATCH] ---');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('From:', mailOptions.from || ENV.SMTP_FROM);
      console.log('Body snippet:', (mailOptions.text || mailOptions.html || '').slice(0, 150) + '...');
      console.log('----------------------------------');
      return { messageId: 'simulated-' + Date.now() };
    },
  } as any;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: ENV.SMTP_FROM,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html,
    });
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    return null;
  }
};

export const sendVerificationEmail = async (to: string, name: string, token: string) => {
  const verifyUrl = `${ENV.CLIENT_URL}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px; border: 1px solid #D9A441;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #2F5D3A; margin: 0; font-size: 24px;">Mewa Masala Ghar</h1>
        <p style="color: #8C7B65; margin: 4px 0 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Pure Indian Goodness, Rooted in Tradition</p>
      </div>
      <div style="background: white; padding: 28px; border-radius: 8px; border: 1px solid #E6DEC8;">
        <h2 style="color: #2B2B2B; margin-top: 0;">Namaste ${name},</h2>
        <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6;">
          Thank you for joining <strong>Mewa Masala Ghar</strong>. Please verify your email address to activate your account and enjoy pure dry fruits, freshly stone-ground spices, and family wellness blends.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #2F5D3A; color: #FAF6EC; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block; border: 1px solid #D9A441;">
            Verify My Email Address
          </a>
        </div>
        <p style="color: #777; font-size: 13px; line-height: 1.5;">
          This verification link is valid for 24 hours. If the button above does not work, copy and paste this link into your browser:<br/>
          <a href="${verifyUrl}" style="color: #2F5D3A; word-break: break-all;">${verifyUrl}</a>
        </p>
      </div>
      <div style="text-align: center; margin-top: 24px; color: #8C7B65; font-size: 12px;">
        <p style="margin: 4px 0;">FSSAI Lic. No.: 10021051000123 • GSTIN: 08AABCM1234F1Z5</p>
        <p style="margin: 4px 0;">JAGRITI TRADING COMPANY ( MEWAMASALAGHAR) • HANWANT COLONY GANDHIPURA Balotra -344022</p>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: 'Verify Your Email — Mewa Masala Ghar',
    html,
  });
};

export const sendPasswordResetEmail = async (to: string, name: string, token: string) => {
  const resetUrl = `${ENV.CLIENT_URL}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px; border: 1px solid #D9A441;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #2F5D3A; margin: 0; font-size: 24px;">Mewa Masala Ghar</h1>
        <p style="color: #8C7B65; margin: 4px 0 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Password Reset Request</p>
      </div>
      <div style="background: white; padding: 28px; border-radius: 8px; border: 1px solid #E6DEC8;">
        <h2 style="color: #2B2B2B; margin-top: 0;">Namaste ${name},</h2>
        <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6;">
          We received a request to reset your password for your Mewa Masala Ghar account. Click the button below to choose a new secure password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #2F5D3A; color: #FAF6EC; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block; border: 1px solid #D9A441;">
            Reset My Password
          </a>
        </div>
        <p style="color: #777; font-size: 13px; line-height: 1.5;">
          This link will expire in 60 minutes. If you did not request this change, you can safely ignore this email — your password will remain unchanged.
        </p>
      </div>
      <div style="text-align: center; margin-top: 24px; color: #8C7B65; font-size: 12px;">
        <p style="margin: 4px 0;">Customer Support: mewamasalaghar26@gmail.com • +91 70717 04506</p>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: 'Reset Your Password — Mewa Masala Ghar',
    html,
  });
};
