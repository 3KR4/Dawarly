"use client";
import React, { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import "@/styles/dashboard/forms.css";
import useTranslate from "@/Contexts/useTranslation";

function Images({
  images,
  setImages,
  isSubmitted,
  disabled = false,
  limit = 15,
  label = true,
  // ===== BLOG vs SECTION MODE =====
  sectionMode = false,
  sectionId = null,
  setSections = null,
}) {
  const t = useTranslate();
  const inputFileRef = useRef(null);

  const [isDrag, setIsDrag] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const safeImages = Array.isArray(images) ? images : [];

  const isInvalid = safeImages.length === 0 && isSubmitted;

  const helperText =
    limit === 1 ? t.ad.images?.helperTextSingle : t.ad.images?.helperText;

  // ================= ADD FILES =================
  const handleFiles = (files) => {
    setErrorMessage("");

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const safePrev = Array.isArray(images) ? images : [];

    if (safePrev.length + imageFiles.length > limit) {
      setErrorMessage(t.ad.images?.errors.maxLimit?.replace("{limit}", limit));
      return;
    }

    const newImages =
      limit === 1 ? [imageFiles[0]] : [...safePrev, ...imageFiles];

    setImages(newImages);
  };

  // ================= DROP =================
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  // ================= INPUT =================
  const handleInputChange = (e) => {
    handleFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  // ================= REMOVE =================
  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      const updated = [...safe];
      updated.splice(index, 1);
      return updated;
    });
  };
  return (
    <div className={`box forInput ${disabled ? "disabled" : ""}`}>
      {label && (
        <label>
          {t.ad.images?.label}
          {limit > 1 && ` (${limit} ${t.ad.images?.max})`}
          {limit === 1 && ` (${t.ad.images?.single})`}
        </label>
      )}

      <div className={`images-uplouder ${isInvalid ? "invalid" : ""}`}>
        {/* ================= UPLOAD AREA ================= */}
        <div
          className={`upload-label ${isDrag ? "active" : ""}`}
          onClick={() => {
            if (!disabled && safeImages.length < limit) {
              inputFileRef.current?.click();
            }
          }}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDrag(true);
          }}
          onDragLeave={() => setIsDrag(false)}
        >
          <FaCloudUploadAlt />

          {disabled ? (
            <p className="disapled-images-label">
              {t.ad.images?.disabledLabel}
            </p>
          ) : (
            <>
              <p>{helperText}</p>

              {safeImages.length < limit ? (
                <h1>
                  {isDrag ? t.ad.images?.dropHere : t.ad.images?.clickHere}
                </h1>
              ) : (
                <h1 className="limit-reached">{t.ad.images?.limitReached}</h1>
              )}
            </>
          )}
        </div>

        {/* ================= INPUT ================= */}
        <input
          type="file"
          accept="image/*"
          multiple={limit > 1 && !sectionMode}
          hidden
          ref={inputFileRef}
          disabled={disabled}
          onChange={handleInputChange}
        />

        {/* ================= PREVIEW ================= */}
        <div className={`imgHolder ${limit === 1 ? "single-image" : ""}`}>
          {/* ================= SECTION MODE PREVIEW ================= */}
          {sectionMode ? (
            safeImages.length === 0 ? null : (
              <div className="uploaded">
                <Image
                  src={
                    safeImages[0]?.secure_url ||
                    URL.createObjectURL(safeImages[0])
                  }
                  alt="section-image"
                  width={150}
                  height={150}
                />
                {!disabled && <IoClose onClick={() => handleRemoveImage(0)} />}
              </div>
            )
          ) : (
            // ================= BLOG MODE PREVIEW =================
            safeImages?.map((image, index) => {
              console.log(image);

              return (
                <div className="uploaded" key={index}>
                  <Image
                    src={
                      image?.secure_url
                        ? image?.secure_url
                        : URL.createObjectURL(image)
                    }
                    alt={`image-${index}`}
                    width={150}
                    height={150}
                  />

                  <p>{index + 1}</p>

                  {!disabled && (
                    <IoClose onClick={() => handleRemoveImage(index)} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= ERRORS ================= */}
      {errorMessage && (
        <span className="error">
          <CircleAlert />
          {errorMessage}
        </span>
      )}

      {isInvalid && (
        <span className="error">
          <CircleAlert />
          {t.ad.images?.errors.required}
        </span>
      )}
    </div>
  );
}

export default Images;
