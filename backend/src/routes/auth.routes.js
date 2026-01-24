import { Router } from 'express';
import { studentLogin, professorLogin } from '../controllers/auth.controller.js';

const router = Router()

// student login
router.route("/student/login").post(studentLogin)

// professor login
router.route("/professor/login").post(professorLogin)

export default router