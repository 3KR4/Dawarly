"use client";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import React, { useContext, useState, useEffect } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { settings } from "@/Contexts/settings";
import "@/styles/client/ad-card.css";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { isArabic } from "@/utils/detectDirection";
import useTranslate from "@/Contexts/useTranslation";
import { specsConfig } from "@/Contexts/specsConfig";
import { subcategoriesEn, subcategoriesAr } from "@/data";
import { FaEye } from "react-icons/fa";
import { RentFrequencies } from "@/data/enums";

export default function CardItem({ data }) {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const [isFavorite, setIsFavorite] = useState(data?.isFavorite);

  const arabic = isArabic(data?.title);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsFavorite(!isFavorite);

    // API call example:
    // fetch(`/api/favorites/${data?.id}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ isFavorite: !isFavorite })
    // })
  };

  const [subcategories, setSubcategories] = useState([]);

  const getSpecConfig = (key) => specsConfig[key];
  const locationParts = [
    data?.area?.[`name_${locale}`],
    data?.city?.[`name_${locale}`],
    data?.governorate?.[`name_${locale}`],
    data?.compound?.[`name_${locale}`],
  ].filter(Boolean);
  return (
    <Link href={`/market/${data?.id}`} key={data?.id} className={`ad-card`}>
      <div className="image-holder">
        <Image
          className="main"
          fill
          src={data?.image[0]?.secure_url}
          alt={data?.title}
        />
        <Image
          className="cover"
          fill
          src={data?.image[0]?.secure_url}
          alt={`${data?.title}-cover`}
        />
        <div className="top">
          <button
            className={`fav-btn ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {data?.favoritesCount > 0 && data?.favoritesCount}
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>
      <div className="body">
        <div className="row-holder">
          <h4
            className={`ellipsis ${arabic ? "rtl" : "ltr"}`}
            dir={arabic ? "rtl" : "ltr"}
          >
            {data?.title}
          </h4>
          <Link
            href={`/market?subcat=${data?.SubCategories?.id}`}
            className={`category ellipsis`}
          >
            {data?.SubCategories?.[`name_${locale}`]}
          </Link>
        </div>
        <div className="row-holder">
          <h3>
            {formatCurrency(data?.rent_amount, data?.rent_currency, locale)}
          </h3>
          <span className={`status`}>
            {
              RentFrequencies.find((x) => x.id == data?.rent_frequency)?.[
                `name_${locale}`
              ]
            }
          </span>
        </div>
      </div>
      <div className="date-area">
        {Object.entries(data?.specifecs || {})
          .filter(([key]) => {
            const config = getSpecConfig(key);
            return config?.showInMini;
          })
          .map(([key, value]) => {
            const config = getSpecConfig(key);
            const Icon = config?.icon;

            const displayValue =
              typeof value === "object" ? (value.label ?? value.value) : value;

            return (
              <div key={key} className="spec">
                {Icon && <Icon className="spec-icon" />}
                <span>
                  {displayValue}
                  {config?.suffix && ` ${config.suffix}`}
                </span>
              </div>
            );
          })}
      </div>

      <div className="date-area">
        <p className="area ellipsis">{locationParts.join("، ")}</p>
        <p className="date" style={{ minWidth: "max-content" }}>
          {formatRelativeDate(data?.created_at, locale)}
        </p>
      </div>
    </Link>
  );
}
