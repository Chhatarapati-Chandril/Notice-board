import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

export const requireAuth = (req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }
};
