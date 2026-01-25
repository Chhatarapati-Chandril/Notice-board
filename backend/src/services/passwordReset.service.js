import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { BCRYPT_SALT_ROUNDS } from "../constants.js";
import { generateOtp, getOtpExpiry } from "../utils/otp.js";

import {
  createPasswordResetOtp,
  findValidOtpByOtp,
  markOtpUsed,
} from "../models/passwordResetOtp.model.js";
import { updateStudentPassword } from "../models/student.model.js";
import { updateProfessorPassword } from "../models/professor.model.js";

import { devLog } from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/mailer.js";

/**
 * SEND OTP
 */
export const sendPasswordResetOtp = async ({ userId, userType, email }) => {
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
    text: `Your password reset code is ${otp}. \nIt is valid for 10 minutes.`,
  });

  return true;
};

/**
 * VERIFY OTP
 */
export const verifyOtpService = async ({ otp }) => {
  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  // 1. find latest unused OTP (across users)
  const otpRecord = await findValidOtpByOtp();
  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // 2. verify OTP
  const isValid = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  // 3. issue short-lived RESET TOKEN
  const reset_token = jwt.sign(
    {
      userId: otpRecord.user_id,
      role: otpRecord.user_type,
      otpId: otpRecord.id,
    },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: "10m" },
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
    decoded = jwt.verify(reset_token, process.env.RESET_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired reset token");
  }

  const { userId, role, otpId } = decoded;

  // 2. hash password
  const hashedPassword = await bcrypt.hash(new_password, BCRYPT_SALT_ROUNDS);

  // 3. update password
  if (role === "STUDENT") {
    await updateStudentPassword(userId, hashedPassword);
  } else if (role === "PROFESSOR") {
    await updateProfessorPassword(userId, hashedPassword);
  } else {
    throw new ApiError(400, "Invalid role");
  }

  // 4. mark OTP as used (single-use guarantee)
  await markOtpUsed(otpId);

  return true;
};
