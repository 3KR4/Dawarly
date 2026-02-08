"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaAngleDown,
  FaAngleRight,
  FaArrowLeft,
} from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import Link from "next/link";
import useClickOutside from "@/Contexts/useClickOutside";

import governorates from "@/data/governorates.json";
import cities from "@/data/cities.json";

function SelectLocation({ locale = "en", onSelect }) {
  const t = useTranslate();

  const [activeMenu, setActiveMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const menuRef = useRef(null);

  useClickOutside(menuRef, () => {
    setActiveMenu(false);
    setCurrentPage(1);
    setSelectedGovernorate(null);
    setSearchValue("");
  });

  const getName = (item) =>
    locale === "en" ? item.name_en : item.name_ar;

  const handleSelectGovernorate = (gov) => {
    setSelectedGovernorate(gov);
    setCurrentPage(2);
    setSearchValue("");
  };

  const handleSelectCity = (city) => {
    onSelect?.({
      governorate: selectedGovernorate,
      city,
    });
    setActiveMenu(false);
    setCurrentPage(1);
    setSelectedGovernorate(null);
    setSearchValue("");
  };

  return (
    <div className="places-select" ref={menuRef}>
      <h4 onClick={() => setActiveMenu((prev) => !prev)}>
        {t.actions.filterByLocation} <FaAngleDown />
      </h4>

      {activeMenu && (
        <div className="menu active">
          <div className="locations-holder">
            {/* Top bar */}
            <div className="top">
              {currentPage > 1 && (
                <FaArrowLeft
                  className="arrow"
                  onClick={() => {
                    setCurrentPage(1);
                    setSelectedGovernorate(null);
                  }}
                />
              )}

              <div>
                {currentPage === 1 && (
                  <h5>{t.location.egyptGovernorates}</h5>
                )}
                {currentPage === 2 && selectedGovernorate && (
                  <h5>{getName(selectedGovernorate)}</h5>
                )}
              </div>

              <div className="hidden-element">-</div>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder={
                currentPage === 1
                  ? t.location.searchGovernorate
                  : `${t.location.searchCity} ${
                      selectedGovernorate
                        ? getName(selectedGovernorate)
                        : ""
                    }...`
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            {/* Items List */}
            <div
              className={`items-list ${
                (currentPage === 1
                  ? governorates.length
                  : cities.filter(
                      (c) => c.gov_id === selectedGovernorate?.id
                    ).length) < 11
                  ? "has-padding"
                  : ""
              }`}
            >
              {/* Governorates */}
              {currentPage === 1 &&
                governorates
                  .filter((gov) =>
                    getName(gov)
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .map((gov) => {
                    const govCities = cities.filter(
                      (c) => c.gov_id === gov.id
                    );

                    return (
                      <button key={gov.id}>
                        <Link href={`/${gov.id}`}>
                          {getName(gov)}
                        </Link>

                        {govCities.length > 0 && (
                          <span
                            onClick={() =>
                              handleSelectGovernorate(gov)
                            }
                          >
                            {govCities.length}
                            <FaAngleRight className="arrow" />
                          </span>
                        )}
                      </button>
                    );
                  })}

              {/* Cities */}
              {currentPage === 2 &&
                selectedGovernorate &&
                cities
                  .filter(
                    (city) =>
                      city.gov_id === selectedGovernorate.id
                  )
                  .filter((city) =>
                    getName(city)
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                    >
                      <Link href={`/${city.id}`}>
                        {getName(city)}
                      </Link>
                    </button>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectLocation;



//   sale and rent
// ==============
// Area (m²)
// Bedrooms
// Bathrooms
// Furnished
// Level
// Ownershipx
// Payment Option
// Payment Period  
// Down Payment
// Delivery Term


// ========================
// rent
// ======
// Monthly Installments  
// Rental Frequency