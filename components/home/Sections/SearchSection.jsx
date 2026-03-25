"use client";
import "@/styles/client/sections/search-section.css";
import React, { useEffect, useContext } from "react";
import { settings } from "@/Contexts/settings";
import SelectLocation from "@/components/Tools/data-collector/selectLocation";

function SearchSection() {
  const { locale } = useContext(settings);

  useEffect(() => {}, [locale]);

  return (
    <div>
      <SelectLocation locale={locale} />
    </div>
  );
}

export default SearchSection;
