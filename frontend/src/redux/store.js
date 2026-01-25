import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import { injectStore } from "./axios";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// 🔥 inject AFTER store creation
injectStore(store);
