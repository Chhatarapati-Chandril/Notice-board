import crypto from "crypto";

// Range: 100000–999999 (always exactly 6 digits)
export const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Sets expiry to 10 minutes from current time
export const getOtpExpiry = () => new Date(Date.now() + 10 * 60 * 1000);
