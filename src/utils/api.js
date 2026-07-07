import axios from "axios";
import { api_url_v1 } from "./config";

const api = axios.create({
  baseURL: api_url_v1,
  // No cookies involved anymore — both tokens are sent explicitly.
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

      const refreshToken = localStorage.getItem("refreshToken");

      // Nothing to refresh with — bail out immediately instead of
      // hitting the server with an empty refresh request.
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const res = await api.post("/refresh-token", { refreshToken });

        // Backend rotates both tokens — store the new pair
        const { accessToken: newToken, refreshToken: newRefreshToken } = res.data;
        localStorage.setItem("accessToken", newToken);
        if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.log("Refresh failed:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;