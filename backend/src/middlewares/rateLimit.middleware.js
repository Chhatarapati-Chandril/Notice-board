import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

// Shared key generator (IP + identifier)
const passwordRateLimitKey = (req) => {
  const identifier = req.body?.roll_no || req.body?.email;
  
  if (!identifier) {
    return ipKeyGenerator(req)
  }

  // IPv6-safe IP handling
  return `${ipKeyGenerator(req)}:${identifier}`;
};

// Admin login
export const adminLoginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: passwordRateLimitKey,
  handler: (req, res, next) => {
    next(new ApiError(429, "Too many admin login attempts. Access temporarily blocked."));
  },
});

// Admin Reset password
export const changeAdminPasswordLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: passwordRateLimitKey,
  handler: (req, res, next) => {
    next(new ApiError(429, "Too many password reset attempts. Try again later."));
  },
});


// Login 
export const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: passwordRateLimitKey,
  handler: (req, res, next) => {
    next(new ApiError(429, "Too many login attempts. Try again later."));
  },
});

// Forgot password (OTP send)
export const forgotPasswordLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: passwordRateLimitKey,
  handler: (req, res, next) => {
    next(new ApiError(429, "Too many OTP requests. Please try again later."));
  },
});

// Reset password (OTP verify)
export const changePasswordLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: passwordRateLimitKey,
  handler: (req, res, next) => {
    next(new ApiError(429, "Too many password reset attempts. Try again later."));
  },
});
