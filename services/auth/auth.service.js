import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */
export const registerUser = (payload) => {
  return api.post(ENDPOINTS.AUTH.REGISTER(), payload);
};
export const loginUser = (payload) => {
  return api.post(ENDPOINTS.AUTH.LOGIN(), payload);
};

/* ================= VERIFY OTP ================= */
export const verifyUserOtp = (payload) => {
  return api.post(ENDPOINTS.AUTH.VERIFY(), payload);
};

/* ================= RESEND OTP ================= */
export const resendEmailOtp = (payload) => {
  return api.post(ENDPOINTS.AUTH.RESEND_EMAIL(), payload);
};
export const forgetPassword = (email) => {
  return api.post(ENDPOINTS.AUTH.FORGET_PASSWORD(), { email });
};

// اعادة تعيين الباسورد: نرسل الايميل + OTP + الباسورد الجديد
export const resetPassword = (payload) => {
  return api.post(ENDPOINTS.AUTH.RESET_PASSWORD(), payload);
};
/* ================= REFRESH TOKEN ================= */
export const refreshToken = () => {
  return api.post(ENDPOINTS.AUTH.REFRESH());
};

/* ================= GET CURRENT USER ================= */
export const getAllUsers = () => {
  return api.get(ENDPOINTS.AUTH.All_USERS());
};
/* ================= GET CURRENT USER ================= */
export const getOneUser = (id) => {
  return api.get(ENDPOINTS.AUTH.ONE_USER(id));
};
export const getCurrentUser = () => {
  return api.get(ENDPOINTS.AUTH.ME());
};
