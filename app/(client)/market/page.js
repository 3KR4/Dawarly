"use client";
import React, { useState, useContext, useEffect, useCallback } from "react";
import AdsCard from "@/components/home/AdsCard";
import DynamicFilters from "@/components/Tools/data-collector/DynamicFilters";
import ActiveFiltersBar from "@/components/home/ActiveFiltersBar";
import CategoriesSwiper from "@/components/home/Sections/CategoriesSwiper";
import Pagination from "@/components/Tools/Pagination";
import "@/styles/client/pages/market.css";
import { ads, propertiesFiltersEn, propertiesFiltersAr } from "@/data";
import { settings } from "@/Contexts/settings";
import { useSearchParams } from "next/navigation";
import { IoFilterSharp } from "react-icons/io5";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import { BsGridFill } from "react-icons/bs";

export default function Marketplace() {
  const defaultOptions = [
    {
      id: "newest",
      name: { en: "Publish Date: Newest", ar: "تاريخ النشر: الأحدث" },
    },
    {
      id: "oldest",
      name: { en: "Publish Date: Oldest", ar: "تاريخ النشر: الأقدم" },
    },
    {
      id: "price_low",
      name: { en: "Price: Low to High", ar: "السعر: من الأقل للأعلى" },
    },
    {
      id: "price_high",
      name: { en: "Price: High to Low", ar: "السعر: من الأعلى للأقل" },
    },
    {
      id: "title_az",
      name: { en: "Ads Titles: A to Z", ar: "عناوين الاعلانات: من أ إلى ي" },
    },
    {
      id: "title_za",
      name: { en: "Ads Titles: Z to A", ar: "عناوين الاعلانات: من ي إلى أ" },
    },
  ];
  const { screenSize, locale } = useContext(settings);
  const searchParams = useSearchParams();

  const [data] = useState(ads);
  const [openFilters, setOpenFilters] = useState(false);
  const [listGridOption, setListGridOption] = useState("grid");

  const [dynamicFilters, setDynamicFilters] = useState([]);

  useEffect(() => {
    const fetchdynamicFilters = async () => {
      // try {
      //   const { data } = await getService.getDynamicFilters(6);
      //   setDynamicFilters(
      //     data || locale == "en" ? propertiesFiltersEn : propertiesFiltersAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setDynamicFilters(locale == "en" ? propertiesFiltersEn : propertiesFiltersAr);
      // }
      setDynamicFilters(
        locale == "en" ? propertiesFiltersEn : propertiesFiltersAr,
      );
    };
    fetchdynamicFilters();
  }, [locale]);

  const handleListGridOption = (type) => {
    setListGridOption((prev) => (prev == type ? "" : type));
  };

  // ✅ قراءة الفئات من URL
  const catParam = searchParams.get("cat");
  const subcatParam = searchParams.get("subcat");

  const [selectedCategory, setSelectedCategory] = useState({
    cat: catParam ? { id: parseInt(catParam) } : null,
    subCat: subcatParam ? { id: parseInt(subcatParam) } : null,
  });

  // ✅ حالة موحدة للفلترات
  const [allFilters, setAllFilters] = useState({
    priceRange: [0, 10000],
    dynamicFilters: {},
  });

  const [orderBy, setOrderBy] = useState(defaultOptions[0]); // الافتراضي الأحدث
  const [orderOpen, setOrderOpen] = useState(false);

  // ✅ تحديث الفلترات عند تغيير URL
  useEffect(() => {
    setSelectedCategory({
      cat: catParam ? { id: parseInt(catParam) } : null,
      subCat: subcatParam ? { id: parseInt(subcatParam) } : null,
    });
  }, [catParam, subcatParam]);

  // ✅ تحقق إذا كان هناك فئة مختارة
  const hasSelectedCategory = selectedCategory.cat || selectedCategory.subCat;

  // ✅ التعامل مع اختيار الفئة
  const handleCategorySelect = (type, item) => {
    if (type === "cat") {
      setSelectedCategory({
        cat: item,
        subCat: null, // إعادة تعيين الفئة الفرعية عند تغيير الفئة الرئيسية
      });
    } else if (type === "sub-cat") {
      setSelectedCategory((prev) => ({
        ...prev,
        subCat: item,
      }));
    }
  };

  // ✅ إزالة فلتر الفئة
  const handleRemoveCategory = (type) => {
    if (type === "cat") {
      setSelectedCategory({ cat: null, subCat: null });
    } else if (type === "subCat") {
      setSelectedCategory((prev) => ({ ...prev, subCat: null }));
    }
  };

  // ✅ فلترات الديناميك
  const handleDynamicFilterChange = useCallback((key, value) => {
    setAllFilters((prev) => {
      const newFilters = {
        ...prev,
        dynamicFilters: {
          ...prev.dynamicFilters,
          [key]: value,
        },
      };

      return newFilters;
    });
  }, []);

  // ✅ فلتر السعر
  const handlePriceChange = (newRange) => {
    setAllFilters((prev) => ({
      ...prev,
      priceRange: newRange,
    }));
  };

  // ✅ إزالة فلتر ديناميكي
  const handleRemoveFilter = (filterKey) => {
    if (filterKey === "priceRange") {
      setAllFilters((prev) => ({
        ...prev,
        priceRange: [0, 10000],
      }));
    } else {
      setAllFilters((prev) => ({
        ...prev,
        dynamicFilters: Object.keys(prev.dynamicFilters || {})
          .filter((key) => key !== filterKey)
          .reduce((obj, key) => {
            obj[key] = prev.dynamicFilters[key];
            return obj;
          }, {}),
      }));
    }
  };

  // ✅ إزالة جميع الفلترات
  const handleClearAllFilters = () => {
    setSelectedCategory({ cat: null, subCat: null });
    setAllFilters({
      priceRange: [0, 10000],
      dynamicFilters: {},
    });
  };

  const hasActivePriceFilter =
    allFilters.priceRange[0] !== 0 || allFilters.priceRange[1] !== 10000;
  const hasActiveDynamicFilters =
    Object.keys(allFilters.dynamicFilters).length > 0;

  const activeFiltersCount =
    (hasActivePriceFilter ? 1 : 0) +
    (selectedCategory.cat ? 1 : 0) +
    (selectedCategory.subCat ? 1 : 0) +
    Object.keys(allFilters.dynamicFilters).length;

  return (
    <>
      {!hasSelectedCategory && (
        <CategoriesSwiper
          type="cat"
          onSelect={(item) => handleCategorySelect("cat", item)}
          showControls={true}
        />
      )}
      {selectedCategory.cat && !selectedCategory.subCat && (
        <CategoriesSwiper
          type="sub-cat"
          catId={selectedCategory.cat.id}
          onSelect={(item) => handleCategorySelect("sub-cat", item)}
          showControls={true}
        />
      )}
      <div className="fluid-container marketplace">
        <div className="content">
          <DynamicFilters
            dynamicFilters={dynamicFilters}
            selectedFilters={allFilters.dynamicFilters}
            setSelectedFilters={handleDynamicFilterChange}
            screenSize={screenSize}
            active={openFilters}
            setActive={setOpenFilters}
            locale={locale}
            priceRange={allFilters.priceRange}
            setPriceRange={handlePriceChange}
          />

          <div className="main">
            <div className="top-nav">
              <ActiveFiltersBar
                selectedCategory={selectedCategory}
                dynamicFilters={allFilters.dynamicFilters}
                priceRange={allFilters.priceRange}
                onRemoveCategory={handleRemoveCategory}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
                onOpenFilters={() => setOpenFilters(true)}
                screenSize={screenSize}
                fieldDefinitions={dynamicFilters}
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
                      {defaultOptions.map((item) => {
                        const isActive = orderBy.id === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={isActive ? "active" : ""}
                            onClick={() => {
                              setOrderBy(item);
                              setOrderOpen(false);
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
                    className={`${listGridOption == "grid" ? "active" : ""}`}
                    onClick={() => handleListGridOption("grid")}
                  />
                  <FaListUl
                    className={`${listGridOption == "list" ? "active" : ""}`}
                    onClick={() => handleListGridOption("list")}
                  />
                </div>
              </div>
            </div>

            <div className="grid-holder">
              {data.map((item, index) => (
                <AdsCard key={item.id || index} data={item} />
              ))}
            </div>

            {/* ✅ الترقيم */}
            <Pagination
              pageCount={50}
              screenSize={screenSize}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  );
}
