"use client";
import React, { useContext, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { settings } from "@/Contexts/settings";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "@/styles/client/pages/home.css";

export default function HeroSwiper() {
  const { locale } = useContext(settings);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // بيانات السلايدات
  const slides = [
    {
      id: 1,
      image: "/slides/1.jpeg",
      link: "/",
      title: {
        ar: "استرخاء بلا حدود",
        en: "Unlimited Relaxation",
      },
      description: {
        ar: "استمتع بتجربة فريدة على شاطئ يجمع بين الهدوء والفخامة",
        en: "Enjoy a unique beachfront experience where comfort meets luxury",
      },
    },
    {
      id: 2,
      image: "/slides/2.jpeg",
      link: "/",
      title: {
        ar: "إقامة بمعايير عالمية",
        en: "World-Class Living",
      },
      description: {
        ar: "فيلات مصممة لتمنحك أقصى درجات الراحة والخصوصية",
        en: "Villas designed to offer ultimate comfort and privacy",
      },
    },
    {
      id: 3,
      image: "/slides/3.jpeg",
      link: "/",
      title: {
        ar: "كل ما تحتاجه قريب منك",
        en: "Everything You Need",
      },
      description: {
        ar: "سوق وخدمات متكاملة تلبي جميع احتياجاتك اليومية",
        en: "A fully integrated marketplace for all your daily needs",
      },
    },
  ];

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handlePaginationClick = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

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
        {slides.map((slide) => (
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
                <h1 className="slide-title">{slide.title?.[locale]}</h1>

                <p className="slide-description">
                  {slide.description?.[locale]}
                </p>
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
