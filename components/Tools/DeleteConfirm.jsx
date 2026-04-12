"use client";

import { useState } from "react";
import { CircleAlert } from "lucide-react";
import useTranslate from "@/Contexts/useTranslation";

export default function DeleteConfirm({
  menuType,
  onConfirm,
  onCancel,
  loading,
  rejectInput,
  setRejectInput,
}) {
  const t = useTranslate();
  const [fieldError, setFieldError] = useState(null);

  const handleConfirm = async () => {
    try {
      if (menuType === "delete") {
        await onConfirm?.();
        onCancel();
        return;
      }

      if (!rejectInput || rejectInput.trim().length < 3) {
        setFieldError("Please enter a valid reason");
        return;
      }

      setFieldError(null);

      await onConfirm?.(rejectInput);
      onCancel();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="confirm-box">
      {/* DELETE MESSAGE */}
      {menuType === "delete" && (
        <div className="warning">
          <CircleAlert />
          <p>This item will be permanently deleted</p>
        </div>
      )}

      {/* REJECT INPUT */}
      {menuType === "reject" && (
        <div className="box forInput" style={{ marginBottom: "8px" }}>
          <div className="inputHolder">
            <div className="holder">
              <input
                type="text"
                value={rejectInput || ""}
                onChange={(e) => {
                  setRejectInput(e.target.value);
                  if (fieldError) setFieldError(null);
                }}
                placeholder={t.ad?.theRejectReason || "Type the reject reason"}
              />
            </div>

            {fieldError && (
              <span className="error">
                <CircleAlert />
                {fieldError}
              </span>
            )}
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div className="buttons-holder">
        <button type="button" className="main-button cancel" onClick={onCancel}>
          Cancel
        </button>

        <button
          type="button"
          className="main-button danger"
          disabled={loading}
          onClick={handleConfirm}
        >
          {loading ? (
            <span className="loader"></span>
          ) : menuType === "delete" ? (
            "Delete"
          ) : (
            "Reject"
          )}
        </button>
      </div>
    </div>
  );
}
