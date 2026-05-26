"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { CircleAlert } from "lucide-react";
import { settings } from "@/Contexts/settings";
import useTranslate from "@/Contexts/useTranslation";

function SelectOptions({
  size = "large",
  label,
  placeholder,
  options = [],
  value,
  className,
  multi = false,
  onChange,
  type,
  disabled = false,
  hiddenIco = false,
  error,
  required = false,
}) {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");
  const selectRef = useRef(null);

  const getSingleText = useCallback(
    (item) => {
      if (!item) return "";

      if (type === "users") return item.full_name;

      if (type === "date") {
        const rawValue = typeof item === "string" ? item : item?.name || item?.id;
        const date = new Date(rawValue);
        if (isNaN(date)) return rawValue || "";
        return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US");
      }

      return item[`name_${locale}`] || item.name_en || item.name || "";
    },
    [locale, type],
  );

  const getText = useCallback(
    (item) => {
      if (!item) return "";

      if (multi) {
        if (!Array.isArray(item)) return getSingleText(item);
        return item.map((option) => getSingleText(option)).join(", ");
      }

      return getSingleText(item);
    },
    [getSingleText, multi],
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;

    const normalizedSearch = search.toLowerCase();

    return options.filter((item) => {
      const searchPool = [
        item.name_en,
        item.name_ar,
        item.name,
        item.id,
        getText(item),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchPool.includes(normalizedSearch);
    });
  }, [options, search, getText]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setActive(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = () => {
    if (disabled) return;
    setActive(!active);
  };

  const handleSelect = (item) => {
    onChange(item);
    setActive(false);
    setSearch("");
  };

  return (
    <div
      className={`box forInput ${disabled ? "disabled" : ""}`}
      ref={selectRef}
      style={{ background: value?.bg && !label && value?.bg }}
    >
      {label && (
        <label>
          {label || " "} {required && <span className="required">*</span>}
        </label>
      )}

      <div className={`selectOptions ${size} ${className}`}>
        <div className={`btn ${error ? "error-border" : ""}`}>
          <h4
            className="ellipsis"
            onClick={toggle}
            style={{ color: value?.tx }}
          >
            {active ? (
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="search-input"
              />
            ) : value ? (
              getText(value)
            ) : (
              placeholder
            )}
          </h4>
          {active ? (
            <IoMdClose
              className="main-ico"
              onClick={toggle}
              style={{ visibility: hiddenIco ? "hidden" : "visible" }}
            />
          ) : (
            <IoIosArrowDown
              className="main-ico"
              onClick={toggle}
              style={{ visibility: hiddenIco ? "hidden" : "visible" }}
            />
          )}
        </div>

        {active && (
          <div className="menu active">
            {filteredOptions.length ? (
              filteredOptions.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={
                    multi
                      ? value?.some((selected) => selected.id === item.id)
                        ? "active"
                        : ""
                      : value?.id === item.id
                        ? "active"
                        : ""
                  }
                  onClick={() => handleSelect(item)}
                  style={{ background: item?.bg, color: item?.tx }}
                >
                  {getText(item)}
                </button>
              ))
            ) : (
              <div className="no-results">{t.common.noResults}</div>
            )}
          </div>
        )}
      </div>

      {error && !disabled && (
        <span className="error">
          <CircleAlert size={16} />
          {error}
        </span>
      )}
    </div>
  );
}

export default SelectOptions;
