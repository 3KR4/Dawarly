import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { selectors } from "@/Contexts/selectors";
import useTranslate from "@/Contexts/useTranslation";

const parseTagsText = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export default function Tags({ disabled = false, inputMode = "chips" }) {
  const {
    tags,
    setTags,
    compsInput,
    updateCompsError,
    compsErrors,
    updateCompsInput,
  } = useContext(selectors);

  const t = useTranslate();
  const [rawTagsText, setRawTagsText] = useState(tags.join(","));
  const skipNextRawSync = useRef(false);

  useEffect(() => {
    if (inputMode !== "textarea") return;

    if (skipNextRawSync.current) {
      skipNextRawSync.current = false;
      return;
    }

    queueMicrotask(() => {
      setRawTagsText(tags.join(","));
    });
  }, [inputMode, tags]);

  const addTag = () => {
    const trimmed = compsInput.tags.trim();

    if (!trimmed || trimmed.length < 3) {
      updateCompsError("tags", t.ad.tags.errors.minLength);
      return;
    }

    if (tags.includes(trimmed.toLowerCase())) {
      updateCompsError("tags", t.ad.tags.errors.duplicate);
      return;
    }

    setTags([...tags, trimmed.toLowerCase()]);
    updateCompsInput("tags", "");
    updateCompsError("tags", "");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    updateCompsError("tags", "");
  };

  if (inputMode === "textarea") {
    return (
      <div className={`box forInput ${disabled ? "disabled" : ""}`}>
        <label>{t.ad.tags.label}</label>

        <div className="inputHolder tags">
          <div className="holder">
            <textarea
              value={rawTagsText}
              onChange={(e) => {
                const value = e.target.value;
                setRawTagsText(value);
                skipNextRawSync.current = true;
                setTags(parseTagsText(value));
                updateCompsError("tags", "");
              }}
              placeholder={t.ad.tags.placeholder}
              rows={3}
              disabled={disabled}
            />
          </div>
          {compsErrors.tags && (
            <span className="error">
              <CircleAlert />
              {compsErrors.tags}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`box forInput ${disabled ? "disabled" : ""}`}>
      <label>{t.ad.tags.label}</label>

      <div className="inputHolder tags">
        {!disabled && (
          <div className="holder flex">
            <input
              value={compsInput.tags}
              onChange={(e) => {
                updateCompsInput("tags", e.target.value);
                updateCompsError("tags", "");
              }}
              placeholder={t.ad.tags.placeholder}
            />

            <button
              className="main-button for-tags"
              type="button"
              onClick={addTag}
            >
              {t.ad.tags.add}
            </button>
          </div>
        )}
        {compsErrors.tags && (
          <span className="error">
            <CircleAlert />
            {compsErrors.tags}
          </span>
        )}

        {tags.length > 0 && (
          <div className="tagsList">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="tag"
                onClick={() => {
                  !disabled && removeTag(i);
                }}
              >
                {tag}
                {!disabled && <IoClose />}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
