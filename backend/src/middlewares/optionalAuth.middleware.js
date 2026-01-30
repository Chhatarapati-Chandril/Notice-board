import jwt from "jsonwebtoken";

export const optionalAuth = (req, _res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
  } catch {
    req.user = null; // invalid token → treat as guest
  }

  next();
};
