"use client";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import React, { useContext, useState, useEffect } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { settings } from "@/Contexts/settings";
import { useAppData } from "@/Contexts/DataContext";
import "@/styles/client/ad-card.css";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { isArabic } from "@/utils/detectDirection";
import useTranslate from "@/Contexts/useTranslation";
import { specsConfig } from "@/Contexts/specsConfig";
import { FaImages } from "react-icons/fa";
import { PaymentMethod, RentFrequencies } from "@/data/enums";
import { toggleFavorite } from "@/services/favorites/favorites.service";
import { useAuth } from "@/Contexts/AuthContext";
import { useRouter } from "next/navigation";
import { playSound } from "@/utils/sounds";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { getAdTableId } from "@/utils/getAdTableId";
import { buildMarketUrl } from "@/utils/marketSeo";
import { IoLocationOutline } from "react-icons/io5";
import { LuClock3 } from "react-icons/lu";

const specLabels = {
  bedrooms: { en: "Bedrooms", ar: "غرف النوم" },
  bathrooms: { en: "Bathrooms", ar: "الحمامات" },
  level: { en: "Floor", ar: "الدور" },
  area_m2: { en: "Area", ar: "المساحة" },
};

const preventAdImageContextMenu = (e) => {
  e.preventDefault();
};

export default function CardItem({ data }) {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const { user, updateUserFavoritesCount } = useAuth();
  const router = useRouter();
  const {
    countries,
    governorates,
    cities,
    areas,
    compounds,
    tables,
    categories,
    subCategories,
  } = useAppData();

  const [isFavorite, setIsFavorite] = useState(data?.isFavorite);
  const [favoritesCount, setFavoritesCount] = useState(
    data?.favorites_count || 0,
  );
  const [favLoading, setfavLoading] = useState(false);

  const arabic = isArabic(data?.title);
  const tableId = getAdTableId(data);
  const adHref = `/market/${data?.id}?dep=${tableId || ""}`;
  const imagesCount = Number(data?.images_count || 0);
  const userHasFavorited = Boolean(
    data?.isFavorite || data?.is_favorite || data?.isFavorited,
  );

  useEffect(() => {
    setIsFavorite(userHasFavorited);
    setFavoritesCount(data?.favorites_count || 0);
  }, [data?.favorites_count, userHasFavorited]);

  const handleFavoriteClick = async () => {
    if (!user) {
      router.push(`/register?redirect=${encodeURIComponent(adHref)}`);
      return;
    }

    if (favLoading || !tableId || !data?.id) return;

    setfavLoading(true);

    const wasFavorite = isFavorite;

    try {
      await toggleFavorite(tableId, data.id);

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
  const priceMeta =
    RentFrequencies.find((x) => x.id == data?.rent_frequency)?.[
      `name_${locale}`
    ] ||
    PaymentMethod.find((x) => x.id == data?.payment_method)?.[`name_${locale}`];

  return (
    <Link
      href={adHref}
      key={`${tableId || "ad"}-${data?.id}`}
      className={`ad-card`}
    >
      <div className="image-holder" onContextMenu={preventAdImageContextMenu}>
        <Image
          className="main protected-ad-image"
          fill
          src={data?.image?.secure_url || "/apartment-mockup.avif"}
          alt={data?.title}
          draggable={false}
          onContextMenu={preventAdImageContextMenu}
        />
        <Image
          className="cover protected-ad-image"
          fill
          src={data?.image?.secure_url || "/apartment-mockup.avif"}
          alt={`${data?.title}-cover`}
          draggable={false}
          onContextMenu={preventAdImageContextMenu}
        />
        <div className="top">
          <div className="column">
            {data?.featured_priority > 0 && (
              <span className="verified ad-badge featured-badge ellipsis">
                <BsFillLightningChargeFill /> {t.ad.featured_ad}
              </span>
            )}
            {data?.is_verified && (
              <span className="verified ad-badge verified-badge ellipsis">
                <BsFillPatchCheckFill /> {t.ad.verified}
              </span>
            )}
          </div>
          <button
            className={`fav-btn ${isFavorite ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFavoriteClick();
            }}
            aria-label={
              isFavorite ? t.ad.remove_from_favorites : t.ad.add_to_favorites
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
        </div>
        <div className="row-holder">
          <h3>{formatCurrency(data?.price, data?.currency, locale)}</h3>
          {priceMeta && <span className={`status`}>{priceMeta}</span>}
        </div>
      </div>
      <div className="row">
        <div className="category-path">
          <span className="department ellipsis">
            {data?.department?.[`name_${locale}`]}
          </span>
          <span className="category-separator">/</span>
          <h5
            onClick={(e) => {
            e.stopPropagation();
              router.push(
                buildMarketUrl(
                  {
                    dep: data?.department?.id || data?.table_id,
                    cat: data?.category?.id,
                  },
                  {
                    countries,
                    governorates,
                    cities,
                    areas,
                    compounds,
                    tables,
                    categories,
                    subCategories,
                  },
                  "",
                ),
              );
            }}
          >
            {data?.category?.[`name_${locale}`]}
          </h5>
        </div>
        {imagesCount > 0 && (
          <span className="image-count-badge">
            <FaImages />
            {imagesCount}
          </span>
        )}
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
              typeof value === "object"
                ? (value?.label ?? value?.value)
                : value;
            const normalizedValue =
              key === "level" && Number(displayValue) === 0
                ? locale === "ar"
                  ? "أرضي"
                  : "Ground"
                : displayValue;

            return (
              <div key={key} className="spec">
                <div className="tops">
                  {Icon && <Icon className="spec-icon" />}
                  <span className="spec-value">
                    {normalizedValue}
                    {key === "area_m2" ? (
                      <>
                        {" "}
                        <small>m²</small>
                      </>
                    ) : config?.suffix ? (
                      ` ${config.suffix}`
                    ) : (
                      ""
                    )}
                  </span>
                </div>

              </div>
            );
          })}
      </div>

      <div className="date-area">
        <p className="area ellipsis">
          <IoLocationOutline />
          <span>{locationParts.join(" / ")}</span>
        </p>
        <p className="date" style={{ minWidth: "max-content" }}>
          <LuClock3 />
          {formatRelativeDate(data?.created_at, locale)}
        </p>
      </div>
    </Link>
  );
}
