import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */
export const getAdsBySub = (cat, id) => {
  return api.get(ENDPOINTS.ADS.GET_BY_SUB(cat, id));
};
export const getOneAd = (cat, id) => {
  return api.get(ENDPOINTS.ADS.GET_ONE_AD(cat, id));
};
export const crateAd = (cat, subId, payload) => {
  return api.post(ENDPOINTS.ADS.CREATE(cat, subId), payload);
};
export const updateAd = (cat, id, payload) => {
  return api.put(ENDPOINTS.ADS.UPDATE(cat, id), payload);
};
export const deleteAd = (cat, id) => {
  return api.post(ENDPOINTS.ADS.DELETE(cat, id));
};