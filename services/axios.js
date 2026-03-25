// services/api.js
import axios from "axios";

// Instance عادي بدون interceptors
export const plainApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // عشان الكوكيز تبعت refresh token
});

// Instance الرئيسي مع interceptors
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// -------------------- REQUEST interceptor --------------------
api.interceptors.request.use(async (config) => {
  // لو مفيش access token حاول تجيب واحد من refresh token
  if (!accessToken) {
    try {
      const res = await plainApi.post("/auth/refresh-token");
      accessToken = res.data.accessToken;
    } catch (err) {
      console.log("No refresh token available");
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// -------------------- RESPONSE interceptor --------------------
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // لو 401 والطلب مش already retried
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/auth/refresh-token")
    ) {
      original._retry = true;
      try {
        const res = await plainApi.post("/auth/refresh-token");
        accessToken = res.data.accessToken;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original); // إعادة محاولة الطلب الأصلي
      } catch (err) {
        // لو الريفرش فشل نودي المستخدم لل login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
