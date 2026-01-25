import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { changePasswordLimit, forgotPasswordLimit } from '../middlewares/rateLimit.middleware.js';
import { 
    studentLogin, 
    professorLogin, 
    logout,
    forgotPassword,
    resetPassword,
    verifyOtp,
    refreshAccessToken
} from '../controllers/auth.controller.js';

const router = Router()

// LOGIN
router.route("/student/login")
    .post(studentLogin);

router.route("/professor/login")
    .post(professorLogin);


// PASSWORD RESET
router.route("/forgot-password")
    .post(forgotPasswordLimit, forgotPassword);

router.route("/verify-otp")
    .post(changePasswordLimit, verifyOtp)

router.route("/reset-password")
    .patch(changePasswordLimit, resetPassword);


// TOKEN
router.route("/refresh-token")
    .post(refreshAccessToken)


// LOGOUT
router.route("/logout")
    .post(logout);


export default router