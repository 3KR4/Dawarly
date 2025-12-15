"use client";

import React, { useState, useRef, useEffect } from "react";
import governorates from "@/data/governorates.json";
import cities from "@/data/cities.json";
import districts from "@/data/districts.json";
import {
  FaAngleDown,
  FaAngleRight,
  FaAngleLeft,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import Link from "next/link";
import { FiSun } from "react-icons/fi";
import useClickOutside from "@/Contexts/useClickOutside";

function SelectLocation({ locale = "en", onSelect }) {
  const t = useTranslate();
  const [activeMenu, setActiveMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const menuRef = useRef(null);

  useClickOutside(menuRef, () => {
    setActiveMenu(false);
    setCurrentPage(1);
    setSearchValue("");
  });

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

  const handleSelectDistrict = (district) => {
    if (onSelect) onSelect(district);
    setActiveMenu(false);
    setCurrentPage(1);
    setSelectedGovernorate(null);
    setSelectedCity(null);
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
              {currentPage > 1 &&
                (locale === "en" ? (
                  <FaArrowLeft
                    onClick={() => {
                      if (currentPage === 3) setCurrentPage(2);
                      else if (currentPage === 2) setCurrentPage(1);
                      setSelectedCity(null);
                    }}
                  />
                ) : (
                  <FaArrowRight
                    onClick={() => {
                      if (currentPage === 3) setCurrentPage(2);
                      else if (currentPage === 2) setCurrentPage(1);
                      setSelectedCity(null);
                    }}
                  />
                ))}

              <h5>
                {currentPage === 1 && t.location.egyptGovernorates}
                {currentPage === 2 && selectedGovernorate && (
                  <>
                    {locale === "en"
                      ? `${t.location.inside} ${selectedGovernorate.name_en}`
                      : `${t.location.inside} ${selectedGovernorate.name_ar}`}
                  </>
                )}
                {currentPage === 3 && selectedCity && (
                  <>
                    {locale === "en"
                      ? `${t.location.inside} ${selectedCity.name_en}`
                      : `${t.location.inside} ${selectedCity.name_ar}`}
                  </>
                )}
              </h5>
              <h5></h5>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder={
                currentPage === 1
                  ? t.location.searchGovernorate
                  : currentPage === 2
                  ? `${t.location.searchCity} ${
                      selectedGovernorate
                        ? locale === "en"
                          ? selectedGovernorate.name_en
                          : selectedGovernorate.name_ar
                        : ""
                    }...`
                  : `${t.location.searchCity} ${
                      selectedCity
                        ? locale === "en"
                          ? selectedCity.name_en
                          : selectedCity.name_ar
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
                  : currentPage === 2
                  ? cities.filter(
                      (city) => city.governorate_id === selectedGovernorate?.id
                    ).length
                  : districts.filter((d) => d.city_id === selectedCity?.id)
                      .length) < 11
                  ? "has-padding"
                  : ""
              }`}
            >
              {/* Governorates */}
              {currentPage === 1 &&
                governorates
                  .filter((gov) =>
                    locale === "en"
                      ? gov.name_en
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      : gov.name_ar.includes(searchValue)
                  )
                  .map((gov) => (
                    <button key={gov.id}>
                      <Link href={`/${gov.id}`}>
                        {locale === "en" ? gov.name_en : gov.name_ar}
                      </Link>
                      {gov.cities_count > 0 && (
                        <span onClick={() => handleSelectGovernorate(gov)}>
                          {gov.cities_count}
                          {locale == "en" ? <FaAngleRight /> : <FaAngleLeft />}
                        </span>
                      )}
                    </button>
                  ))}

              {/* Cities */}
              {currentPage === 2 &&
                selectedGovernorate &&
                cities
                  .filter(
                    (city) => city.governorate_id === selectedGovernorate.id
                  )
                  .filter((city) =>
                    locale === "en"
                      ? city.name_en
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      : city.name_ar.includes(searchValue)
                  )
                  .map((city) => (
                    <button key={city.id}>
                      <Link href={`/${city.id}`}>
                        {locale === "en" ? city.name_en : city.name_ar}
                      </Link>
                      {city.districts_count > 0 && (
                        <span onClick={() => handleSelectCity(city)}>
                          {city.districts_count}
                          {locale == "en" ? <FaAngleRight /> : <FaAngleLeft />}
                        </span>
                      )}
                    </button>
                  ))}

              {/* Districts */}
              {currentPage === 3 &&
                selectedCity &&
                districts
                  .filter((district) => district.city_id === selectedCity.id)
                  .filter((district) =>
                    locale === "en"
                      ? district.name_en
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      : district.name_ar.includes(searchValue)
                  )
                  .map((district) => (
                    <button key={district.id}>
                      <Link href={`/${district.id}`}>
                        {locale === "en" ? district.name_en : district.name_ar}
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
