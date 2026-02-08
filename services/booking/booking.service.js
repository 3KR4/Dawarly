import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= BOOKING ================= */
export const getBookingByProperties = (id) => {
  return api.get(ENDPOINTS.BOOKING.GET_BY_PROPERTIES(id));
};
export const getBookingByUser = (id) => {
  return api.get(ENDPOINTS.BOOKING.GET_BY_USER(id));
};
export const crateBooking = (id, payload) => {
  return api.post(ENDPOINTS.BOOKING.CREATE(id), payload);
};
export const updateBookingStatus = (id, payload) => {
  return api.put(ENDPOINTS.BOOKING.UPDATE_STATUS(id), payload);
};
export const updateBookingDates = (userId, adId, payload) => {
  return api.put(ENDPOINTS.BOOKING.UPDATE_DATES(userId, adId), payload);
};
export const cancelBooking = (id) => {
  return api.put(ENDPOINTS.BOOKING.CANCEL(id));
};
