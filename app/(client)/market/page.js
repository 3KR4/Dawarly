"use client";
export const dynamic = "force-dynamic";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AdsCard from "@/components/home/AdsCard";
import DynamicFilters from "@/components/Tools/data-collector/DynamicFilters";
import ActiveFiltersBar from "@/components/home/ActiveFiltersBar";
import CategoriesSwiper from "@/components/home/Sections/CategoriesSwiper";
import Pagination from "@/components/Tools/Pagination";
import "@/styles/client/pages/market.css";
import { settings } from "@/Contexts/settings";
import { useRouter, useSearchParams } from "next/navigation";
import { IoFilterSharp } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { BsGridFill } from "react-icons/bs";
import { getAllAds } from "@/services/ads/ads.service";
import {
  getAreas,
  getCities,
  getCompounds,
  getGovernorates,
} from "@/services/data/data.service";
import { TbListSearch } from "react-icons/tb";
import { useNotification } from "@/Contexts/NotificationContext";
import { useAppData } from "@/Contexts/DataContext";
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

const SORT_OPTIONS = [
  {
    id: "newest",
    backendSort: "date",
    backendOrder: "desc",
    name: { en: "Publish Date: Newest", ar: "Publish Date: Newest" },
  },
  {
    id: "oldest",
    backendSort: "date",
    backendOrder: "asc",
    name: { en: "Publish Date: Oldest", ar: "Publish Date: Oldest" },
  },
  {
    id: "price_low",
    backendSort: "price_asc",
    name: { en: "Price: Low to High", ar: "Price: Low to High" },
  },
  {
    id: "price_high",
    backendSort: "price_desc",
    name: { en: "Price: High to Low", ar: "Price: High to Low" },
  },
  {
    id: "most_viewed",
    backendSort: "views_desc",
    name: { en: "Most Viewed", ar: "Most Viewed" },
  },
  {
    id: "most_favorites",
    backendSort: "favorites_desc",
    name: { en: "Most Favorites", ar: "Most Favorites" },
  },
];

const rangeQueryKeys = {
  price: ["min_price", "max_price"],
  area_m2: ["min_area_m2", "max_area_m2"],
  down_payment: ["min_down_payment", "max_down_payment"],
};

const toFilterOption = (item) => ({
  id: item.id,
  value: item.id,
  label: {
    en: item.name_en,
    ar: item.name_ar,
  },
});

const getFilterValueForUrl = (params, field) => {
  if (field.uiType === "range") {
    const [minKey, maxKey] = rangeQueryKeys[field.key] || [
      `min_${field.key}`,
      `max_${field.key}`,
    ];
    const min = params.get(minKey);
    const max = params.get(maxKey);

    if (min === null && max === null) return undefined;
    return [Number(min ?? field.min ?? 0), Number(max ?? field.max ?? 10000)];
  }

  if (field.uiType === "multiSelect") {
    const value = params.get(field.key);
    return value ? value.split(",").filter(Boolean) : undefined;
  }

  if (field.uiType === "boolean") {
    const value = params.get(field.key);
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
  }

  if (field.uiType === "checkbox") {
    return params.get(field.key) === "true" ? true : undefined;
  }

  if (field.uiType === "nested") {
    const selectedValues = field.levels.reduce((acc, level) => {
      const value = params.get(level.queryKey);
      if (value) acc[level.queryKey] = value;
      return acc;
    }, {});

    return Object.keys(selectedValues).length ? selectedValues : undefined;
  }

  const value = params.get(field.key);
  if (!value) return undefined;

  return (
    field.options?.find((option) => String(option.id) === value) || {
      id: value,
      value,
      label: { en: value, ar: value },
    }
  );
};

const hasAds = (item) => Number(item?.adsCount || 0) > 0;

