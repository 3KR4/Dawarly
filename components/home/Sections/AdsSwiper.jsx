"use client";
import React, { useContext, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { settings } from "@/Contexts/settings";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@/styles/client/sections/ads-swiper.css";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import AdsCard from "@/components/home/AdsCard";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";

import { ads } from "@/data";

export default function AdsSwiper({ title, type }) {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();

  const swiperRef = useRef(null);

  const TOTAL_ADS = ads.length;

  const [visibleCount, setVisibleCount] = useState(8);
  const [fetchCount, setFetchCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0); // غير لـ 0 بدلاً من 1
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // دالة لحساب threshold بناءً على slidesPerView
  const getLoadMoreThreshold = (currentSlidesPerView) => {
    if (currentSlidesPerView >= 3) {
      return 1; // لـ 3 أو 4 slides في العرض
    } else if (currentSlidesPerView === 2) {
      return 2; // لـ 2 slides في العرض
    } else {
      return 3; // لـ 1 slide في العرض (موبايل)
    }
  };

  // حساب عدد الشرائح التي تتحرك في كل مرة (slidesPerGroup)
  const getSlidesPerGroup = (currentSlidesPerView) => {
    if (currentSlidesPerView >= 4) {
      return 2; // مع 4 slides، يتحرك 2 في كل مرة
    } else if (currentSlidesPerView === 3) {
      return 1; // مع 3 slides، يتحرك 1 في كل مرة
    } else if (currentSlidesPerView === 2) {
      return 1; // مع 2 slides، يتحرك 1 في كل مرة
    } else {
      return 1; // مع 1 slide، يتحرك 1 في كل مرة
    }
  };

  const handleSlideChange = (swiper) => {
    const currentSlidesPerView = swiper.params.slidesPerView || 4;

    // تحديث حالة slidesPerView الحالي
    setSlidesPerView(currentSlidesPerView);

    // تحديث حالة البداية والنهاية
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    // حساب activeIndex (بداية من 1 لعرض المستخدم)
    const currentIndex = swiper.activeIndex + 1;
    setActiveIndex(currentIndex);

    const remainingSlides = visibleCount - currentIndex;

    // احسب الـ threshold بناءً على عدد الشرائح المعروضة
    const threshold = getLoadMoreThreshold(currentSlidesPerView);

    // تحقق إذا قربنا من النهاية
    if (remainingSlides <= threshold && visibleCount < TOTAL_ADS) {
      setFetchCount((prev) => {
        const nextFetch = prev + 1;

        // حدد عدد الإعلانات الإضافية بناءً على حجم الشاشة
        let increment;
        if (currentSlidesPerView >= 3) {
          increment = 4; // لـ 3 أو 4 slides
        } else if (currentSlidesPerView === 2) {
          increment = 3; // لـ 2 slides
        } else {
          increment = 2; // لـ 1 slide (موبايل)
        }

        setVisibleCount((prevCount) =>
          Math.min(prevCount + increment, TOTAL_ADS)
        );

        return nextFetch;
      });
    }
  };

  // تحديث حالة البداية والنهاية عند تغيير الـ Swiper
  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // دالة للجلب التلقائي عند الوصول للنهاية
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
        Math.min(prevCount + increment, TOTAL_ADS)
      );

      // إعادة تعيين isEnd بعد إضافة المزيد
      setTimeout(() => {
        if (swiperRef.current) {
          setIsEnd(swiperRef.current.isEnd);
        }
      }, 100);
    }
  };

  // إعادة تعيين visibleCount عند تغيير حجم الشاشة
  useEffect(() => {
    // إعادة التعيين إلى قيمة مناسبة بناءً على حجم الشاشة
    let initialCount = 8; // افتراضي

    if (screenSize === "large") {
      initialCount = 8; // 2 صفوف من 4
    } else if (screenSize === "med") {
      initialCount = 6; // 2 صفوف من 3
    } else if (screenSize === "small") {
      initialCount = 4; // 2 صفوف من 2
    } else {
      initialCount = 2; // 2 صفوف من 1
    }

    setVisibleCount(Math.min(initialCount, TOTAL_ADS));
    setActiveIndex(1);
    setIsBeginning(true);
    setIsEnd(visibleCount <= initialCount);

    // إعادة تعيين السلايدر إلى البداية
    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 0);
      setIsBeginning(true);
      setIsEnd(visibleCount <= initialCount);
    }
  }, [screenSize, TOTAL_ADS]);

  // تحديث isEnd عند تغيير visibleCount
  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      setIsEnd(swiper.isEnd);
    }
  }, [visibleCount]);

  return (
    <div className="swiper-section container">
      {/* ===== Top ===== */}
      <div className="top">
        <h3 className="title">{title}</h3>
        <Link href="#" className="link">
          {t.home.seeMore}
          {locale == "en" ? <FaAngleRight /> : <FaAngleLeft />}
        </Link>
      </div>
      {/* ===== Swiper ===== */}
      <div className="swiper-holder">
        {screenSize !== "small" && (
          <button
            className="nav-btn prev-btn"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
          >
            {locale === "en" ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        )}
        <Swiper
          key={locale}
          speed={800}
          spaceBetween={12}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          onReachEnd={handleReachEnd}
          dir={locale === "ar" ? "rtl" : "ltr"}
          watchSlidesProgress={true}
          breakpoints={{
            0: {
              slidesPerView: 1.4,
              slidesPerGroup: 1,
            },
            500: {
              slidesPerView: 1.5,
              slidesPerGroup: 1,
            },
            620: {
              slidesPerView: 2.2,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 1,
            },
            1000: {
              slidesPerView: 3,
              slidesPerGroup: 2,
            },
            1200: {
              slidesPerView: 4,
              slidesPerGroup: 2,
            },
          }}
        >
          {ads.slice(0, visibleCount).map((data, index) => (
            <SwiperSlide key={data.id || index}>
              <AdsCard data={data} />
            </SwiperSlide>
          ))}
        </Swiper>
        {screenSize !== "small" && (
          <button
            className="nav-btn next-btn"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
          >
            {locale === "en" ? <FaArrowRight /> : <FaArrowLeft />}
          </button>
        )}
      </div>
    </div>
  );
}
