import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */
export const registerUser = (payload) => {
  return api.post(ENDPOINTS.AUTH.REGISTER(), payload);
};
export const loginUser = (payload) => {
  return api.post(ENDPOINTS.AUTH.LOGIN(), payload);
};
export const verifyUserOtp = (payload) => {
  return api.post(ENDPOINTS.AUTH.VERIFY(), payload);
};
export const resendEmailOtp = (payload) => {
  return api.post(ENDPOINTS.AUTH.RESEND_EMAIL(), payload);
};
export const forgetPassword = (email) => {
  return api.post(ENDPOINTS.AUTH.FORGET_PASSWORD(), { email });
};
export const resetPassword = (payload) => {
  return api.post(ENDPOINTS.AUTH.RESET_PASSWORD(), payload);
};
export const change_password = (payload) => {
  return api.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD(), payload);
};

export const refreshToken = () => {
  return api.post(ENDPOINTS.AUTH.REFRESH());
};
/* ================= Get ================= */
export const getAllUsers = (search, user_type, permissions, page, limit) => {
  return api.get(
    ENDPOINTS.AUTH.All_USERS(search, user_type, permissions, page, limit),
  );
};
export const getOneUser = (id) => {
  return api.get(ENDPOINTS.AUTH.ONE_USER(id));
};
export const getCurrentUser = () => {
  return api.get(ENDPOINTS.AUTH.ME());
};

/* ================= Update ================= */
export const updateUserProfile = (payload) => {
  return api.patch(ENDPOINTS.AUTH.UPDATE_USER_PROFILE(), payload);
};
export const updateSubscriperProfile = (payload) => {
  return api.patch(ENDPOINTS.AUTH.UPDATE_SUBSCRIBER_PROFILE(), payload);
};
export const deleteUser = (id) => {
  return api.delete(ENDPOINTS.AUTH.DELETE_USER(id));
};
export const updatePermissions = (id, payload) => {
  return api.patch(ENDPOINTS.AUTH.UPDATE_PERMISSIONS(id), payload);
};
export const updateRole = (id, payload) => {
  return api.patch(ENDPOINTS.AUTH.UPDATE_ROLE(id), payload);
};
export const make_suber_admin = (id, payload) => {
  return api.patch(ENDPOINTS.AUTH.MAKE_SUBER_ADMIN(id), payload);
};
export const change_ads_limit = (id, payload) => {
  return api.patch(ENDPOINTS.AUTH.CHANGE_ADS_LIMIT(id), payload);
};
