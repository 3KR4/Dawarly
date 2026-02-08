"use client";
import "@/styles/client/sections/search-section.css";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMessage, FaAngleDown } from "react-icons/fa6";
import { settings } from "@/Contexts/settings";
import { FaSearch } from "react-icons/fa";
import {
  categoriesEn,
  categoriesAr,
  subcategoriesEn,
  subcategoriesAr,
} from "@/data";
import useTranslate from "@/Contexts/useTranslation";
import { getAllSubCats } from "@/services/subCategories/subCats.service";
import SelectLocation from "@/components/Tools/data-collector/selectLocation";

function SearchSection() {
  const t = useTranslate();
  const { screenSize, theme, toggleTheme, locale, toggleLocale } =
    useContext(settings);

  useEffect(() => {}, [locale]);

  return (
    <div>
      <SelectLocation locale={locale} />
    </div>
  );
}

export default SearchSection;
