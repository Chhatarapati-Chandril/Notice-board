import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileFilter } from "../validators/fileValidation.js";
import { MAX_NOTICE_FILE_SIZE } from "../constants.js";

const uploadDir = path.resolve("public/uploads/notices");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");

    const uniqueName = `${baseName}-${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_NOTICE_FILE_SIZE,
  },
  fileFilter,
});

export default upload;
