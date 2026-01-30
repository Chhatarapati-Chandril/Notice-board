import pool from "../db/db.js";

// find prof by email
export const findProfessorByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT id, email, password_hash
        FROM professors
        WHERE email = ?`,
    [email],
  );
  return rows[0] || null;
};

// find prof by id
export const findProfessorById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, email, password_hash
        FROM professors
        WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
};

// create a new prof
export const createProfessor = async ({ email, password_hash }) => {
  const [result] = await pool.query(
    `INSERT INTO professors (email, password_hash)
        VALUES (? , ?)`,
    [email, password_hash],
  );
  return result.insertId;
};

// update prof password
export const updateProfessorPassword = async (id, password_hash) => {
  await pool.query(
    `UPDATE professors 
        SET password_hash = ? WHERE id = ?`,
    [password_hash, id],
  );
};
