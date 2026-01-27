import { Router } from "express";
import { 
    getNoticeById, 
    getNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    getMyNotices
} from "../controllers/noticeBoardNotice.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

// upload middleware

const router = Router()

// PUBLIC
router.get("/", 
    optionalAuth,
    getNotices)

// PROTECTED (must be BEFORE :id)
router.get(
  "/my",
  requireAuth,
  requireRole("PROFESSOR"),
  getMyNotices
)

// PUBLIC
router.get("/:id", 
    optionalAuth,
    getNoticeById)

// PROTECTED

// create
router.post(
  "/",
  requireAuth,
  requireRole("PROFESSOR"),
  upload.array("files", 5),
  createNotice
)

// update
router.patch(
  "/:id",
  requireAuth,
  requireRole("PROFESSOR"),
  upload.array("files", 5),
  updateNotice
)

// delete
router.delete(
  "/:id",
  requireAuth,
  requireRole("PROFESSOR"),
  deleteNotice
)

export default router
