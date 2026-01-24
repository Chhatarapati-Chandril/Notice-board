import nodemailer from "nodemailer"
import ApiError from "./ApiError.js"
import { devLog } from "./logger.js"

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,  // must be false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendEmail = async ({to, subject, text}) => {
    try {
        await transporter.sendMail({
            from: `"Notice Board" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        })
    } catch (error) {
        devLog("email send failed")
        throw new ApiError(500, "Unable to send email. Try again later.")
    }
}