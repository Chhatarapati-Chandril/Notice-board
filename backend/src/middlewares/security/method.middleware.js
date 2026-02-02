import ApiError from "../../utils/ApiError.js";

const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export const methodGuard = (req, res, next) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    return next(new ApiError(405, "HTTP method not allowed"));
  }
  next();
};
