import pool from "../db/db.js";

export const getNotices = async ({
  page = 1,
  limit = 10,
  search,
  categoryId,
  from,
  to
}) => {
  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];

  if (search) {
    conditions.push("n.title LIKE ?");
    params.push(`%${search}%`);
  }

  if (categoryId) {
    conditions.push("n.notice_category_id = ?");
    params.push(categoryId);
  }

  if (from) {
    conditions.push("n.created_at >= ?");
    params.push(from);
  }

  if (to) {
    conditions.push("n.created_at <= ?");
    params.push(to);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `
    SELECT 
      n.id,
      n.title,
      n.created_at,
      c.name AS category_name
    FROM notices n
    JOIN notice_categories c ON c.id = n.notice_category_id
    ${whereClause}
    ORDER BY n.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [...params, Number(limit), Number(offset)]
  );

  return rows;
};


export const getNoticeById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
      n.id,
      n.title,
      n.content,
      n.created_at,
      c.id AS category_id,
      c.name AS category_name
    FROM notices n
    JOIN notice_categories c ON c.id = n.notice_category_id
    WHERE n.id = ?
    `,
    [id]
  );

  return rows[0] || null;
};

