import Brevo from "@getbrevo/brevo";
import ApiError from "./ApiError.js";
import { devError, devLog } from "./logger.js";

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: false, // must be false for 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const resend = new Resend(process.env.RESEND_API_KEY);

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);


export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html || `<p>${text}</p>`;
    sendSmtpEmail.sender = {
      name: "Notice Board",
      email: process.env.EMAIL_FROM,
    };
    sendSmtpEmail.to = [{ email: to }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    devLog("BREVO SUCCESS:", response.body.messageId);

    return response;
  } 
  catch (error) {
    devError("BREVO ERROR:", error);
    throw new ApiError(500, error.message);
  }
};

