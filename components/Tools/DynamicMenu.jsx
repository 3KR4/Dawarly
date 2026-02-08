"use client";

import { FaArrowLeft } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

export default function DynamicMenu({
  open,
  title,
  descriptions,
  children,
  onClose,
  step,
  setStep,
}) {
  if (!open) return null;

  return (
    <div className="dynamic-menu" onClick={onClose}>
      <div className="holder" onClick={(e) => e.stopPropagation()}>
        <div className="top">
          <FaArrowLeft
            className="arrow"
            style={{
              padding: "5px",
              visibility: step > 1 ? "visible" : "hidden",
            }}
            onClick={() => setStep((prev) => prev - 1)}
          />
          <h4 className="title">{title}</h4>

          <IoIosClose className="close" onClick={onClose} />
        </div>
        {descriptions && (
          <p style={{ textAlign: "center" }} className="descriptions">
            {descriptions}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
