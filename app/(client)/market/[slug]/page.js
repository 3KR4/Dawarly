"use client";
import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "next/navigation";
import "@/styles/client/pages/singel-details.css";
import Image from "next/image";
import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import Rating from "@mui/material/Rating";
import { getService } from "@/services/api/getService";
import Navigations from "@/components/Tools/Navigations";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { eachDayOfInterval } from "date-fns";

import {
  FaAngleUp,
  FaAngleDown,
  FaAngleRight,
  FaAngleLeft,
  FaArrowRight,
  FaWhatsapp,
  FaRegHeart,
  FaPhone,
} from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  categoriesEn,
  categoriesAr,
  subcategoriesEn,
  subcategoriesAr,
  ads,
} from "@/data";
import { FiShare2 } from "react-icons/fi";

import { FiPhone } from "react-icons/fi";

import { settings } from "@/Contexts/settings";
import { formatEGP } from "@/utils/formatCurrency";
import AdsSwiper from "@/components/home/Sections/AdsSwiper";
import { specsConfig } from "@/Contexts/specsConfig";
import BookingCalendar from "@/components/Tools/data-collector/BookingCalendar";
import BookingRange from "@/components/Tools/data-collector/BookingCalendar";
export default function AdDetails() {
  const t = useTranslate();
  const { slug } = useParams();
  const { screenSize, locale } = useContext(settings);

  const [ad, setAd] = useState(null);
  // const [productReviews, setProductReviews] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    // const fetchProduct = async () => {
    //   try {
    //     const { data } = await getService.getSingleProduct(slug);
    //     const item = data?.data;

    //     if (item) {
    //       setProduct(item);
    //       setProductReviews(item.reviews || null);
    //     }
    //   } catch (err) {
    //     console.error("Failed to fetch product:", err);
    //   }
    // };

    // if (slug) fetchProduct();
    const ad = ads;
    setAd(ad?.find((x) => x.id == slug));
  }, [slug, locale]);

  const adCat =
    locale === "en"
      ? categoriesEn.find((x) => x.id === ad?.category)
      : categoriesAr.find((x) => x.id === ad?.category);
  const adSubCat =
    locale === "en"
      ? subcategoriesEn.find((x) => x.id === ad?.sub_category)
      : subcategoriesAr.find((x) => x.id === ad?.sub_category);

  const getSpecConfig = (key) => specsConfig[key];

  const swiperDirection = screenSize === "large" ? "vertical" : "horizontal";
  const slidesView =
    screenSize === "ultra-small" ? 4 : screenSize === "small" ? 5 : 6;
  const space = screenSize === "large" ? 7 : 6;

  const showThumbNav = ad?.images?.length > slidesView;

  const bookedRanges = [
    { start: "2025-12-05", end: "2025-12-10" },
    { start: "2025-12-15", end: "2025-12-18" },
  ];

  const disabledDates = bookedRanges.flatMap((range) =>
    eachDayOfInterval({
      start: new Date(range.start),
      end: new Date(range.end),
    }),
  );
  return (
    <>
      <div className="single-page container for-product">
        <Navigations
          items={[
            { name: t.market.all_ads, href: "/market" },
            { name: adCat?.name, href: `/market?cat=${adCat?.id}` },
            { name: adSubCat?.name, href: `/market?cat=${adSubCat?.id}` },
            { name: t.ad.ad_details, href: "" },
          ]}
          container="main"
        />

        <div className="holder big-holder">
          <div className="images-holder">
            {ad?.images?.[currentImg] && (
              <div className="img">
                <Image
                  className="main-img"
                  fill
                  src={ad.images[currentImg]}
                  alt={ad.title}
                />
                <Image
                  className="back-img"
                  src={ad?.images?.[currentImg]}
                  alt={ad?.name}
                  fill
                />
              </div>
            )}
            {ad?.images?.length > 1 && (
              <div
                className={`imgs-swiper-wrapper ${screenSize == "large" ? "vertical" : "horizontal"}`}
              >
                {/* Prev Button */}
                {showThumbNav &&
                  (screenSize === "large" ? (
                    <FaAngleUp className="nav-btn up" />
                  ) : (
                    <FaAngleLeft className="nav-btn up" />
                  ))}

                <Swiper
                  direction={swiperDirection}
                  slidesPerView={slidesView}
                  spaceBetween={space}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  onSlideChange={(swiper) => setCurrentImg(swiper.activeIndex)}
                  watchSlidesProgress
                  modules={[Navigation]}
                  navigation={
                    showThumbNav
                      ? { nextEl: ".nav-btn.down", prevEl: ".nav-btn.up" }
                      : false
                  }
                  className="imgs-swiper"
                >
                  {ad?.images?.map((x, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className={`img ${index === currentImg ? "active" : ""}`}
                        onClick={() => {
                          setCurrentImg(index);
                          swiperRef.current?.slideTo(index);
                        }}
                      >
                        <Image fill src={x} alt={ad?.name} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Next Button */}
                {showThumbNav &&
                  (screenSize === "large" ? (
                    <FaAngleDown className="nav-btn down" />
                  ) : (
                    <FaAngleRight className="nav-btn down" />
                  ))}
              </div>
            )}
          </div>

          <div className="details-holder">
            <div className="left">
              <div className="main-details card">
                <div className="row">
                  <h3>{ad?.title}</h3>
                  {!screenSize.includes("small") && (
                    <div className="btns">
                      <FiShare2 /> <FaRegHeart />
                    </div>
                  )}
                </div>
                <h5 className="price">{formatEGP(ad?.price, locale)}</h5>
                <div className="row">
                  <div className="area">
                    <FaLocationDot /> {ad?.area?.governorate?.en},{` `}
                    {ad?.area?.city?.en}
                  </div>
                  <p className="time">
                    {formatRelativeDate(ad?.creation_date, locale)}{" "}
                  </p>
                </div>
                {screenSize.includes("small") && (
                  <div className="btns">
                    <FiShare2 /> <FaRegHeart />
                  </div>
                )}
              </div>
              <div className="specifecs card">
                <h4>{t.ad.specifecs}</h4>
                <ul>
                  {Object.entries(ad?.specifecs || {}).map(([key, value]) => {
                    const config = getSpecConfig(key);
                    const Icon = config?.icon;

                    const displayValue =
                      typeof value === "object"
                        ? (value.label ?? value.value)
                        : value;

                    return (
                      <li key={key} className="spec-item">
                        {/* الأيقونة تظهر بس لو موجودة */}
                        {Icon && <Icon className="spec-icon" />}

                        <span className="spec-key">{config?.label ?? key}</span>

                        <span className="spec-value">
                          : {displayValue}
                          {config?.suffix && ` ${config.suffix}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="amenities card">
                <h4>{t.ad.amenities}</h4>
                <ul>
                  {ad?.amenities?.map((x, index) => (
                    <li className="amenitie-item" key={index}>
                      {x.label}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="description card">
                <h4>{t.ad.description}</h4> <p>{ad?.description}</p>
              </p>
              <div className="card">
                <h5>{t.ad.booking}</h5>
                <BookingRange bookedDates={disabledDates} />
              </div>

              {ad?.specs?.length > 0 && (
                <div className="specifications">
                  <h5>{t.dashboard.forms.specifications}</h5>
                  <ul>
                    {ad?.specs.map((spec, index) => (
                      <li key={index}>
                        <span>{spec.key}: </span>
                        {spec.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="right">
              <div className="card user-info">
                <h4>
                  {t.ad.listed_by} {ad?.user?.name || "Mahmoud"}
                </h4>
                <p>{t.ad.member_since} Jan 2025</p>
                <div className="holder">
                  <Link className="main-button" href="/">
                    {t.ad.see_profile} <FaArrowRight />
                  </Link>
                  <div className="row">
                    <button className="main-button">
                      <FaPhone /> {t.ad.phone_number}
                    </button>

                    <button className="main-button">
                      <TbBrandWhatsappFilled /> {t.ad.whatsapp}
                    </button>
                  </div>
                </div>
              </div>

              <div className="card safety">
                <h4>{t.ad.safety_title}</h4>
                <ul>
                  {t.ad.safety_rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdsSwiper type={`newly_added`} />
    </>
  );
}
