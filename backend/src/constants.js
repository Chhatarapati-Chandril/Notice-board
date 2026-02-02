export const JSON_LIMIT = "100kb";

export const BCRYPT_SALT_ROUNDS = 10;

export const PASSWORD_RESET_TOKEN_EXPIRY = "10m"

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const MIN_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const MAX_NOTICE_FILES = 5;
export const MAX_NOTICE_FILE_SIZE = 10 * 1024 * 1024;

export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
  PROFESSOR: "PROFESSOR",
  GUEST: "GUEST",
});

export const AUDIENCES = Object.freeze({
  PUBLIC: "PUBLIC",
  STUDENTS: "STUDENTS",
  PROFESSORS: "PROFESSORS",
  BOTH: "BOTH",
});
export const AUDIENCE_VALUES = Object.values(AUDIENCES);

export const PASSWORD_RESET_OTP_RETENTION_DAYS = 10;
export const PASSWORD_RESET_OTP_CLEANUP_CRON = "0 3 * * *";
