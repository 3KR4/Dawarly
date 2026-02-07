"use client";

import { IoIosClose } from "react-icons/io";

export default function DynamicMenu({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="dynamic-menu" onClick={onClose}>
      <div className="holder" onClick={(e) => e.stopPropagation()}>
        <div className="top">
          <div style={{ width: "30px" }} />
          <h4 className="title">{title}</h4>
          <IoIosClose className="close" onClick={onClose} />
        </div>

        {children}
      </div>
    </div>
  );
}
