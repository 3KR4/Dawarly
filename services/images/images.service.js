import api from "../axios";
import { ENDPOINTS } from "../endpoints";

/* ================= REGISTER ================= */

export const uploadImages = (
  entity_type,
  entity_id,
  payload,
  table_id = null,
) => {
  return api.post(
    ENDPOINTS.IMAGES.ADD(entity_type, entity_id, table_id),
    payload,
  );
};
export const deleteImage = (entity_type, entity_id, image_id) => {
  return api.delete(ENDPOINTS.IMAGES.DELETE(entity_type, entity_id, image_id));
};
export const updateImage = (entity_type, entity_id, image_id, payload) => {
  return api.patch(
    ENDPOINTS.IMAGES.EDIT(entity_type, entity_id, image_id),
    payload,
  );
};
