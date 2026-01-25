"use client";
import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import "@/styles/client/pages/singel-details.css";
import Image from "next/image";
import Link from "next/link";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import Rating from "@mui/material/Rating";
import { getService } from "@/services/api/getService";
import Navigations from "@/components/Tools/Navigations";
import {
  FaAngleUp,
  FaAngleDown,
  FaArrowRight,
  FaWhatsapp,
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
                    <img src={x} alt={ad?.name} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <FaAngleDown className="nav-btn down" />
          </div>
        </div>

        <div className="details-holder">
          <div className="left">
            <div className="main-details">
              <div className="row">
                <h3>{ad?.title}</h3>
                <div className="btns">
                  <FiShare2 /> <Svg />
                </div>
              </div>
            </div>
            <p className="description">{ad?.description}</p>

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
            <div className="user-info">
              <h4>Listed by agency</h4>
              <h5>mahmoud elshazly</h5>
              <p>member since jan 2025</p>
              <Link href={`/`} className="main-button">
                <FaArrowRight className="arrow" /> see profile
              </Link>
              <div className="row-holder">
                <button className="main-button">
                  <FiPhone /> Phone Number
                </button>
                <button className="main-button">
                  <FaWhatsapp /> WhatsApp
                </button>
              </div>
            </div>
            <div className="safety">
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
      </div>
    </div>
  );
}
