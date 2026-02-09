import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import noticeReducer from "./noticeSlice";
import { injectStore } from "./api";

export const store = configureStore({
  reducer: {
     auth: authReducer,
    notices: noticeReducer,
  },
});

// 🔥 inject AFTER store creation
injectStore(store);
