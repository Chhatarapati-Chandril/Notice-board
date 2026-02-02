import path from "path";
import ApiError from "../utils/ApiError.js";

export const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // PowerPoint
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Text
  "text/plain",
];

export const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
];

export const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  // no extension
  if (!ext) {
    return cb(
        new ApiError(400, "File must have a valid extension"), 
        false
    );
  }
  // unsuppoerted type
  if (
    !allowedMimeTypes.includes(file.mimetype) ||
    !allowedExtensions.includes(ext)
  ) {
    return cb(
        new ApiError(400, "Unsupported file type"), 
        false
    );
  }
  // valid file
  cb(null, true);
};
