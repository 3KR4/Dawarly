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

export default function AdsSwiper({ type, value }) {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const id = value?.id;
  const swiperRef = useRef(null);

  // ================= STATES =================
  const [ads, setAds] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // ================= BREAKPOINT =================
  const breakpoints = {
    0: { slidesPerView: 1.4 },
    500: { slidesPerView: 1.5 },
    620: { slidesPerView: 2.2 },
    768: { slidesPerView: 2 },
    1000: { slidesPerView: 3 },
    1350: { slidesPerView: 4 },
  };

  const maxSlides = Math.max(
    ...Object.values(breakpoints).map((b) => b.slidesPerView),
  );

  // ================= HELPERS =================
  const hasMore = ads.length < total;

  // ================= FETCH =================
  const fetchAds = async (newPage = 1, append = false) => {
    try {
      setLoading(true);

      const res = await getSectionsAds(type, id, newPage, limit);
      const newAds = res.data.data || [];

      setAds((prev) => {
        const updated = append ? [...prev, ...newAds] : newAds;

        // 🔥 مهم جداً عشان Swiper يعرف إن في slides جديدة
        setTimeout(() => {
          swiperRef.current?.update();
        }, 0);

        return updated;
      });

      setTotal(res.data.pagination?.total || 0);
      setPage(newPage);
    } catch (err) {
      console.error("Fetch Ads Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    setAds([]);
    setPage(1);
    setTotal(0);
    fetchAds(1, false);
  }, [type, id]);

  // ================= SWIPER =================
  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd && !hasMore);
  };
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update(); // مهم عشان Swiper يعرف عدد slides الجديد
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd && !hasMore);
    }
  }, [ads, hasMore]);
  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd && !hasMore);

    // 🔥 load more لما نقرب من الآخر
    if (
      swiper.activeIndex + swiper.params.slidesPerView >= ads.length - 1 &&
      hasMore &&
      !loading
    ) {
      fetchAds(page + 1, true);
    }
  };

  // ================= NAVIGATION =================
  const showNav =
    total > maxSlides && !screenSize.includes("small") && screenSize !== "xs";

  // ================= LOADING =================
  if (ads.length === 0 && loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  // ================= UI =================
  return (
    <div className="swiper-section for-ads container">
      <div className="top">
        <h3 className="title">
          {t.home.PropertiesIn} {value?.[`name_${locale}`]}
        </h3>

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
          spaceBetween={10}
        >
          {ads.map((ad) => (
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
