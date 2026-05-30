import api, { plainApi } from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */
export const getSectionsAds = (params) => {
  return api.get(ENDPOINTS.ADS.GET_SECTIONS_ADS(params));
};
export const getAllAds = (filters) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined),
  );
  return api.get(ENDPOINTS.ADS.GET_ALL(), { params });
};
export const getOneAd = (tableId, adId, params) => {
  return api.get(ENDPOINTS.ADS.GET_ONE_AD(tableId, adId, params));
};
export const userAds = (id, status, search, page, limit) => {
  return api.get(ENDPOINTS.ADS.GET_USER_ADS(id, status, search, page, limit));
};
export const crateAd = (tableId, payload) => {
  return api.post(ENDPOINTS.ADS.CREATE(tableId), payload);
};
export const createAnonymousAd = (tableId, payload) => {
  return plainApi.post(ENDPOINTS.ADS.CREATE(tableId), payload);
};
export const updateAd = (tableId, adId, payload) => {
  return api.patch(ENDPOINTS.ADS.UPDATE(tableId, adId), payload);
};
export const deleteAd = (tableId, adId) => {
  return api.delete(ENDPOINTS.ADS.DELETE(tableId, adId));
};
export const assignAdmin = (tableId, adId, payload) => {
  return api.patch(ENDPOINTS.ADS.ASSIGN_ADMIN(tableId, adId), payload);
};
export const changeStatus = (tableId, adId, payload) => {
  return api.patch(ENDPOINTS.ADS.SHANGE_STATUS(tableId, adId), payload);
};
