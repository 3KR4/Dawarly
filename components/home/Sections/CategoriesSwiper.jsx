"use client";
import React, { useRef, useState, useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@/styles/client/sections/ads-swiper.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import CatCard from "@/components/home/CatCard";
import { settings } from "@/Contexts/settings";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppData } from "@/Contexts/DataContext";
import { IoStorefront } from "react-icons/io5";
import { MdVilla } from "react-icons/md";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { BsFillBuildingsFill } from "react-icons/bs";

const categoryIcons = {
  // 1: PiBuildingApartmentFill,
  // 2: MdVilla,
  // 3: IoStorefront,
  // 4: BsFillBuildingsFill,
};

export default function CategoriesSwiper({
  type,
  catId,
  onSelect,
  showControls = true,
}) {
  const { categories, subCategories } = useAppData();

  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const swiperRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
        const selectedSubcat = subCategories.find(
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
      : subCategories.filter((x) => x.category_id === catId);

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

    if (onSelect) {
      onSelect(isAlreadySelected ? null : item);
    }
  };

  const hasSubcategories = (catId) => {
    return subCategories.some((sub) => sub.category_id === catId);
  };

  const breakpoints = {
    0: { slidesPerView: Math.min(data.length, 2.2) },
    500: { slidesPerView: Math.min(data.length, 3.2) },
    768: { slidesPerView: Math.min(data.length, 4) },
    992: { slidesPerView: Math.min(data.length, 5) },
    1200: { slidesPerView: Math.min(data.length, 6) },
    1400: { slidesPerView: Math.min(data.length, 7) },
  };

  const maxSlides = Math.max(
    ...Object.values(breakpoints).map((b) => b.slidesPerView),
  );

  const showNav =
    data.length > maxSlides && !screenSize.includes("small") && showControls;

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
            const itemWithIcon =
              type === "cat"
                ? {
                    ...item,
                    icon: categoryIcons[item.id], // ممكن تبقى undefined لو مش موجود
                  }
                : item;

            return (
              <SwiperSlide key={item.id} className="category-slide">
                <CatCard
                  data={itemWithIcon}
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
