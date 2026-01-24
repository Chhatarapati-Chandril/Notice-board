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

export const findValidOtp = async ({userId, userType}) => {
  if (!userId || !userType) {
    throw new Error("userId and userType are required");
  }
  const [rows] = await pool.query(
    `SELECT *
        FROM password_reset_otp
        WHERE user_id = ?
            AND user_type = ?
            AND used = FALSE
            AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1`,
    [userId, userType],
  );
  return rows[0] || null;
};

export const markOtpUsed = async (id) => {
  await pool.query(`UPDATE password_reset_otp SET used = TRUE WHERE id = ?`, [
    id,
  ]);
};
