import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://dawarly.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (token)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
  }
  return config;
});

export default api;
