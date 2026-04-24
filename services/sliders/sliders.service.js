import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const getAllSliders = (page = 1, limit = 100, active_only = true) => {
  return api.get(ENDPOINTS.SLIDERS.GET_ALL(page, limit, active_only));
};
export const getOneSlider = (id) => {
  return api.get(ENDPOINTS.SLIDERS.GET_ONE(id));
};
export const createSlider = (payload) => {
  return api.post(ENDPOINTS.SLIDERS.CREATE(), payload);
};
export const updateSlider = (id, payload) => {
  return api.patch(ENDPOINTS.SLIDERS.UPDATE(id), payload);
};
export const deleteSlider = (id) => {
  return api.delete(ENDPOINTS.SLIDERS.DELETE(id));
};
