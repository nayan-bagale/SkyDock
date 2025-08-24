// src/utils/EmailService.ts
import nodemailer, { Transporter } from "nodemailer";
import logger from "../logger";

class EmailService {
  private static instance: EmailService;
  private transporter: Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g. "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendMail(
    to: string,
    subject: string,
    html: string,
    from: string = `"MyApp" <${process.env.SMTP_USER}>`
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      console.log("Email sent:", info.messageId);
      logger.log("Email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
      logger.error("Error sending email:", error);
      throw error;
    }
  }

  public async sendEmailTemplate(template: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      const mailOptions = {
        ...template,
        from: template.from ?? `<${process.env.SMTP_USER}>`,
      };
      const info = await this.transporter.sendMail(mailOptions);
      logger.log("Email sent:", info.messageId);
    } catch (error) {
      logger.error("Error sending email:", error);
      throw error;
    }
  }
}

export default EmailService.getInstance();
