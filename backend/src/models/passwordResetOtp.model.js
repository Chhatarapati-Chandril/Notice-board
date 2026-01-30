import pool from "../db/db.js";

export const createPasswordResetOtp = async ({
  userId,
  userType,
  otpHash,
  expiresAt,
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
        (user_id, user_type, otp, expires_at)
        VALUES (?, ?, ?, ?)`,
    [userId, userType, otpHash, expiresAt],
  );
};

export const findValidOtpByOtp = async () => {
  const [rows] = await pool.query(
    `SELECT *
        FROM password_reset_otp
        WHERE used = FALSE
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1`,
  );
  return rows[0] || null;
};

export const markOtpUsed = async (id) => {
  await pool.query(`UPDATE password_reset_otp SET used = TRUE WHERE id = ?`, [
    id,
  ]);
};
