import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */
export const getAdsBySub = (entity_type, entity_id, payload) => {
  return api.post(ENDPOINTS.IMAGES.ADD(entity_type, entity_id), payload);
};
export const getOneAd = (entity_type, entity_id, image_id) => {
  return api.delete(ENDPOINTS.IMAGES.DELETE(entity_type, entity_id, image_id));
};
export const crateAd = (entity_type, entity_id, image_id, payload) => {
  return api.patch(
    ENDPOINTS.IMAGES.EDIT(entity_type, entity_id, image_id),
    payload,
  );
};
