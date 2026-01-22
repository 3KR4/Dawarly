"use client";
import React from "react";
import { useContext, useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import "@/styles/client/pages/market.css";
import useTranslate from "@/Contexts/useTranslation";
import {
  categoriesEn,
  categoriesAr,
  subcategoriesEn,
  subcategoriesAr,
} from "@/data";
import { LuSettings2 } from "react-icons/lu";
import { settings } from "@/Contexts/settings";

const ActiveFiltersBar = ({
  selectedCategory,
  dynamicFilters,
  priceRange,
  onRemoveCategory,
  onRemoveFilter,
  onClearAll,
  onOpenFilters,
  fieldDefinitions = [],
}) => {
  const t = useTranslate();
  const { locale, screenSize } = useContext(settings);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      // try {
      //   const { data } = await getService.getDynamicFilters(6);
      //   setDynamicFilters(
      //     data || locale == "en" ? propertiesFiltersEn : propertiesFiltersAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setDynamicFilters(locale == "en" ? propertiesFiltersEn : propertiesFiltersAr);
      // }
      setCategories(locale == "en" ? categoriesEn : categoriesAr);
      setSubcategories(locale == "en" ? subcategoriesEn : subcategoriesAr);
    };
    fetchCategories();
  }, [locale]);

  // دالة لعرض اسم الفلتر
  const getFilterDisplayName = (key, value) => {
    // فلتر السعر
    if (key === "priceRange") {
      const defaultMin = 0;
      const defaultMax = 10000;
      if (value[0] === defaultMin && value[1] === defaultMax) return "";
      return `${t.dashboard.forms.price}: ${value[0]} - ${value[1]}`;
    }

    // فلتر الفئة الرئيسية
    if (key === "cat") {
      const cat = categories.find((c) => c.id === value.id);
      return `${t.dashboard.forms.category}: ${cat ? cat.name : ""}`;
    }

    // فلتر الفئة الفرعية
    if (key === "subCat") {
      const sub = subcategories.find((s) => s.id == value.id);
      return `${t.dashboard.forms.subCategory}: ${sub ? sub.name : ""}`;
    }

    // فلترات ديناميكية
    const field = fieldDefinitions.find((f) => f.key === key);
    if (!field) {
      if (typeof value === "object" && value !== null) {
        return `${key}: ${value.name || value.name || value.value || ""}`;
      }
      return `${key}: ${value}`;
    }

    // أنواع الفلاتر المختلفة
    switch (field.uiType) {
      case "select":
        if (!value) return "";
        const selOption = field.options.find((opt) => opt.id === value.id);
        if (selOption) {
          const displayName =
            typeof selOption.name === "object"
              ? selOption.name
              : selOption.name;
          return `${field.label}: ${displayName}`;
        }
        break;

      case "radio":
        if (!value) return "";
        const radioOption = field.options.find(
          (opt) => opt.value === value?.value || value,
        );
        if (radioOption) {
          const displayLabel = radioOption.label || radioOption.value || value;
          return `${field.label}: ${displayLabel}`;
        }
        return `${field.label}: ${value}`;

      case "boolean":
        const displayValue =
          value === true
            ? locale === "ar"
              ? "نعم"
              : "Yes"
            : locale === "ar"
              ? "لا"
              : "No";
        return `${field.label}: ${displayValue}`;

      case "multiSelect":
        if (!Array.isArray(value) || value.length === 0) return "";
        const displayValues = value
          .map((val) => {
            const opt = field.options.find((o) => o.value === val);
            return opt?.label || opt?.value || val;
          })
          .filter(Boolean);
        return `${field.label}: ${displayValues.join(", ")}`;

      case "input":
        if (field.inputType === "number" && Array.isArray(value)) {
          const [min, max] = value;
          const defaultMin = field.min || 0;
          const defaultMax = field.max || 10000;
          if (min === defaultMin && max === defaultMax) return "";
          return `${field.label}: ${min} - ${max}`;
        }
        break;

      default:
        if (typeof value === "object" && value !== null) {
          return `${field.label}: ${
            value.name || value.name || value.value || ""
          }`;
        }
        return `${field.label}: ${value}`;
    }

    return "";
  };

  // حساب الفلاتر النشطة
  const activeFilters = [];

  if (selectedCategory?.cat) {
    const display = getFilterDisplayName("cat", selectedCategory.cat);
    if (display)
      activeFilters.push({ key: "cat", value: selectedCategory.cat, display });
  }

  if (selectedCategory?.subCat) {
    const display = getFilterDisplayName("subCat", selectedCategory.subCat);
    if (display)
      activeFilters.push({
        key: "subCat",
        value: selectedCategory.subCat,
        display,
      });
  }

  // فلتر السعر
  if (priceRange) {
    const display = getFilterDisplayName("priceRange", priceRange);
    if (display)
      activeFilters.push({ key: "priceRange", value: priceRange, display });
  }

  // فلترات ديناميكية
  if (dynamicFilters && typeof dynamicFilters === "object") {
    Object.entries(dynamicFilters).forEach(([key, value]) => {
      const isEmpty =
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && Object.keys(value).length === 0);
      if (!isEmpty) {
        const display = getFilterDisplayName(key, value);
        if (display) activeFilters.push({ key, value, display });
      }
    });
  }
  if (screenSize == "large" && activeFilters.length === 0) return null;

  return (
    <div className="active-filters-bar">
      <div className="filters-header" onClick={onOpenFilters}>
        {t.actions.active_filters}
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
              if (filter.key === "cat" || filter.key === "subCat") {
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
