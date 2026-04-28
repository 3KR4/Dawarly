"use client";
import React, { useRef, useState, useContext, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@/styles/client/sections/ads-swiper.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import CatCard from "@/components/home/CatCard";
import { settings } from "@/Contexts/settings";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppData } from "@/Contexts/DataContext";
import { RELATIONS } from "@/data/enums";
import { IoMdArrowRoundBack } from "react-icons/io";

const categoryIcons = {};

export default function CategoriesSwiper({
  viewType = "swiper",
  type,
  target,
  setTarget,
  dashboard = false,
  showControls = true,
  setItem,
  handleHistory,
}) {
  const {
    countries,
    governorates,
    categories,
    subCategories,
    cities,
    areas,
    compounds,
  } = useAppData();

  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const swiperRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // ✅ pagination state
  const [visibleCount, setVisibleCount] = useState(12);

  // =========================
  // DATA SOURCES
  // =========================
  const sources = {
    categories,
    subcategories: subCategories,
    countries,
    governorates,
    cities,
    areas,
    compounds,
  };

  // =========================
  // FILTER DATA
  // =========================
  let data = sources[type] || [];

  if (target && RELATIONS[type]) {
    const { parentKey } = RELATIONS[type];
    data = data.filter((item) => item[parentKey] == target);
  }

  // ✅ sliced data (pagination)
  const visibleData = useMemo(() => {
    return data.slice(0, visibleCount);
  }, [data, visibleCount]);

  // =========================
  // RESET pagination when data changes
  // =========================
  useEffect(() => {
    setVisibleCount(12);
  }, [type, target]);

  // =========================
  // CURRENT TARGET NAME
  // =========================
  let curentTargetName = null;

  if (target && RELATIONS[type]) {
    const { parentSource } = RELATIONS[type];
    const parentList = sources[parentSource];

    const found = parentList?.find((x) => x.id == target);
    if (found) {
      curentTargetName = found[`name_${locale}`];
    }
  }

  const title = t.home?.[type];

  // =========================
  // URL SYNC
  // =========================
  useEffect(() => {
    const QUERY_KEYS = {
      categories: "cat",
      subcategories: "subcat",
    };

    const key = QUERY_KEYS[type];
    if (!key) return;

    const param = searchParams.get(key);
    if (param) {
      const list = sources[type] || [];
      const found = list.find((item) => item.id == param);
      if (found) {
        setSelectedItem(found.id);
      }
    }
  }, [searchParams, type]);

  // =========================
  // HANDLE SELECT
  // =========================
  const handleSelect = (item) => {
    const isAlreadySelected = selectedItem === item.id;
    const newSelectedItem = isAlreadySelected ? null : item.id;

    setSelectedItem(newSelectedItem);

    const params = new URLSearchParams(searchParams.toString());

    const QUERY_KEYS = {
      categories: "cat",
      subcategories: "subcat",
    };

    const key = QUERY_KEYS[type];

    if (key) {
      if (newSelectedItem) params.set(key, newSelectedItem);
      else params.delete(key);
    }

    if (type === "categories") {
      params.delete("subcat");
    }

    router.push(`?${params.toString()}`);
  };

  const hasSubcategories = (id) => {
    return subCategories.some((sub) => sub.category_id === id);
  };

  // =========================
  // SWIPER SETTINGS
  // =========================
  const breakpoints = {
    0: { slidesPerView: Math.min(visibleData.length, 2.2) },
    500: { slidesPerView: Math.min(visibleData.length, 3.2) },
    768: { slidesPerView: Math.min(visibleData.length, 4) },
    992: { slidesPerView: Math.min(visibleData.length, 5) },
    1200: { slidesPerView: Math.min(visibleData.length, 6) },
    1400: { slidesPerView: Math.min(visibleData.length, 7) },
  };

  const maxSlides = Math.max(
    ...Object.values(breakpoints).map((b) => b.slidesPerView),
  );

  const showNav =
    visibleData.length > maxSlides &&
    !screenSize.includes("small") &&
    showControls;

  // =========================
  // LOAD MORE
  // =========================
  const loadMore = () => {
    if (viewType === "grid") {
      // 🔥 grid → حمّل الكل مرة واحدة
      setVisibleCount(data.length);
    } else {
      // 🔥 swiper → تدريجي
      setVisibleCount((prev) => Math.min(prev + 10, data.length));
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div
      className={`swiper-section container cats ${
        type === "subcategories" ? "sub-cat" : ""
      }`}
    >
      <div className="top">
        <h3 className="title">
          {curentTargetName && dashboard && (
            <IoMdArrowRoundBack onClick={handleHistory} />
          )}
          {title} {curentTargetName ? `in ${curentTargetName}` : ""}
        </h3>
      </div>

      {viewType == "swiper" ? (
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
            key={`${type}-${target}-${visibleData.length}-${locale}`}
            speed={500}
            spaceBetween={8}
            onReachEnd={loadMore} // ✅ هنا السحر
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
            {visibleData.map((item) => {
              const isSelected = selectedItem == item.id;

              const itemWithIcon =
                type === "categories"
                  ? { ...item, icon: categoryIcons[item.id] }
                  : item;

              return (
                <SwiperSlide key={item.id}>
                  <CatCard
                    data={itemWithIcon}
                    type={type}
                    target={target}
                    dashboard={dashboard}
                    setTarget={setTarget}
                    activeClass={isSelected}
                    position={dashboard ? "when-create-ad" : null}
                    onSelect={() => {
                      if (dashboard) {
                        setItem({ type, item });
                      } else {
                        handleSelect(item);
                      }
                    }}
                    showSubcatIndicator={
                      type === "categories" &&
                      hasSubcategories(item.id) &&
                      isSelected
                    }
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
              <FaArrowRight />
            </button>
          )}
        </div>
      ) : (
        <div className="data-grid">
          {visibleData.map((item) => {
            const isSelected = selectedItem == item.id;

            return (
              <CatCard
                key={item.id}
                data={item}
                target={target}
                setTarget={setTarget}
                dashboard={true}
                type={type}
                activeClass={isSelected}
                position={dashboard ? "when-create-ad" : null}
                onSelect={() => {
                  if (dashboard) {
                    setItem({ type, item });
                  } else {
                    handleSelect(item);
                  }
                }}
              />
            );
          })}

          {/* زرار تحميل إضافي للـ grid */}
          {visibleCount < data.length && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}
