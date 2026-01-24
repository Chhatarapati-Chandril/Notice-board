import bcrypt from "bcrypt"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

import { findStudentByRollNo } from "../models/student.model.js"
import { findProfessorByEmail } from "../models/professor.model.js";

import normalizeRollNo from "../validators/rules/rollno.rule.js"
import normalizeEmail from "../validators/rules/email.rule.js"


/**
 * STUDENT LOGIN
 */
export const studentLogin = asyncHandler(async (req, res) => {
    const {roll_no, password} = req.body;

    // 1. validate & normalize inputs
    const normalizedRollNo = normalizeRollNo(roll_no);
    if (!normalizedRollNo) {
        throw new ApiError(400, "Invalid roll number");
    }

    // 2. find student
    const student = await findStudentByRollNo(normalizedRollNo);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    // 3. compare password
    const isPasswordValid = await bcrypt.compare(
        password, student.password_hash
    )
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    // 4. first login handeling
    if (student.is_first_login) {
        return res.status(200).json(
            new ApiResponse(
                {
                    userId: student.id,
                    role: "STUDENT",
                    is_first_login: true
                },
                "First login detected. Please change password."
                
            )
        )
    }

    // 4. normal login success
    return res.status(200).json(
        new ApiResponse(
            {
                userId: student.id,
                role: "STUDENT",
                is_first_login: false
            },
            "Login successful"
        )
    )
})


/**
 * PROFESSOR LOGIN
 */
export const professorLogin = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    // 1. validate & normalize inputs
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
        throw new ApiError(400, "Invalid email");
    }

    // 2. find prof
    const professor = await findProfessorByEmail(normalizedEmail)
    if (!professor) {
        throw new ApiError(404, "Professor not found")
    }

    // 3. compare password
    const isPasswordValid = await bcrypt.compare(
        password, professor.password_hash
    )
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    // 4. first login handeling
    if (professor.is_first_login) {
        return res.status(200).json(
            new ApiResponse(
                {
                    userId: professor.id,
                    role: "PROFESSOR",
                    is_first_login: true
                },
                "First login detected. Please change password."
            )
        )
    }

    // 5. normal login success
    return res.status(200).json(
        new ApiResponse(
            {
                userId: professor.id,
                role: "PROFESSOR",
                is_first_login: false
            },
            "Login successful"
        )
    )
})