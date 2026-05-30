export const ENDPOINTS = {
  AUTH: {
    REGISTER: () => "/auth/register",
    LOGIN: () => "/auth/login",
    VERIFY: () => `/auth/verify-email/`,
    RESEND_EMAIL: () => `/auth/resend-otp/`,
    FORGET_PASSWORD: () => `/auth/forgot-password/`,
    RESET_PASSWORD: () => `/auth/reset-password/`,
    CHANGE_PASSWORD: () => `/auth/change-password/`,
    REFRESH: () => "/auth/refresh-token",
    All_USERS: (search, user_type, permissions, page, limit) =>
      `/auth/users?search=${search}&user_type=${user_type}&permissions=${permissions}&page=${page}&limit=${limit}`,
    DELETE_USER: (id) => `/auth/delete/${id}`,
    ONE_USER: (id) => `/auth/users/${id}`,
    ME: () => "/auth/me",
    UPDATE_USER_PROFILE: () => `/auth/profile`,
    UPDATE_USER_BASIC_INFO: (id) => `/auth/users/${id}/basic-info`,
    UPDATE_SUBSCRIBER_PROFILE: () => `/auth/subuser-profile`,
    UPDATE_PERMISSIONS: (id) => `/auth/${id}/permissions`,
    MAKE_SUBER_ADMIN: (id) => `/auth/${id}/super-admin`,
    CHANGE_ADS_LIMIT: (id) => `/auth/${id}/subscription-limit`,
    UPDATE_ROLE: (id) => `/auth/${id}/role`,
  },
  ADS: {
    GET_SECTIONS_ADS: (params = {}) => {
      const query = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          query.append(key, value);
        }
      });

      return `/ads/sections?${query.toString()}`;
    },
    GET_ALL: () => `/ads/all`,
    GET_ONE_AD: (tableId, adId, params = {}) => {
      const query = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          query.append(key, value);
        }
      });

      const queryString = query.toString();
      return `/ads/${tableId}/${adId}${queryString ? `?${queryString}` : ""}`;
    },
    GET_USER_ADS: (id, status, search, page, limit) => {
      const params = new URLSearchParams();

      if (status) params.append("status", status);
      if (search) params.append("search", search);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      return `/ads/profile/${id}?${params.toString()}`;
    },
    CREATE: (tableId) => `/ads/create/${tableId}`,
    UPDATE: (tableId, adId) => `/ads/update/${tableId}/${adId}`,
    DELETE: (tableId, adId) => `/ads/delete/${tableId}/${adId}`,
    ASSIGN_ADMIN: (tableId, adId) => `/ads/assign-admin/${tableId}/${adId}`,
    SHANGE_STATUS: (tableId, adId) => `/ads/update/${tableId}/${adId}/status`,
  },
  SLIDERS: {
    GET_ALL: (page, limit, active_only) => {
      const params = new URLSearchParams({
        page,
        limit,
      });

      if (active_only !== null && active_only !== undefined) {
        params.append("active_only", active_only);
      }

      return `/sliders?${params.toString()}`;
    },
    GET_ONE: (id) => `/sliders/${id}`,
    CREATE: () => `/sliders`,
    UPDATE: (id) => `/sliders/${id}`,
    DELETE: (id) => `/sliders/${id}`,
  },
  BLOGS: {
    GET_ALL: (page, limit, status, search, scope) => {
      let url = `/blogs?page=${page}&limit=${limit}`;

      if (status) url += `&status=${status}`;
      if (search) url += `&search=${search}`;
      if (scope) url += `&scope=${scope}`;

      return url;
    },
    GET_ONE: (slug, scope) => `/blogs/${slug}${scope ? `?scope=${scope}` : ""}`,
    CREATE: () => `/blogs`,
    UPDATE: (slug) => `/blogs/${slug}`,
    DELETE: (slug) => `/blogs/${slug}`,
  },
  SEARCH: {
    HEADER: (text, limit = 4) => {
      const params = new URLSearchParams();
      params.append("text", text);
      params.append("limit", limit);
      return `/search/header?${params.toString()}`;
    },
  },
  FAVORITES: {
    TOGGLE_FAVORITES: (tableId, adId) => `/favorites/${tableId}/${adId}`,
    GET_FAVORITES: (page, limit) => `/favorites?page=${page}&limit=${limit}`,
  },
  IMAGES: {
    ADD: (entity_type, entity_id, table_id = null) =>
      `/images/${entity_type}/${table_id ?? 0}/${entity_id}`,
    DELETE: (entity_type, entity_id, image_id) =>
      `/images/${entity_type}/${entity_id}/${image_id}`,
    EDIT: (entity_type, entity_id, image_id) =>
      `/images/${entity_type}/${entity_id}/${image_id}`,
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
    GET_COUNTRIES: (table_id) => {
      const params = new URLSearchParams();
      if (table_id) params.append("table_id", table_id);
      const query = params.toString();
      return query ? `data/countries?${query}` : `data/countries`;
    },
    GET_GOVERNRATES: (country_id, table_id) => {
      const params = new URLSearchParams();
      if (country_id) params.append("country_id", country_id);
      if (table_id) params.append("table_id", table_id);
      const query = params.toString();
      return query ? `data/governorates?${query}` : `data/governorates`;
    },
    GET_CITIES: (governorate_id, table_id) => {
      const params = new URLSearchParams();
      if (governorate_id) params.append("governorate_id", governorate_id);
      if (table_id) params.append("table_id", table_id);
      const query = params.toString();
      return query ? `data/cities?${query}` : `data/cities`;
    },
    GET_AREAS: (city_id, table_id) => {
      const params = new URLSearchParams();
      if (city_id) params.append("city_id", city_id);
      if (table_id) params.append("table_id", table_id);
      const query = params.toString();
      return query ? `data/areas?${query}` : `data/areas`;
    },
    GET_COMPOUNDS: (area_id, table_id) => {
      const params = new URLSearchParams();
      if (area_id) params.append("area_id", area_id);
      if (table_id) params.append("table_id", table_id);
      const query = params.toString();
      return query ? `data/compounds?${query}` : `data/compounds`;
    },
    GET_TABLES: () => `data/tables`,
    GET_CATEGORIES: () => `data/categories`,
    GET_SUBCATEGORIES: (category_id) =>
      category_id
        ? `data/subcategories?category_id=${category_id}`
        : `data/subcategories`,
    CREATE_MODEL: (model) => `data/${model}`,
    UPDATE_MODEL: (model, id) => `data/${model}/${id}`,
    DELETE_MODEL: (model, id) => `data/${model}/${id}`,
  },
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
};
