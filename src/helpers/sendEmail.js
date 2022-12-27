import { createTransport } from "nodemailer";
import * as dotenv from "dotenv";
import {
  EMAIL,
  HOST,
  MAIL_SERVICE,
  MAIL_SUBJECT,
  MAIL_TEXT,
  PASS,
  USER,
} from "./index.js";

dotenv.config();

export const sendEmail = async (email, url) => {
  try {
    const transporter = createTransport({
      host: HOST,
      service: MAIL_SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: EMAIL,
        pass: PASS,
      },
    });

    await transporter.sendMail({
      from: USER,
      to: email,
      subject: MAIL_SUBJECT,
      text: `${MAIL_TEXT} ${url}`,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};
