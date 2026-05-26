// services/api.js
import axios from "axios";

export const plainApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

const getProtectedLoginRedirect = () => {
  if (typeof window === "undefined") return null;

  const currentPath = window.location.pathname;
  const protectedPaths = ["/dashboard", "/account"];

  if (currentPath.startsWith("/register")) return null;

  const isProtectedPath = protectedPaths.some((path) =>
    currentPath.startsWith(path),
  );

  if (!isProtectedPath) return null;

  return `/register?redirect=${encodeURIComponent(currentPath)}`;
};

// -------------------- TOKEN STORAGE --------------------
let accessToken = null;
let isAuthenticated = false;

export const setAccessToken = (token) => {
  accessToken = token;
  isAuthenticated = !!token;
};

export const clearAuth = () => {
  accessToken = null;
  isAuthenticated = false;
};

export const getAccessToken = () => accessToken;

// -------------------- REFRESH CONTROL --------------------
let refreshPromise = null;

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = plainApi
      .post("/auth/refresh-token")
      .then((res) => {
        setAccessToken(res.data.accessToken);
        return accessToken;
      })
      .catch((err) => {
        clearAuth();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// -------------------- REQUEST INTERCEPTOR --------------------
api.interceptors.request.use(async (config) => {
  if (!accessToken) {
    try {
      await refreshAccessToken();
    } catch (err) {
      return config;
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// -------------------- RESPONSE INTERCEPTOR --------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url.includes("/auth/refresh-token")
    ) {
      original._retry = true;

      try {
        await refreshAccessToken();

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (err) {
        const loginRedirect = getProtectedLoginRedirect();

        if (loginRedirect) {
          window.location.href = loginRedirect;
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
