import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */
export const getSectionsAds = (type, id, page, limit) => {
  return api.get(ENDPOINTS.ADS.GET_SECTIONS_ADS(type, id, page, limit));
};
export const getAllAds = (filters) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined),
  );
  return api.get(ENDPOINTS.ADS.GET_ALL(), { params });
};
export const getOneAd = (id) => {
  return api.get(ENDPOINTS.ADS.GET_ONE_AD(id));
};
export const userAds = (id, status, search, page, limit) => {
  return api.get(ENDPOINTS.ADS.GET_USER_ADS(id, status, search, page, limit));
};
export const crateAd = (payload) => {
  return api.post(ENDPOINTS.ADS.CREATE(), payload);
};
export const updateAd = (id, payload) => {
  return api.put(ENDPOINTS.ADS.UPDATE(id), payload);
};
export const deleteAd = (id) => {
  return api.delete(ENDPOINTS.ADS.DELETE(id));
};
export const assignAdmin = (ad, payload) => {
  return api.patch(ENDPOINTS.ADS.ASSIGN_ADMIN(ad), payload);
};
export const changeStatus = (ad, payload) => {
  return api.patch(ENDPOINTS.ADS.SHANGE_STATUS(ad), payload);
};
