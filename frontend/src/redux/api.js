import axios from "axios";

let reduxStore;

// Inject redux store (called once during app init)
export const injectStore = (store) => {
  reduxStore = store;
};

const api = axios.create({
  baseURL: "/api/v1",     // ✅ Backend prefix
  withCredentials: true,  // ✅ Cookies (refresh token)
  // ❌ REMOVE global Content-Type
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

    // 🔥 CRITICAL FIX
    // Only set JSON header if NOT FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // Let browser set multipart/form-data + boundary
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response || !reduxStore) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // 🚫 Never retry refresh itself
    if (originalRequest.url?.includes("/auth/refresh")) {
      reduxStore.dispatch({ type: "auth/logout" });
      return Promise.reject(error);
    }

    // 🔁 Access token expired
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");
        const { accessToken, role } = res.data.data;

        reduxStore.dispatch({
          type: "auth/loginSuccess",
          payload: { token: accessToken, role },
        });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        reduxStore.dispatch({ type: "auth/logout" });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;