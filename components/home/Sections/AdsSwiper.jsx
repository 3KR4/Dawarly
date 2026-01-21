"use client";
import React, { useContext, useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { settings } from "@/Contexts/settings";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@/styles/client/sections/ads-swiper.css";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import AdsCard from "@/components/home/AdsCard";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";

import {
  ads,
  subcategoriesEn,
  subcategoriesAr,
  categoriesEn,
  categoriesAr,
} from "@/data";

export default function AdsSwiper({ type, id }) {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();

  // ================= TITLE =================
  const computedTitle = useMemo(() => {
    const categories = locale == "en" ? categoriesEn : categoriesAr;

    if (type === "cat") {
      const curentCat = categories?.find((x) => x.id == id);

      return curentCat || "";
    }

    const subcategories = locale == "en" ? subcategoriesEn : subcategoriesAr;

    if (type === "sub-cat") {
      const curentSubCat = subcategories?.find((x) => x.id == id);

      return curentSubCat || "";
    }

    if (type === "newly_added") {
      return t.home.newestAds;
    }

    return "";
  }, [type, id, locale]);

  // ================= FILTERED ADS =================
  const filteredAds = useMemo(() => {
    if (type === "cat") {
      return ads.filter((ad) => ad.category === id);
    }

    if (type === "sub-cat") {
      return ads.filter((ad) => ad.sub_category === id);
    }

    if (type === "newest") {
      return ads;
    }

    return ads;
  }, [type, id]);

  const swiperRef = useRef(null);

  const TOTAL_ADS = filteredAds.length;

  const [visibleCount, setVisibleCount] = useState(8);
  const [fetchCount, setFetchCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // ================= BREAKPOINTS LOGIC =================
  // نفس الـ breakpoints اللي في CategoriesSwiper
  const breakpoints = {
    0: {
      slidesPerView: 1.4,
      slidesPerGroup: 1,
      spaceBetween: 8,
    },
    500: {
      slidesPerView: 1.5,
      slidesPerGroup: 1,
      spaceBetween: 8,
    },
    620: {
      slidesPerView: 2.2,
      slidesPerGroup: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      slidesPerGroup: 1,
      spaceBetween: 10,
    },
    1000: {
      slidesPerView: 3,
      slidesPerGroup: 2,
      spaceBetween: 12,
    },
    1350: {
      slidesPerView: 4,
      slidesPerGroup: 2,
      spaceBetween: 12,
    },
  };

  // 👇 نحسب أكبر قيمة من slidesPerView في أي breakpoint
  const maxSlides = Math.max(
    ...Object.values(breakpoints).map((b) => b.slidesPerView),
  );

  // 👇 نظهر الـ navigation بس لو عدد الإعلانات أكبر من maxSlides
  const showNav =
    filteredAds.length > maxSlides &&
    screenSize !== "small" &&
    screenSize !== "xs";

  // ================= LOAD MORE LOGIC =================
  const getLoadMoreThreshold = (currentSlidesPerView) => {
    if (currentSlidesPerView >= 3) {
      return 1;
    } else if (currentSlidesPerView === 2) {
      return 2;
    } else {
      return 3;
    }
  };

  const getSlidesPerGroup = (currentSlidesPerView) => {
    if (currentSlidesPerView >= 4) {
      return 2;
    } else if (currentSlidesPerView === 3) {
      return 1;
    } else if (currentSlidesPerView === 2) {
      return 1;
    } else {
      return 1;
    }
  };

  const handleSlideChange = (swiper) => {
    const currentSlidesPerView = swiper.params.slidesPerView || 4;

    setSlidesPerView(currentSlidesPerView);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    const currentIndex = swiper.activeIndex + 1;
    setActiveIndex(currentIndex);

    const remainingSlides = visibleCount - currentIndex;
    const threshold = getLoadMoreThreshold(currentSlidesPerView);

    if (remainingSlides <= threshold && visibleCount < TOTAL_ADS) {
      setFetchCount((prev) => {
        const nextFetch = prev + 1;

        let increment;
        if (currentSlidesPerView >= 3) {
          increment = 4;
        } else if (currentSlidesPerView === 2) {
          increment = 3;
        } else {
          increment = 2;
        }

        setVisibleCount((prevCount) =>
          Math.min(prevCount + increment, TOTAL_ADS),
        );

        return nextFetch;
      });
    }
  };

  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleReachEnd = (swiper) => {
    if (visibleCount < TOTAL_ADS) {
      const currentSlidesPerView = swiper.params.slidesPerView || 4;

      let increment;
      if (currentSlidesPerView >= 3) {
        increment = 4;
      } else if (currentSlidesPerView === 2) {
        increment = 3;
      } else {
        increment = 2;
      }

      setVisibleCount((prevCount) =>
        Math.min(prevCount + increment, TOTAL_ADS),
      );

      setTimeout(() => {
        if (swiperRef.current) {
          setIsEnd(swiperRef.current.isEnd);
        }
      }, 100);
    }
  };

  // ================= RESPONSIVE INITIAL COUNT =================
  useEffect(() => {
    let initialCount = 8;

    if (screenSize === "large" || screenSize === "xl") {
      initialCount = 8;
    } else if (screenSize === "med") {
      initialCount = 6;
    } else if (screenSize === "small") {
      initialCount = 4;
    } else {
      initialCount = 2;
    }

    setVisibleCount(Math.min(initialCount, TOTAL_ADS));
    setActiveIndex(1);
    setIsBeginning(true);
    setIsEnd(visibleCount <= initialCount);

    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 0);
      setIsBeginning(true);
      setIsEnd(visibleCount <= initialCount);
    }
  }, [screenSize, TOTAL_ADS, type, id]);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      setIsEnd(swiper.isEnd);
    }
  }, [visibleCount]);

  // ================= NO ADS MESSAGE =================
  if (TOTAL_ADS === 0) {
    return (
      <div className="swiper-section for-ads container">
        <div className="top">
          <h3 className="title">{computedTitle?.name}</h3>
        </div>
        <div className="no-ads-message">
          <p>{t.home.noAdsFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swiper-section for-ads container">
      {/* ===== Top ===== */}
      <div className="top">
        <h3 className="title">{computedTitle?.name}</h3>
        {showNav && (
          <Link
            href={
              type === "cat"
                ? `/category/${id}`
                : type === "sub-cat"
                  ? `/category?subcat=${id}`
                  : "/ads"
            }
            className="link"
          >
            {t.home.seeMore}
            {locale == "en" ? <FaAngleRight /> : <FaAngleLeft />}
          </Link>
        )}
      </div>

      {/* ===== Swiper ===== */}
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
          key={`${locale}-${type}-${id}`}
          speed={800}
          spaceBetween={12}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          onReachEnd={handleReachEnd}
          dir={locale === "ar" ? "rtl" : "ltr"}
          watchSlidesProgress={true}
          breakpoints={breakpoints}
        >
          {filteredAds.slice(0, visibleCount).map((data, index) => (
            <SwiperSlide key={data.id || index}>
              <AdsCard data={data} />
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
