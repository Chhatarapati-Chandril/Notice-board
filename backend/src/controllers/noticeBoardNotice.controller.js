import pool from "../db/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import { createAttachments } from "../models/noticeBoardAttachment.model.js";
import { getAllowedAudiencesForRole } from "../services/noticeAudience.service.js";
import { devLog } from "../utils/logger.js";
import {
  MIN_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  AUDIENCES,
  AUDIENCE_VALUES,
} from "../constants.js";

export const getNotices = asyncHandler(async (req, res) => {
  const { search, categoryId, date, from, to, tab = "recent" } = req.query;

  const page = Math.max(
    Number(req.query.page) || MIN_PAGE_NUMBER,
    MIN_PAGE_NUMBER,
  );
  const limit = Math.min(
    Number(req.query.limit) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );
  const offset = (page - 1) * limit;

  const role = req.user?.role || "GUEST";
  const allowedAudiences = getAllowedAudiencesForRole(role);
  const placeholders = allowedAudiences.map(() => "?").join(",");

  let where = `
    WHERE n.is_deleted = FALSE
    AND n.audience IN (${placeholders})
  `;
  const params = [...allowedAudiences];

  // Notice age filter (apply only when no explicit date filter is used)
  if (!date && !from && !to) {
    if (tab === "old") {
      where += " AND n.created_at < NOW() - INTERVAL 30 DAY";
    } else {
      // default: recent
      where += " AND n.created_at >= NOW() - INTERVAL 30 DAY";
    }
  }

  if (search) {
    where += " AND n.title LIKE ?";
    params.push(`%${search}%`);
  }

  if (categoryId) {
    where += " AND n.notice_category_id = ?";
    params.push(categoryId);
  }

  if (date) {
    // frontend sends: ?date=YYYY-MM-DD
    const startOfDay = `${date} 00:00:00`;
    const endOfDay = `${date} 23:59:59`;

    where += " AND n.created_at BETWEEN ? AND ?";
    params.push(startOfDay, endOfDay);
  } else {
    // fallback: explicit range (useful for future filters)
    if (from) {
      where += " AND n.created_at >= ?";
      params.push(from);
    }
    if (to) {
      where += " AND n.created_at <= ?";
      params.push(to);
    }
  }

  const [rows] = await pool.query(
    `
    SELECT 
      n.id,
      n.title,
      n.created_at,
      c.id AS category_id,
      c.name AS category_name,
      c.badge_class AS category_badge_class

    FROM notices n
    JOIN notice_categories c ON c.id = n.notice_category_id
    ${where}
    ORDER BY n.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [...params, limit, offset],
  );


  const [[{ total }]] = await pool.query(
    `
    SELECT COUNT(*) as total
    FROM notices n
    JOIN notice_categories c ON c.id = n.notice_category_id
    ${where}
    `,
    params,
  );

  const items = rows.map((row) => ({
    id: row.id,
    title: row.title,
    created_at: row.created_at,
    category: {
      id: row.category_id,
      name: row.category_name,
      badgeClass: row.category_badge_class,
    },
  }));

  return res.json(
    new ApiResponse({
      items,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    }),
  );
});

export const getNoticeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = req.user?.role || "GUEST";
  const allowedAudiences = getAllowedAudiencesForRole(role);
  const placeholders = allowedAudiences.map(() => "?").join(",");

  const [[notice]] = await pool.query(
    `
    SELECT 
      n.id,
      n.title,
      n.content,
      n.audience,
      n.created_at,
      c.id AS category_id,
      c.name AS category_name,
      c.badge_class AS category_badge_class,
      a.email AS posted_by
    FROM notices n
    JOIN notice_categories c ON c.id = n.notice_category_id
    LEFT JOIN admins a ON a.id = n.posted_by
    WHERE n.id = ?
      AND n.is_deleted = FALSE
      AND n.audience IN (${placeholders})
    `,
    [id, ...allowedAudiences],
  );

  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  const [files] = await pool.query(
    `SELECT file_url, original_name FROM notice_files WHERE notice_id = ?`,
    [id],
  );

  const formattedNotice = {
    id: notice.id,
    title: notice.title,
    content: notice.content,
    audience: notice.audience,
    created_at: notice.created_at,
    posted_by: notice.posted_by,
    category: {
      id: notice.category_id,
      name: notice.category_name,
      badgeClass: notice.category_badge_class,
    },
    files,
  };

  return res.json(new ApiResponse(formattedNotice));

});

export const createNotice = asyncHandler(async (req, res) => {
  devLog("USER:", req.user);
  devLog("BODY:", req.body);
  devLog("FILES:", req.files);

  const { title, content, categoryId, audience } = req.body;

  if (!title || title.trim() === "" || !categoryId || !audience) {
    throw new ApiError(400, "Title, category and audience are required");
  }

  const parsedCategoryId = Number(categoryId);
  if (Number.isNaN(parsedCategoryId)) {
    throw new ApiError(400, "Invalid category");
  }

  if (!AUDIENCE_VALUES.includes(audience)) {
    throw new ApiError(400, "Invalid audience value");
  }

  const [result] = await pool.query(
    `
    INSERT INTO notices
    (title, content, notice_category_id, audience, posted_by)
    VALUES (?, ?, ?, ?, ?)
    `,
    [title, content || null, parsedCategoryId, audience, req.user.id],
  );

  await createAttachments(result.insertId, req.files || []);

  return res
    .status(201)
    .json(
      new ApiResponse(
        { noticeId: result.insertId },
        "Notice created successfully",
      ),
    );
});

export const updateNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, categoryId, audience } = req.body;

  if (
    title === undefined &&
    content === undefined &&
    categoryId === undefined &&
    audience === undefined
  ) {
    throw new ApiError(400, "Nothing to update");
  }

  if (title !== undefined && title.trim() === "") {
    throw new ApiError(400, "Title cannot be empty");
  }

  let parsedCategoryId = null;

  if (categoryId !== undefined) {
    parsedCategoryId = Number(categoryId);
    if (Number.isNaN(parsedCategoryId)) {
      throw new ApiError(400, "Invalid category");
    }
  }

  const [[notice]] = await pool.query(
    `SELECT id FROM notices WHERE id = ? AND is_deleted = FALSE`,
    [id],
  );
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  if (audience !== undefined && !AUDIENCE_VALUES.includes(audience)) {
    throw new ApiError(400, "Invalid audience value");
  }

  await pool.query(
    `
    UPDATE notices
    SET
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      notice_category_id = COALESCE(?, notice_category_id),
      audience = COALESCE(?, audience)
    WHERE id = ?
    `,
    [title ?? null, content ?? null, parsedCategoryId, audience ?? null, id],
  );

  return res
    .status(200)
    .json(new ApiResponse(null, "Notice updated successfully"));
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [[notice]] = await pool.query(
    `SELECT id FROM notices WHERE id = ? AND is_deleted = FALSE`,
    [id],
  );
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  await pool.query(`UPDATE notices SET is_deleted = TRUE WHERE id = ?`, [id]);

  return res
    .status(200)
    .json(new ApiResponse(null, "Notice deleted successfully"));
});
