"use client";
import React, { useContext, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { settings } from "@/Contexts/settings";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "@/styles/client/pages/home.css";
import { slidesEn, slidesAr } from "@/data";

export default function HeroSwiper() {
  const { locale } = useContext(settings);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // بيانات السلايدات

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  const [slieds, setSlieds] = useState([]);
  useEffect(() => {
    const fetchSlieds = async () => {
      // try {
      //   const { data } = await getService.getSlieds(6);
      //   setDynamicFilters(
      //     data || locale == "en" ? slidesEn : slidesAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setDynamicFilters(locale == "en" ? slidesEn : slidesAr);
      // }
      setSlieds(locale == "en" ? slidesEn : slidesAr);
    };
    fetchSlieds();
  }, [locale]);

  return (
    <div className="hero-section">
      <Swiper
        key={locale}
        ref={swiperRef}
        modules={[Autoplay, Pagination]}
        spaceBetween={15}
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        dir={locale === "ar" ? "rtl" : "ltr"}
        pagination={{
          el: ".hero-pagination",
          clickable: true,
          bulletClass: "pagination-bullet",
          bulletActiveClass: "pagination-bullet-active",
          renderBullet: function (index, className) {
            return `
              <button class="${className}" aria-label="Go to slide ${
                index + 1
              }">
                <span class="bullet-inner"></span>
              </button>
            `;
          },
        }}
        className="hero-swiper"
      >
        {slieds.map((slide) => (
          <SwiperSlide key={slide.id} className="hero-slide">
            <Link href={slide.link} className="slide-link">
              <div className="slide-image-wrapper">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="slide-image"
                  priority={slide.id === 1}
                />
              </div>
              <div className="slide-content">
                <h1 className="slide-title">{slide.title}</h1>

                <p className="slide-description">{slide.description}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Dots */}
      <div className="hero-pagination"></div>
    </div>
  );
}
