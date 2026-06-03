"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { settings } from "@/Contexts/settings";
import { useAppData } from "@/Contexts/DataContext";
import DynamicFilters from "@/components/Tools/data-collector/DynamicFilters";
import {
  Amenities,
  BuildingAndLandsTypes,
  BuildingCondition,
  BuildingType,
  Currencies,
  LandType,
  Levels,
  PaymentMethod,
  RentFrequencies,
} from "@/data/enums";
import { getTableRule } from "@/data/tablesRules";
import { getAllAds } from "@/services/ads/ads.service";
import {
  getAreas,
  getCities,
  getCompounds,
  getGovernorates,
  getHeroSearchFilters,
  getSubCategories,
} from "@/services/data/data.service";

const QUERY_KEY_MAP = {
  table_id: "dep",
  categoryId: "cat",
  subCategoryId: "subcat",
  is_verified: "is_verified_only",
};

const LABELS = {
  en: {
    search: "Search",
    more: "More Filters",
    filters: {
      locations: "Locations",
      departments: "Departments",
      price: "Price (EGP)",
      currency: "Currency",
      verified: "Verified Ads Only",
      dynamic: "Filters",
      advanced: "More Filters",
    },
    placeholders: {
      locations: "Choose location",
      departments: "Choose department",
      price: "Set price range",
      currency: "Choose currency",
      verified: "Verification status",
      dynamic: "Choose filter",
      advanced: "Advanced filters",
    },
    yes: "Yes",
    no: "No",
    all: "All",
  },
  ar: {
    search: "ابحث",
    more: "فلاتر إضافية",
    filters: {
      locations: "المواقع",
      departments: "الأقسام",
      price: "السعر",
      currency: "العملة",
      verified: "الإعلانات الموثقة",
      dynamic: "الفلاتر",
      advanced: "فلاتر إضافية",
    },
    placeholders: {
      locations: "اختر الموقع",
      departments: "اختر القسم",
      price: "حدد السعر",
      currency: "اختر العملة",
      verified: "حالة التوثيق",
      dynamic: "اختر فلتر",
      advanced: "فلاتر متقدمة",
    },
    yes: "نعم",
    no: "لا",
    all: "الكل",
  },
};

const ARABIC_OPTION_LABELS = {
  currency: {
    EGP: "جنيه مصري",
    USD: "دولار",
    EUR: "يورو",
    SAR: "ريال سعودي",
    AED: "درهم إماراتي",
  },
  payment_method: {
    CASH: "كاش",
    INSTALLMENTS: "تقسيط",
    CASH_OR_INSTALLMENTS: "كاش أو تقسيط",
  },
  rent_frequency: {
    DAY: "يومي",
    WEEK: "أسبوعي",
    MONTH: "شهري",
  },
  type: {
    BUILDING: "مبنى",
    LAND: "أرض",
  },
  land_type: {
    RESIDENTIAL: "سكني",
    AGRICULTURAL: "زراعي",
    COMMERCIAL: "تجاري",
    INDUSTRIAL: "صناعي",
  },
  building_type: {
    RESIDENTIAL: "سكني",
    COMMERCIAL: "تجاري",
    MIXED_USE: "متعدد الاستخدام",
    INDUSTRIAL: "صناعي",
    ADMINISTRATIVE: "إداري",
  },
  building_condition: {
    NEW: "جديد",
    OLD: "قديم",
    UNDER_CONSTRUCTION: "تحت الإنشاء",
  },
};

const RANGE_KEYS = {
  price: ["min_price", "max_price"],
  area_m2: ["min_area_m2", "max_area_m2"],
  down_payment: ["min_down_payment", "max_down_payment"],
};

const toFilterOption = (option, fieldKey) => ({
  id: option.value,
  value: option.value,
  label: {
    en: option.label,
    ar: ARABIC_OPTION_LABELS[fieldKey]?.[option.value] || option.label,
  },
});

const getItemName = (item, locale) =>
  item?.[`name_${locale}`] || item?.name_en || item?.name_ar || item?.value || "";

