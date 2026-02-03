export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    VERIFY: (id) => `/users/verify/${id}`,
    RESEND_EMAIL: (id) => `/users/resend-email/${id}`,
  },
  SUB_CAT: {
    GET: (id) => `/subCategory/category/${id}`,
    CREATE: `/subCategory/`,
    UPDATE: (id) => `/subCategory/${id}`,
    DELETE: (id) => `/subCategory/${id}`,
  },
};
