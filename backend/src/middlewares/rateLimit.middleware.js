import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

// Shared key generator (IP + identifier)
const passwordRateLimitKey = (req) => {
  const identifier =
    req.body?.roll_no ||
    req.body?.email ||
    "unknown";

  // ✅ IPv6-safe IP handling
  return `${ipKeyGenerator(req)}:${identifier}`;
};

// Forgot password (OTP send)
export const forgotPasswordLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: passwordRateLimitKey,
  handler: () => {
    throw new ApiError(
      429,
      "Too many OTP requests. Please try again later."
    );
  },
});

// Reset password (OTP verify)
export const changePasswordLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: passwordRateLimitKey,
  handler: () => {
    throw new ApiError(
      429,
      "Too many password reset attempts. Try again later."
    );
  },
});