const filterHasAds = (item) => Number(item?.adsCount || 0) > 0;

const toEnumOption = (item) => ({
  id: item.id,
  value: item.id,
  label: {
    en: item.name_en,
    ar: item.name_ar,
  },
});

const buildLocationField = ({ governorates, cities, areas, compounds }, locale) => ({
  key: "location_tree",
  uiType: "nested",
  label: {
    en: LABELS.en.filters.locations,
    ar: LABELS.ar.filters.locations,
  },
  levels: [
    {
      queryKey: "governorate_id",
      items: governorates,
      hasAdsOnly: true,
    },
    {
      queryKey: "city_id",
      parentKey: "governorate_id",
      items: cities,
      hasAdsOnly: true,
    },
    {
      queryKey: "area_id",
      parentKey: "city_id",
      items: areas,
      hasAdsOnly: true,
    },
    {
      queryKey: "compound_id",
      parentKey: "area_id",
      items: compounds,
      hasAdsOnly: true,
    },
  ],
  summary: (value) => {
    const selectedKey =
      value?.compound_id ||
      value?.area_id ||
      value?.city_id ||
      value?.governorate_id;
    const selectedItem =
      compounds.find((item) => String(item.id) === String(value?.compound_id)) ||
      areas.find((item) => String(item.id) === String(value?.area_id)) ||
      cities.find((item) => String(item.id) === String(value?.city_id)) ||
      governorates.find((item) => String(item.id) === String(value?.governorate_id));

    return selectedKey && selectedItem
      ? getItemName(selectedItem, locale)
      : LABELS[locale].placeholders.locations;
  },
});

const buildDepartmentField = ({ departments, categories, subCategories }, locale) => ({
  key: "department_tree",
  uiType: "nested",
  label: {
    en: LABELS.en.filters.departments,
    ar: LABELS.ar.filters.departments,
  },
  levels: [
    {
      queryKey: "dep",
      items: departments.filter(filterHasAds),
      hasAdsOnly: true,
    },
    {
      queryKey: "cat",
      parentKey: "table_id",
      items: categories.filter(filterHasAds),
      hasAdsOnly: true,
    },
    {
      queryKey: "subcat",
      parentKey: "category_id",
      items: subCategories.filter(filterHasAds),
      hasAdsOnly: true,
    },
  ],
  summary: (value) => {
    const selectedItems = [
      departments.find((item) => String(item.id) === String(value?.dep)),
      categories.find((item) => String(item.id) === String(value?.cat)),
      subCategories.find((item) => String(item.id) === String(value?.subcat)),
    ].filter(Boolean);

    return selectedItems.length
      ? selectedItems.map((item) => getItemName(item, locale)).join(" > ")
      : LABELS[locale].placeholders.departments;
  },
});

const buildPriceField = (locale) => ({
  key: "price",
  uiType: "range",
  min: 0,
  max: 10000000,
  label: {
    en: LABELS.en.filters.price,
    ar: LABELS.ar.filters.price,
  },
  summary: (value) => {
    if (!Array.isArray(value)) return LABELS[locale].placeholders.price;
    return `${value[0]} - ${value[1]}`;
  },
});

const buildCurrencyField = (locale) => ({
  key: "currency",
  uiType: "select",
  label: {
    en: LABELS.en.filters.currency,
    ar: LABELS.ar.filters.currency,
  },
  options: Currencies.map((item) => ({
    id: item.id,
    value: item.id,
    label: {
      en: item.name_en,
      ar: item.name_ar,
    },
  })),
  summary: (value) =>
    value?.label?.[locale] || LABELS[locale].placeholders.currency,
});

const buildVerifiedField = (locale) => ({
  key: "is_verified_only",
  uiType: "checkbox",
  label: {
    en: LABELS.en.filters.verified,
    ar: LABELS.ar.filters.verified,
  },
  summary: (value) =>
    value === true
      ? LABELS[locale].filters.verified
      : LABELS[locale].placeholders.verified,
});