const getDynamicFilterDefinitions = (tableId, data = {}) => {
  const {
    maxPrice = 10000000,
    maxAreaM2 = 2000,
    tables = [],
    categories = [],
    subCategories = [],
    governorates = [],
    cities = [],
    areas = [],
    compounds = [],
  } = data;
  const tableRule = getTableRule(tableId);
  const fields = [
    {
      key: "location_tree",
      uiType: "nested",
      label: { en: "Locations", ar: "Locations" },
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
    },
    {
      key: "category_tree",
      uiType: "nested",
      label: { en: "Departments", ar: "Departments" },
      levels: [
        {
          queryKey: "dep",
          items: tables.filter((table) =>
            categories.some((cat) => cat.table_id === table.id && hasAds(cat)),
          ),
        },
        {
          queryKey: "cat",
          parentKey: "table_id",
          items: categories.filter(hasAds),
        },
        {
          queryKey: "subcat",
          parentKey: "category_id",
          items: subCategories.filter(hasAds),
        },
      ],
    },

    {
      key: "price",
      uiType: "range",
      min: 0,
      max: maxPrice || 10000000,
      label: { en: "Price (EGP)", ar: "Price (EGP)" },
    },
    {
      key: "currency",
      uiType: "select",
      label: { en: "Currency", ar: "Currency" },
      options: Currencies.map(toFilterOption),
    },
    {
      key: "is_verified_only",
      uiType: "checkbox",
      label: { en: "Verified ads only", ar: "Verified ads only" },
    },
  ];

  if (!tableId) return fields;

  const allowed = new Set(tableRule.allFields);
  const pushIfAllowed = (fieldName, field) => {
    if (allowed.has(fieldName)) fields.push(field);
  };

  pushIfAllowed("area_m2", {
    key: "area_m2",
    uiType: "range",
    min: 0,
    max: maxAreaM2 || 2000,
    label: { en: "Area m2", ar: "Area m2" },
  });

  ["bedrooms", "bathrooms"].forEach((key) => {
    pushIfAllowed(key, {
      key,
      uiType: "select",
      label: { en: key === "bedrooms" ? "Bedrooms" : "Bathrooms", ar: key },
      options: Array.from({ length: 6 }, (_, index) => ({
        id: index + 1,
        value: index + 1,
        label: { en: `${index + 1}`, ar: `${index + 1}` },
      })),
    });
  });

  pushIfAllowed("level", {
    key: "level",
    uiType: "select",
    label: { en: "Level", ar: "Level" },
    options: Levels.map(toFilterOption),
  });

  pushIfAllowed("rent_frequency", {
    key: "rent_frequency",
    uiType: "select",
    label: { en: "Rent Frequency", ar: "Rent Frequency" },
    options: RentFrequencies.map(toFilterOption),
  });

  pushIfAllowed("payment_method", {
    key: "payment_method",
    uiType: "select",
    label: { en: "Payment Method", ar: "Payment Method" },
    options: PaymentMethod.map(toFilterOption),
  });

  ["ready_to_move", "furnished"].forEach((key) => {
    pushIfAllowed(key, {
      key,
      uiType: "boolean",
      label: {
        en: key === "ready_to_move" ? "Ready to Move" : "Furnished",
        ar: key === "ready_to_move" ? "Ready to Move" : "Furnished",
      },
    });
  });

  pushIfAllowed("type", {
    key: "type",
    uiType: "select",
    label: { en: "Type", ar: "Type" },
    options: BuildingAndLandsTypes.map(toFilterOption),
  });
  pushIfAllowed("land_type", {
    key: "land_type",
    uiType: "select",
    label: { en: "Land Type", ar: "Land Type" },
    options: LandType.map(toFilterOption),
  });
  pushIfAllowed("building_type", {
    key: "building_type",
    uiType: "select",
    label: { en: "Building Type", ar: "Building Type" },
    options: BuildingType.map(toFilterOption),
  });
  pushIfAllowed("building_condition", {
    key: "building_condition",
    uiType: "select",
    label: { en: "Building Condition", ar: "Building Condition" },
    options: BuildingCondition.map(toFilterOption),
  });

  if (tableRule.amenityFields.length) {
    fields.push({
      key: "amenities",
      uiType: "multiSelect",
      label: { en: "Amenities", ar: "Amenities" },
      options: Amenities.filter((amenity) =>
        tableRule.amenityFields.includes(amenity.id),
      ).map((amenity) => ({
        id: amenity.id,
        value: amenity.id,
        label: { en: amenity.name_en, ar: amenity.name_ar },
      })),
    });
  }

  return fields;
};

