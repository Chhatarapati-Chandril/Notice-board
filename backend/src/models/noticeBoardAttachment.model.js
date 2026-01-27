import pool from "../db/db.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

export const getFilesByNoticeId = async (noticeId) => {
  const [rows] = await pool.query(
    `
    SELECT file_url, original_name
    FROM notice_files
    WHERE notice_id = ?
    `,
    [noticeId]
  );

  return rows;
};


export const createAttachments = async (noticeId, files = []) => {
  if (!files.length) return;

  for (const file of files) {

    const uploaded = await uploadOnCloudinary(file.path);

    await pool.query(
      `
      INSERT INTO notice_files (notice_id, file_url, original_name)
      VALUES (?, ?, ?)
      `,
      [
        noticeId,
        uploaded.url,        // ✅ Cloudinary URL
        file.originalname,
      ]
    );
  }
};

