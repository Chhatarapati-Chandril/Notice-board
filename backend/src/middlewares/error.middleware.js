import ApiError from "../utils/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle unexpected errors safely
  if (!(err instanceof ApiError)) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  const response = {
    success: false,
    message,
  };

  // Expose stack trace ONLY in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
