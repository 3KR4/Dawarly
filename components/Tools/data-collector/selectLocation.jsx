"use client";

import React, { useState, useRef } from "react";
import governorates from "@/data/governorates.json";
import cities from "@/data/cities.json";
import districts from "@/data/districts.json";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import Link from "next/link";
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
                      setCurrentPage((prev) => (prev === 3 ? 2 : 1));
                      setSelectedCity(null);
                    }}
                  />
                ) : (
                  <FaArrowRight
                    onClick={() => {
                      setCurrentPage((prev) => (prev === 3 ? 2 : 1));
                      setSelectedCity(null);
                    }}
                  />
                ))}

              <h5>
                {currentPage === 1 && t.location.egyptGovernorates}
                {currentPage === 2 && selectedGovernorate && (
                  <>{t.governorate[selectedGovernorate.name]}</>
                )}
                {currentPage === 3 && selectedCity && (
                  <>{t.cities[selectedCity.name]}</>
                )}
              </h5>
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
                        ? t.governorate[selectedGovernorate.name]
                        : ""
                    }...`
                  : `${t.location.searchCity} ${
                      selectedCity ? t.cities[selectedCity.name] : ""
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
                  .filter((gov) => {
                    const govName = t.governorate[gov.name];
                    return govName
                      .toLowerCase()
                      .includes(searchValue.toLowerCase());
                  })
                  .map((gov) => (
                    <button key={gov.id}>
                      <Link href={`/${gov.id}`}>{t.governorate[gov.name]}</Link>
                      {gov.cities_count > 0 && (
                        <span onClick={() => handleSelectGovernorate(gov)}>
                          {gov.cities_count}
                          {locale === "en" ? <FaAngleRight /> : <FaAngleLeft />}
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
                  .filter((city) => {
                    const cityName = t.cities[city.name];
                    return cityName
                      .toLowerCase()
                      .includes(searchValue.toLowerCase());
                  })
                  .map((city) => (
                    <button key={city.id}>
                      <Link href={`/${city.id}`}>{t.cities[city.name]}</Link>
                      {city.districts_count > 0 && (
                        <span onClick={() => handleSelectCity(city)}>
                          {city.districts_count}
                          {locale === "en" ? <FaAngleRight /> : <FaAngleLeft />}
                        </span>
                      )}
                    </button>
                  ))}

              {/* Districts */}
              {currentPage === 3 &&
                selectedCity &&
                districts
                  .filter((district) => district.city_id === selectedCity.id)
                  .filter((district) => {
                    const districtName = t.districts[district.name];
                    return districtName
                      .toLowerCase()
                      .includes(searchValue.toLowerCase());
                  })
                  .map((district) => (
                    <button key={district.id}>
                      <Link href={`/${district.id}`}>
                        {t.districts[district.name]}
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
