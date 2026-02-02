import ApiError from "../../utils/ApiError.js";

export const enforceContentType = (req, res, next) => {
  // GET requests usually have no body
  if (req.method === "GET") {
    return next();
  }

  const contentType = req.headers["content-type"];

  // No content-type at all
  if (!contentType) {
    return next(new ApiError(415, "Content-Type header is required"));
  }

  // Allow JSON
  if (req.is("application/json")) {
    return next();
  }

  // Allow file uploads (multer)
  if (req.is("multipart/form-data")) {
    return next();
  }

  // Everything else is rejected
  return next(
    new ApiError(
      415,
      "Unsupported Content-Type. Use application/json or multipart/form-data",
    ),
  );
};
