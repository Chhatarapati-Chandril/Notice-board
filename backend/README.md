Backend service (owned by backend-dev branch)

SELECT 
  n.id,
  n.title,
  n.created_at,
  c.name AS category_name
FROM notices n
JOIN notice_categories c ON c.id = n.notice_category_id
WHERE c.is_active = TRUE
  AND (? IS NULL OR n.title LIKE ?)
  AND (? IS NULL OR n.notice_category_id = ?)
  AND (? IS NULL OR n.created_at >= ?)
  AND (? IS NULL OR n.created_at <= ?)
ORDER BY n.created_at DESC
LIMIT ? OFFSET ?;
