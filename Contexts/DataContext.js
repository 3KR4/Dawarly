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
    if (loading) return;
    localStorage.setItem("countries", JSON.stringify(countries));
  }, [countries, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem("governorates", JSON.stringify(governorates));
  }, [governorates, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem("subCategories", JSON.stringify(subCategories));
  }, [subCategories, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem("areas", JSON.stringify(areas));
  }, [areas, loading]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem("compounds", JSON.stringify(compounds));
  }, [compounds, loading]);

  useEffect(() => {
    const loadFromCache = () => {
      try {
        const cached = {
          countries: JSON.parse(localStorage.getItem("countries") || "null"),
          governorates: JSON.parse(localStorage.getItem("governorates") || "null"),
          categories: JSON.parse(localStorage.getItem("categories") || "null"),
          subCategories: JSON.parse(localStorage.getItem("subCategories") || "null"),
          cities: JSON.parse(localStorage.getItem("cities") || "null"),
          areas: JSON.parse(localStorage.getItem("areas") || "null"),
          compounds: JSON.parse(localStorage.getItem("compounds") || "null"),
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
          setCountries(cached.countries);
          setGovernorates(cached.governorates);
          setCategories(cached.categories);
          setSubCategories(cached.subCategories);
          setCities(cached.cities);
          setAreas(cached.areas);
          setCompounds(cached.compounds);
          return true;
        }

        return false;
      } catch {
        return false;
      }
    };

    const fetchFreshData = async () => {
      try {
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

        // 🔥 update UI مباشرة
        setCountries(countriesRes.data);
        setGovernorates(govRes.data);
        setCategories(catRes.data);
        setSubCategories(subCatRes.data);
        setCities(citiesRes.data);
        setAreas(areasRes.data);
        setCompounds(compoundsRes.data);

        // 🔥 update cache
        localStorage.setItem("countries", JSON.stringify(countriesRes.data));
        localStorage.setItem("governorates", JSON.stringify(govRes.data));
        localStorage.setItem("categories", JSON.stringify(catRes.data));
        localStorage.setItem("subCategories", JSON.stringify(subCatRes.data));
        localStorage.setItem("cities", JSON.stringify(citiesRes.data));
        localStorage.setItem("areas", JSON.stringify(areasRes.data));
        localStorage.setItem("compounds", JSON.stringify(compoundsRes.data));
      } catch (err) {
        console.error(err);
      }
    };

    const init = async () => {
      const hasCache = loadFromCache();

      // لو في كاش → اعرضه فورًا
      setLoading(!hasCache);

      // دايمًا هات أحدث داتا في الخلفية
      await fetchFreshData();

      setLoading(false);
    };

    init();
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
        setCountries,
        setGovernorates,
        setCategories,
        setSubCategories,
        setCities,
        setAreas,
        setCompounds
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useAppData = () => useContext(DataContext);