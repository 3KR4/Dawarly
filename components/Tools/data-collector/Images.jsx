"use client";

import React, { useState, useRef, useEffect } from "react";
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
  limit = 25,
  label = true,

  // ===== BLOG vs SECTION MODE =====
  sectionMode = false,
}) {
  const t = useTranslate();

  const inputFileRef = useRef(null);

  const [isDrag, setIsDrag] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const safeImages = Array.isArray(images) ? images : [];

  const isInvalid = safeImages.length === 0 && isSubmitted;

  const helperText =
    limit === 1 ? t.ad.images?.helperTextSingle : t.ad.images?.helperText;

  // ================= CLEANUP OBJECT URLS =================
  useEffect(() => {
    return () => {
      safeImages.forEach((img) => {
        if (img?.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  // ================= GET IMAGE SRC =================
  const getImageSrc = (img) => {
    if (!img) return "";

    // uploaded image from backend
    if (img.secure_url) return img.secure_url;

    // processed local image
    if (img.preview) return img.preview;

    // string url
    if (typeof img === "string") return img;

    return "";
  };

  // ================= ADD FILES =================
  const handleFiles = (files) => {
    setErrorMessage("");

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const safePrev = Array.isArray(images) ? images : [];

    if (safePrev.length + imageFiles.length > limit) {
      setErrorMessage(t.ad.images?.errors.maxLimit?.replace("{limit}", limit));
      return;
    }

    // ===== PROCESS FILES =====
    const processedImages = imageFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    const newImages =
      limit === 1 ? [processedImages[0]] : [...safePrev, ...processedImages];

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

      const removedImage = updated[index];

      // cleanup preview memory
      if (removedImage?.preview) {
        URL.revokeObjectURL(removedImage.preview);
      }

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
          {safeImages?.map((image, index) => (
            <div
              className="uploaded"
              key={
                image?.id || image?.secure_url || image?.preview || `${index}`
              }
            >
              <Image
                src={getImageSrc(image)}
                alt={`image-${index}`}
                width={150}
                height={150}
                unoptimized
              />

              {!sectionMode && <p>{index + 1}</p>}

              {!disabled && (
                <IoClose onClick={() => handleRemoveImage(index)} />
              )}
            </div>
          ))}
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