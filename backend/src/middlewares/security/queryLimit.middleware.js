import ApiError from "../../utils/ApiError.js";

export const queryLimitGuard = (req, res, next) => {
  const MAX_PARAMS = 20;

  if (Object.keys(req.query).length > MAX_PARAMS) {
    return next(new ApiError(400, "Too many query parameters"));
  }

  next();
};