const buildTableDynamicFields = ({
  tableId,
  categories,
  subCategories,
  locale,
  maxAreaM2 = 2000,
}) => {
  if (!tableId) return [];

  const tableRule = getTableRule(tableId);
  const allowed = new Set(tableRule.allFields || []);
  const fields = [];

  if (allowed.has("area_m2")) {
    fields.push({
      key: "area_m2",
      uiType: "range",
      min: 0,
      max: maxAreaM2,
      label: { en: "Area m2", ar: "Area m2" },
      summary: (value) =>
        Array.isArray(value) ? `${value[0]} - ${value[1]}` : "Area m2",
    });
  }

  ["bedrooms", "bathrooms"].forEach((key) => {
    if (!allowed.has(key)) return;
    fields.push({
      key,
      uiType: "select",
      label: { en: key === "bedrooms" ? "Bedrooms" : "Bathrooms", ar: key },
      options: Array.from({ length: 6 }, (_, index) => ({
        id: index + 1,
        value: index + 1,
        label: { en: `${index + 1}`, ar: `${index + 1}` },
      })),
      summary: (value) =>
        value?.label?.[locale] || (key === "bedrooms" ? "Bedrooms" : "Bathrooms"),
    });
  });

  if (allowed.has("level")) {
    fields.push({
      key: "level",
      uiType: "select",
      label: { en: "Level", ar: "Level" },
      options: Levels.map(toEnumOption),
      summary: (value) => value?.label?.[locale] || "Level",
    });
  }

  if (allowed.has("rent_frequency")) {
    fields.push({
      key: "rent_frequency",
      uiType: "select",
      label: { en: "Rent Frequency", ar: "Rent Frequency" },
      options: RentFrequencies.map(toEnumOption),
      summary: (value) => value?.label?.[locale] || "Rent Frequency",
    });
  }

  if (allowed.has("payment_method")) {
    fields.push({
      key: "payment_method",
      uiType: "select",
      label: { en: "Payment Method", ar: "Payment Method" },
      options: PaymentMethod.map(toEnumOption),
      summary: (value) => value?.label?.[locale] || "Payment Method",
    });
  }

  ["ready_to_move", "furnished"].forEach((key) => {
    if (!allowed.has(key)) return;
    fields.push({
      key,
      uiType: "boolean",
      label: {
        en: key === "ready_to_move" ? "Ready to Move" : "Furnished",
        ar: key === "ready_to_move" ? "Ready to Move" : "Furnished",
      },
      summary: (value) =>
        value === true ? LABELS[locale].yes : value === false ? LABELS[locale].no : key,
    });
  });

  if (allowed.has("type")) {
    fields.push({
      key: "type",
      uiType: "select",
      label: { en: "Type", ar: "Type" },
      options: BuildingAndLandsTypes.map(toEnumOption),
      summary: (value) => value?.label?.[locale] || "Type",
    });
  }

  if (allowed.has("land_type")) {
    fields.push({
      key: "land_type",
      uiType: "select",
      label: { en: "Land Type", ar: "Land Type" },
      options: LandType.map(toEnumOption),
      summary: (value) => value?.label?.[locale] || "Land Type",
    });
  }

  if (allowed.has("building_type")) {
    fields.push({
      key: "building_type",
      uiType: "select",
      label: { en: "Building Type", ar: "Building Type" },
      options: BuildingType.map(toEnumOption),
      summary: (value) => value?.label?.[locale] || "Building Type",
    });
  }

  if (allowed.has("building_condition")) {
    fields.push({
      key: "building_condition",
      uiType: "select",
      label: { en: "Building Condition", ar: "Building Condition" },
      options: BuildingCondition.map(toEnumOption),
      summary: (value) => value?.label?.[locale] || "Building Condition",
    });
  }

  const amenityOptions = Amenities.filter((item) =>
    (tableRule.amenityFields || []).includes(item.id),
  ).map((item) => ({
    id: item.id,
    value: item.id,
    label: { en: item.name_en, ar: item.name_ar },
  }));

  if (amenityOptions.length) {
    fields.push({
      key: "amenities",
      uiType: "multiSelect",
      label: { en: "Amenities", ar: "Amenities" },
      options: amenityOptions,
      summary: (value) =>
        Array.isArray(value) && value.length ? `${value.length} selected` : "Amenities",
    });
  }

  return fields;
};

