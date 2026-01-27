import api from "./api.js";
import { loginSuccess, authChecked } from "./authslice.js";

export const restoreSession = () => async (dispatch) => {
  try {
    const savedAuth = JSON.parse(localStorage.getItem("auth"));

    if (!savedAuth?.token) throw new Error("No session");

    dispatch(loginSuccess(savedAuth));
  } catch {
    dispatch(authChecked());
  }
};

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