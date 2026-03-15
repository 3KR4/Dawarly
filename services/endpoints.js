export const ENDPOINTS = {
  AUTH: {
    REGISTER: () => "/auth/register",
    LOGIN: () => "/auth/login",
    VERIFY: () => `/auth/verify-email/`,
    RESEND_EMAIL: () => `/auth/resend-otp/`,
    FORGET_PASSWORD: () => `/auth/forgot-password/`,
    RESET_PASSWORD: () => `/auth/reset-password/`,
    REFRESH: () => "/auth/refresh-token",
    All_USERS: () => "/auth/users",
    ONE_USER: (id) => `/auth/users/${id}`,
    ME: () => "/auth/me",
  },
  // SUBCATEGORIES: {
  //   GETALL: (lang) => `/subCategory/all?lang=${lang}`,
  //   GETBYId: (id) => `/subCategory/${id}`,
  //   GETBYCAT: (id, lang) => `/subCategory/category/${id}?lang=${lang}`,
  //   CREATE: () => `/subCategory/`,
  //   UPDATE: (id) => `/subCategory/${id}`,
  //   UPDATE_LANG: (id) => `/subCategory/${id}/Translation`,
  //   DELETE: (id) => `/subCategory/${id}`,
  // },
  // FILTERS: {
  //   //filters
  //   GET_ALL_FILTERS: (lang) => `/subCategory/filters/all?lang=${lang}`,
  //   GET_ONE_FILTER: (id) => `/subCategory/filters/${id}`,
  //   GET_FILTERS_BY_SUB: (id, lang) => `/subCategory/${id}/filter?lang=${lang}`,
  //   CREATE_FILTER: (id) => `/subCategory/${id}/filter`,
  //   UPDATE_FILTER: (id) => `/subCategory/filter/${id}`,
  //   UPDATE_FILTER_LANG: (id) => `/subCategory/filter/translations${id}`,
  //   DELETE_FILTER: (id) => `/subCategory/filter/${id}/`,
  //   //options
  //   GET_OPTIONS: (id, lang) =>
  //     `/subCategory/filter/${id}/options?lang=${lang}`,
  //   CREATE_OPTION: (id) => `/subCategory/filter/${id}/options`,
  //   UPDATE_OPTION: (id) => `/subCategory/filter/options/${id}`,
  //   UPDATE_OPTION_LANG: (id) =>
  //     `/subCategory/filter/options/translations/${id}`,
  //   DELETE_OPTION: (id) => `/subCategory/filter/options/${id}`,
  // },

  ADS: {
    GET_BY_SUB: (cat, subId) => `/${cat}/subCategory/${subId}`,
    GET_ONE_AD: (id) => `/ads/${id}`,
    CREATE: (cat, subId) => `/${cat}/subCategory/${subId}`,
    UPDATE: (cat, id) => `/${cat}/${id}`,
    DELETE: (cat, id) => `/${cat}/${id}`,
  },
  BOOKING: {
    CREATE: (id) => `/Booking/create/Properties/${id}`,
    GET_BY_PROPERTIES: (id) => `/Booking/Properties/${id}`,
    GET_BY_USER: (id) => `/Booking/user/${id}`,
    UPDATE_STATUS: (id) => `/Booking/${id}`,
    UPDATE_DATES: (userId, adId) => `/Booking/${userId}/Properties/${adId}`,
    CANCEL: (id) => `/Booking/${id}/Cancel`,
  },
  DATA: {
    GET_COUNTRIES: () => `data/countries`,

    GET_GOVERNRATES: (country_id) =>
      country_id
        ? `data/governorates?country_id=${country_id}`
        : `data/governorates`,

    GET_CITIES: (governorate_id) =>
      governorate_id
        ? `data/cities?governorate_id=${governorate_id}`
        : `data/cities`,

    GET_AREAS: (city_id) =>
      city_id ? `data/areas?city_id=${city_id}` : `data/areas`,

    GET_COMPOUNDS: (area_id) =>
      area_id ? `data/compounds?area_id=${area_id}` : `data/compounds`,

    GET_CATEGORIES: () => `data/categories`,

    GET_SUBCATEGORIES: (category_id) =>
      category_id
        ? `data/subcategories?category_id=${category_id}`
        : `data/subcategories`,
  },
};
