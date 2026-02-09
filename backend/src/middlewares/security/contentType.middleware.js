export const enforceContentType = (req, res, next) => {
  // Methods that never have bodies
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Detect actual body presence
  const hasBody =
    Number(req.headers["content-length"]) > 0 ||
    req.headers["transfer-encoding"];

  // No body → no need for Content-Type
  if (!hasBody) {
    return next();
  }

  // Enforce allowed types
  if (req.is("application/json")) return next();
  if (req.is("multipart/form-data")) return next();

  return next(
    new ApiError(
      415,
      "Unsupported Content-Type. Use application/json or multipart/form-data"
    )
  );
};
