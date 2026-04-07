"use client";
import React, { useState, useContext, useEffect, useCallback } from "react";
import Slider from "@mui/material/Slider";
import "@/styles/client/filters.css";
import { IoIosClose } from "react-icons/io";
import { settings } from "@/Contexts/settings";
import useTranslate from "@/Contexts/useTranslation";

const DynamicFilters = ({
  dynamicFilters = [],
  selectedFilters = {},
  setSelectedFilters = () => {},
  screenSize,
  active,
  setActive,
  locale = "en",
}) => {
  const { theme } = useContext(settings);
  const [localState, setLocalState] = useState({});
  const t = useTranslate();

  // sync local state with parent selectedFilters
  useEffect(() => {
    setLocalState(selectedFilters);
  }, [selectedFilters]);

  const updateFilter = useCallback(
    (fieldKey, value) => {
      setLocalState((prev) => {
        const newState = { ...prev };
        const shouldDelete =
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "object" &&
            !Array.isArray(value) &&
            !value.id &&
            !value.value);

        if (shouldDelete) delete newState[fieldKey];
        else newState[fieldKey] = value;

        return newState;
      });

      // تحديث الأب
      setSelectedFilters(fieldKey, value);
    },
    [setSelectedFilters]
  );

  // Range Slider
  const renderNumberFilter = (field) => {
    const value = Array.isArray(localState[field.key])
      ? localState[field.key]
      : [field.min || 0, field.max || 10000];

    return (
      <div className="filter-field" key={field.key}>
        <div className="filter-header">
          <h4>{field.label[locale]}</h4>
        </div>

        <div className="price-input">
          <div className="field">
            <span>{locale === "ar" ? "أدنى" : "Min"}</span>
            <h3>{value[0]}</h3>
          </div>
          <div className="field">
            <h3>{value[1]}</h3>
            <span>{locale === "ar" ? "أقصى" : "Max"}</span>
          </div>
        </div>

        <Slider
          value={value}
          onChange={(_, newValue) => updateFilter(field.key, newValue)}
          min={field.min || 0}
          max={field.max || 10000}
          className="price-slider"
        />
      </div>
    );
  };

  // Select / Radio / MultiSelect / Boolean
  const renderFilterField = (field) => {
    const value = localState[field.key];

    // Range filters
    if (field.uiType === "range") return renderNumberFilter(field);

    switch (field.uiType) {
      case "select":
        return (
          <div className="filter-field" key={field.key}>
            <div className="filter-header">
              <h4>{field.label[locale]}</h4>
            </div>
            <div className="select-options">
              {field.options.map((option) => {
                const displayName = option.label[locale] || option.value;
                const isSelected = value?.id === option.id;
                return (
                  <button
                    key={option.id}
                    className={`filter-option ${isSelected ? "active" : ""}`}
                    onClick={() =>
                      updateFilter(field.key, isSelected ? null : option)
                    }
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "multiSelect":
        const currentValues = Array.isArray(value) ? value : [];
        return (
          <div className="filter-field" key={field.key}>
            <div className="filter-header">
              <h4>{field.label[locale]}</h4>
            </div>
            <div className="multiselect-options">
              {field.options.map((option) => {
                const displayLabel = option.label[locale] || option.value;
                const isSelected = currentValues.includes(option.value);
                return (
                  <button
                    key={option.id || option.value}
                    className={`filter-option ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      const newValues = isSelected
                        ? currentValues.filter((v) => v !== option.value)
                        : [...currentValues, option.value];
                      updateFilter(
                        field.key,
                        newValues.length ? newValues : null
                      );
                    }}
                  >
                    {displayLabel}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "boolean":
        return (
          <div className="filter-field" key={field.key}>
            <div className="filter-header">
              <h4>{field.label[locale]}</h4>
            </div>
            <div className="boolean-options">
              <button
                className={`filter-option ${value === true ? "active" : ""}`}
                onClick={() =>
                  updateFilter(field.key, value === true ? null : true)
                }
              >
                {t.ad.yes}
              </button>
              <button
                className={`filter-option ${value === false ? "active" : ""}`}
                onClick={() =>
                  updateFilter(field.key, value === false ? null : false)
                }
              >
                {t.ad.no}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`filters dynamic-filters ${active ? "active" : ""}`}>
      {screenSize !== "large" && (
        <IoIosClose className="close" onClick={() => setActive(false)} />
      )}

      <div className="holder">
        {dynamicFilters.map((field, index) => (
          <React.Fragment key={field.key}>
            {renderFilterField(field)}
            {index !== dynamicFilters.length - 1 && <hr />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DynamicFilters;