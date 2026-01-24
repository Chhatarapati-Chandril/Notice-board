import pool from "../db/db.js"

// find student by roll number
export const findStudentByRollNo = async (rollNo) => {
    const [rows] = await pool.query(
        `SELECT id, roll_no, email, password_hash, is_first_login
        FROM students
        WHERE roll_no = ?`,
        [rollNo]
    )
    return rows[0] || null
}

// find student by id
export const findStudentById = async (id) => {
    const [rows] = await pool.query(
        `SELECT id, roll_no, email, password_hash, is_first_login
        FROM students
        WHERE id = ?`,
        [id]
    )
    return rows[0] || null
}

// create a new student
export const createStudent = async ({roll_no, email, password_hash}) => {
    const [result] = await pool.query(
        `INSERT INTO students (roll_no, email, password_hash)
        VALUES (?, ? , ?)`,
        [roll_no, email, password_hash]
    )
    return result.insertId
}

// update student password
export const updateStudentPassword = async (id, password_hash) => {
    await pool.query(
        `UPDATE students 
        SET 
            password_hash = ?, is_first_login = FALSE
        WHERE id = ?`,
        [password_hash, id]
    )
}