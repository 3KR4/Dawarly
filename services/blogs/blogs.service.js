import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const getAllSBlogs = (page = 1, limit = 10) => {
  return api.get(ENDPOINTS.BLOGS.GET_ALL(page, limit));
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
