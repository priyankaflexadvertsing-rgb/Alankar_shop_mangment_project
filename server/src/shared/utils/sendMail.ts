import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv"
import { fileURLToPath } from "url";

dotenv.config()

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: "saumilathya@gmail.com",
    pass: "kgil pnhn optu dkxe ",
  },
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

// send emal funtion
const sendMail = async (options: EmailOptions): Promise<void> => {
  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, "../../mails", template);
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.log(error.message);
    return;

  }

};

export default sendMail;
