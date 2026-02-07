import { CircleAlert } from "lucide-react";

export default function DeleteConfirm({
  message = "Are you sure you want to delete this item?",
  onConfirm,
  onCancel,
  loading,
}) {
  console.log(loading);
  
  return (
    <div className="confirm-box">
      <div className="warning">
        <CircleAlert />
        <p>{message}</p>
      </div>

      <div className="buttons-holder">
        <button type="button" className="main-button cancel" onClick={onCancel}>
          Cancel
        </button>{" "}
        <button
          type="button"
          className="main-button danger"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? <span class="loader"></span> : "Delete"}
        </button>
      </div>
    </div>
  );
}
