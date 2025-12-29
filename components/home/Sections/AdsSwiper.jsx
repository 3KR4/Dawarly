"use client";
import React, { useContext, useRef, useState } from "react";
import Link from "next/link";
import { settings } from "@/Contexts/settings";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@/styles/client/sections/ads-swiper.css";

import AdsCard from "@/components/home/AdsCard";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";

import { ads } from "@/data";

export default function AdsSwiper({ title, type }) {
  const { locale } = useContext(settings);
  const t = useTranslate();


  const swiperRef = useRef(null);

  const TOTAL_ADS = ads.length;

  const [visibleCount, setVisibleCount] = useState(6);
  const [fetchCount, setFetchCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);

  const handleSlideChange = (swiper) => {
    const currentIndex = swiper.activeIndex + 1;
    setActiveIndex(currentIndex);

    const remainingSlides = visibleCount - currentIndex;

    // لو قرب من آخر 2 slides
    if (remainingSlides <= 2 && visibleCount < TOTAL_ADS) {
      setFetchCount((prev) => {
        const nextFetch = prev + 1;

        const increment = nextFetch < 4 ? 2 : 4;

        setVisibleCount((prevCount) =>
          Math.min(prevCount + increment, TOTAL_ADS)
        );

        return nextFetch;
      });
    }
  };

  return (
    <div className="ads-section container">
      {/* ===== Top ===== */}
      <div className="top">
        <h3 className="title">{title}</h3>
        <Link href="#" className="link">
          {t.home.seeMore}
        </Link>
      </div>

      {/* ===== Swiper ===== */}
      <Swiper
        key={locale}
        slidesPerView={4}
        speed={800}
        spaceBetween={12}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        dir={locale === "ar" ? "rtl" : "ltr"} // ← هذا يحل مشكلة المارجين والاتجاه
      >
        {ads.slice(0, visibleCount).map((data, index) => (
          <SwiperSlide key={data.id || index}>
            <AdsCard data={data} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ===== Bottom ===== */}
      <div className="bottom">
        <div className="lists-count">
          {activeIndex} / {visibleCount}
        </div>

        <div className="navigation">
          <button
            className="nav-btn"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            {locale === "en" ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
          <button
            className="nav-btn"
            onClick={() => swiperRef.current?.slideNext()}
          >
            {locale === "en" ? <FaArrowRight /> : <FaArrowLeft />}
          </button>
          
        </div>
      </div>
    </div>
  );
}
