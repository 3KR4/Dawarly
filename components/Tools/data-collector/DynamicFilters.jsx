"use client";
import React, { useState, useContext, useEffect, useCallback } from "react";
import Slider from "@mui/material/Slider";
import "@/styles/client/filters.css";
import { IoIosClose } from "react-icons/io";
import { settings } from "@/Contexts/settings";
import useTranslate from "@/Contexts/useTranslation";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const DynamicFilters = ({
  dynamicFilters = [],
  selectedFilters = {},
  setSelectedFilters = () => {},
  screenSize,
  active,
  setActive,
  locale = "en",
  showViewToggle = true,
  nestedChildrenAsMenu = true,
  focusSelectedBranch = false,
}) => {
  const { theme } = useContext(settings);
  const [localState, setLocalState] = useState({});
  const [expandedLists, setExpandedLists] = useState({});
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
            Object.keys(value).length === 0);

        if (shouldDelete) delete newState[fieldKey];
        else newState[fieldKey] = value;

        return newState;
      });

      // تحديث الأب
      setSelectedFilters(fieldKey, value);
    },
    [setSelectedFilters],
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

  const getItemName = (item) =>
    item?.[`name_${locale}`] || item?.name_en || item?.name_ar || "";

  const getItemCount = (item) => Number(item?.adsCount || 0);

  const getListKey = (fieldKey, levelKey = "root") => `${fieldKey}:${levelKey}`;

  const isListExpanded = (fieldKey, levelKey) =>
    Boolean(expandedLists[getListKey(fieldKey, levelKey)]);

  const toggleListExpanded = (fieldKey, levelKey) => {
    const key = getListKey(fieldKey, levelKey);
    setExpandedLists((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getVisibleItems = ({
    items,
    limit,
    expanded,
    selectedId,
    selectedIds = [],
  }) => {
    if (!limit || expanded || items.length <= limit) return items;

    const visibleItems = items.slice(0, limit);
    const pinnedSelectedItems = items.filter(
      (item) =>
        String(item.id) === String(selectedId) ||
        selectedIds.some((id) => String(id) === String(item.value ?? item.id)),
    );

    pinnedSelectedItems.forEach((selectedItem) => {
      if (
        !visibleItems.some(
          (item) => String(item.id) === String(selectedItem.id),
        )
      ) {
        visibleItems.splice(Math.max(limit - 1, 0), 1, selectedItem);
      }
    });

    return visibleItems;
  };

  const renderViewToggle = ({
    fieldKey,
    levelKey,
    total,
    limit,
    asListItem = false,
  }) => {
    if (!showViewToggle) return null;
    if (!limit || total <= limit) return null;

    const expanded = isListExpanded(fieldKey, levelKey);

    const button = (
      <div className="view-toggle-row">
        <hr />
        <button
          type="button"
          className="view-toggle"
          onClick={() => toggleListExpanded(fieldKey, levelKey)}
        >
          {expanded ? "View less" : "View more"}
        </button>
        <hr />
      </div>
    );

    return asListItem ? <li className="view-toggle-item">{button}</li> : button;
  };

  const hasSelectedDescendant = (field, currentValue, levelIndex, item) => {
    const nextLevel = field.levels[levelIndex + 1];
    if (!nextLevel) return false;

    const children = nextLevel.items.filter((child) => {
      if (!nextLevel.parentKey) return false;
      return String(child[nextLevel.parentKey]) === String(item.id);
    });

    return children.some((child) => {
      const isChildSelected =
        String(currentValue[nextLevel.queryKey]) === String(child.id);

      return (
        isChildSelected ||
        hasSelectedDescendant(field, currentValue, levelIndex + 1, child)
      );
    });
  };

  const renderNestedList = (
    field,
    currentValue,
    levelIndex = 0,
    parentItem = null,
  ) => {
    const level = field.levels[levelIndex];
    if (!level) return null;

    const items = level.items.filter((item) => {
      if (level.hasAdsOnly && Number(item?.adsCount || 0) <= 0) return false;
      if (!level.parentKey) return true;
      return String(item[level.parentKey]) === String(parentItem?.id);
    });

    const selectedAtThisLevel = currentValue[level.queryKey];
    const visibleBranchItems =
      focusSelectedBranch && selectedAtThisLevel
        ? items.filter((item) => String(item.id) === String(selectedAtThisLevel))
        : items;

    if (!visibleBranchItems.length) return null;

    const limit = level.limit || field.limit || 5;
    const expanded = isListExpanded(field.key, level.queryKey);
    const visibleItems = getVisibleItems({
      items: visibleBranchItems,
      limit,
      expanded,
      selectedId: currentValue[level.queryKey],
    });

    return (
      <ul
        className={`nisted-list ${levelIndex > 0 && nestedChildrenAsMenu ? "menu" : ""} ${levelIndex > 0 && !nestedChildrenAsMenu ? "nested-child" : ""}`}
        key={level.queryKey}
      >
        {visibleItems.map((item) => {
          const isSelected =
            String(currentValue[level.queryKey]) === String(item.id);
          const count = getItemCount(item);
          const childList = renderNestedList(
            field,
            currentValue,
            levelIndex + 1,
            item,
          );
          const isOpen =
            isSelected ||
            hasSelectedDescendant(field, currentValue, levelIndex, item);

          return (
            <li
              key={item.id}
              className={`${isSelected ? "active" : ""} ${isOpen ? "open" : ""}`}
            >
              <h5
                role="button"
                tabIndex={0}
                onClick={() => {
                  const nextValue = { ...currentValue };

                  field.levels.slice(levelIndex).forEach((x) => {
                    delete nextValue[x.queryKey];
                  });

                  if (!isSelected) nextValue[level.queryKey] = item.id;

                  updateFilter(
                    field.key,
                    Object.keys(nextValue).length ? nextValue : null,
                  );
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              >
                <span>{getItemName(item)}</span>
                {count > 0 && <small>{count}</small>}
              </h5>

              {(nestedChildrenAsMenu || isOpen) ? childList : null}
            </li>
          );
        })}
        {renderViewToggle({
          fieldKey: field.key,
          levelKey: level.queryKey,
          total: visibleBranchItems.length,
          limit,
          asListItem: true,
        })}
      </ul>
    );
  };

  // Select / Radio / MultiSelect / Boolean
  const renderFilterField = (field) => {
    const value = localState[field.key];

    // Range filters
    if (field.uiType === "range") return renderNumberFilter(field);

    switch (field.uiType) {
      case "checkbox":
        return (
          <div className="filter-field" key={field.key}>
            <div className="checkbox-wrapper-13 filter-checkbox">
              <input
                id={`filter-${field.key}`}
                type="checkbox"
                checked={value === true}
                onChange={(e) =>
                  updateFilter(field.key, e.target.checked ? true : null)
                }
              />
              <label htmlFor={`filter-${field.key}`}>
                {field.label[locale]}
              </label>
            </div>
          </div>
        );

      case "nested": {
        const currentValue =
          typeof value === "object" && value !== null && !Array.isArray(value)
            ? value
            : {};

        return (
          <div className="filter-field" key={field.key}>
            <div className="filter-header">
              <h4>{field.label[locale]}</h4>
            </div>

            {renderNestedList(field, currentValue)}
          </div>
        );
      }

      case "select":
        return (
          <div className="filter-field" key={field.key}>
            <div className="filter-header">
              <h4>{field.label[locale]}</h4>
            </div>
            <div className="select-options">
              {field.options.map((option) => {
                const displayName = option.label[locale] || option.value;
                const isSelected = String(value?.id) === String(option.id);
                return (
                  <button
                    type="button"
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
        const multiSelectLimit = field.limit || 10;
        const multiSelectExpanded = isListExpanded(field.key, "options");
        const visibleOptions = getVisibleItems({
          items: field.options,
          limit: multiSelectLimit,
          expanded: multiSelectExpanded,
          selectedId: null,
          selectedIds: currentValues,
        });
        return (
          <div className="filter-field" key={field.key}>
            <div className="filter-header">
              <h4>{field.label[locale]}</h4>
            </div>
            <div className="multiselect-options">
              {visibleOptions.map((option) => {
                const displayLabel = option.label[locale] || option.value;
                const isSelected = currentValues.includes(option.value);
                return (
                  <button
                    type="button"
                    key={option.id || option.value}
                    className={`filter-option ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      const newValues = isSelected
                        ? currentValues.filter((v) => v !== option.value)
                        : [...currentValues, option.value];
                      updateFilter(
                        field.key,
                        newValues.length ? newValues : null,
                      );
                    }}
                  >
                    {displayLabel}
                  </button>
                );
              })}
            </div>
            {renderViewToggle({
              fieldKey: field.key,
              levelKey: "options",
              total: field.options.length,
              limit: multiSelectLimit,
            })}
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
                type="button"
                className={`filter-option ${value === true ? "active" : ""}`}
                onClick={() =>
                  updateFilter(field.key, value === true ? null : true)
                }
              >
                {t.ad.yes}
              </button>
              <button
                type="button"
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
