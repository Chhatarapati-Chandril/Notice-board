import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  loginLimit,
  adminLoginLimit,
  changeAdminPasswordLimit,
  changePasswordLimit,
  forgotPasswordLimit,
} from "../middlewares/rateLimit.middleware.js";
import {
  studentLogin,
  professorLogin,
  logout,
  forgotPassword,
  resetPassword,
  verifyOtp,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import {
  adminLogin,
  changeAdminPassword,
} from "../controllers/adminAuth.controller.js";
import { ROLES } from "../constants.js";

const router = Router();

// ADMIN
router.route("/admin/login").post(adminLoginLimit, adminLogin);
router
  .route("/admin/change-password")
  .patch(
    requireAuth,
    requireRole(ROLES.ADMIN),
    changeAdminPasswordLimit,
    changeAdminPassword,
  );

// LOGIN
router.route("/student/login").post(loginLimit, studentLogin);
router.route("/professor/login").post(loginLimit, professorLogin);

// PASSWORD RESET
router.route("/forgot-password").post(forgotPasswordLimit, forgotPassword);
router.route("/verify-otp").post(changePasswordLimit, verifyOtp);
router.route("/reset-password").patch(changePasswordLimit, resetPassword);

// TOKEN
router.route("/refresh").post(refreshAccessToken);

// LOGOUT
router.route("/logout").post(requireAuth, logout);

export default router;
