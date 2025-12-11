"use client";
import { createContext, useState } from "react";

export const filters = createContext();

export const FiltersProvider = ({ children }) => {
  const [searchText, setSearchText] = useState("");
  const [filtersState, setFiltersState] = useState({
    name: "",
    price: "",
    status: "",
    date: "",
    availability: "",
  });
  const [selectedCats, setSelectedCats] = useState({
    cat: "",
    subCat: "",
    gov: "",
  });
  const updateFilter = (key, value, type) => {
    if (type == "filters") {
      setFiltersState((prev) => ({
        ...prev,
        [key]: value,
      }));
    } else {
      setSelectedCats((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };
  return (
    <filters.Provider
      value={{
        searchText,
        setSearchText,
        selectedCats,
        filtersState,
        updateFilter,
      }}
    >
      {children}
    </filters.Provider>
  );
};
