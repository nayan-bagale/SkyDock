import { MailDataRequired } from "@sendgrid/mail";
import sgMail from "../config/sendgrid";
import logger from "../logger";

class Email {
  private static instance: Email;

  private constructor() {}

  public static getInstance(): Email {
    if (!Email.instance) {
      Email.instance = new Email();
    }
    return Email.instance;
  }

  async sendThankYouForRegisteringEmail(toEmail: string, url: string) {
    const msg: MailDataRequired = {
      to: toEmail,
      from: {
        name: "SkyDock",
        email: "skydockos@gmail.com",
      },
      subject: "Thank you for registering to SkyDock",
      text: `Here is activation link ${url} . Thank you for registering to SkyDock`,
      html: `<strong>Here is activation <a href="${url}">link</a> . Thank you for registering to SkyDock</strong>`,
    };

    const msgToDev: MailDataRequired = {
      to: "skydockos@gmail.com",
      from: {
        name: "SkyDock Devs",
        email: "skydockos@gmail.com",
      },
      subject: "New user registered",
      text: `New user registered with email: ${toEmail}`,
      html: `<strong>New user registered with email: ${toEmail}</strong>`,
    };

    try {
      await sgMail.send(msg);
      await sgMail.send(msgToDev);
    } catch (e) {
      logger.error("Error sending email", e);
      throw e;
    }
  }

  async sendPasswordResetOTP(toEmail: string, otp: string) {
    const msg: MailDataRequired = {
      to: toEmail,
      from: {
        name: "SkyDock",
        email: "skydockos@gmail.com",
      },
      subject: "Thank you for registering to SkyDock",
      text: `<strong>Here is otp ${otp} . Thank you for registering to SkyDock</strong>`,
      html: `<strong>Here is otp ${otp} . Thank you for registering to SkyDock</strong>`,
    };
    try {
      await sgMail.send(msg);
    } catch (e) {
      logger.error("Error sending email", e);
      throw e;
    }
  }

  async sendThankYouForSignUpEmail(toEmail: string) {
    const msg: MailDataRequired = {
      to: toEmail,
      from: {
        name: "SkyDock",
        email: "skydockos@gmail.com",
      },
      subject: "Thank you for registering to SkyDock",
      text: `Thank you for registering to SkyDock`,
      html: `Thank you for registering to SkyDock</strong>`,
    };

    const msgToDev: MailDataRequired = {
      to: "skydockos@gmail.com",
      from: {
        name: "SkyDock Devs",
        email: "skydockos@gmail.com",
      },
      subject: "New user registered",
      text: `New user registered with email: ${toEmail}`,
      html: `<strong>New user registered with email: ${toEmail}</strong>`,
    };

    try {
      await sgMail.send(msg);
      await sgMail.send(msgToDev);
    } catch (e) {
      logger.error("Error sending email", e);
      throw e;
    }
  }
}

export default Email.getInstance();
