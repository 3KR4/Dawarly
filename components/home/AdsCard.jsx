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
import { toggleFavorite } from "@/services/favorites/favorites.service";
import { useAuth } from "@/Contexts/AuthContext";
import { useRouter } from "next/navigation";
import { playSound } from "@/utils/sounds";

export default function CardItem({ data }) {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const { user, updateUserFavoritesCount } = useAuth();
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(data?.isFavorite);
  const [favoritesCount, setFavoritesCount] = useState(
    data?.favorites_count || 0,
  );
  const [favLoading, setfavLoading] = useState(false);

  const arabic = isArabic(data?.title);

  const handleFavoriteClick = async (id) => {
    if (!user) {
      router.push(`/register?redirect=/market/${id}`);
      return;
    }

    if (favLoading) return;

    setfavLoading(true);

    const wasFavorite = isFavorite;

    try {
      await toggleFavorite(id);

      const newCount = wasFavorite
        ? Math.max(user.favorites_count - 1, 0)
        : user.favorites_count + 1;

      // ✅ update UI local
      setIsFavorite(!wasFavorite);
      setFavoritesCount((prev) =>
        wasFavorite ? Math.max(prev - 1, 0) : prev + 1,
      );

      // ✅ update global user
      updateUserFavoritesCount(newCount);
      if (wasFavorite) {
        playSound("favOff"); // ❌ remove
      } else {
        playSound("favOn"); // ✅ add
      }
    } catch (err) {
      console.error("toggleFavorite err", err);

      // rollback
      setIsFavorite(wasFavorite);
      setFavoritesCount((prev) =>
        wasFavorite ? prev + 1 : Math.max(prev - 1, 0),
      );
    } finally {
      setfavLoading(false);
    }
  };

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
          src={data?.images?.[0]?.secure_url || "/apartment-mockup.avif"}
          alt={data?.title}
        />
        <Image
          className="cover"
          fill
          src={data?.images?.[0]?.secure_url || "/apartment-mockup.avif"}
          alt={`${data?.title}-cover`}
        />
        <div className="top">
          <button
            className={`fav-btn ${isFavorite || favoritesCount > 0 ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFavoriteClick(data?.id);
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {favLoading ? (
              <span className="loader"></span>
            ) : isFavorite ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
            {favoritesCount > 0 && (
              <span className="count">{favoritesCount}</span>
            )}
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
      <div className="specs-holder">
        {Object.entries(data?.details || {})
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
