import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */
export const registerUser = (payload) => {
  return api.post(ENDPOINTS.AUTH.REGISTER, payload);
};
export const loginUser = (payload) => {
  return api.post(ENDPOINTS.AUTH.LOGIN, payload);
};

/* ================= VERIFY OTP ================= */
export const verifyUserOtp = (userId, otp) => {
  return api.post(ENDPOINTS.AUTH.VERIFY(userId), { otp });
};

/* ================= RESEND OTP ================= */
export const resendEmailOtp = (userId) => {
  return api.post(ENDPOINTS.AUTH.RESEND_EMAIL(userId));
};
