import { MailDataRequired } from "@sendgrid/mail";
import sgMail from "../config/sendgrid";

class Email {
  private static instance: Email;

  private constructor() {}

  public static getInstance(): Email {
    if (!Email.instance) {
      Email.instance = new Email();
    }
    return Email.instance;
  }

  sendThankYouForRegisteringEmail(toEmail: string) {
    const msg: MailDataRequired = {
      to: toEmail,
      from: {
        name: "SkyDock",
        email: "skydockos@gmail.com",
      },
      subject: "Thank you for registering to SkyDock",
      text: "Our team will activate your account soon. Thank you for registering to SkyDock",
      html: "<strong>Our team will activate your account soon. Thank you for registering to SkyDock</strong>",
    };

    return sgMail.send(msg);
  }
}

export default Email.getInstance();
