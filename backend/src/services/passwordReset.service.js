import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../constants.js";
import { generateOtp, getOtpExpiry } from "../utils/otp.js";

import { createPasswordResetOtp, findValidOtp, markOtpUsed } from "../models/passwordResetOtp.model.js";
import { findStudentByRollNo, updateStudentPassword } from "../models/student.model.js";
import { findProfessorByEmail, updateProfessorPassword } from "../models/professor.model.js";

import normalizeRollNo from "../validators/rollno.rule.js";
import normalizeEmail from "../validators/email.rule.js";

import { devLog } from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/mailer.js";

/**
 * SEND OTP
 */
export const sendPasswordResetOtp = async ({ 
    userId, 
    userType, 
    email 
}) => {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);
    const expiresAt = getOtpExpiry();

    await createPasswordResetOtp({
        userId,
        userType,
        otpHash,
        expiresAt,
    });

    devLog("OTP: ", otp);

    await sendEmail({
        to: email,
        subject: "Password Reset Code",
        text: `Your password reset code is ${otp}. \nIt is valid for 10 minutes.`
    })

    return true;
}


/**
 * RESET PASSWORD
 */
export const resetPasswordService = async ({
    role,
    roll_no,
    email,
    otp,
    new_password
}) => {
    let user 
    let userId

    // 1. identify user
    if (role === "STUDENT") {
        const normalizedRollNo = normalizeRollNo(roll_no)
        if (!normalizedRollNo) {
            throw new ApiError(400, "Invalid roll no")
        }
        user = await findStudentByRollNo(normalizedRollNo)
        if (!user) {
            throw new ApiError(404, "Student not found");
        }
    }
    else if (role === "PROFESSOR") {
        const normalizedEmail = normalizeEmail(email)
        if (!normalizedEmail) {
            throw new ApiError(400, "Invalid email")
        }
        user = await findProfessorByEmail(normalizedEmail)
        if (!user) {
            throw new ApiError(404, "Professor not found");
        }
    }
    else {
        throw new ApiError(400, "Invalid role")
    }

    userId = user.id

    // 2. fetch latest valid otp
    const otpRecord = await findValidOtp({
        userId,
        userType: role
    })
    if (!otpRecord) {
        throw new ApiError(400, "Invalid or expired OTP")
    }

    // 3. verify otp
    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp)
    if (!isOtpValid) {
        throw new ApiError(400, "Invalid OTP")
    }

    // 4. hash new password
    const hashedPassword = await bcrypt.hash(new_password, BCRYPT_SALT_ROUNDS)

    // 5. update password
    if (role === "STUDENT") {
        await updateStudentPassword(userId, hashedPassword)
    }
    else if (role === "PROFESSOR") {
        await updateProfessorPassword(userId, hashedPassword)
    }
    else {
        throw new ApiError(400, "Can not update password")
    }

    // 6. mark otp as used
    await markOtpUsed(otpRecord.id)

    return true

}
