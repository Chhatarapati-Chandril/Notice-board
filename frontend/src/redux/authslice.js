import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  role: null,
  loading: true, // 🔥 CRITICAL: auth check in progress
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Called after successful login OR refresh
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.loading = false;
    },

    // ✅ Called when refresh fails or user logs out
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
      state.loading = false;
    },

    // ✅ Called when refresh finishes but user is NOT logged in
    authChecked: (state) => {
      state.loading = false;
    },
  },
});

export const { loginSuccess, logout, authChecked } = authSlice.actions;
export default authSlice.reducer;
