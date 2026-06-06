"use client";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/tables.css";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IoCloseSharp, IoSearchSharp } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import { getAllAds, deleteAd, changeStatus } from "@/services/ads/ads.service";
import { settings } from "@/Contexts/settings";
import AdsTable from "@/components/dashboard/AdsTable";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import DynamicFilters from "@/components/Tools/data-collector/DynamicFilters";
import ActiveFiltersBar from "@/components/home/ActiveFiltersBar";
import { useNotification } from "@/Contexts/NotificationContext";
import Pagination from "@/components/Tools/Pagination";
import { AdStatuses, Amenities, BuildingAndLandsTypes, BuildingCondition, BuildingType, Currencies, Levels, PaymentMethod, RentFrequencies } from "@/data/enums";
import { useAuth } from "@/Contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppData } from "@/Contexts/DataContext";
import { getTableRule } from "@/data/tablesRules";
import { getAreas, getCities, getCompounds, getGovernorates } from "@/services/data/data.service";

const SORT_OPTIONS = [
  {
    id: "newest",
    backendSort: "date",
    backendOrder: "desc",
    name_en: "Publish Date: Newest",
    name_ar: "تاريخ النشر: الأحدث",
  },
  {
    id: "oldest",
    backendSort: "date",
    backendOrder: "asc",
    name_en: "Publish Date: Oldest",
    name_ar: "تاريخ النشر: الأقدم",
  },
  {
    id: "price_low",
    backendSort: "price_asc",
    name_en: "Price: Low to High",
    name_ar: "السعر: من الأقل للأعلى",
  },
  {
    id: "price_high",
    backendSort: "price_desc",
    name_en: "Price: High to Low",
    name_ar: "السعر: من الأعلى للأقل",
  },
  {
    id: "most_viewed",
    backendSort: "views_desc",
    name_en: "Most Viewed",
    name_ar: "الأكثر مشاهدة",
  },
  {
    id: "most_favorites",
    backendSort: "favorites_desc",
    name_en: "Most Favorites",
    name_ar: "الأكثر تفضيلا",
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

const getAdsCount = (item) =>
  item?.adsCount ??
  item?.ads_count ??
  item?.active_ads_count ??
  item?.activeAdsCount;

const hasAds = (item) => {
  const adsCount = getAdsCount(item);
  return Number(adsCount || 0) > 0;
};

const sameId = (a, b) => String(a) === String(b);

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
            categories.some((cat) => sameId(cat.table_id, table.id) && hasAds(cat)),
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

export default function ActiveAds() {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const { addNotification } = useNotification();
  const { loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const {
    tables = [],
    categories = [],
    subCategories = [],
    governorates = [],
    cities = [],
    areas = [],
    compounds = [],
  } = useAppData();

  const ownerFilterId = searchParams.get("user");
  const ownerFilterType = searchParams.get("user_type");
  const currentPage = Number(searchParams.get("page") || 1);
  const searchParam = searchParams.get("search") || "";
  const sortUiParam = searchParams.get("sort_by_ui");
  const statusFromUrl = searchParams.get("status");
  const tableId = searchParams.get("dep") ? Number(searchParams.get("dep")) : null;
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
  const [openFilters, setOpenFilters] = useState(false);
  const [searchText, setSearchText] = useState(searchParam);
  const [searchConfirmed, setSearchConfirmed] = useState(Boolean(searchParam));
  const [tableLocations, setTableLocations] = useState(null);
  const [meta, setMeta] = useState({
    max_price: 10000000,
    max_area_m2: 2000,
    price_currency: "EGP",
  });

  const statusOptions = AdStatuses.filter((status) => status.id !== "PENDING");
  const selectedStatus =
    AdStatuses.find((status) => status.id === statusFromUrl) || null;
  const selectedSort =
    SORT_OPTIONS.find((option) => option.id === sortUiParam) || SORT_OPTIONS[0];

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
      meta.max_area_m2,
      meta.max_price,
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

  const activeBarDefinitions = useMemo(
    () => [
      ...activeDynamicFilters,
      {
        key: "status_ui",
        uiType: "select",
        label: { en: "Status", ar: "الحالة" },
        options: statusOptions.map(toFilterOption),
      },
    ],
    [activeDynamicFilters, statusOptions],
  );

  const activeBarFilters = useMemo(() => {
    const filters = { ...selectedDynamicFilters };
    if (selectedStatus) filters.status_ui = selectedStatus;
    return filters;
  }, [selectedDynamicFilters, selectedStatus]);

  useEffect(() => {
    setSearchText(searchParam);
    setSearchConfirmed(Boolean(searchParam));
  }, [searchParam]);

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

      if (
        Object.prototype.hasOwnProperty.call(updates, "dep") &&
        String(updates.dep || "") !== String(params.get("dep") || "")
      ) {
        params.delete("governorate_id");
        params.delete("city_id");
        params.delete("area_id");
        params.delete("compound_id");
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
      router.push(
        nextQuery ? `/dashboard/ads/all?${nextQuery}` : "/dashboard/ads/all",
      );
    },
    [queryString, router],
  );

  const buildRequestFilters = useCallback(
    (page = 1) => {
      const params = new URLSearchParams(queryString);
      const filters = {
        scope: "dashboard",
        page,
        limit: adsData.pagination.limit,
        status: params.get("status") || null,
        exclude_status:
          params.get("status") || params.get("user") ? null : "PENDING",
        user: params.get("user") || null,
        user_type: params.get("user_type") || null,
        search: params.get("search") || null,
        sort: selectedSort.backendSort,
      };

      if (selectedSort.backendOrder) filters.order = selectedSort.backendOrder;
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
          message: "Failed to fetch ads from server ❌",
        });
      } finally {
        setLoadingContent(false);
      }
    },
    [addNotification, buildRequestFilters],
  );

  useEffect(() => {
    if (!loading) {
      fetchAds(currentPage);
    }
  }, [currentPage, fetchAds, loading]);

  const handlePageChange = (newPage) => {
    updateUrl({ page: newPage }, false);
  };

  const handleOwnerClick = (owner) => {
    if (!owner?.id) return;

    setSearchText("");
    setSearchConfirmed(false);
    updateUrl({
      user: owner.id,
      user_type: owner.type,
      status: null,
      search: null,
    });
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
    if (filterKey === "owner") {
      updateUrl({ user: null, user_type: null });
      return;
    }

    if (filterKey === "search") {
      setSearchText("");
      setSearchConfirmed(false);
      updateUrl({ search: null });
      return;
    }

    if (filterKey === "status_ui") {
      updateUrl({ status: null });
      return;
    }

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
    setSearchText("");
    setSearchConfirmed(false);

    const updates = {
      status: null,
      search: null,
      user: null,
      user_type: null,
      dep: null,
      cat: null,
      subcat: null,
    };

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

  const handelChangeStatus = async (ad, status) => {
    try {
      const res = await changeStatus(ad.table_id, ad.id, { status: status.id });

      addNotification({
        type: "success",
        message: res?.data?.message,
      });

      const remainingItems = adsData.ads.length - 1;
      const newPage =
        remainingItems === 0 && adsData.pagination.page > 1
          ? adsData.pagination.page - 1
          : adsData.pagination.page;

      fetchAds(newPage);
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || t.common.somethingWentWrong,
      });
    }
  };

  const handleDeleteAd = async (ad) => {
    try {
      await deleteAd(ad.table_id, ad.id);
      addNotification({
        type: "success",
        message: "Ad deleted successfully ✅",
      });

      const remainingItems = adsData.ads.length - 1;
      const newPage =
        remainingItems === 0 && adsData.pagination.page > 1
          ? adsData.pagination.page - 1
          : adsData.pagination.page;

      fetchAds(newPage);
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || t.common.somethingWentWrong,
      });
    }
  };

  return (
    <div className="dash-holder marketplace dashboard-ads-page">
      <div className="top dashboard-ads-top">
        <div className="filters-header">
          <input
            type="text"
            placeholder={t.placeholders.search}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchConfirmed(false);
            }}
          />

          {searchConfirmed ? (
            <span
              style={{ display: "flex", cursor: "pointer" }}
              className="filters-count delete"
              onClick={() => {
                setSearchText("");
                setSearchConfirmed(false);
                updateUrl({ search: null });
              }}
            >
              <IoCloseSharp style={{ padding: "7px" }} />
            </span>
          ) : (
            <span
              style={{
                display: "flex",
                cursor: searchText ? "pointer" : "default",
              }}
              className={`filters-count ${searchText ? "active" : ""}`}
              onClick={() => {
                if (!searchText && !searchParam) return;
                setSearchConfirmed(Boolean(searchText));
                updateUrl({ search: searchText || null });
              }}
            >
              <IoSearchSharp style={{ padding: "7px" }} />
            </span>
          )}
        </div>

        <SelectOptions
          size="small"
          placeholder={t.ad.status.label}
          options={statusOptions}
          value={selectedStatus}
          locale={locale}
          t={t}
          onChange={(selected) => {
            updateUrl({ status: selected?.id === selectedStatus?.id ? null : selected?.id });
          }}
        />

        <SelectOptions
          size="small"
          placeholder={locale === "ar" ? "ترتيب النتائج" : "Sort by"}
          options={SORT_OPTIONS}
          value={selectedSort}
          locale={locale}
          t={t}
          onChange={(selected) => {
            updateUrl({
              sort_by_ui:
                selected?.id && selected.id !== SORT_OPTIONS[0].id
                  ? selected.id
                  : null,
            });
          }}
        />

        <div
          className={`filters-header ${openFilters ? "active" : ""}`}
          onClick={() => setOpenFilters((prev) => !prev)}
        >
          {t.actions.filterations}
          <span className="filters-count" style={{ display: "flex" }}>
            <LuSettings2 />
          </span>
        </div>
      </div>

      <ActiveFiltersBar
        selectedCategory={null}
        dynamicFilters={activeBarFilters}
        searchText={searchParam}
        ownerFilter={{
          ownerType: ownerFilterType,
          ownerId: ownerFilterId,
          ownerName: null,
        }}
        onRemoveCategory={() => {}}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
        onOpenFilters={() => setOpenFilters(true)}
        fieldDefinitions={activeBarDefinitions}
      />

      <div className={`dashboard-ads-layout ${openFilters ? "filters-open" : ""}`}>
        <div className="dashboard-ads-main">
          <AdsTable
            ads={adsData?.ads}
            loadingContent={loadingContent}
            removeAd={handleDeleteAd}
            changeStatus={handelChangeStatus}
            activeAds={true}
            statusChanger={"admin"}
            showOwnerDetails={true}
            onOwnerClick={handleOwnerClick}
          />

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

        <div className="dashboard-ads-sidebar">
          <DynamicFilters
            dynamicFilters={activeDynamicFilters}
            selectedFilters={selectedDynamicFilters}
            setSelectedFilters={handleDynamicFilterChange}
            screenSize={screenSize}
            active={openFilters}
            setActive={setOpenFilters}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
