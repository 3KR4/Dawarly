"use client";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import React, { useContext, useState } from "react";
import { formatEGP } from "@/utils/formatCurrency";
import { settings } from "@/Contexts/settings";
import "@/styles/client/ad-card.css";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { isArabic } from "@/utils/detectDirection";
import useTranslate from "@/Contexts/useTranslation";

export default function CardItem({ data }) {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const [isFavorite, setIsFavorite] = useState(data?.id == 102);

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

  return (
    <Link href={`/ad/${data?.id}`} key={data?.id} className={`ad-card`}>
      <div className="image-holder">
        <Image className="main" fill src={data?.images[0]} alt={data?.title} />
        <Image className="cover" fill src={data?.images[0]} alt={`${data?.title}-cover`} />
        <div className="top">
          <button
            className={`fav-btn ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
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
          <span className={`category ellipsis`}>
            {t.subcategories[data?.sub_category.name]}
          </span>
        </div>
        <div className="row-holder">
          <h3>{formatEGP(data?.price, locale)}</h3>
          <span className={`status`}>{data?.status}</span>
          <span className={`condition`}>{data?.condition}</span>
        </div>
      </div>
      <div className="date-area">
        <p className="area">
          {data?.area.governorate[locale]}, {data?.area.city[locale]}
        </p>
        <p className="date">
          {formatRelativeDate(data?.creation_date, locale)}
        </p>
      </div>
    </Link>
  );
}
