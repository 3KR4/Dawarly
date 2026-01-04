"use client";
import React, { useRef, useState, useContext } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@/styles/client/sections/ads-swiper.css";

import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import { categories, subcategories } from "@/data";
import CatCard from "@/components/home/CatCard";
import { settings } from "@/Contexts/settings";

export default function CategoriesSwiper({ type, catId }) {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const swiperRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const data =
    type === "cat"
      ? categories
      : subcategories.filter((x) => x.categoryId === catId);

  const title =
    type === "cat" ? t.home.browseCategories : t.home.browseSubCategories;

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
    ...Object.values(breakpoints).map((b) => b.slidesPerView)
  );

  // 👇 نظهر الـ navigation بس لو عدد العناصر أكبر من maxSlides
  const showNav = data.length > maxSlides && screenSize !== "small";

  return (
    <div className="swiper-section container cats">
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
          key={locale}
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
          {data.map((cat) => (
            <SwiperSlide key={cat.id} className="category-slide">
              <CatCard data={cat} type={type} />
            </SwiperSlide>
          ))}
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
