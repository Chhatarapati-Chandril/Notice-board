import pool from "../db/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT id, name FROM notice_categories WHERE is_active = TRUE`
  );

  return res.status(200).json(new ApiResponse(rows));
});
