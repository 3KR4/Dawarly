import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= SUBCATEGORIES ================= */

export const getAllSubCats = (lang) => {
  return api.get(ENDPOINTS.SUBCATEGORIES.GETALL(lang));
};
export const getOneSubCat = (id, lang) => {
  return api.get(ENDPOINTS.SUBCATEGORIES.GETBYId(id, lang));
};
export const getSubCatByCat = (id, lang) => {
  return api.get(ENDPOINTS.SUBCATEGORIES.GETBYCAT(id, lang));
};
export const createSubCat = (payload) => {
  return api.post(ENDPOINTS.SUBCATEGORIES.CREATE, payload);
};
export const updateSubCat = (id, payload) => {
  return api.put(ENDPOINTS.SUBCATEGORIES.UPDATE(id), payload);
};
export const updateSubCatLang = (id, payload) => {
  return api.put(ENDPOINTS.SUBCATEGORIES.UPDATE_LANG(id), payload);
};
export const deleteSubCat = (id) => {
  return api.delete(ENDPOINTS.SUBCATEGORIES.DELETE(id));
};
