import api from "@/services/axios";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // تحقق هل هذا request يحتاج auth
      const needsAuth =
        original.url.startsWith("/protected") ||
        original.url.startsWith("/dashboard");

      if (!needsAuth) {
        // لو request عام مثل الهوم، مجرد تجاهل 401 بدون redirect
        return Promise.reject(error);
      }

      try {
        const res = await api.post("/refresh-token");

        accessToken = res.data.accessToken;
        original.headers.Authorization = `Bearer ${accessToken}`;

        return api(original);
      } catch (err) {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/register")) {
          window.location.href = `/register?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
