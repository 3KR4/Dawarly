import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */
export const getAdsBySub = (cat, id) => {
  return api.get(ENDPOINTS.ADS.GET_BY_SUB(cat, id));
};
export const getAllAds = (filters) => {
  return api.get(ENDPOINTS.ADS.GET_ALL(), {
    params: filters,
  });
};
export const getOneAd = (id) => {
  return api.get(ENDPOINTS.ADS.GET_ONE_AD(id));
};
export const crateAd = (payload) => {
  return api.post(ENDPOINTS.ADS.CREATE(), payload);
};
export const updateAd = (id, payload) => {
  return api.put(ENDPOINTS.ADS.UPDATE(id), payload);
};
export const deleteAd = (cat, id) => {
  return api.post(ENDPOINTS.ADS.DELETE(cat, id));
};
