import pool from "../db/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import { createAttachments } from "../models/noticeBoardAttachment.model.js";

export const getNotices = asyncHandler(async (req, res) => {
  const isAuthenticated = Boolean(req.user);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { search, categoryId, from, to } = req.query;

  let where = `
    WHERE n.is_deleted = FALSE
    AND (n.is_public = TRUE OR ? = TRUE)
  `;
  const params = [isAuthenticated];

  if (search) {
    where += " AND n.title LIKE ?";
    params.push(`%${search}%`);
  }

  if (categoryId) {
    where += " AND n.notice_category_id = ?";
    params.push(categoryId);
  }

  if (from) {
    where += " AND n.created_at >= ?";
    params.push(from);
  }

  if (to) {
    where += " AND n.created_at <= ?";
    params.push(to);
  }

  const [rows] = await pool.query(
    `
    SELECT 
      n.id,
      n.title,
      n.created_at,
      c.name AS category
    FROM notices n
    JOIN notice_categories c ON c.id = n.notice_category_id
    ${where}
    ORDER BY n.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `
    SELECT COUNT(*) as total
    FROM notices n
    JOIN notice_categories c ON c.id = n.notice_category_id
    ${where}
    `,
    params
  );


  return res.json(
    new ApiResponse({
      items: rows,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    })
  );
});


export const getNoticeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isAuthenticated = Boolean(req.user);

  const [[notice]] = await pool.query(
    `
    SELECT 
      n.id,
      n.title,
      n.content,
      n.is_public,
      n.created_at,
      c.name AS category,
      p.email AS posted_by
    FROM notices n
    JOIN notice_categories c ON c.id = n.notice_category_id
    LEFT JOIN professors p ON p.id = n.posted_by
    WHERE n.id = ?
      AND n.is_deleted = FALSE
      AND (n.is_public = TRUE OR ? = TRUE)
    `,
    [id, isAuthenticated]
  );

  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  const [files] = await pool.query(
    `SELECT file_url, original_name FROM notice_files WHERE notice_id = ?`,
    [id]
  );

  notice.files = files;

  return res.json(new ApiResponse(notice));
});


export const createNotice = asyncHandler(async (req, res) => {
  const { title, content, categoryId, is_public = true } = req.body;

  if (!title || !categoryId) {
    throw new ApiError(400, "Title and category are required");
  }

  const [result] = await pool.query(
    `
    INSERT INTO notices
    (title, content, notice_category_id, is_public, posted_by)
    VALUES (?, ?, ?, ?, ?)
    `,
    [title, content || null, categoryId, is_public, req.user.id]
  );

  await createAttachments(result.insertId, req.files || []);

  return res.status(201).json(
    new ApiResponse(
      { noticeId: result.insertId },
      "Notice created successfully"
    )
  );
});


export const updateNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, categoryId, is_public } = req.body;

  const [[notice]] = await pool.query(
    `SELECT posted_by FROM notices WHERE id = ? AND is_deleted = FALSE`,
    [id]
  );

  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  if (notice.posted_by !== req.user.id) {
    throw new ApiError(403, "You can only edit your own notices");
  }

  await pool.query(
    `
    UPDATE notices
    SET 
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      notice_category_id = COALESCE(?, notice_category_id),
      is_public = COALESCE(?, is_public)
    WHERE id = ?
    `,
    [title, content, categoryId, is_public, id]
  );

  return res.status(200).json(
    new ApiResponse(null, "Notice updated successfully")
  );
});


export const deleteNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [[notice]] = await pool.query(
    `SELECT posted_by FROM notices WHERE id = ? AND is_deleted = FALSE`,
    [id]
  );

  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  if (notice.posted_by !== req.user.id) {
    throw new ApiError(403, "You can only delete your own notices");
  }

  await pool.query(
    `UPDATE notices SET is_deleted = TRUE WHERE id = ?`,
    [id]
  );

  return res.status(200).json(
    new ApiResponse(null, "Notice deleted successfully")
  );
});


export const getMyNotices = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `
    SELECT 
      n.id,
      n.title,
      n.is_public,
      n.created_at,
      c.name AS category
    FROM notices n
    JOIN notice_categories c ON c.id = n.notice_category_id
    WHERE n.posted_by = ?
      AND n.is_deleted = FALSE
    ORDER BY n.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [req.user.id, limit, offset]
  );

  return res.json(new ApiResponse(rows));
});
