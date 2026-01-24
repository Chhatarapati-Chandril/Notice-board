import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js"

export const requireAuth = (req, _res, next) => {
    const authHeader = req.header("Authorization") || req.header("authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Authorization token missing")
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )

        req.user = {
            id: decoded.userId,
            role: decoded.role
        }

        next()
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token")
    }
}