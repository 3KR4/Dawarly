import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const getCountries = (table_id) => {
  return api.get(ENDPOINTS.DATA.GET_COUNTRIES(table_id));
};

export const getGovernorates = (country_id, table_id) => {
  return api.get(ENDPOINTS.DATA.GET_GOVERNRATES(country_id, table_id));
};

export const getCities = (governorate_id, table_id) => {
  return api.get(ENDPOINTS.DATA.GET_CITIES(governorate_id, table_id));
};

export const getAreas = (city_id, table_id) => {
  return api.get(ENDPOINTS.DATA.GET_AREAS(city_id, table_id));
};

export const getCompounds = (area_id, table_id) => {
  return api.get(ENDPOINTS.DATA.GET_COMPOUNDS(area_id, table_id));
};

export const getTables = () => {
  return api.get(ENDPOINTS.DATA.GET_TABLES());
};
export const getCategories = () => {
  return api.get(ENDPOINTS.DATA.GET_CATEGORIES());
};

export const getSubCategories = (category_id) => {
  return api.get(ENDPOINTS.DATA.GET_SUBCATEGORIES(category_id));
};

export const createModel = (model,payload) => {
  return api.post(ENDPOINTS.DATA.CREATE_MODEL(model), payload);
};
export const updateModel = (model, id, payload) => {
  return api.put(ENDPOINTS.DATA.UPDATE_MODEL(model, id), payload);
};
export const deleteModel = (model, id ) => {
  return api.delete(ENDPOINTS.DATA.DELETE_MODEL(model, id));
};