export default function HeroSearchCard() {
  const { locale } = useContext(settings);
  const {
    tables = [],
    categories: allCategories = [],
    subCategories: allSubCategories = [],
    governorates: globalGovernorates = [],
    cities: globalCities = [],
    areas: globalAreas = [],
    compounds: globalCompounds = [],
  } = useAppData();
  const router = useRouter();
  const shellRef = useRef(null);
  const text = LABELS[locale] || LABELS.en;

  const [meta, setMeta] = useState({
    basic_filters: [],
    dynamic_filters: [],
    prefetched_options: { categories: [] },
    departments: [],
  });
  const [options, setOptions] = useState({
    governorates: [],
    cities: [],
    areas: [],
    compounds: [],
    subCategories: [],
  });
  const [form, setForm] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchMeta, setSearchMeta] = useState({
    max_price: 10000000,
    total: 0,
  });
  const [searchError, setSearchError] = useState("");

  const selectedTableId = form.dep || null;
  const selectedCategoryId = form.categoryId || form.cat || null;
  const selectedLocation = useMemo(
    () => ({
      governorate_id: form.governorate_id,
      city_id: form.city_id,
      area_id: form.area_id,
      compound_id: form.compound_id,
    }),
    [form],
  );
  const selectedDepartment = useMemo(
    () => ({
      dep: form.dep,
      cat: form.cat || form.categoryId,
      subcat: form.subcat || form.subCategoryId,
    }),
    [form],
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideMenuField = event.target.closest(".hero-menu-field");

      if (!clickedInsideMenuField) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let active = true;

    const loadMeta = async () => {
      try {
        setLoading(true);
        const res = await getHeroSearchFilters(selectedTableId);
        if (!active) return;
        setMeta(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMeta();

    return () => {
      active = false;
    };
  }, [selectedTableId]);

  useEffect(() => {
    let active = true;

    const loadGovernorates = async () => {
      try {
        const res = await getGovernorates(null, selectedTableId);
        if (!active) return;
        setOptions((prev) => ({ ...prev, governorates: res.data || [] }));
      } catch (error) {
        console.error(error);
      }
    };

    loadGovernorates();

    return () => {
      active = false;
    };
  }, [selectedTableId]);

  useEffect(() => {
    let active = true;

    if (!form.governorate_id) {
      setOptions((prev) => ({ ...prev, cities: [], areas: [], compounds: [] }));
      return undefined;
    }

    const loadCities = async () => {
      try {
        const res = await getCities(form.governorate_id, selectedTableId);
        if (!active) return;
        setOptions((prev) => ({
          ...prev,
          cities: res.data || [],
          areas: [],
          compounds: [],
        }));
      } catch (error) {
        console.error(error);
      }
    };

    loadCities();

    return () => {
      active = false;
    };
  }, [form.governorate_id, selectedTableId]);

  useEffect(() => {
    let active = true;

    if (!form.city_id) {
      setOptions((prev) => ({ ...prev, areas: [], compounds: [] }));
      return undefined;
    }

    const loadChildren = async () => {
      try {
        const [areasRes, compoundsRes] = await Promise.all([
          getAreas(form.city_id, selectedTableId),
          getCompounds(null, selectedTableId, form.city_id),
        ]);

        if (!active) return;

        setOptions((prev) => ({
          ...prev,
          areas: areasRes.data || [],
          compounds: compoundsRes.data || [],
        }));
      } catch (error) {
        console.error(error);
      }
    };

    loadChildren();

    return () => {
      active = false;
    };
  }, [form.city_id, selectedTableId]);

  useEffect(() => {
    let active = true;

    if (!form.area_id) return undefined;

    const loadCompounds = async () => {
      try {
        const res = await getCompounds(form.area_id, selectedTableId);
        if (!active) return;
        setOptions((prev) => ({ ...prev, compounds: res.data || [] }));
      } catch (error) {
        console.error(error);
      }
    };

    loadCompounds();

    return () => {
      active = false;
    };
  }, [form.area_id, selectedTableId]);

  useEffect(() => {
    let active = true;

    if (!selectedCategoryId) {
      setOptions((prev) => ({ ...prev, subCategories: [] }));
      return undefined;
    }

    const loadSubCategories = async () => {
      try {
        const res = await getSubCategories(selectedCategoryId);
        if (!active) return;
        setOptions((prev) => ({ ...prev, subCategories: res.data || [] }));
      } catch (error) {
        console.error(error);
      }
    };

    loadSubCategories();

    return () => {
      active = false;
    };
  }, [selectedCategoryId]);

  useEffect(() => {
    let active = true;

    const loadSearchMeta = async () => {
      try {
        const filters = { page: 1, limit: 1 };

        if (form.dep) filters.table_id = form.dep;
        if (form.cat || form.categoryId) {
          filters.category = form.cat || form.categoryId;
        }
        if (form.subcat || form.subCategoryId) {
          filters.subCategory = form.subcat || form.subCategoryId;
        }

        [
          "governorate_id",
          "city_id",
          "area_id",
          "compound_id",
          "currency",
          "is_verified_only",
        ].forEach((key) => {
          if (form[key] !== undefined && form[key] !== null && form[key] !== "") {
            filters[key] = form[key];
          }
        });

        Object.entries(form).forEach(([key, value]) => {
          if (
            value === undefined ||
            value === null ||
            value === "" ||
            [
              "dep",
              "cat",
              "subcat",
              "categoryId",
              "subCategoryId",
              "governorate_id",
              "city_id",
              "area_id",
              "compound_id",
              "currency",
              "is_verified_only",
              "min_price",
              "max_price",
            ].includes(key)
          ) {
            return;
          }

          filters[key] = value;
        });

        Object.keys(filters).forEach((key) => {
          if (String(key).startsWith("am_") && filters[key] !== true) {
            delete filters[key];
          }
        });

        const res = await getAllAds(filters);
        if (!active) return;

        setSearchMeta({
          max_price: res.data?.meta?.max_price || 10000000,
          total: res.data?.pagination?.total || 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadSearchMeta();

    return () => {
      active = false;
    };
  }, [form]);

    const hasSelectedFilters = useMemo(
      () =>
        Object.entries(form).some(
          ([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== false,
        ),
      [form],
    );


  useEffect(() => {
    if (searchError && hasSelectedFilters) {
      setSearchError("");
    }
  }, [hasSelectedFilters, searchError]);

  const locationField = useMemo(
    () =>
      buildLocationField(
        {
          governorates:
            selectedTableId && options.governorates.length
              ? options.governorates
              : globalGovernorates,
          cities: selectedTableId && options.cities.length ? options.cities : globalCities,
          areas: selectedTableId && options.areas.length ? options.areas : globalAreas,
          compounds:
            selectedTableId && options.compounds.length
              ? options.compounds
              : globalCompounds,
        },
        locale,
      ),
    [
      globalAreas,
      globalCities,
      globalCompounds,
      globalGovernorates,
      locale,
      options.areas,
      options.cities,
      options.compounds,
      options.governorates,
      selectedTableId,
    ],
  );

  const availableCategories = useMemo(() => {
    const source = allCategories.filter(filterHasAds);
    return selectedTableId
      ? source.filter((item) => Number(item.table_id) === Number(selectedTableId))
      : source;
  }, [allCategories, selectedTableId]);

  const availableTables = useMemo(
    () =>
      tables.filter((table) =>
        availableCategories.some((cat) => Number(cat.table_id) === Number(table.id)),
      ),
    [availableCategories, tables],
  );

  const availableSubCategories = useMemo(() => {
    const source = options.subCategories.length ? options.subCategories : allSubCategories;
    return source.filter(filterHasAds);
  }, [allSubCategories, options.subCategories]);

  const departmentField = useMemo(
    () =>
      buildDepartmentField(
        {
          departments: availableTables,
          categories: availableCategories,
          subCategories: availableSubCategories,
        },
        locale,
      ),
    [availableCategories, availableSubCategories, availableTables, locale],
  );

  const priceField = useMemo(() => {
    const field = buildPriceField(locale);

    return {
      ...field,
      max: searchMeta.max_price || 10000000,
      summary: (value) => {
        if (!Array.isArray(value)) {
          return `0 - ${searchMeta.max_price || 10000000}`;
        }

        return `${value[0]} - ${value[1]}`;
      },
    };
  }, [locale, searchMeta.max_price]);
  const currencyField = useMemo(() => buildCurrencyField(locale), [locale]);
  const verifiedField = useMemo(() => buildVerifiedField(locale), [locale]);

  const allDynamicFields = useMemo(
    () =>
      buildTableDynamicFields({
        tableId: selectedTableId,
        categories: availableCategories,
        subCategories: availableSubCategories,
        locale,
        maxAreaM2: 2000,
      }),
    [availableCategories, availableSubCategories, locale, selectedTableId],
  );

  const applyFieldValue = (fieldKey, value) => {
    setForm((prev) => {
      const next = { ...prev };

      if (fieldKey === "location_tree") {
        ["governorate_id", "city_id", "area_id", "compound_id"].forEach((key) => {
          if (!value?.[key]) delete next[key];
          else next[key] = value[key];
        });
        return next;
      }

      if (fieldKey === "department_tree") {
        const nextDep = value?.dep || null;
        const depChanged = String(next.dep || "") !== String(nextDep || "");

        if (!value?.dep) delete next.dep;
        else next.dep = value.dep;

        if (!value?.cat) delete next.cat;
        else next.cat = value.cat;

        if (!value?.subcat) delete next.subcat;
        else next.subcat = value.subcat;

        if (depChanged) {
          [
            "governorate_id",
            "city_id",
            "area_id",
            "compound_id",
          ].forEach((key) => delete next[key]);
        }

        return next;
      }

      if (fieldKey === "price") {
        const [minKey, maxKey] = RANGE_KEYS.price;
        if (!Array.isArray(value)) {
          delete next[minKey];
          delete next[maxKey];
        } else {
          next[minKey] = value[0];
          next[maxKey] = value[1];
        }
        return next;
      }

      if (fieldKey === "categoryId") {
        if (value === null || value === undefined || value === "") {
          delete next.categoryId;
          delete next.cat;
          delete next.subCategoryId;
          delete next.subcat;
        } else {
          next.categoryId = value.id;
          next.cat = value.id;
          delete next.subCategoryId;
          delete next.subcat;
        }
        return next;
      }

      if (fieldKey === "subCategoryId") {
        if (value === null || value === undefined || value === "") {
          delete next.subCategoryId;
          delete next.subcat;
        } else {
          next.subCategoryId = value.id;
          next.subcat = value.id;
        }
        return next;
      }

      if (fieldKey === "amenities") {
        const selectedAmenities = Array.isArray(value) ? value : [];

        Object.keys(next).forEach((key) => {
          if (String(key).startsWith("am_")) {
            delete next[key];
          }
        });

        selectedAmenities.forEach((amenityKey) => {
          next[amenityKey] = true;
        });

        return next;
      }

      const rangeKeys = RANGE_KEYS[fieldKey];
      if (rangeKeys) {
        const [minKey, maxKey] = rangeKeys;
        if (!Array.isArray(value)) {
          delete next[minKey];
          delete next[maxKey];
        } else {
          next[minKey] = value[0];
          next[maxKey] = value[1];
        }
        return next;
      }

      if (value === null || value === undefined || value === "") {
        delete next[fieldKey];
      } else if (typeof value === "object" && value.id !== undefined) {
        next[fieldKey] = value.id;
      } else {
        next[fieldKey] = value;
      }

      return next;
    });
  };

  const buildSelectedValue = (field) => {
    if (field.key === "location_tree") return selectedLocation;
    if (field.key === "department_tree") return selectedDepartment;

      const rangeKeys = RANGE_KEYS[field.key];
      if (rangeKeys) {
        const [minKey, maxKey] = rangeKeys;
        if (form[minKey] === undefined && form[maxKey] === undefined) return undefined;
        const maxValue =
          field.key === "price" ? searchMeta.max_price || field.max || 10000000 : field.max || 10000000;
        return [
          Number(form[minKey] || 0),
          Math.min(Number(form[maxKey] || maxValue), maxValue),
        ];
      }

    if (field.uiType === "select") {
      return field.options?.find((option) => String(option.id) === String(form[field.key]));
    }

    if (field.uiType === "multiSelect") {
      return (field.options || [])
        .filter((option) => form[option.value] === true)
        .map((option) => option.value);
    }

    if (field.uiType === "checkbox" || field.uiType === "boolean") {
      return form[field.key];
    }

    return form[field.key];
  };

  const getTriggerSummary = (field) => {
    const value = buildSelectedValue(field);
    return field.summary ? field.summary(value) : text.placeholders.dynamic;
  };


  const searchButtonText = useMemo(() => {
    if (!hasSelectedFilters) return text.search;
    if (searchMeta.total <= 0) {
      return locale === "ar" ? "لا توجد نتائج" : "No results";
    }
    return locale === "ar"
      ? `عرض ${searchMeta.total} نتيجة`
      : `View ${searchMeta.total} results`;
  }, [hasSelectedFilters, locale, searchMeta.total, text.search]);

  const renderFloatingField = (menuKey, field, width = "standard") => {
    const selectedValue = buildSelectedValue(field);

    return (
      <div className={`hero-menu-field ${width}`} key={menuKey}>
        <div
          className={`selectOptions large hero-trigger ${activeMenu === menuKey ? "active" : ""}`}
        >
          <div
            className="btn"
            onClick={() => setActiveMenu((prev) => (prev === menuKey ? null : menuKey))}
          >
            <h4 className="ellipsis">{getTriggerSummary(field)}</h4>
            <IoIosArrowDown className="main-ico" />
          </div>

          {activeMenu === menuKey && (
            <div className="hero-floating-menu">
              <DynamicFilters
                dynamicFilters={[field]}
                selectedFilters={{ [field.key]: selectedValue }}
                setSelectedFilters={(key, value) => applyFieldValue(key, value)}
                screenSize="large"
                active={true}
                setActive={() => {}}
                locale={locale}
                showViewToggle={false}
                nestedChildrenAsMenu={false}
                focusSelectedBranch={field.uiType === "nested"}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    Object.entries(form).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;

      const mappedKey = QUERY_KEY_MAP[key] || key;
      params.set(mappedKey, String(value));
    });

    return params;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!hasSelectedFilters) {
      setSearchError(
        locale === "ar"
          ? "لازم تختار حاجة من الفلاتر الأول"
          : "You need to select at least one filter first",
      );
      return;
    }

    if (searchMeta.total <= 0) {
      return;
    }

    setSearchError("");
    const params = buildQueryParams();
    router.push(params.toString() ? `/market?${params}` : "/market");
  };

  return (
    <div className="hero-search-shell" ref={shellRef}>
      <form className="hero-search-card" onSubmit={handleSubmit}>
        <div className="hero-search-row">
          {renderFloatingField("departments", departmentField, "wide")}
          {renderFloatingField("locations", locationField, "wide")}
          {renderFloatingField("price", priceField)}
          {renderFloatingField("currency", currencyField)}
          {renderFloatingField("verified", verifiedField)}
        </div>

        {selectedTableId && allDynamicFields.length > 0 && (
          <div className="hero-search-row secondary">
            {allDynamicFields.map((field) =>
              renderFloatingField(`dynamic-${field.key}`, field),
            )}
          </div>
        )}

        <div className="hero-search-footer">
          {searchError ? <span className="error">{searchError}</span> : null}
          <button
            type="submit"
            className={`hero-search-submit ${!hasSelectedFilters || searchMeta.total <= 0 ? "disabled" : ""}`}
          >
            {searchButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