export default function Marketplace() {
  const { screenSize, locale } = useContext(settings);
  const { addNotification } = useNotification();
  const {
    tables,
    categories,
    subCategories,
    governorates,
    cities,
    areas,
    compounds,
  } = useAppData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const tableId = searchParams.get("dep")
    ? Number(searchParams.get("dep"))
    : null;
  const currentPage = Number(searchParams.get("page") || 1);
  const catParam = searchParams.get("cat");
  const subcatParam = searchParams.get("subcat");
  const sortUiParam = searchParams.get("sort_by_ui");

  const [adsData, setAdsData] = useState({
    ads: [],
    pagination: {
      page: 1,
      totalPages: 1,
      limit: 10,
      total: 0,
    },
  });
  const [loadingContent, setLoadingContent] = useState(false);
  const [meta, setMeta] = useState({
    max_price: 10000000,
    max_area_m2: 2000,
    price_currency: "EGP",
  });
  const [tableLocations, setTableLocations] = useState(null);
  const [openFilters, setOpenFilters] = useState(false);
  const [listGridOption, setListGridOption] = useState("grid");
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    cat: catParam ? { id: parseInt(catParam) } : null,
    subCat: subcatParam ? { id: parseInt(subcatParam) } : null,
  });

  const activeDynamicFilters = useMemo(
    () =>
      getDynamicFilterDefinitions(tableId, {
        maxPrice: meta.max_price,
        maxAreaM2: meta.max_area_m2,
        tables,
        categories,
        subCategories,
        governorates: tableLocations?.governorates || governorates,
        cities: tableLocations?.cities || cities,
        areas: tableLocations?.areas || areas,
        compounds: tableLocations?.compounds || compounds,
      }),
    [
      areas,
      categories,
      cities,
      compounds,
      governorates,
      meta.max_price,
      meta.max_area_m2,
      subCategories,
      tableLocations,
      tableId,
      tables,
    ],
  );

  const selectedDynamicFilters = useMemo(() => {
    const params = new URLSearchParams(queryString);

    return activeDynamicFilters.reduce((acc, field) => {
      const value = getFilterValueForUrl(params, field);
      if (value !== undefined) acc[field.key] = value;
      return acc;
    }, {});
  }, [activeDynamicFilters, queryString]);

  const selectedSort = useMemo(() => {
    return (
      SORT_OPTIONS.find((option) => option.id === sortUiParam) ||
      SORT_OPTIONS[0]
    );
  }, [sortUiParam]);

  const [orderBy, setOrderBy] = useState(selectedSort);

  useEffect(() => {
    if (!tableId) {
      setTableLocations(null);
      return;
    }

    let isCurrent = true;

    const fetchTableLocations = async () => {
      try {
        const [govRes, citiesRes, areasRes, compoundsRes] = await Promise.all([
          getGovernorates(null, tableId),
          getCities(null, tableId),
          getAreas(null, tableId),
          getCompounds(null, tableId),
        ]);

        if (!isCurrent) return;

        setTableLocations({
          governorates: govRes.data || [],
          cities: citiesRes.data || [],
          areas: areasRes.data || [],
          compounds: compoundsRes.data || [],
        });
      } catch (err) {
        console.error(err);
        if (isCurrent) setTableLocations(null);
      }
    };

    fetchTableLocations();

    return () => {
      isCurrent = false;
    };
  }, [tableId]);

  const updateUrl = useCallback(
    (updates = {}, resetPage = true) => {
      const params = new URLSearchParams(queryString);
      const categoryKeys = ["dep", "cat", "subcat"];
      const shouldResetPriceRange = categoryKeys.some((key) => {
        if (!Object.prototype.hasOwnProperty.call(updates, key)) return false;

        const nextValue = updates[key];
        const currentValue = params.get(key);
        const normalizedNextValue =
          nextValue === null || nextValue === undefined || nextValue === ""
            ? null
            : String(nextValue);

        return currentValue !== normalizedNextValue;
      });

      if (shouldResetPriceRange) {
        params.delete("min_price");
        params.delete("max_price");
      }

      Object.entries(updates).forEach(([key, value]) => {
        const isEmpty =
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) params.delete(key);
        else params.set(key, String(value));
      });

      if (resetPage) params.delete("page");

      const nextQuery = params.toString();
      router.push(nextQuery ? `/market?${nextQuery}` : "/market");
    },
    [queryString, router],
  );

  const buildRequestFilters = useCallback(
    (page = 1) => {
      const params = new URLSearchParams(queryString);
      const filters = {
        page,
        limit: adsData.pagination.limit,
        sort: selectedSort.backendSort,
      };
      const search = params.get("s") || params.get("search");

      if (selectedSort.backendOrder) filters.order = selectedSort.backendOrder;
      if (search) filters.search = search;
      if (params.get("dep")) filters.table_id = params.get("dep");
      if (params.get("cat")) filters.category = params.get("cat");
      if (params.get("subcat")) filters.subCategory = params.get("subcat");

      activeDynamicFilters.forEach((field) => {
        const value = getFilterValueForUrl(params, field);
        if (value === undefined) return;

        if (field.uiType === "range") {
          const [minKey, maxKey] = rangeQueryKeys[field.key] || [
            `min_${field.key}`,
            `max_${field.key}`,
          ];
          filters[minKey] = value[0];
          filters[maxKey] = value[1];
          return;
        }

        if (field.key === "amenities" && Array.isArray(value)) {
          value.forEach((amenityKey) => {
            filters[amenityKey] = true;
          });
          return;
        }

        if (field.uiType === "nested") {
          Object.entries(value).forEach(([queryKey, selectedValue]) => {
            if (queryKey === "dep") filters.table_id = selectedValue;
            else if (queryKey === "cat") filters.category = selectedValue;
            else if (queryKey === "subcat") filters.subCategory = selectedValue;
            else filters[queryKey] = selectedValue;
          });
          return;
        }

        if (field.uiType === "checkbox") {
          if (value === true) filters[field.key] = true;
          return;
        }

        filters[field.key] =
          typeof value === "object" && value !== null ? value.id : value;
      });

      return filters;
    },
    [activeDynamicFilters, adsData.pagination.limit, queryString, selectedSort],
  );

  const fetchAds = useCallback(
    async (page = 1) => {
      try {
        setLoadingContent(true);

        const res = await getAllAds(buildRequestFilters(page));

        setAdsData((prev) => ({
          ads: res.data.data || [],
          pagination: res.data.pagination || prev.pagination,
        }));
        setMeta((prev) => {
          const next = res.data.meta || prev;
          return next.max_price === prev.max_price &&
            next.max_area_m2 === prev.max_area_m2 &&
            next.price_currency === prev.price_currency
            ? prev
            : next;
        });
      } catch (err) {
        console.error(err);
        addNotification({
          type: "warning",
          message: "Failed to fetch ads from server",
        });
      } finally {
        setLoadingContent(false);
      }
    },
    [addNotification, buildRequestFilters],
  );

  useEffect(() => {
    setSelectedCategory({
      cat: catParam ? { id: parseInt(catParam) } : null,
      subCat: subcatParam ? { id: parseInt(subcatParam) } : null,
    });
    setOrderBy(selectedSort);
  }, [catParam, subcatParam, selectedSort]);

  useEffect(() => {
    fetchAds(currentPage);
  }, [currentPage, fetchAds]);

  const handlePageChange = (newPage) => {
    updateUrl({ page: newPage }, false);
  };

  const handleListGridOption = (type) => {
    setListGridOption((prev) => (prev === type ? "" : type));
  };

  const handleCategorySelect = (type, item) => {
    if (type === "categories") {
      setSelectedCategory({ cat: item, subCat: null });
    } else if (type === "subcategories") {
      setSelectedCategory((prev) => ({ ...prev, subCat: item }));
    }
  };

  const handleRemoveCategory = (type) => {
    if (type === "cat") {
      setSelectedCategory({ cat: null, subCat: null });
      updateUrl({ cat: null, subcat: null });
    } else if (type === "subCat") {
      setSelectedCategory((prev) => ({ ...prev, subCat: null }));
      updateUrl({ subcat: null });
    }
  };

  const handleDynamicFilterChange = useCallback(
    (key, value) => {
      const field = activeDynamicFilters.find((item) => item.key === key);
      if (!field) return;

      if (field.uiType === "range") {
        const [minKey, maxKey] = rangeQueryKeys[key] || [
          `min_${key}`,
          `max_${key}`,
        ];

        if (!Array.isArray(value)) {
          updateUrl({ [minKey]: null, [maxKey]: null });
          return;
        }

        updateUrl({ [minKey]: value[0], [maxKey]: value[1] });
        return;
      }

      if (field.uiType === "multiSelect") {
        updateUrl({ [key]: Array.isArray(value) ? value.join(",") : null });
        return;
      }

      if (field.uiType === "nested") {
        const updates = field.levels.reduce((acc, level) => {
          acc[level.queryKey] = value?.[level.queryKey] || null;
          return acc;
        }, {});
        updateUrl(updates);
        return;
      }

      if (field.uiType === "checkbox") {
        updateUrl({ [key]: value === true ? true : null });
        return;
      }

      updateUrl({
        [key]: value && typeof value === "object" ? value.id : value,
      });
    },
    [activeDynamicFilters, updateUrl],
  );

  const handleRemoveFilter = (filterKey) => {
    const field = activeDynamicFilters.find((item) => item.key === filterKey);

    if (field?.uiType === "range") {
      const [minKey, maxKey] = rangeQueryKeys[filterKey] || [
        `min_${filterKey}`,
        `max_${filterKey}`,
      ];
      updateUrl({ [minKey]: null, [maxKey]: null });
      return;
    }

    if (field?.uiType === "nested") {
      const updates = field.levels.reduce((acc, level) => {
        acc[level.queryKey] = null;
        return acc;
      }, {});
      updateUrl(updates);
      return;
    }

    updateUrl({ [filterKey]: null });
  };

  const handleClearAllFilters = () => {
    setSelectedCategory({ cat: null, subCat: null });
    const updates = { dep: null, cat: null, subcat: null };

    activeDynamicFilters.forEach((field) => {
      if (field.uiType === "range") {
        const [minKey, maxKey] = rangeQueryKeys[field.key] || [
          `min_${field.key}`,
          `max_${field.key}`,
        ];
        updates[minKey] = null;
        updates[maxKey] = null;
      } else {
        updates[field.key] = null;
      }

      if (field.uiType === "nested") {
        field.levels.forEach((level) => {
          updates[level.queryKey] = null;
        });
      }
    });

    updateUrl(updates);
  };

  return (
    <>
      <div className="fluid-container marketplace">
        <div className="content">
          <DynamicFilters
            dynamicFilters={activeDynamicFilters}
            selectedFilters={selectedDynamicFilters}
            setSelectedFilters={handleDynamicFilterChange}
            screenSize={screenSize}
            active={openFilters}
            setActive={setOpenFilters}
            locale={locale}
          />

          <div className="main">
            <div className="top-nav">
              <ActiveFiltersBar
                selectedCategory={selectedCategory}
                dynamicFilters={selectedDynamicFilters}
                onRemoveCategory={handleRemoveCategory}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
                onOpenFilters={() => setOpenFilters(true)}
                screenSize={screenSize}
                fieldDefinitions={activeDynamicFilters}
              />

              <div className="row-holder">
                <div className="selectOptions ultra-small">
                  <div className="btn">
                    <h4
                      className="ellipsis"
                      onClick={() => setOrderOpen((prev) => !prev)}
                    >
                      {orderBy.name[locale]}
                    </h4>

                    <IoFilterSharp
                      className="main-ico"
                      onClick={() => setOrderOpen((prev) => !prev)}
                    />
                  </div>

                  {orderOpen && (
                    <div className="menu active">
                      {SORT_OPTIONS.map((item) => {
                        const isActive = orderBy.id === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={isActive ? "active" : ""}
                            onClick={() => {
                              setOrderBy(item);
                              setOrderOpen(false);
                              updateUrl({
                                sort_by_ui:
                                  item.id === "newest" ? null : item.id,
                              });
                            }}
                          >
                            {item.name[locale]}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid-option">
                  <BsGridFill
                    className={`${listGridOption === "grid" ? "active" : ""}`}
                    onClick={() => handleListGridOption("grid")}
                  />
                  <FaListUl
                    className={`${listGridOption === "list" ? "active" : ""}`}
                    onClick={() => handleListGridOption("list")}
                  />
                </div>
              </div>
            </div>

            <div
              className="grid-holder"
              style={{
                position: "relative",
                opacity: loadingContent ? "0.6" : "1",
              }}
            >
              {loadingContent && (
                <div className="loading-content cover">
                  <span
                    className="loader"
                    style={{ opacity: loadingContent ? "1" : "0" }}
                  ></span>
                </div>
              )}
              {!adsData?.ads?.length && !loadingContent ? (
                <div className="no-data-found">
                  <TbListSearch />
                  <p>{"no data found"} </p>
                </div>
              ) : (
                adsData?.ads?.map((item, index) => (
                  <AdsCard
                    key={`${item.department?.id || "ad"}-${item.id || index}`}
                    data={item}
                  />
                ))
              )}
            </div>

            {adsData?.pagination?.totalPages > 1 && (
              <Pagination
                pageCount={adsData?.pagination.totalPages}
                screenSize={screenSize}
                isDashBoard={true}
                currentPage={adsData?.pagination.page}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
