"use client";
import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "next/navigation";
import "@/styles/client/pages/singel-details.css";
import Image from "next/image";
import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import Rating from "@mui/material/Rating";
import Navigations from "@/components/Tools/Navigations";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { eachDayOfInterval } from "date-fns";
import { FaHeart } from "react-icons/fa";
import {
  FaAngleUp,
  FaAngleDown,
  FaAngleRight,
  FaAngleLeft,
  FaArrowRight,
  FaWhatsapp,
  FaRegHeart,
  FaPhone,
  FaEye,
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
import { formatCurrency } from "@/utils/formatCurrency";
import AdsSwiper from "@/components/home/Sections/AdsSwiper";
import { specsConfig } from "@/Contexts/specsConfig";
import BookingCalendar from "@/components/Tools/data-collector/BookingCalendar";
import BookingRange from "@/components/Tools/data-collector/BookingCalendar";
import { getOneAd } from "@/services/ads/ads.service";
export default function AdDetails() {
  const t = useTranslate();
  const { slug } = useParams();
  const { screenSize, locale } = useContext(settings);

  const [ad, setAd] = useState(null);
  // const [productReviews, setProductReviews] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  useEffect(() => {
    getOneAd(slug)
      .then((res) => {
        console.log("res", res.data);
        setAd(res.data);
      })
      .catch(console.error);
  }, [slug]);

  const getSpecConfig = (key) => specsConfig[key];

  const swiperDirection = screenSize === "large" ? "vertical" : "horizontal";
  const slidesView =
    screenSize === "ultra-small" ? 4 : screenSize === "small" ? 5 : 6;
  const space = screenSize === "large" ? 7 : 6;

  const showThumbNav = ad?.images?.length > slidesView;

  const bookedRanges = [
    { start: "2026-02-10", end: "2026-02-12" },
    { start: "2026-02-18", end: "2026-02-20" },
  ];

  const disabledDates = bookedRanges.flatMap((range) =>
    eachDayOfInterval({
      start: new Date(
        range.start.split("-")[0],
        range.start.split("-")[1] - 1,
        range.start.split("-")[2],
      ),
      end: new Date(
        range.end.split("-")[0],
        range.end.split("-")[1] - 1,
        range.end.split("-")[2],
      ),
    }),
  );

  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return "";

    let cleaned = phone.replace(/\D/g, ""); // نشيل أي حاجة مش رقم

    // لو الرقم 10 أرقام وبيبدأ بـ 0 → مصري
    if (cleaned.startsWith("0")) {
      cleaned = "20" + cleaned.slice(1);
    }

    // لو بيبدأ بـ +20 (اتشالت الـ +)
    if (cleaned.startsWith("20")) {
      return cleaned;
    }

    return cleaned;
  };
  return (
    <>
      <div className="single-page container for-product">
        <Navigations
          items={[
            { name: t.market.all_ads, href: "/market" },
            {
              name: ad?.Categories?.[`name_${locale}`],
              href: `/market?cat=${ad?.Categories?.id}`,
            },
            {
              name: ad?.SubCategories?.[`name_${locale}`],
              href: `/market?cat=${ad?.SubCategories?.id}`,
            },
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
                  src={ad?.images[currentImg]?.secure_url}
                  alt={ad.title}
                />
                <Image
                  className="back-img"
                  src={ad?.images[currentImg]?.secure_url}
                  alt={ad?.title}
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
                        <Image fill src={x?.secure_url} alt={ad?.name} />
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
                <div className="row">
                  <h5 className="price">
                    {formatCurrency(ad?.rent_amount, ad?.rent_currency, locale)}{" "}
                    / {ad?.rent_frequency}
                  </h5>
                  <div className="row stats">
                    <span>
                      <FaEye /> {ad?.views_count}
                    </span>
                    <span>
                      <FaHeart /> {ad?.favorites_count}
                    </span>
                  </div>
                </div>

                <div className="row">
                  <div className="area">
                    <FaLocationDot /> {ad?.governorate?.[`name_${locale}`]},
                    {` `}
                    {ad?.city?.[`name_${locale}`]}
                  </div>
                  <p className="time">
                    uploaded since:{" "}
                    {formatRelativeDate(ad?.created_at, locale)}{" "}
                  </p>
                </div>

                {screenSize.includes("small") && (
                  <div className="btns">
                    <FiShare2 /> <FaRegHeart />
                  </div>
                )}
              </div>
              <div className="card rent-details">
                <h4>conditions</h4>
                <ul className="list">
                  {ad?.deposit_amount && (
                    <li>
                      {t.ad.deposit || "deposit"}:{" "}
                      {formatCurrency(
                        ad.deposit_amount,
                        ad.rent_currency,
                        locale,
                      )}
                    </li>
                  )}

                  {ad?.min_rent_period && (
                    <li>
                      {t.ad.min_period || "min period"}: {ad.min_rent_period}{" "}
                      {t.ad[ad.min_rent_period_unit || "min rent period unit"]}
                    </li>
                  )}

                  {ad?.adult_no_max && (
                    <li>
                      {t.ad.max_adults || "max adults"}: {ad.adult_no_max}
                    </li>
                  )}

                  {ad?.child_no_max && (
                    <li>
                      {t.ad.max_children || "max children"}: {ad.child_no_max}
                    </li>
                  )}
                </ul>
              </div>
              <div className="specifecs card">
                <h4>{t.ad.specifecs}</h4>
                <ul>
                  {Object.entries(ad?.details || {}).map(([key, value]) => {
                    const config = getSpecConfig(key);
                    const Icon = config?.icon;

                    return (
                      <li key={key} className="spec-item">
                        {/* الأيقونة تظهر بس لو موجودة */}
                        {Icon && <Icon className="spec-icon" />}

                        <span className="spec-key">{config?.label ?? key}</span>

                        <span className="spec-value">
                          : {value}
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
                  {Object.entries(ad?.amenities || {})
                    .filter(([_, value]) => value) // بس اللي قيمته true
                    .map(([key]) => (
                      <li className="amenitie-item" key={key}>
                        {key}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="description card">
                <h4>{t.ad.description}</h4> <p>{ad?.description}</p>
              </div>
              <div className="card">
                <h4>{t.ad.book_now || "book now"}</h4>
                <p>
                  {t.ad.availability || "available from: "}
                  {new Date(ad?.available_from).toLocaleDateString(
                    locale,
                  )} to: {new Date(ad?.available_to).toLocaleDateString(locale)}
                </p>

                <BookingRange disabledDates={disabledDates} />
              </div>
            </div>
            <div className="right">
              <div className="card user-info">
                <h4>
                  {t.ad.listed_by}{" "}
                  {ad?.listed_by?.type === "admin"
                    ? "Dawaarly"
                    : ad?.listed_by?.name}
                </h4>

                {ad?.listed_by?.type !== "admin" && (
                  <div className="row-holder">
                    <p>
                      {t.ad.member_since}{" "}
                      {new Date(
                        ad?.listed_by?.member_since,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      {t.ad.active_ads || "active ads:"}{" "}
                      {ad?.listed_by?.active_ads_count}
                    </p>
                  </div>
                )}

                <div className="holder">
                  <Link
                    className="main-button"
                    href={`/profile/${ad?.listed_by?.id}`}
                  >
                    {t.ad.see_profile} <FaArrowRight />
                  </Link>

                  <div className="row">
                    {ad?.display_phone && (
                      <button
                        onClick={() => setShowPhoneNumber(true)}
                        className="main-button"
                      >
                        <FaPhone />{" "}
                        {showPhoneNumber
                          ? ad?.listed_by?.phone
                          : t.ad.phone_number}
                      </button>
                    )}

                    {ad?.display_whatsapp && (
                      <a
                        href={`https://wa.me/${formatPhoneForWhatsApp(
                          ad?.listed_by?.phone,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="main-button"
                      >
                        <TbBrandWhatsappFilled /> {t.ad.whatsapp}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Safety يظهر فقط لو مش Admin */}
              {ad?.listed_by?.type !== "admin" && (
                <div className="card safety">
                  <h4>{t.ad.safety_title}</h4>
                  <ul className="list">
                    {t.ad.safety_rules.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AdsSwiper type={`newly_added`} />
    </>
  );
}
