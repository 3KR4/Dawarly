"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { CircleAlert } from "lucide-react";

const normalize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");

function SelectOptions({
  label,
  placeholder,
  options = [],
  value,
  onChange,
  tPath,
  disabled = false,
  noTranslate = false,
  error, // error message
  required = false,
  t, // translation object
  locale = "en", // current locale
}) {
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");
  const [hasError, setHasError] = useState(false);
  const selectRef = useRef(null);

  // 👈 دالة جديدة لاستخراج النص بناءً على locale
  const getText = (item) => {
    if (noTranslate) {
      // إذا كان noTranslate = true، اسم العرض بناءً على locale
      if (typeof item.name === 'object' && item.name !== null) {
        // كائن name يحتوي على en و ar
        return item.name[locale] || item.name.en || '';
      }
      // إذا كان string قديم
      return item.name || '';
    }
    
    // إذا كان هناك ترجمة من tPath
    if (t && t[tPath] && typeof item.name === 'string') {
      return t[tPath][item.name] || item.name;
    }
    
    // fallback
    if (typeof item.name === 'object') {
      return item.name[locale] || item.name.en || '';
    }
    
    return item.name || '';
  };

  // 👈 دالة للحصول على القيمة المحددة للعرض
  const getDisplayValue = () => {
    if (!value) return '';
    
    // إذا كانت القيمة كائن من الخيارات
    if (typeof value === 'object' && value !== null) {
      if (typeof value.name === 'object') {
        return value.name[locale] || value.name.en || '';
      }
      return value.name || '';
    }
    
    // إذا كانت القيمة string مباشرة
    return value;
  };

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    
    return options.filter((item) => {
      const text = getText(item);
      return normalize(text).includes(normalize(search));
    });
  }, [options, search, noTranslate, tPath, t, locale]);

  useEffect(() => {
    const close = () => {
      setActive(false);
      setSearch("");
    };
    window.addEventListener("closeAllSelects", close);
    return () => window.removeEventListener("closeAllSelects", close);
  }, []);

  useEffect(() => {
    // Update error state when external error changes
    setHasError(!!error);
  }, [error]);

  useEffect(() => {
    // Clear error when value is selected
    if (value && hasError) {
      setHasError(false);
    }
  }, [value, hasError]);

  const openSelect = () => {
    if (disabled) return;
    window.dispatchEvent(new Event("closeAllSelects"));
    setActive(true);
  };

  const handleSelect = (item) => {
    onChange(item);
    setActive(false);
    setSearch("");
    setHasError(false);
  };

  const handleClose = () => {
    setActive(false);
    setSearch("");
  };

  return (
    <div className={`box forInput ${disabled ? "disabled" : ""}`}>
      {label && (
        <label>
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <div className="filters for-cats" ref={selectRef}>
        <div className={`btn ${hasError ? "error-border" : ""}`}>
          <h4 className="ellipsis" onClick={openSelect}>
            {active ? (
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="search-input"
              />
            ) : (
              getDisplayValue() || placeholder
            )}
          </h4>

          {active ? (
            <IoMdClose className="main-ico" onClick={handleClose} />
          ) : (
            <IoIosArrowDown className="main-ico" onClick={openSelect} />
          )}
        </div>

        {active && (
          <div className="menu active">
            {filteredOptions.length ? (
              filteredOptions.map((item) => {
                const text = getText(item);
                const isSelected = getDisplayValue() === text;
                
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={isSelected ? "active" : ""}
                    onClick={() => handleSelect(item)}
                  >
                    {text}
                  </button>
                );
              })
            ) : (
              <div className="no-results">
                {locale === "ar" ? "لا توجد نتائج" : "No results"}
              </div>
            )}
          </div>
        )}
      </div>

      {hasError && (
        <span className="error">
          <CircleAlert size={16} />
          {error}
        </span>
      )}
    </div>
  );
}

export default SelectOptions;