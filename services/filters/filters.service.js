import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= FILTERS ================= */

export const getAllFilter = (lang) => {
  return api.get(ENDPOINTS.FILTERS.GET_ALL_FILTERS(lang));
};
export const getOneFilter = (id, lang) => {
  return api.get(ENDPOINTS.FILTERS.GET_ONE_FILTER(id));
};
export const getSubFilters = (id, lang) => {
  return api.get(ENDPOINTS.FILTERS.GET_FILTERS_BY_SUB(id, lang));
};
export const createFilter = (id, payload) => {
  return api.post(ENDPOINTS.FILTERS.CREATE_FILTER(id), payload);
};
export const updateFilter = (id, payload) => {
  return api.put(ENDPOINTS.FILTERS.UPDATE_FILTER(id), payload);
};
export const updateFilterLang = (id, payload) => {
  return api.put(ENDPOINTS.FILTERS.UPDATE_FILTER_LANG(id), payload);
};
export const deleteFilter = (id) => {
  return api.delete(ENDPOINTS.FILTERS.DELETE_FILTER(id));
};

/* ================= OPTIONS ================= */

export const getFilterOptions = (id, lang) => {
  return api.get(ENDPOINTS.FILTERS.GET_OPTIONS(id, lang));
};
export const createOption = (id, payload) => {
  return api.post(ENDPOINTS.FILTERS.CREATE_OPTION(id), payload);
};
export const updateOption = (id, payload) => {
  return api.put(ENDPOINTS.FILTERS.UPDATE_OPTION(id), payload);
};
export const updateOptionLang = (id, payload) => {
  return api.put(ENDPOINTS.FILTERS.UPDATE_OPTION_LANG(id), payload);
};
export const deleteOption = (id) => {
  return api.delete(ENDPOINTS.FILTERS.DELETE_OPTION(id));
};