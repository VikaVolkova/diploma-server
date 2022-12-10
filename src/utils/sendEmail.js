import { createTransport } from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (email, url) => {
  try {
    const transporter = createTransport({
      host: process.env.HOST,
      service: process.env.MAIL_SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: process.env.MAIL_SUBJECT,
      text: `${process.env.MAIL_TEXT} ${url}`,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};
