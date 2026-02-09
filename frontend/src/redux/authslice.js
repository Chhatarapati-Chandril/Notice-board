import { createSlice } from "@reduxjs/toolkit";

const savedAuth = (() => {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch {
    return null;
  }
})();

const initialState = {
  isAuthenticated: !!savedAuth,
  token: savedAuth?.token || null,
  role: savedAuth?.role || null,
  userIdentifier: savedAuth?.userIdentifier || null,
  loading: true, // 🔴 IMPORTANT: start as true
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.userIdentifier = action.payload.userIdentifier || null;
      state.loading = false;

      localStorage.setItem("auth", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
      state.userIdentifier = null;
      state.loading = false;

      localStorage.removeItem("auth");
    },

    authChecked: (state) => {
      state.loading = false;
    },
  },
});

export const { loginSuccess, logout, authChecked } = authSlice.actions;
export default authSlice.reducer;
