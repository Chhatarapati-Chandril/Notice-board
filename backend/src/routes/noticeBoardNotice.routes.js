import { Router } from "express";
import {
  getNoticeById,
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeBoardNotice.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

import { ROLES, MAX_NOTICE_FILES } from "../constants.js";

// upload middleware

const router = Router();

// PUBLIC
router.get("/", optionalAuth, getNotices);

// PUBLIC
router.get("/:id", optionalAuth, getNoticeById);

// PROTECTED

// create
router.post(
  "/",
  requireAuth,
  requireRole(ROLES.ADMIN),
  upload.array("files", MAX_NOTICE_FILES),
  createNotice,
);

// update
router.patch(
  "/:id",
  requireAuth,
  requireRole(ROLES.ADMIN),
  upload.array("files", MAX_NOTICE_FILES),
  updateNotice,
);

// delete
router.delete(
  "/:id", 
  requireAuth, 
  requireRole(ROLES.ADMIN), 
  deleteNotice
);

export default router;
