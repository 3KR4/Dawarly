"use client";
import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { CircleAlert } from "lucide-react";
import { settings } from "@/Contexts/settings";

function SelectOptions({
  size = "large",
  label,
  placeholder,
  options = [],
  value,
  multi = false,
  onChange,
  type,
  disabled = false,
  hiddenIco = false,
  error,
  required = false,
}) {
  const { locale } = useContext(settings);
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");
  const selectRef = useRef(null);

  const getText = (item) => {
    if (!item) return "";

    // لو multi => نتوقع مصفوفة
    if (multi) {
      if (!Array.isArray(item)) return getSingleText(item); // لو مش مصفوفة
      return item.map((i) => getSingleText(i)).join(", "); // ندمج كل الأسماء بفاصلة
    }

    // لو single
    return getSingleText(item);
  };

  // دالة مساعدة للتعامل مع عنصر واحد
  const getSingleText = (i) => {
    if (!i) return "";

    if (type === "users") return i.full_name;

    if (type === "date") {
      const value = typeof i === "string" ? i : i?.name || i?.id;
      const date = new Date(value);
      if (isNaN(date)) return value || "";
      return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US");
    }

    return i[`name_${locale}`] || i.name_en || i.name || "";
  };
  /* ---------------- SEARCH ---------------- */
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
  }, [options, search, locale]);

  /* ---------------- CLOSE OUTSIDE ---------------- */

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

  /* ---------------- HANDLERS ---------------- */

  const toggle = () => {
    if (disabled) return;
    setActive(!active);
  };

  const handleSelect = (item) => {
    onChange(item);
    setActive(false);
    setSearch("");
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      className={`box forInput ${disabled ? "disabled" : ""}`}
      ref={selectRef}
      style={{ background: value?.bg }}
    >
      {label && (
        <label>
          {label || " "} {required && <span className="required">*</span>}
        </label>
      )}

      <div className={`selectOptions ${size}`}>
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
                      ? value?.some((v) => v.id === item.id)
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
              <div className="no-results">No results</div>
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
