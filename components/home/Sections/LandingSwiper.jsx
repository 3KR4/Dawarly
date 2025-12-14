"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { slides } from "@/data";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

function LandingSwiper() {
  return (
    <div className="landing">
      {/* <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        slidesPerView={1}
        loop={true}
        speed={2000}
        pagination={{ clickable: true }}
      >
        {slides?.map((slide, index) => (
          <SwiperSlide key={index}>
            <Image src={slide?.image} fill alt="" />

            <div className="slide-content">
              <span>{slide.small}</span>
              <h1>{slide.title}</h1>
              <h2>{slide.paragraph}</h2>

              <Link href={slide.link}>
                <button className="main-button">{slide.btnText}</button>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper> */}
    </div>
  );
}

export default LandingSwiper;
