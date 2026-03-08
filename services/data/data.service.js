import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const getCountries = () => {
  return api.get(ENDPOINTS.DATA.GET_COUNTRIES());
};

export const getGovernorates = (country_id) => {
  return api.get(ENDPOINTS.DATA.GET_GOVERNRATES(country_id));
};

export const getCities = (governorate_id) => {
  return api.get(ENDPOINTS.DATA.GET_CITIES(governorate_id));
};

export const getAreas = (city_id) => {
  return api.get(ENDPOINTS.DATA.GET_AREAS(city_id));
};

export const getCompounds = (area_id) => {
  return api.get(ENDPOINTS.DATA.GET_COMPOUNDS(area_id));
};

export const getCategories = () => {
  return api.get(ENDPOINTS.DATA.GET_CATEGORIES());
};

export const getSubCategories = (category_id) => {
  return api.get(ENDPOINTS.DATA.GET_SUBCATEGORIES(category_id));
};
