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
  onChange,
  type,
  disabled = false,
  error,
  required = false,
}) {
  const { locale } = useContext(settings);
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");
  const selectRef = useRef(null);

  const getText = (item) => {
    if (!item) return "";

    if (type === "users") return item.full_name;

    return item[`name_${locale}`] || item.name_en || "";
  };

  /* ---------------- SEARCH ---------------- */
  const filteredOptions = useMemo(() => {
    if (!search) return options;

    const normalizedSearch = search.toLowerCase();

    return options.filter((item) => {
      const combinedText =
        `${item.name_en || ""} ${item.name_ar || ""}`.toLowerCase();
      return combinedText.includes(normalizedSearch);
    });
  }, [options, search]);

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

  /* ---------------- STATUS COLORS ---------------- */

  const statusColors = {
    active: "#deffe7",
    paused: "#fff6db",
    sold: "#ddcff7",
    cancelled: "#ffdede",
    accepted: "#deffe7",
  };

  const getBtnBg = () => {
    if (!value) return "";

    const val = typeof value === "object" ? value.name || value.status : value;

    return statusColors[val] || "";
  };

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
    >
      {label && (
        <label>
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <div className={`selectOptions ${size}`}>
        <div
          className={`btn ${error ? "error-border" : ""}`}
          style={{ backgroundColor: getBtnBg() }}
        >
          <h4 className="ellipsis" onClick={toggle}>
            {active ? (
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="search-input"
              />
            ) : value ? (
              // العرض حسب الـ locale بس
              value[`name_${locale}`]
            ) : (
              placeholder
            )}
          </h4>

          {active ? (
            <IoMdClose className="main-ico" onClick={toggle} />
          ) : (
            <IoIosArrowDown className="main-ico" onClick={toggle} />
          )}
        </div>

        {active && (
          <div className="menu active">
            {filteredOptions.length ? (
              filteredOptions.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={value?.id === item.id ? "active" : ""}
                  onClick={() => handleSelect(item)}
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
