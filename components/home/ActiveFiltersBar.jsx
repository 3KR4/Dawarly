"use client";
import React, { useContext } from "react";
import { IoIosClose } from "react-icons/io";
import "@/styles/client/pages/market.css";
import useTranslate from "@/Contexts/useTranslation";
import { LuSettings2 } from "react-icons/lu";
import { settings } from "@/Contexts/settings";
import { useAppData } from "@/Contexts/DataContext";

const ActiveFiltersBar = ({
  selectedCategory,
  dynamicFilters,
  searchText,
  onRemoveCategory,
  onRemoveFilter,
  onClearAll,
  onOpenFilters,
  fieldDefinitions = [],
}) => {
  const t = useTranslate();
  const { locale, screenSize } = useContext(settings);
  const { categories = [], subCategories = [] } = useAppData();

  const getLocalizedText = (value) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return value;
    return value[locale] || value.en || value.ar || "";
  };

  const getFieldLabel = (field) => getLocalizedText(field?.label) || field?.key || "";

  const getFilterDisplayName = (key, value) => {
    if (key === "cat") {
      const cat = categories.find((item) => String(item.id) === String(value.id));
      return `${t.dashboard.forms.category}: ${cat ? cat[`name_${locale}`] : value.id}`;
    }

    if (key === "subCat") {
      const sub = subCategories.find((item) => String(item.id) === String(value.id));
      return `${t.dashboard.forms.subCategory}: ${sub ? sub[`name_${locale}`] : value.id}`;
    }

    const field = fieldDefinitions.find((item) => item.key === key);
    if (!field) {
      if (typeof value === "object" && value !== null) {
        return `${key}: ${getLocalizedText(value.label) || value.value || value.id || ""}`;
      }
      return `${key}: ${value}`;
    }

    switch (field.uiType) {
      case "select": {
        if (!value) return "";
        const selectedOption = field.options.find(
          (option) => String(option.id) === String(value.id),
        );
        const displayValue =
          getLocalizedText(selectedOption?.label) ||
          selectedOption?.[`name_${locale}`] ||
          selectedOption?.value ||
          value.id;

        return `${getFieldLabel(field)}: ${displayValue}`;
      }

      case "boolean":
        return `${getFieldLabel(field)}: ${value === true ? t.ad.yes : t.ad.no}`;

      case "checkbox":
        return value === true ? getFieldLabel(field) : "";

      case "nested": {
        if (!value || typeof value !== "object") return "";
        const parts = field.levels
          .map((level) => {
            const selectedId = value[level.queryKey];
            const selectedItem = level.items.find(
              (item) => String(item.id) === String(selectedId),
            );
            return selectedItem?.[`name_${locale}`] || selectedItem?.name_en;
          })
          .filter(Boolean);

        return parts.length ? `${getFieldLabel(field)}: ${parts.join(" / ")}` : "";
      }

      case "multiSelect": {
        if (!Array.isArray(value) || value.length === 0) return "";
        const displayValues = value
          .map((selectedValue) => {
            const option = field.options.find(
              (item) => String(item.value) === String(selectedValue),
            );
            return getLocalizedText(option?.label) || option?.value || selectedValue;
          })
          .filter(Boolean);

        return `${getFieldLabel(field)}: ${displayValues.join(", ")}`;
      }

      case "range":
        if (!Array.isArray(value)) return "";
        return `${getFieldLabel(field)}: ${value[0]} - ${value[1]}`;

      default:
        if (typeof value === "object" && value !== null) {
          return `${getFieldLabel(field)}: ${
            getLocalizedText(value.label) || value.value || value.id || ""
          }`;
        }
        return `${getFieldLabel(field)}: ${value}`;
    }
  };

  const activeFilters = [];

  if (searchText) {
    activeFilters.push({
      key: "search",
      value: searchText,
      display: `${locale === "ar" ? "بحث" : "Search"}: ${searchText}`,
    });
  }

  if (selectedCategory?.cat) {
    const display = getFilterDisplayName("cat", selectedCategory.cat);
    if (display) {
      activeFilters.push({ key: "cat", value: selectedCategory.cat, display });
    }
  }

  if (selectedCategory?.subCat) {
    const display = getFilterDisplayName("subCat", selectedCategory.subCat);
    if (display) {
      activeFilters.push({
        key: "subCat",
        value: selectedCategory.subCat,
        display,
      });
    }
  }

  if (dynamicFilters) {
    Object.entries(dynamicFilters).forEach(([key, value]) => {
      const isEmpty =
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0);

      if (!isEmpty) {
        const display = getFilterDisplayName(key, value);
        if (display) activeFilters.push({ key, value, display });
      }
    });
  }

  if (screenSize === "large" && activeFilters.length === 0) return null;

  return (
    <div className="active-filters-bar">
      <div className="filters-header" onClick={onOpenFilters}>
        {screenSize === "large" ? t.actions.active_filters : t.actions.filterations}
        <span className="filters-count" style={{ display: "flex" }}>
          {screenSize !== "large" ? <LuSettings2 /> : ":"}
        </span>
      </div>

      <div className="filters-list">
        {activeFilters.map((filter) => (
          <div
            key={filter.key}
            className="filter-tag"
            onClick={() => {
              if (filter.key === "search") {
                onRemoveFilter("search");
              } else if (filter.key === "cat" || filter.key === "subCat") {
                onRemoveCategory(filter.key);
              } else {
                onRemoveFilter(filter.key);
              }
            }}
          >
            <span className="filter-text">{filter.display}</span>
            <IoIosClose className="remove-icon" />
          </div>
        ))}

        {activeFilters.length > 1 && (
          <button className="clear-all-btn" onClick={onClearAll}>
            {t.actions.clear_all}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveFiltersBar;
