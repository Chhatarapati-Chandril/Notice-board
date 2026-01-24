import ApiError from "../utils/ApiError.js";

export const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, "Access denied")
        }
        next()
    }
}