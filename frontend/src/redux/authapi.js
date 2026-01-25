import api from "./axios";
import { loginSuccess, logout } from "./authslice";

export const restoreSession = () => async (dispatch) => {
  try {
    const res = await api.post("/auth/refresh");
    dispatch(loginSuccess(res.data.data));
  } catch {
    dispatch(logout());
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
