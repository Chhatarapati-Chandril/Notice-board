import api from "./api.js";
import { loginSuccess, authChecked } from "./authslice.js";

export const restoreSession = () => async (dispatch) => {
  try {
    const res = await api.post("/auth/refresh");
    const { accessToken, role } = res.data.data;

    dispatch(loginSuccess({ token: accessToken, role }));
  } catch {
    dispatch(authChecked()); // 👈 tells app “auth check done”
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
