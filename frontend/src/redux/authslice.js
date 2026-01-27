import { createSlice } from "@reduxjs/toolkit";

const savedAuth = JSON.parse(localStorage.getItem("auth"));

const initialState = {
  isAuthenticated: !!savedAuth,
  token: savedAuth?.token || null,
  role: savedAuth?.role || null,
  userIdentifier: savedAuth?.userIdentifier || null,
  loading: false,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.userIdentifier = action.payload.userIdentifier;
      state.loading = false;
    },

    logout: (state) => {
      localStorage.removeItem("auth");
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
      state.userIdentifier = null;
      state.loading = false;
    },


    authChecked: (state) => {
      state.loading = false;
    },
  },
});

export const { loginSuccess, logout, authChecked } = authSlice.actions;
export default authSlice.reducer;