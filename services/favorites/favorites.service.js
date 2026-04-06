import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */
export const toggleFavorite = (id) => {
  return api.post(ENDPOINTS.FAVORITES.TOGGLE_FAVORITES(id));
};

export const getFavorites = (page, limit) => {
  return api.get(ENDPOINTS.FAVORITES.GET_FAVORITES(page, limit));
};
