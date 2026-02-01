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
  limit = 10,
}) {
  const t = useTranslate();
  const inputFileRef = useRef(null);

  const [isDrag, setIsDrag] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isInvalid = images?.length === 0 && isSubmitted;

  const helperText =
    limit === 1 ? t.ad.images?.helperTextSingle : t.ad.images?.helperText;

  const handleFiles = (files) => {
    setErrorMessage("");

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (images.length + imageFiles.length > limit) {
      setErrorMessage(t.ad.images?.errors.maxLimit?.replace("{limit}", limit));
      return;
    }

    if (limit === 1 && imageFiles.length > 0) {
      setImages([imageFiles[0]]);
    } else {
      setImages((prev) => [...prev, ...imageFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleInputChange = (e) => {
    handleFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setErrorMessage("");
  };

  return (
    <div className={`box forInput ${disabled ? "disabled" : ""}`}>
      <label>
        {t.ad.images?.label}
        {limit > 1 && ` (${limit} ${t.ad.images?.max})`}
        {limit === 1 && ` (${t.ad.images?.single})`}
      </label>

      <div className={`images-uplouder ${isInvalid ? "invalid" : ""}`}>
        <div
          className={`upload-label ${isDrag ? "active" : ""} ${limit}-image`}
          onClick={() =>
            !disabled && images.length < limit && inputFileRef.current.click()
          }
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && images.length < limit) {
              setIsDrag(true);
            }
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

              {images.length < limit ? (
                <h1>
                  {isDrag ? t.ad.images?.dropHere : t.ad.images?.clickHere}
                </h1>
              ) : (
                <h1 className="limit-reached">{t.ad.images?.limitReached}</h1>
              )}
            </>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          multiple={limit > 1}
          hidden
          ref={inputFileRef}
          disabled={disabled || images.length >= limit}
          onChange={handleInputChange}
        />

        <div className={`imgHolder ${limit === 1 ? "single-image" : ""}`}>
          {images?.map((image, index) => (
            <div className="uploaded" key={index}>
              <Image
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
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
          ))}
        </div>
      </div>

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
