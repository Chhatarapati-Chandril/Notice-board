import api from "./axios";

// Student login
export const studentLogin = (payload) =>
  api.post("/auth/student/login", payload);

// Professor login
export const professorLogin = (payload) =>
  api.post("/auth/professor/login", payload);

// Forgot password (send OTP)
export const forgotPassword = (payload) =>
  api.post("/auth/forgot-password", payload);

// Reset password
export const resetPassword = (payload) =>
  api.patch("/auth/reset-password", payload);
