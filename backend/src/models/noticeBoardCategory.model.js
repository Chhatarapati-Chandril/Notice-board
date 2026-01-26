import pool from "../db/db.js"

// get all active notice categories

export const getActiveCategories = async () => {
    const [rows] = await pool.query(
        `
        SELECT id, name
        FROM notice_categories
        WHERE is_active = TRUE
        ORDER BY name ASC
        `
    )
}