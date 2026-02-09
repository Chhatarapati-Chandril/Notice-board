import ApiError from "../../utils/ApiError.js";

export const safeRedirectGuard = (req, res, next) => {
  const redirect = req.query.redirect;

  if (redirect && redirect.startsWith("http")) {
    return next(new ApiError(400, "Invalid redirect URL"));
  }

  next();
};
