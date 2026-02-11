import axios from "axios";
import { logout, loginSuccess } from "./authslice";

let reduxStore;

// 🔌 Inject store ONCE in main.jsx
export const injectStore = (store) => {
  reduxStore = store;
};

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token = reduxStore?.getState()?.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  Promise.reject
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!error.response || !reduxStore) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // 🟢 PUBLIC AUTH ROUTES (do NOT auto-logout / redirect)
    const publicAuthRoutes = [
      "/auth/login",
      "/auth/admin/login",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    if (publicAuthRoutes.some((route) =>
      originalRequest.url.includes(route)
    )) {
      return Promise.reject(error);
    }

    // 🚫 Don't retry refresh itself
    if (originalRequest.url.includes("/auth/refresh")) {
      reduxStore.dispatch(logout());
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 🔁 Try refresh ONCE
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");

        const { accessToken, role, userIdentifier } = res.data.data;

        reduxStore.dispatch(
          loginSuccess({
            token: accessToken,
            role,
            userIdentifier,
          })
        );

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        reduxStore.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;