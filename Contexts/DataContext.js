"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getCountries,
  getGovernorates,
  getCategories,
  getSubCategories,
  getCities,
  getAreas,
  getCompounds,
} from "@/services/data/data.service";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [compounds, setCompounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const cached = {
          countries: localStorage.getItem("countries"),
          governorates: localStorage.getItem("governorates"),
          categories: localStorage.getItem("categories"),
          subCategories: localStorage.getItem("subCategories"),
          cities: localStorage.getItem("cities"),
          areas: localStorage.getItem("areas"),
          compounds: localStorage.getItem("compounds"),
        };

        if (
          cached.countries &&
          cached.governorates &&
          cached.categories &&
          cached.subCategories &&
          cached.cities &&
          cached.areas &&
          cached.compounds
        ) {
          setCountries(JSON.parse(cached.countries));
          setGovernorates(JSON.parse(cached.governorates));
          setCategories(JSON.parse(cached.categories));
          setSubCategories(JSON.parse(cached.subCategories));
          setCities(JSON.parse(cached.cities));
          setAreas(JSON.parse(cached.areas));
          setCompounds(JSON.parse(cached.compounds));
          setLoading(false);
          return;
        }

        const [
          countriesRes,
          govRes,
          catRes,
          subCatRes,
          citiesRes,
          areasRes,
          compoundsRes,
        ] = await Promise.all([
          getCountries(),
          getGovernorates(null),
          getCategories(),
          getSubCategories(null),
          getCities(null),
          getAreas(null),
          getCompounds(null),
        ]);

        setCountries(countriesRes.data);
        setGovernorates(govRes.data);
        setCategories(catRes.data);
        setSubCategories(subCatRes.data);
        setCities(citiesRes.data);
        setAreas(areasRes.data);
        setCompounds(compoundsRes.data);

        localStorage.setItem("countries", JSON.stringify(countriesRes.data));
        localStorage.setItem("governorates", JSON.stringify(govRes.data));
        localStorage.setItem("categories", JSON.stringify(catRes.data));
        localStorage.setItem("subCategories", JSON.stringify(subCatRes.data));
        localStorage.setItem("cities", JSON.stringify(citiesRes.data));
        localStorage.setItem("areas", JSON.stringify(areasRes.data));
        localStorage.setItem("compounds", JSON.stringify(compoundsRes.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        countries,
        governorates,
        categories,
        subCategories,
        cities,
        areas,
        compounds,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useAppData = () => useContext(DataContext);
