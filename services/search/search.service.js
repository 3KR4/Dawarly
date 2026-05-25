import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const getHeaderSearch = (text, limit = 4, signal) => {
  return api.get(ENDPOINTS.SEARCH.HEADER(text, limit), { signal });
};
