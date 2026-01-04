"use client";
import React, { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import "@/styles/dashboard/forms.css";
import useTranslate from "@/Contexts/useTranslation";

function Images({ images, setImages, isSubmitted }) {
  const t = useTranslate();

  const inputFileRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);

  const isInvalid = images.length === 0 && isSubmitted;

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setImages((prev) => [...prev, ...imageFiles]);
  };

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setImages((prev) => [...prev, ...imageFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="box forInput">
      <label>{t.create.images.label}</label>

      <div className={`images-uplouder ${isInvalid ? "invalid" : ""}`}>
        <div
          className={`upload-label ${isDrag ? "active" : ""}`}
          onClick={() => inputFileRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDrag(true);
          }}
          onDragLeave={() => setIsDrag(false)}
        >
          <FaCloudUploadAlt />

          <p>{t.create.images.helperText}</p>

          <h1>
            {isDrag ? t.create.images.dropHere : t.create.images.clickHere}
          </h1>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          ref={inputFileRef}
          onChange={handleInputChange}
        />

        <div className="imgHolder">
          {images.map((image, index) => (
            <div className="uploaded" key={index}>
              <Image
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Image-${index}`}
                width={150}
                height={150}
              />
              <p>{index + 1}</p>
              <IoClose onClick={() => handleRemoveImage(index)} />
            </div>
          ))}
        </div>
      </div>
      {isInvalid && (
        <span className="error">
          <CircleAlert />
          {t.create.images.errors.required}
        </span>
      )}
    </div>
  );
}

export default Images;
