import crypto from "crypto";
import ApiError from "../utils/ApiError.js";

export const verifyAdminSecret = (admin_secret) => {

  if (!admin_secret) {
    throw new ApiError(401, "Admin secret required");
  }

  const envSecret = process.env.ADMIN_LOGIN_SECRET;
  if (!envSecret) {
    throw new ApiError(500, "ADMIN_LOGIN_SECRET not configured");
  }

  const a = Buffer.from(admin_secret);
  const b = Buffer.from(envSecret);

  if (a.length !== b.length) {
    throw new ApiError(401, "Invalid admin secret");
  }

  const isValid = crypto.timingSafeEqual(a, b);

  if (!isValid) {
    throw new ApiError(401, "Invalid admin secret");
  }
};
