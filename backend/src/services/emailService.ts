import nodemailer from 'nodemailer';

interface SendEmailDTO {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; path: string }[];
}

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html, attachments }: SendEmailDTO) {
    try {
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn('SMTP credentials not configured. Email skipped.');
        return;
      }

      const info = await this.transporter.sendMail({
        from: `"Pratika Vistorias" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        attachments,
      });

      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
