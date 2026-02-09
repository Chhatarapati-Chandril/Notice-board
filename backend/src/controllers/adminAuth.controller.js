import bcrypt from "bcrypt";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  findAdminByEmail,
  findAdminById,
  updateAdminPassword,
} from "../models/admin.model.js";

import { issueTokens } from "../services/auth.service.js";
import { verifyAdminSecret } from "../services/adminSecret.service.js";

import { cookieOptions } from "../constants.js";
import { BCRYPT_SALT_ROUNDS } from "../constants.js";
import { ROLES } from "../constants.js";

import normalizeEmail from "../validators/email.rule.js";
import isValidPassword from "../validators/password.rule.js";
import { deleteAllRefreshTokens } from "../models/refreshToken.model.js";
import { devLog } from "../utils/logger.js";

/**
 * ADMIN LOGIN
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password, admin_secret } = req.body;

  // 0. validate admin secret first
  verifyAdminSecret(admin_secret);

  // 1. validate & normalize inputs
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new ApiError(400, "Invalid email");
  }

  // 2. find admin
  const admin = await findAdminByEmail(normalizedEmail);

  devLog("admin: ", admin)
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  devLog("admin is active: ", admin.is_active)
  if (!admin.is_active) {
    throw new ApiError(403, "Admin account disabled");
  }

  // 3. compare password
  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 4. issue tokens
  const { accessToken, refreshToken } = await issueTokens({
    userId: admin.id,
    role: "ADMIN",
  });

  // 5. set refresh ad access token cookie
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  // 6. normal login success
  return res.status(200).json(
    new ApiResponse(
      {
        accessToken,
        role: "ADMIN",
      },
      "Login successful",
    ),
  );
});

/**
 * ADMIN CHANGE PASSWORD
 */
export const changeAdminPassword = asyncHandler(async (req, res) => {
  const { curr_password, new_password, admin_secret } = req.body;

  // 0. basic validation
  if (!curr_password || !new_password || !admin_secret) {
    throw new ApiError(400, "All fields are required");
  }
  if (!isValidPassword(new_password)) {
    throw new ApiError(400, "Invalid password format");
  }
  if (new_password === curr_password) {
    throw new ApiError(400, "New password must be different from current password");
  }

  // 1. verify admin secret
  verifyAdminSecret(admin_secret);

  // 2. fetch admin (from token)
  const admin = await findAdminById(req.user.id);

  devLog("admin: ", admin)
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  devLog("admin is active: ", admin.is_active)
  if (!admin.is_active) {
    throw new ApiError(403, "Admin account disabled");
  }

  // 3. verify current password
  const isValid = await bcrypt.compare(curr_password, admin.password_hash);
  if (!isValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // 4. hash new password
  const newHash = await bcrypt.hash(new_password, BCRYPT_SALT_ROUNDS);

  // 5. update password
  await updateAdminPassword(admin.id, newHash);

  // 6. keep user logged in and rotate refresh token
  await deleteAllRefreshTokens(admin.id, ROLES.ADMIN);

  const { accessToken, refreshToken } = await issueTokens({
    userId: admin.id,
    role: ROLES.ADMIN,
  });

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res
    .status(200)
    .json(
      new ApiResponse({ accessToken }, "Admin password changed successfully"),
    );
});
