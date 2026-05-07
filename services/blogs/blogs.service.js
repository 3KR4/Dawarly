import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const getAllBlogs = (page = 1, limit = 8, status, search) => {
  return api.get(ENDPOINTS.BLOGS.GET_ALL(page, limit, status, search));
};
export const getOneBlog = (slug) => {
  return api.get(ENDPOINTS.BLOGS.GET_ONE(slug));
};
export const createBlog = (payload) => {
  return api.post(ENDPOINTS.BLOGS.CREATE(), payload);
};
export const updateBlog = (id, payload) => {
  return api.patch(ENDPOINTS.BLOGS.UPDATE(id), payload);
};
export const deleteBlog = (id) => {
  return api.delete(ENDPOINTS.BLOGS.DELETE(id));
};
