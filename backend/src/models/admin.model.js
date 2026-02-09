import pool from "../db/db.js";

// find admin by email
export const findAdminByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT id, email, password_hash, is_active
        FROM admins
        WHERE email = ?`,
    [email],
  );
  return rows[0] || null;
};

// find admin by id
export const findAdminById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, email, password_hash, is_active
        FROM admins
        WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
};

// update admin password
export const updateAdminPassword = async (id, password_hash) => {
  await pool.query(
    `UPDATE admins 
        SET password_hash = ? WHERE id = ?`,
    [password_hash, id],
  );
};
