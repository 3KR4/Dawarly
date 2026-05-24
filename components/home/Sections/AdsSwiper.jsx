"use client";
import React, { useContext, useMemo, useRef, useState, useEffect } from "react";
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
import { useAppData } from "@/Contexts/DataContext";
import AdCardSkeleton from "@/components/skeletons/AdCardSkeleton";

const TYPE_ALIASES = {
  gov: "gov",
  governorate: "gov",
  city: "city",
  area: "area",
  compound: "compound",
  category: "category",
  subcategory: "subcategory",
  subCategory: "subcategory",
  sub_category: "subcategory",
  table: "table",
  views: "views",
  top_views: "views",
  featured: "featured",
  futured: "futured",
  favorites: "favorites",
  favoriets: "favoriets",
  favourites: "favorites",
};

const VALUE_TYPES = [
  "gov",
  "city",
  "area",
  "compound",
  "category",
  "subcategory",
  "table",
];

const buildSectionTitle = (type, value, table, locale, t) => {
  const tableName = table?.[`name_${locale}`];

  if (value) {
    const valueTitle = `${t.home.PropertiesIn} ${value?.[`name_${locale}`]}`;
    return tableName ? `${valueTitle} ${tableName}` : valueTitle;
  }

  const titles = {
    views: locale === "ar" ? "الأكثر مشاهدة" : "Most viewed",
    featured: locale === "ar" ? "الإعلانات المميزة" : "Featured ads",
    futured: locale === "ar" ? "الإعلانات المميزة" : "Featured ads",
    favorites: locale === "ar" ? "الأكثر تفضيلا" : "Most favorited",
    favoriets: locale === "ar" ? "الأكثر تفضيلا" : "Most favorited",
  };

  const title = titles[type] || t.home.newly_added;

  return tableName ? `${title} ${tableName}` : title;
};

export default function AdsSwiper({ type, id, value, tableId, pageSize = 6 }) {
  const {
    categories,
    subCategories,
    governorates,
    cities,
    areas,
    compounds,
    tables,
  } = useAppData();

  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const sectionType = TYPE_ALIASES[type] || type;
  const sectionValue = value ?? id;
  const lookupValue =
    sectionType === "table" ? sectionValue || tableId : sectionValue;
  const selectedItem = useMemo(() => {
    const sources = {
      gov: governorates,
      city: cities,
      area: areas,
      compound: compounds,
      category: categories,
      subcategory: subCategories,
      table: tables,
    };

    return sources[sectionType]?.find((x) => x.id == lookupValue);
  }, [
    areas,
    categories,
    cities,
    compounds,
    governorates,
    lookupValue,
    sectionType,
    subCategories,
    tables,
  ]);

  const inferredTableId =
    tableId ||
    selectedItem?.table_id ||
    categories.find((category) => category.id == selectedItem?.category_id)
      ?.table_id;
  const selectedTable = tables.find((x) => x.id == inferredTableId);

  const swiperRef = useRef(null);

  // ================= STATES =================
  const [ads, setAds] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(pageSize);
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
  const hasRequiredValue =
    sectionType === "table"
      ? sectionValue || tableId
      : !VALUE_TYPES.includes(sectionType) || sectionValue;
  const shouldFetch =
    TYPE_ALIASES[type] &&
    hasRequiredValue &&
    (!["category", "subcategory"].includes(sectionType) || inferredTableId);

  const sectionParams = useMemo(
    () => ({
      type: sectionType,
      value: VALUE_TYPES.includes(sectionType) ? sectionValue : undefined,
      table_id:
        sectionType === "table"
          ? tableId
          : inferredTableId,
      page,
      limit,
    }),
    [inferredTableId, limit, page, sectionType, sectionValue, tableId],
  );

  // ================= FETCH =================
  const fetchAds = async (newPage = 1, append = false) => {
    if (!shouldFetch) return;

    try {
      setLoading(true);

      const res = await getSectionsAds({ ...sectionParams, page: newPage });
      const newAds = res.data.data || res.data.ads || [];

      setAds((prev) => {
        const updated = append ? [...prev, ...newAds] : newAds;

        // 🔥 مهم جداً عشان Swiper يعرف إن في slides جديدة
        setTimeout(() => {
          swiperRef.current?.update();
        }, 0);

        return updated;
      });

      setTotal(
        res.data.pagination?.total ||
          res.data.meta?.total ||
          res.data.total ||
          newAds.length,
      );
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
  }, [type, sectionValue, inferredTableId, limit]);

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

  // ================= UI =================

  const getSkeletonCount = () => {
    // أول تحميل
    if (ads.length === 0 && loading) {
      return Math.ceil(maxSlides);
    }

    // load more
    if (ads.length > 0 && loading) {
      return 2;
    }

    return 0;
  };

  const skeletonCount = getSkeletonCount();

  const slides = [
    ...ads,
    ...Array.from({ length: skeletonCount }).map((_, i) => ({
      id: `skeleton-${i}`,
      isSkeleton: true,
    })),
  ];
  const isEmpty = !loading && ads.length === 0;
  if (isEmpty) {
    return null; // أو ممكن Empty State UI
  }

  return (
    <div className="swiper-section for-ads container">
      <div className="top">
        {VALUE_TYPES.includes(sectionType) && !selectedItem ? (
          <div className="skeleton-card swiper-top">
            <div className="title-skeleton element"></div>
            <div className="link-skeleton element"></div>
          </div>
        ) : (
          <>
            <h3 className="title">
              {buildSectionTitle(
                sectionType,
                selectedItem,
                selectedTable,
                locale,
                t,
              )}
            </h3>

            {total > maxSlides && (
              <Link
                href={
                  sectionType === "table"
                    ? `/market?dep=${sectionValue || tableId}`
                    : sectionType === "category"
                      ? `/market?cat=${sectionValue}${inferredTableId ? `&dep=${inferredTableId}` : ""}`
                      : sectionType === "subcategory"
                        ? `/market?subcat=${sectionValue}${inferredTableId ? `&dep=${inferredTableId}` : ""}`
                        : "/market"
                }
                className="link"
              >
                {t.home.seeMore}
                {locale === "en" ? <FaAngleRight /> : <FaAngleLeft />}
              </Link>
            )}
          </>
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
          key={`${locale}-${type}-${sectionValue || tableId || ""}`}
          speed={800}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          dir={locale === "ar" ? "rtl" : "ltr"}
          breakpoints={breakpoints}
          spaceBetween={10}
        >
          {slides.map((item) => (
            <SwiperSlide key={item.id}>
              {item.isSkeleton ? <AdCardSkeleton /> : <AdsCard data={item} />}
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
