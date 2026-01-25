import axios from "axios";

let reduxStore;

// Inject redux store (must be called once in store setup)
export const injectStore = (store) => {
  reduxStore = store;
};

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // ✅ CORRECT
  withCredentials: true,                  // ✅ REQUIRED for refresh token cookie
  headers: {
    "Content-Type": "application/json",
  },
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
    const originalRequest = error.config;

    // Safety checks
    if (!error.response) {
      return Promise.reject(error);
    }

    // ❌ Never retry refresh endpoint itself
    if (originalRequest.url?.includes("/auth/refresh")) {
      reduxStore?.dispatch({ type: "auth/logout" });
      return Promise.reject(error);
    }

    // Handle expired access token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");

        const { accessToken, role } = res.data.data;

        reduxStore.dispatch({
          type: "auth/loginSuccess",
          payload: {
            token: accessToken,
            role,
          },
        });

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        reduxStore?.dispatch({ type: "auth/logout" });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
