import pool from "../db/db.js";

export const createPasswordResetOtp = async ({
  userId,
  userType,
  otpHash,
  expiresAt,
  resetContext
}) => {
  // invalidate old OTPs
  await pool.query(
    `UPDATE password_reset_otp
        SET used = TRUE
        WHERE user_id = ? AND user_type = ?`,
    [userId, userType],
  );

  await pool.query(
    `INSERT INTO password_reset_otp
        (user_id, user_type, otp, expires_at, reset_context)
        VALUES (?, ?, ?, ?, ?)`,
    [userId, userType, otpHash, expiresAt, resetContext],
  );
};

export const findValidOtpByContext = async (resetContext) => {
  const [rows] = await pool.query(
    `SELECT *
        FROM password_reset_otp
        WHERE reset_context = ?
          AND used = FALSE
          AND expires_at > NOW()
        LIMIT 1`,
        [resetContext]
  );
  return rows[0] || null;
};

export const markOtpUsed = async (id) => {
  await pool.query(
    `UPDATE password_reset_otp 
    SET used = TRUE, context_used = TRUE
    WHERE id = ?`, 
    [id]
  );
};
