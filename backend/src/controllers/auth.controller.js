import bcrypt from "bcrypt";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import { findStudentByRollNo } from "../models/student.model.js";
import { findProfessorByEmail } from "../models/professor.model.js";
import { createPasswordResetOtp } from "../models/passwordResetOtp.model.js";

import normalizeRollNo from "../validators/rollno.rule.js";
import normalizeEmail from "../validators/email.rule.js";

import { issueTokens } from "../services/auth.service.js";
import { resetPasswordService, sendPasswordResetOtp } from "../services/passwordReset.service.js";

import { cookieOptions } from "../constants.js";

import { deleteRefreshToken } from "../models/refreshToken.model.js";

/**
 * STUDENT LOGIN
 */
export const studentLogin = asyncHandler(async (req, res) => {
  const { roll_no, password } = req.body;

  // 1. validate & normalize inputs
  const normalizedRollNo = normalizeRollNo(roll_no);
  if (!normalizedRollNo) {
    throw new ApiError(400, "Invalid roll number");
  }

  // 2. find student
  const student = await findStudentByRollNo(normalizedRollNo);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // 3. compare password
  const isPasswordValid = await bcrypt.compare(password, student.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 4. issue tokens
  const { accessToken, refreshToken } = await issueTokens({
    userId: student.id,
    role: "STUDENT",
  });

  // 5. set refresh token cookie
  res.cookie("refreshToken", refreshToken, cookieOptions);

  // 6. normal login success
  return res.status(200).json(
    new ApiResponse(
      {
        accessToken,
        role: "STUDENT",
      },
      "Login successful",
    ),
  );
});

/**
 * PROFESSOR LOGIN
 */
export const professorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. validate & normalize inputs
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new ApiError(400, "Invalid email");
  }

  // 2. find prof
  const professor = await findProfessorByEmail(normalizedEmail);
  if (!professor) {
    throw new ApiError(404, "Professor not found");
  }

  // 3. compare password
  const isPasswordValid = await bcrypt.compare(
    password,
    professor.password_hash,
  );
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 4. issue tokens
  const { accessToken, refreshToken } = await issueTokens({
    userId: professor.id,
    role: "PROFESSOR",
  });

  // 5. set refresh token cookie
  res.cookie("refreshToken", refreshToken, cookieOptions);

  // 6. normal login success
  return res.status(200).json(
    new ApiResponse(
      {
        accessToken,
        role: "PROFESSOR",
      },
      "Login successful",
    ),
  );
});

/**
 * LOGOUT
 */
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }

  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json(new ApiResponse(null, "Logged out successfully"));
});

/**
 * FORGOT PASSWORD
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { role, roll_no, email } = req.body;

  let user, userId, userEmail;

  if (role === "STUDENT") {
    const normalizedRollNo = normalizeRollNo(roll_no);
    if (!normalizedRollNo) {
      throw new ApiError(400, "Invalid roll number");
    }

    user = await findStudentByRollNo(normalizedRollNo);
    if (!user) {
      throw new ApiError(400, "Student not found");
    }

    if (!user?.email) {
      throw new ApiError(
        400,
        "Email not registered for this roll number. Contact admin."
      );
    }
    userId = user.id;
    userEmail = user.email;
  } 
  else if (role === "PROFESSOR") {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      throw new ApiError(400, "Invalid email");
    }
    user = await findProfessorByEmail(normalizedEmail);
    if (!user) {
      throw new ApiError(400, "Professor not found");
    }

    userId = user.id;
    userEmail = user.email;
  } 
  else {
    throw new ApiError(400, "Invalid role");
  }

  // generate otp
  await sendPasswordResetOtp({
    userId,
    userType: role,
    email: userEmail
  })

  return res.status(200).json(
    new ApiResponse(null, "Verification code sent to registered email")
  )

});

/**
 * RESET PASSWORD
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const { role, roll_no, email, otp, new_password } = req.body

    await resetPasswordService({
        role, roll_no, email, otp, new_password
    })

    return res.status(200).json(
        new ApiResponse(null, "Password reset successfully")
    )
})