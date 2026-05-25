import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const toggleFavorite = (tableId, adId) => {
  if (!tableId || !adId) {
    return Promise.reject(new Error("tableId and adId are required"));
  }

  return api.post(ENDPOINTS.FAVORITES.TOGGLE_FAVORITES(tableId, adId));
};

export const getFavorites = (page, limit) => {
  return api.get(ENDPOINTS.FAVORITES.GET_FAVORITES(page, limit));
};
