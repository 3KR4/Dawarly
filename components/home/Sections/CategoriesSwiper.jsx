"use client";
import React, { useRef, useState, useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@/styles/client/sections/ads-swiper.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import {
  categoriesEn,
  subcategoriesEn,
  categoriesAr,
  subcategoriesAr,
} from "@/data";
import CatCard from "@/components/home/CatCard";
import { settings } from "@/Contexts/settings";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoriesSwiper({
  type,
  catId,
  onSelect,
  showControls = true,
}) {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const swiperRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      // try {
      //   const { data } = await getService.getDynamicFilters(6);
      //   setDynamicFilters(
      //     data || locale == "en" ? propertiesFiltersEn : propertiesFiltersAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setDynamicFilters(locale == "en" ? propertiesFiltersEn : propertiesFiltersAr);
      // }
      setCategories(locale == "en" ? categoriesEn : categoriesAr);
      setSubcategories(locale == "en" ? subcategoriesEn : subcategoriesAr);
    };
    fetchCategories();
  }, [locale]);

  // ✅ قراءة الـ URL عند التحميل
  useEffect(() => {
    if (type === "cat") {
      const catParam = searchParams.get("cat");
      if (catParam) {
        const selectedCat = categories.find((cat) => cat.id == catParam);
        if (selectedCat) {
          setSelectedItem(selectedCat.id);
        }
      }
    } else if (type === "sub-cat") {
      const subcatParam = searchParams.get("subcat");
      if (subcatParam) {
        const selectedSubcat = subcategories.find(
          (sub) => sub.id == subcatParam,
        );
        if (selectedSubcat) {
          setSelectedItem(selectedSubcat.id);
        }
      }
    }
  }, [searchParams, type]);

  const data =
    type === "cat"
      ? categories
      : subcategories.filter((x) => x.categoryId === catId);

  const title =
    type === "cat" ? t.home.browseCategories : t.home.browseSubCategories;

  // ✅ التعامل مع اختيار الفئة
  const handleSelect = (item) => {
    const isAlreadySelected = selectedItem === item.id;
    const newSelectedItem = isAlreadySelected ? null : item.id;

    setSelectedItem(newSelectedItem);

    // ✅ تحديث URL
    const params = new URLSearchParams(searchParams.toString());

    if (type === "cat") {
      if (newSelectedItem) {
        params.set("cat", newSelectedItem);
        params.delete("subcat"); // إزالة subcat عند تغيير الفئة
      } else {
        params.delete("cat");
        params.delete("subcat");
      }
    } else if (type === "sub-cat") {
      if (newSelectedItem) {
        params.set("subcat", newSelectedItem);
      } else {
        params.delete("subcat");
      }
    }

    router.push(`?${params.toString()}`);

    // ✅ استدعاء callback إذا كان موجود
    if (onSelect) {
      onSelect(isAlreadySelected ? null : item);
    }
  };

  // ✅ التحقق إذا كانت الفئة لديها subcategories
  const hasSubcategories = (catId) => {
    return subcategories.some((sub) => sub.categoryId === catId);
  };

  // breakpoints بالأرقام اللي انت حددتها
  const breakpoints = {
    0: { slidesPerView: Math.min(data.length, 2.2) },
    500: { slidesPerView: Math.min(data.length, 3.2) },
    768: { slidesPerView: Math.min(data.length, 4) },
    992: { slidesPerView: Math.min(data.length, 5) },
    1200: { slidesPerView: Math.min(data.length, 6) },
    1400: { slidesPerView: Math.min(data.length, 7) },
  };

  // 👇 نحسب أكبر قيمة من slidesPerView في أي breakpoint
  const maxSlides = Math.max(
    ...Object.values(breakpoints).map((b) => b.slidesPerView),
  );

  // 👇 نظهر الـ navigation بس لو عدد العناصر أكبر من maxSlides
  const showNav =
    data.length > maxSlides && screenSize !== "small" && showControls;

  return (
    <div
      className={`swiper-section container cats ${
        type == "sub-cat" ? "sub-cat" : ""
      }`}
    >
      <div className="top">
        <h3 className="title">{title}</h3>
      </div>

      <div className="swiper-holder">
        {showNav && (
          <button
            className="nav-btn prev-btn"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
          >
            <FaArrowLeft className="arrow" />
          </button>
        )}

        <Swiper
          key={`${type}-${catId}-${data.length}-${locale}`}
          speed={500}
          spaceBetween={8}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          dir={locale === "ar" ? "rtl" : "ltr"}
          breakpoints={breakpoints}
        >
          {data.map((item) => {
            const isSelected = selectedItem == item.id;
            const hasSubcats = type === "cat" && hasSubcategories(item.id);

            return (
              <SwiperSlide key={item.id} className="category-slide">
                <CatCard
                  data={item}
                  type={type}
                  activeClass={isSelected}
                  onSelect={() => handleSelect(item)}
                  showSubcatIndicator={hasSubcats && isSelected}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {showNav && (
          <button
            className="nav-btn next-btn"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
          >
            <FaArrowRight className="arrow" />
          </button>
        )}
      </div>
    </div>
  );
}
