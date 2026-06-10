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

const omitKeys = (filters = {}, keys = []) => {
  const omitted = new Set(keys);

  return Object.fromEntries(
    Object.entries(filters).filter(
      ([key, value]) =>
        !omitted.has(key) && value !== null && value !== undefined && value !== "",
    ),
  );
};

export const getAdsRangeMeta = async (filters = {}) => {
  const sharedKeysToOmit = ["page", "limit", "sort", "order", "details_mode"];
  const [priceRes, areaRes] = await Promise.all([
    getAllAds(omitKeys(filters, [...sharedKeysToOmit, "min_price", "max_price"])),
    getAllAds(
      omitKeys(filters, [...sharedKeysToOmit, "min_area_m2", "max_area_m2"]),
    ),
  ]);

  return {
    max_price: priceRes.data?.meta?.max_price,
    max_area_m2: areaRes.data?.meta?.max_area_m2,
    price_currency:
      priceRes.data?.meta?.price_currency || areaRes.data?.meta?.price_currency,
  };
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
