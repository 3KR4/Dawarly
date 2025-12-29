"use client";
import React, { useState, useMemo } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import useTranslate from "@/Contexts/useTranslation";

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
  tPath, // 👈 governorates | cities | districts
  disabled = false,
}) {
  const t = useTranslate();
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((item) => {
      const translated = t[tPath]?.[item.name] || "";
      return normalize(translated).includes(normalize(search));
    });
  }, [options, search, t, tPath]);


  return (
    <div className={`box forInput ${disabled ? "disabled" : ""}`}>
      {label && <label>{label}</label>}

      <div className="filters for-cats">
        <div className="btn">
          <h4 className="ellipsis" onClick={() => !disabled && setActive(true)}>
            {active ? (
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="search-input"
              />
            ) : value ? (
              value
            ) : (
              placeholder
            )}
          </h4>

          {active ? (
            <IoMdClose
              className="main-ico"
              onClick={() => {
                setActive(false);
                setSearch("");
              }}
            />
          ) : (
            <IoIosArrowDown
              className="main-ico"
              onClick={() => !disabled && setActive(true)}
            />
          )}
        </div>

        <div className={`menu ${active ? "active" : ""}`}>
          {filteredOptions.length ? (
            filteredOptions.map((item) => {
              const text = t[tPath]?.[item.name];

              return (
                <button
                  type="button"
                  key={item.id}
                  className={value === text ? "active" : ""}
                  onClick={() => {
                    onChange(item);
                    setActive(false);
                    setSearch("");
                  }}
                >
                  {text}
                </button>
              );
            })
          ) : (
            <div className="no-results">{`no-results`}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectOptions;
