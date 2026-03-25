"use client";

import React, { useState, useRef } from "react";
import { FaAngleDown, FaAngleRight, FaArrowLeft } from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import Link from "next/link";
import useClickOutside from "@/Contexts/useClickOutside";
import { useAppData } from "@/Contexts/DataContext";

function SelectLocation({ locale = "en", onSelect }) {
  const t = useTranslate();
  const { governorates, cities, areas } = useAppData();

  const [activeMenu, setActiveMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const menuRef = useRef(null);

  useClickOutside(menuRef, () => resetAll());

  const getName = (item) => (locale === "en" ? item.name_en : item.name_ar);

  // =========================
  // Reset
  // =========================
  const resetAll = () => {
    setActiveMenu(false);
    setCurrentPage(1);
    setSelectedGovernorate(null);
    setSelectedCity(null);
    setSearchValue("");
  };

  // =========================
  // Navigation
  // =========================
  const handleBack = () => {
    if (currentPage === 3) {
      setSelectedCity(null);
    } else if (currentPage === 2) {
      setSelectedGovernorate(null);
    }

    setCurrentPage((prev) => prev - 1);
    setSearchValue("");
  };

  // =========================
  // Select Handlers
  // =========================
  const handleSelectGovernorate = (gov) => {
    setSelectedGovernorate(gov);
    setCurrentPage(2);
    setSearchValue("");
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setCurrentPage(3);
    setSearchValue("");
  };

  const handleSelectArea = (area) => {
    onSelect?.({
      governorate: selectedGovernorate,
      city: selectedCity,
      area,
    });

    resetAll();
  };

  // =========================
  // Dynamic Data
  // =========================
  const getCurrentData = () => {
    if (currentPage === 1) return governorates;

    if (currentPage === 2)
      return cities.filter((c) => c.governorate_id === selectedGovernorate?.id);

    if (currentPage === 3)
      return areas.filter((a) => a.city_id === selectedCity?.id);

    return [];
  };

  const filteredData = getCurrentData().filter((item) =>
    getName(item).toLowerCase().includes(searchValue.toLowerCase()),
  );

  // =========================
  // Count Getter
  // =========================
  const getCount = (item) => {
    if (currentPage === 1) return item.cities_count;
    if (currentPage === 2) return item.areas_count;
    return null;
  };

  // =========================
  // Title
  // =========================
  const getTitle = () => {
    if (currentPage === 1) return t.location.egyptGovernorates;
    if (currentPage === 2) return getName(selectedGovernorate);
    if (currentPage === 3) return getName(selectedCity);
  };

  const getPlaceholder = () => {
    if (currentPage === 1) {
      return t.location.searchGovernorate;
    }

    if (currentPage === 2) {
      return `search in ${
        selectedGovernorate ? getName(selectedGovernorate) : ""
      }...`;
    }

    if (currentPage === 3) {
      return `search in ${selectedCity ? getName(selectedCity) : ""}...`;
    }

    return "";
  };

  return (
    <div className="places-select" ref={menuRef}>
      <h4 onClick={() => setActiveMenu((prev) => !prev)}>
        {t.actions.filterByLocation} <FaAngleDown />
      </h4>

      {activeMenu && (
        <div className="menu active">
          <div className="locations-holder">
            {/* Top */}
            <div className="top">
              {currentPage > 1 && (
                <FaArrowLeft className="arrow" onClick={handleBack} />
              )}

              <h5>{getTitle()}</h5>

              <div className="hidden-element">-</div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            {/* List */}
            <div
              className={`items-list ${
                filteredData.length < 11 ? "has-padding" : ""
              }`}
            >
              {filteredData.map((item) => {
                const count = getCount(item);

                return (
                  <button key={item.id}>
                    <Link href={`/${item.id}`}>{getName(item)}</Link>

                    {count > 0 && currentPage !== 3 && (
                      <span
                        onClick={() =>
                          currentPage === 1
                            ? handleSelectGovernorate(item)
                            : handleSelectCity(item)
                        }
                      >
                        {count}
                        <FaAngleRight className="arrow" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectLocation;
