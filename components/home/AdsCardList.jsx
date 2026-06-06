"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaEye,
  FaHeart,
  FaImages,
  FaPhone,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { LuClock3 } from "react-icons/lu";
import { MdVerified } from "react-icons/md";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { isArabic } from "@/utils/detectDirection";
import { settings } from "@/Contexts/settings";
import useTranslate from "@/Contexts/useTranslation";
import { specsConfig } from "@/Contexts/specsConfig";
import {
  Amenities,
  BuildingAndLandsTypes,
  BuildingCondition,
  BuildingType,
  LandType,
  Levels,
  PaymentMethod,
  RentFrequencies,
} from "@/data/enums";
import { getTableRule } from "@/data/tablesRules";
import { getAdTableId } from "@/utils/getAdTableId";

const preventAdImageContextMenu = (e) => {
  e.preventDefault();
};

const getOptionLabel = (options, id, locale) => {
  const option = options.find((item) => String(item.id) === String(id));
  return option?.[`name_${locale}`] || option?.name_en || id;
};

const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return "";

  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "20" + cleaned.slice(1);

  return cleaned;
};

export default function AdsCardList({ data }) {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const tableId = getAdTableId(data);
  const adHref = `/market/${data?.id}?dep=${tableId || ""}`;
  const arabic = isArabic(data?.title);
  const tableRule = getTableRule(tableId);
  const isRentAd = tableRule.isRent || Boolean(data?.rent_frequency);
  const isSaleAd = tableRule.isSale || Boolean(data?.payment_method);
  const rentFrequencyLabel = getOptionLabel(
    RentFrequencies,
    data?.rent_frequency,
    locale,
  );
  const paymentMethodLabel = getOptionLabel(
    PaymentMethod,
    data?.payment_method,
    locale,
  );
  const locationParts = [
    data?.area?.[`name_${locale}`],
    data?.city?.[`name_${locale}`],
    data?.governorate?.[`name_${locale}`],
    data?.compound?.[`name_${locale}`],
  ].filter(Boolean);
  const subuser = data?.subuser || data?.user;
  const contactOwner = data?.admin || subuser || data?.anonymous;
  const images = useMemo(() => {
    const safeImages = Array.isArray(data?.images) ? data.images : [];
    const fallbackImage = data?.image ? [data.image] : [];
    const uniqueImages = [...safeImages, ...fallbackImage].filter(
      (image, index, list) =>
        image?.secure_url &&
        list.findIndex((item) => item?.secure_url === image.secure_url) ===
          index,
    );

    return uniqueImages.length
      ? uniqueImages
      : [{ secure_url: "/apartment-mockup.avif" }];
  }, [data]);
  const imagesCount = images.filter(
    (image) => image.secure_url !== "/apartment-mockup.avif",
  ).length;
  const activeImage = images[activeImageIndex] || images[0];
  const hasMultipleImages = images.length > 1;
  const visibleDots = useMemo(() => {
    const maxDots = 6;
    if (images.length <= maxDots) {
      return images.map((image, index) => ({ image, index }));
    }

    const halfWindow = Math.floor(maxDots / 2);
    const maxStart = images.length - maxDots;
    const start = Math.min(
      Math.max(activeImageIndex - halfWindow, 0),
      maxStart,
    );

    return images
      .slice(start, start + maxDots)
      .map((image, offset) => ({ image, index: start + offset }));
  }, [activeImageIndex, images]);
  const whatsappMessage = encodeURIComponent(
    `https://dawaarly.com${adHref}\n\n`,
  );

  const goToImage = (event, nextIndex) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((nextIndex + images.length) % images.length);
  };

  const detailRows = useMemo(() => {
    const detailLabels = {
      bedrooms: t.ad.bedrooms,
      bathrooms: t.ad.bathrooms,
      level: t.ad.level,
      area_m2: t.ad.area,
      floors: t.ad.floors,
      type: t.ad.type,
      land_type: t.ad.land_type,
      building_type: t.ad.building_type,
      building_condition: t.ad.building_condition,
    };
    const valueFormatters = {
      level: (value) => getOptionLabel(Levels, value, locale),
      area_m2: (value) => `${value} m2`,
      type: (value) => getOptionLabel(BuildingAndLandsTypes, value, locale),
      land_type: (value) => getOptionLabel(LandType, value, locale),
      building_type: (value) => getOptionLabel(BuildingType, value, locale),
      building_condition: (value) =>
        getOptionLabel(BuildingCondition, value, locale),
    };

    return [
      "bedrooms",
      "bathrooms",
      "level",
      "area_m2",
      "floors",
      "type",
      "land_type",
      "building_type",
      "building_condition",
    ]
      .map((key) => {
        const value = data?.details?.[key] ?? data?.[key];
        if (value === null || value === undefined || value === "") return null;
        const config = specsConfig[key] || {};
        const Icon = config.icon;

        return {
          key,
          Icon,
          label: detailLabels[key] || config.label || key,
          value: valueFormatters[key] ? valueFormatters[key](value) : value,
        };
      })
      .filter(Boolean);
  }, [data, locale, t]);

  const extraRows = [
    isSaleAd &&
      data?.payment_method && {
        key: "payment_method",
        label: t.ad.PaymentMethod || t.common?.selectPaymentMethod || "Payment",
        value: paymentMethodLabel,
      },
    isSaleAd &&
      data?.down_payment && {
        key: "down_payment",
        label: t.ad.down_payment || "Down payment",
        value: formatCurrency(data.down_payment, data.currency, locale),
      },
    isSaleAd &&
      data?.installment_years && {
        key: "installment_years",
        label: t.ad.installment_years,
        value: data.installment_years,
      },
    isRentAd &&
      data?.deposit_amount && {
        key: "deposit_amount",
        label: t.ad.deposit,
        value: formatCurrency(data.deposit_amount, data.currency, locale),
      },
  ].filter(Boolean);

  const amenities = Object.entries(data?.amenities || {})
    .filter(([_, value]) => value)
    .map(([key]) => {
      const item =
        Amenities.find((amenity) => amenity.key === key) ||
        Amenities.find((amenity) => amenity.id === `am_${key}`);
      return item?.[`name_${locale}`] || item?.name_en || key;
    });

  return (
    <article className="ad-card-list">
      <div className="list-media" onContextMenu={preventAdImageContextMenu}>
        <Link href={adHref} className="list-image">
          <Image
            className="protected-ad-image"
            fill
            src={activeImage?.secure_url || "/apartment-mockup.avif"}
            alt={data?.title}
            draggable={false}
            onContextMenu={preventAdImageContextMenu}
          />
        </Link>

        {data?.is_verified && (
          <div className="list-media-top">
            <span className="list-badge verified">
              <MdVerified />
              {t.ad.verified}
            </span>
          </div>
        )}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              className="list-image-nav prev"
              aria-label="Previous image"
              onClick={(event) => goToImage(event, activeImageIndex - 1)}
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              className="list-image-nav next"
              aria-label="Next image"
              onClick={(event) => goToImage(event, activeImageIndex + 1)}
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {hasMultipleImages && (
          <div className="list-image-dots">
            {visibleDots.map(({ image, index }) => (
              <button
                type="button"
                key={image.id || image.secure_url || index}
                className={activeImageIndex === index ? "active" : ""}
                aria-label={`Show image ${index + 1}`}
                onClick={(event) => goToImage(event, index)}
              />
            ))}
          </div>
        )}

        {imagesCount > 0 && (
          <span className="list-image-count">
            <FaImages />
            {imagesCount}
          </span>
        )}
      </div>

      <div className="list-content">
        <Link href={adHref} className="title-link">
          <h4
            className={`ellipsis ${arabic ? "rtl" : "ltr"}`}
            dir={arabic ? "rtl" : "ltr"}
          >
            {data?.title}
          </h4>
        </Link>
        <div className="list-category">
          <span className="ellipsis">
            {data?.department?.[`name_${locale}`]}
          </span>
          <span>/</span>
          <span className="ellipsis">{data?.category?.[`name_${locale}`]}</span>
        </div>

        <div className="list-price-row">
          <h3>
            {formatCurrency(data?.price, data?.currency, locale)}
            {isRentAd && data?.rent_frequency ? ` / ${rentFrequencyLabel}` : ""}
            {isSaleAd && data?.payment_method ? ` / ${paymentMethodLabel}` : ""}
          </h3>
          <span className="list-stats">
            <div className="row">
              <FaEye /> {data?.views_count || 0}
            </div>
            <div className="row">
              <FaHeart /> {data?.favorites_count || 0}
            </div>
          </span>
        </div>

        <div className="list-location">
          <div className="row">
            <FaLocationDot />
            <span className="ellipsis">{locationParts.join(" / ")}</span>
          </div>
          <div className="row">
            <LuClock3 />
            <span>{formatRelativeDate(data?.created_at, locale)}</span>
          </div>
        </div>

        {(detailRows.length > 0 || extraRows.length > 0) && (
          <div className="list-details">
            {[...detailRows, ...extraRows].slice(0, 8).map((row) => (
              <span key={row.key} className="list-spec-chip">
                <span className="list-spec-top">
                  {row.Icon && <row.Icon className="list-chip-icon" />}
                  <b>{row.value}</b>
                </span>
                <strong>{row.label}</strong>
              </span>
            ))}
          </div>
        )}

        {amenities.length > 0 && (
          <div className="list-amenities">
            {amenities.map((name) => (
              <span key={name} className="list-amenity-chip">
                <FaCheck className="list-chip-icon" />
                {name}
              </span>
            ))}
          </div>
        )}
        <div className="list-actions">
          {(!!data?.admin || data?.display_phone) && contactOwner?.phone && (
            <button
              type="button"
              className="main-button"
              onClick={() => setShowPhoneNumber(true)}
            >
              <FaPhone />
              {showPhoneNumber ? contactOwner.phone : t.ad.phone_number}
            </button>
          )}

          {(!!data?.admin || data?.display_whatsapp) && contactOwner?.phone && (
            <a
              href={`https://wa.me/${formatPhoneForWhatsApp(
                contactOwner.phone,
              )}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="main-button whatsapp-button"
            >
              <TbBrandWhatsappFilled /> {t.ad.whatsapp}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
