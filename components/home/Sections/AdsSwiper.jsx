"use client";
import React, { useContext, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { settings } from "@/Contexts/settings";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@/styles/client/sections/ads-swiper.css";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

import AdsCard from "@/components/home/AdsCard";
import useTranslate from "@/Contexts/useTranslation";
import { getSectionsAds } from "@/services/ads/ads.service";

export default function AdsSwiper({ type, id }) {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();

  // ================= STATES =================
  const [ads, setAds] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    count: 0,
  });
  const [loading, setLoading] = useState(true);

  const page = 1;
  const limit = 6;

  // ================= FETCH =================
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);

        const res = await getSectionsAds(type, id, page, limit);

        setAds(res.data?.data || []);
        setPagination(res.data?.pagination || {});
      } catch (err) {
        console.error("Fetch Ads Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [type, id]);

  // ================= SWIPER =================
  const swiperRef = useRef(null);

  const TOTAL_ADS = ads.length;

  const [visibleCount, setVisibleCount] = useState(8);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const breakpoints = {
    0: { slidesPerView: 1.4, slidesPerGroup: 1, spaceBetween: 8 },
    500: { slidesPerView: 1.5, slidesPerGroup: 1, spaceBetween: 8 },
    620: { slidesPerView: 2.2, slidesPerGroup: 1, spaceBetween: 10 },
    768: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 10 },
    1000: { slidesPerView: 3, slidesPerGroup: 2, spaceBetween: 12 },
    1350: { slidesPerView: 4, slidesPerGroup: 2, spaceBetween: 12 },
  };

  const maxSlides = Math.max(
    ...Object.values(breakpoints).map((b) => b.slidesPerView)
  );

  const showNav =
    ads.length > maxSlides &&
    !screenSize.includes("small") &&
    screenSize !== "xs";

  // ================= LOAD MORE =================
  const handleSlideChange = (swiper) => {
    const currentSlidesPerView = swiper.params.slidesPerView || 4;

    setSlidesPerView(currentSlidesPerView);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    const currentIndex = swiper.activeIndex + 1;
    setActiveIndex(currentIndex);

    const remaining = visibleCount - currentIndex;

    if (remaining <= 2 && visibleCount < TOTAL_ADS) {
      setVisibleCount((prev) =>
        Math.min(prev + 3, TOTAL_ADS)
      );
    }
  };

  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // ================= RESPONSIVE =================
  useEffect(() => {
    let initial = 8;

    if (screenSize === "large") initial = 8;
    else if (screenSize === "med") initial = 6;
    else initial = 4;

    setVisibleCount(Math.min(initial, TOTAL_ADS));

    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 0);
    }
  }, [screenSize, TOTAL_ADS, type, id]);

  // ================= LOADING =================
  if (loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  // ================= EMPTY =================
  if (TOTAL_ADS === 0) {
    return (
      <div className="swiper-section for-ads container">
        <h3>{type}</h3>
        <p>{t.home.noAdsFound}</p>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="swiper-section for-ads container">
      <div className="top">
        <h3 className="title">{type}</h3>

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
            {locale === "en" ? <FaAngleRight /> : <FaAngleLeft />}
          </Link>
        )}
      </div>

      <div className="swiper-holder">
        {showNav && (
          <button
            className="nav-btn prev-btn"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
          >
            <FaArrowLeft />
          </button>
        )}

        <Swiper
          key={`${locale}-${type}-${id}`}
          speed={800}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          dir={locale === "ar" ? "rtl" : "ltr"}
          breakpoints={breakpoints}
        >
          {ads.slice(0, visibleCount).map((ad) => (
            <SwiperSlide key={ad.id}>
              <AdsCard data={ad} />
            </SwiperSlide>
          ))}
        </Swiper>

        {showNav && (
          <button
            className="nav-btn next-btn"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
          >
            <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}