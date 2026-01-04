"use client";
import React, { useState, useContext, useEffect, useCallback } from "react";
import AdsCard from "@/components/home/AdsCard";
import DynamicFilters from "@/components/home/DynamicFilters";
import ActiveFiltersBar from "@/components/home/ActiveFiltersBar";
import CategoriesSwiper from "@/components/home/Sections/CategoriesSwiper";
import Pagination from "@/components/Tools/Pagination";
import "@/styles/client/pages/market.css";
import { ads, apartmentForSaleFields } from "@/data";
import { settings } from "@/Contexts/settings";
import { useSearchParams } from "next/navigation";
import { IoFilterSharp } from "react-icons/io5";

export default function Marketplace() {
  const { screenSize, locale } = useContext(settings);
  const searchParams = useSearchParams();

  const [data] = useState(ads);
  const [openFilters, setOpenFilters] = useState(false);

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

  // ✅ حساب عدد الفلترات النشطة
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
    <div className="fluid-container marketplace">
      {/* ✅ زر فتح الفلترات للشاشات الصغيرة */}
      {screenSize !== "large" && activeFiltersCount > 0 && (
        <div className="mobile-filters-header">
          <button
            className="open-filters-btn"
            onClick={() => setOpenFilters(true)}
          >
            <IoFilterSharp />
            <span>
              {locale === "ar" ? "الفلترات" : "Filters"}
              {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
            </span>
          </button>
        </div>
      )}

      {/* ✅ عرض الفئات إذا لم تكن هناك فئة مختارة */}
      {!hasSelectedCategory && (
        <CategoriesSwiper
          type="cat"
          onSelect={(item) => handleCategorySelect("cat", item)}
          showControls={true}
        />
      )}

      {/* ✅ عرض الفئات الفرعية إذا كانت هناك فئة مختارة */}
      {selectedCategory.cat && !selectedCategory.subCat && (
        <CategoriesSwiper
          type="sub-cat"
          catId={selectedCategory.cat.id}
          onSelect={(item) => handleCategorySelect("sub-cat", item)}
          showControls={true}
        />
      )}

      <div className="content">
        {/* ✅ الفلترات الجانبية للشاشات الكبيرة */}
        {screenSize === "large" && (
          <DynamicFilters
            dynamicFilters={apartmentForSaleFields}
            selectedFilters={allFilters.dynamicFilters}
            setSelectedFilters={handleDynamicFilterChange}
            screenSize={screenSize}
            active={openFilters}
            setActive={setOpenFilters}
            locale={locale}
            priceRange={allFilters.priceRange}
            setPriceRange={handlePriceChange}
          />
        )}

        {/* ✅ المحتوى الرئيسي */}
        <div className="main">
          {/* ✅ شريط الفلترات النشطة */}
          {activeFiltersCount > 0 && (
            <ActiveFiltersBar
              selectedCategory={selectedCategory}
              dynamicFilters={allFilters.dynamicFilters}
              priceRange={allFilters.priceRange}
              onRemoveCategory={handleRemoveCategory}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
              onOpenFilters={() => setOpenFilters(true)}
              locale={locale}
              screenSize={screenSize}
              fieldDefinitions={apartmentForSaleFields} // ✅ هذا مهم جداً!
            />
          )}

          {/* ✅ الفلترات المنبثقة للشاشات الصغيرة */}
          {screenSize !== "large" && (
            <DynamicFilters
              dynamicFilters={apartmentForSaleFields}
              selectedFilters={allFilters.dynamicFilters}
              setSelectedFilters={handleDynamicFilterChange}
              screenSize={screenSize}
              active={openFilters}
              setActive={setOpenFilters}
              locale={locale}
              priceRange={allFilters.priceRange}
              setPriceRange={handlePriceChange}
            />
          )}

          {/* ✅ عرض الإعلانات */}
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
  );
}
