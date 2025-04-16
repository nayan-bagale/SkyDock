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

  sendThankYouForRegisteringEmail(toEmail: string, url: string) {
    const msg: MailDataRequired = {
      to: toEmail,
      from: {
        name: "SkyDock",
        email: "skydockos@gmail.com",
      },
      subject: "Thank you for registering to SkyDock",
      text: `Here is activation link ${url} . Thank you for registering to SkyDock`,
      html: "<strong>Our team will activate your account soon. Thank you for registering to SkyDock</strong>",
    };

    console.log(url);

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

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        sgMail.send(msgToDev);
        console.log("Email sent to dev");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  }
}

export default Email.getInstance();
