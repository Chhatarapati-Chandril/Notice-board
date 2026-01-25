import axios from "axios";

let reduxStore;

// 👇 THIS EXPORT WAS MISSING
export const injectStore = (store) => {
  reduxStore = store;
};

const api = axios.create({
  baseURL: "/api/v1", // backend base
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = reduxStore?.getState()?.auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");

        reduxStore.dispatch({
          type: "auth/loginSuccess",
          payload: {
            token: res.data.data.accessToken,
            role: res.data.data.role,
          },
        });

        originalRequest.headers.Authorization =
          `Bearer ${res.data.data.accessToken}`;

        return api(originalRequest);
      } catch {
        reduxStore.dispatch({ type: "auth/logout" });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
