import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { BCRYPT_SALT_ROUNDS, PASSWORD_RESET_TOKEN_EXPIRY } from "../constants.js";
import { generateOtp, getOtpExpiry } from "../utils/otp.js";

import {
  createPasswordResetOtp,
  findValidOtpByContext,
  markOtpUsed,
} from "../models/passwordResetOtp.model.js";
import { updateStudentPassword } from "../models/student.model.js";
import { updateProfessorPassword } from "../models/professor.model.js";

import { devLog } from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/mailer.js";

import { passwordResetOtpEmail } from "../templates/passwordResetOtpEmail.template.js";
import isValidPassword from "../validators/password.rule.js";

/**
 * SEND OTP
 */
export const sendPasswordResetOtp = async ({ userId, userType, email, resetContext }) => {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);
  const expiresAt = getOtpExpiry();
  const emailContent = passwordResetOtpEmail(otp);

  await createPasswordResetOtp({
    userId,
    userType,
    otpHash,
    expiresAt,
    resetContext
  });

  devLog("OTP: ", otp);

  await sendEmail({
    to: email,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });

  return resetContext;
};

/**
 * VERIFY OTP
 */
export const verifyOtpService = async ({ otp, resetContext }) => {
  if (!otp || !resetContext) {
    throw new ApiError(400, "OTP and reset context is required");
  }

  // 1. find unused OTP (across users)
  const otpRecord = await findValidOtpByContext(resetContext);
  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired request");
  }

  // 2. verify OTP
  const isValid = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  // 3. mark otp used
  await markOtpUsed(otpRecord.id);

  // 3. issue short-lived RESET TOKEN
  const reset_token = jwt.sign(
    {
      userId: otpRecord.user_id,
      role: otpRecord.user_type,
      purpose: "password_reset"
    },
    process.env.PASSWORD_RESET_TOKEN_SECRET,
    { expiresIn: PASSWORD_RESET_TOKEN_EXPIRY },
  );

  return reset_token;
};

/**
 * RESET NEW PASSWORD
 */
export const resetPasswordService = async ({ reset_token, new_password }) => {
  if (!reset_token || !new_password) {
    throw new ApiError(400, "Reset token and new password required");
  }

  // 1. verify reset token
  let decoded;
  try {
    decoded = jwt.verify(reset_token, process.env.PASSWORD_RESET_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired reset token");
  }

  const { userId, role, purpose } = decoded;

  if (purpose !== "password_reset") {
    throw new ApiError(403, "Invalid reset token purpose")
  }

  // 2. hash password
  if(!isValidPassword(new_password)) {
    throw new ApiError(403, "Invalid password format")
  }
  const hashedPassword = await bcrypt.hash(new_password, BCRYPT_SALT_ROUNDS);

  // 3. update password
  if (role === "STUDENT") {
    await updateStudentPassword(userId, hashedPassword);
  } 
  else if (role === "PROFESSOR") {
    await updateProfessorPassword(userId, hashedPassword);
  } 
  else {
    throw new ApiError(400, "Invalid role");
  }

  return true;
};
