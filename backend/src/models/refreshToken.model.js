import pool from "../db/db.js";

export const saveRefreshToken = async (
    {
        userId,
        userType,
        token,
        expiresAt
    }
) => {
    await pool.query(
        `INSERT INTO refresh_tokens (user_id, user_type, token, expires_at)
        VALUES (?, ?, ?, ?)`,
        [userId, userType, token, expiresAt]
    )
}

export const deleteRefreshToken = async (token) => {
    await pool.query(
        `DELETE FROM refresh_tokens WHERE token = ?`,
        [token]
    )
}