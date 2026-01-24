import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { changePasswordLimit, forgotPasswordLimit } from '../middlewares/rateLimit.middleware.js';
import { 
    studentLogin, 
    professorLogin, 
    logout,
    forgotPassword,
    resetPassword
} from '../controllers/auth.controller.js';

const router = Router()

// AUTH
router.route("/student/login")
    .post(studentLogin);

router.route("/professor/login")
    .post(professorLogin);

// PASSWORD RESET
router.route("/forgot-password")
    .post(forgotPasswordLimit, forgotPassword);

router.route("/reset-password")
    .post(changePasswordLimit, resetPassword);

// LOGOUT
router.route("/logout")
    .post(requireAuth, logout);


export default router