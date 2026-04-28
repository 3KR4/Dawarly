"use client";

import React, { useState, useRef } from "react";
import { FaAngleDown, FaAngleRight, FaArrowLeft } from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import Link from "next/link";
import useClickOutside from "@/Contexts/useClickOutside";
import { useAppData } from "@/Contexts/DataContext";

function SelectLocation({ locale = "en", onSelect }) {
  const t = useTranslate();
  const { governorates, cities, areas, compounds } = useAppData();

  const [activeMenu, setActiveMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const [searchValue, setSearchValue] = useState("");

  const menuRef = useRef(null);
  useClickOutside(menuRef, () => resetAll());

  const getName = (item) =>
    locale === "en" ? item.name_en : item.name_ar;

  // =========================
  // RESET
  // =========================
  const resetAll = () => {
    setActiveMenu(false);
    setCurrentPage(1);
    setSelectedGovernorate(null);
    setSelectedCity(null);
    setSelectedArea(null);
    setSearchValue("");
  };

  // =========================
  // BACK
  // =========================
  const handleBack = () => {
    if (currentPage === 4) setSelectedArea(null);
    if (currentPage === 3) setSelectedCity(null);
    if (currentPage === 2) setSelectedGovernorate(null);

    setCurrentPage((p) => p - 1);
    setSearchValue("");
  };

  // =========================
  // SELECT HANDLERS
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
    setSelectedArea(area);
    setCurrentPage(4);
    setSearchValue("");
  };

  const handleSelectCompound = (compound) => {
    onSelect?.({
      governorate: selectedGovernorate,
      city: selectedCity,
      area: selectedArea,
      compound,
    });

    resetAll();
  };

  const handleNext = (item) => {
    if (currentPage === 1) return handleSelectGovernorate(item);
    if (currentPage === 2) return handleSelectCity(item);
    if (currentPage === 3) return handleSelectArea(item);
    if (currentPage === 4) return handleSelectCompound(item);
  };

  // =========================
  // DATA FLOW
  // =========================
  const getCurrentData = () => {
    if (currentPage === 1) return governorates;

    if (currentPage === 2)
      return cities.filter(
        (c) => c.governorate_id === selectedGovernorate?.id
      );

    if (currentPage === 3)
      return areas.filter(
        (a) => a.city_id === selectedCity?.id
      );

    if (currentPage === 4)
      return compounds.filter(
        (c) => c.area_id === selectedArea?.id
      );

    return [];
  };

  const filteredData = getCurrentData().filter((item) =>
    getName(item).toLowerCase().includes(searchValue.toLowerCase())
  );

  // =========================
  // COUNTS
  // =========================
  const getCount = (item) => {
    if (currentPage === 1) return item.childsCount;
    if (currentPage === 2) return item.areasCount;
    if (currentPage === 3) return item.childsCount;
    return null;
  };

  // =========================
  // TITLE
  // =========================
  const getTitle = () => {
    if (currentPage === 1) return t.location.egyptGovernorates;
    if (currentPage === 2) return getName(selectedGovernorate);
    if (currentPage === 3) return getName(selectedCity);
    if (currentPage === 4) return getName(selectedArea);
    return "";
  };

  // =========================
  // PLACEHOLDER
  // =========================
  const getPlaceholder = () => {
    if (currentPage === 1) return t.location.searchGovernorate;

    if (currentPage === 2)
      return `search in ${
        selectedGovernorate ? getName(selectedGovernorate) : ""
      }...`;

    if (currentPage === 3)
      return `search in ${
        selectedCity ? getName(selectedCity) : ""
      }...`;

    if (currentPage === 4)
      return `search in ${
        selectedArea ? getName(selectedArea) : ""
      }...`;

    return "";
  };

  return (
    <div className="places-select" ref={menuRef}>
      <h4 onClick={() => setActiveMenu((p) => !p)}>
        {t.actions.filterByLocation} <FaAngleDown />
      </h4>

      {activeMenu && (
        <div className="menu active">
          <div className="locations-holder">

            {/* TOP */}
            <div className="top">
              {currentPage > 1 && (
                <FaArrowLeft className="arrow" onClick={handleBack} />
              )}

              <h5>{getTitle()}</h5>

              <div className="hidden-element">-</div>
            </div>

            {/* SEARCH */}
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            {/* LIST */}
            <div
              className={`items-list ${
                filteredData.length < 11 ? "has-padding" : ""
              }`}
            >
              {filteredData.map((item) => {
                const count = getCount(item);

                return (
                  <button key={item.id}>
                    <Link href="#" onClick={(e) => e.preventDefault()}>
                      {getName(item)}
                    </Link>

                    {count > 0 && currentPage !== 4 && (
                      <span onClick={() => handleNext(item)}>
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