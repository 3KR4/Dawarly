"use client";
import { useEffect, useState, useContext } from "react";
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

import {
  FaAngleUp,
  FaAngleDown,
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

export default function AdDetails() {
  const t = useTranslate();
  const { slug } = useParams();
  const { screenSize, locale } = useContext(settings);

  const [ad, setAd] = useState(null);
  // const [productReviews, setProductReviews] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);

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
    setAd(ad.find((x) => x.id == slug));
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
  return (
    <div className="single-page container for-product">
      <Navigations
        items={[
          { name: t.market.all_ads, href: "/market" },
          { name: adCat?.name, href: `/market?cat=${adCat?.id}` },
          { name: adSubCat?.name, href: `/market?cat=${adSubCat?.id}` },
          { name: t.create.ad.ad_details, href: "" },
        ]}
        container="main"
      />
      <div className="holder big-holder">
        <div className="images-holder">
          {ad?.images?.[0] && (
            <div className="img">
              <Image
                className="main-img"
                src={ad?.images?.[currentImg]}
                alt={ad?.name}
                fill
              />
              <Image
                className="back-img"
                src={ad?.images?.[currentImg]}
                alt={ad?.name}
                fill
              />
            </div>
          )}

          <div className="imgs-swiper-wrapper">
            <FaAngleUp className="nav-btn up" />

            <Swiper
              direction="vertical"
              slidesPerView={6}
              spaceBetween={7}
              modules={[Navigation]}
              navigation={{
                nextEl: ".nav-btn.down",
                prevEl: ".nav-btn.up",
              }}
              watchSlidesProgress
              className="imgs-swiper"
            >
              {ad?.images?.map((x, index) => (
                <SwiperSlide key={index}>
                  <div
                    className={`img ${index === currentImg ? "active" : ""}`}
                    onClick={() => setCurrentImg(index)}
                  >
                    <Image fill src={x} alt={ad?.name} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <FaAngleDown className="nav-btn down" />
          </div>
        </div>

        <div className="details-holder">
          <div className="left">
            <div className="main-details card">
              <div className="row">
                <h3>{ad?.title}</h3>
                <div className="btns">
                  <FiShare2 /> <FaRegHeart />
                </div>
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
            </div>
            <div className="specifecs card">
              <h4>specifecs</h4>
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

                      <span className="spec-key">{key}</span>

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
              <h4>amenities</h4>
              <ul>
                {ad?.amenities?.map((x, index) => (
                  <li key={index}>{x.label}</li>
                ))}
              </ul>
            </div>
            <p className="description card">
              <h4>description</h4> <p>{ad?.description}</p>
            </p>

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
            <div className="user-info card">
              <h4>Listed by mahmoud elshazly</h4>
              <p>member since jan 2025</p>
              <Link href={`/`} className="main-button">
                see profile <FaArrowRight className="arrow" />
              </Link>
              <div className="row">
                <button className="main-button">
                  <FaPhone /> Phone Number
                </button>
                <button className="main-button">
                  <TbBrandWhatsappFilled style={{ fontSize: "16px" }} />{" "}
                  WhatsApp
                </button>
              </div>
            </div>
            <div className="safety card">
              <h4>Your safety matters to us!</h4>
              <ul>
                <li>
                  Only meet in public / crowded places for example metro
                  stations and malls.
                </li>
                <li>
                  Never go alone to meet a buyer / seller, always take someone
                  with you.
                </li>
                <li>
                  Check and inspect the product properly before purchasing it.
                </li>
                <li>
                  Never pay anything in advance or transfer money before
                  inspecting the product.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <AdsSwiper type={`newly_added`} />
      </div>
    </div>
  );
}
