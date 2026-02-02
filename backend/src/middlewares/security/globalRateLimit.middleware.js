import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                // max requests per IP per window
  standardHeaders: true,   // return rate limit info in headers
  legacyHeaders: false,    // disable X-RateLimit-* headers
  message: {
    status: "error",
    message: "Too many requests, please try again later",
  },
});
