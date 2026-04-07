import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const getAllSliders = (page, limit) => {
  return api.get(ENDPOINTS.SLIDERS.GET_ALL(page, limit));
};
export const getOneSlider = (id) => {
  return api.get(ENDPOINTS.SLIDERS.GET_ONE(id));
};
export const createSlider = (payload) => {
  return api.post(ENDPOINTS.SLIDERS.CREATE(), payload);
};
export const updateSlider = (id, payload) => {
  return api.put(ENDPOINTS.SLIDERS.UPDATE(id), payload);
};
export const deleteSlider = (id) => {
  return api.delete(ENDPOINTS.SLIDERS.DELETE(id));
};