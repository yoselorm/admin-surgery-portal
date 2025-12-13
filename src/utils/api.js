import axios from "axios";
import { api_url_v1 } from "./config";

const api = axios.create({
  baseURL: api_url_v1,
  withCredentials: true, // allows cookies (refresh token)
});

// Add access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not retried yet → try refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/refresh-token");

        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.log("Refresh failed:", err);
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
