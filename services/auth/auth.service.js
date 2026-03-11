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
export const verifyUserOtp = (userId, otp) => {
  return api.post(ENDPOINTS.AUTH.VERIFY(userId), { otp });
};

/* ================= RESEND OTP ================= */
export const resendEmailOtp = (userId) => {
  return api.post(ENDPOINTS.AUTH.RESEND_EMAIL(userId));
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