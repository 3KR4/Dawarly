"use client";
import { useEffect, useMemo, useState, useContext, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import "@/styles/client/pages/singel-details.css";
import Image from "next/image";
import Link from "next/link";
import Navigations from "@/components/Tools/Navigations";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
// import { eachDayOfInterval } from "date-fns";
import { FaHeart } from "react-icons/fa";
import {
  FaAngleRight,
  FaAngleLeft,
  FaArrowRight,
  FaRegHeart,
  FaPhone,
  FaEye,
} from "react-icons/fa";

import { FaImage } from "react-icons/fa";


import useTranslate from "@/Contexts/useTranslation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { FiShare2 } from "react-icons/fi";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import {
  BsFillLightningChargeFill,
  BsFillPatchCheckFill,
} from "react-icons/bs";

import { settings } from "@/Contexts/settings";
import { formatCurrency } from "@/utils/formatCurrency";
import AdsSwiper from "@/components/home/Sections/AdsSwiper";
import { specsConfig } from "@/Contexts/specsConfig";
// import BookingRange from "@/components/Tools/data-collector/BookingCalendar";
import { getOneAd } from "@/services/ads/ads.service";
import { toggleFavorite } from "@/services/favorites/favorites.service";
import {
  Amenities,
  BuildingAndLandsTypes,
  BuildingCondition,
  BuildingType,
  LandType,
  Levels,
  PaymentMethod,
  RentFrequencies,
  RentPeriodUnit,
} from "@/data/enums";
import AdDetailsSkeleton from "@/components/skeletons/AdDetailsSkeleton";
import { getTableRule } from "@/data/tablesRules";
import { useAuth } from "@/Contexts/AuthContext";
import { playSound } from "@/utils/sounds";
import { getAdTableId } from "@/utils/getAdTableId";
import { slugifyValue } from "@/utils/marketSeo";

const preventAdImageContextMenu = (e) => {
  e.preventDefault();
};

export default function AdDetails() {
  const t = useTranslate();
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { screenSize, locale } = useContext(settings);
  const { user, updateUserFavoritesCount } = useAuth();
  const tableId = searchParams.get("dep");

  const [ad, setAd] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(Boolean(tableId && slug));
  const [favLoading, setFavLoading] = useState(false);
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const fullscreenSwiperRef = useRef(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  const getMarketCategoryHref = useMemo(
    () => (depth = "dep") => {
      const segments = [];

      if (ad?.department?.name_en) {
        segments.push("category", slugifyValue(ad.department.name_en));
      }
      if ((depth === "cat" || depth === "subcat") && ad?.category?.name_en) {
        if (!segments.length) segments.push("category");
        segments.push(slugifyValue(ad.category.name_en));
      }
      if (depth === "subcat" && ad?.subCategory?.name_en) {
        if (!segments.length) segments.push("category");
        segments.push(slugifyValue(ad.subCategory.name_en));
      }

      return segments.length ? `/market/${segments.join("/")}` : "/market";
    },
    [ad],
  );
  const [isImagesFullscreenOpen, setIsImagesFullscreenOpen] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState("grid");

  useEffect(() => {
    if (!tableId || !slug) {
      return;
    }

    getOneAd(tableId, slug)
      .then((res) => {
        console.log("res", res.data);
        setAd(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, tableId]);

  useEffect(() => {
    const productionOrigin = "https://dawaarly.com";
    const isLocalHost = ["localhost", "127.0.0.1"].includes(
      window.location.hostname,
    );

    setPageUrl(
      `${isLocalHost ? productionOrigin : window.location.origin}${window.location.pathname}${window.location.search}`,
    );
  }, [slug, tableId]);

  const activeTableId = Number(ad?.department?.id || tableId);
  const favoriteTableId = getAdTableId(ad) || activeTableId;
  const userHasFavorited = Boolean(
    ad?.isFavorite || ad?.is_favorite || ad?.isFavorited,
  );
  const tableRule = useMemo(() => getTableRule(activeTableId), [activeTableId]);
  const isRentAd = tableRule.isRent || Boolean(ad?.rent_frequency);
  const isSaleAd = tableRule.isSale || Boolean(ad?.payment_method);
  const isAdmin = user?.user_type === "ADMIN" || user?.is_super_admin;

  const getSpecConfig = (key) => specsConfig[key] || {};

  const getOptionLabel = (options, id) => {
    const option = options.find((item) => String(item.id) === String(id));
    return option?.[`name_${locale}`] || option?.name_en || id;
  };

  const formatBoolean = (value) => (value ? t.ad.yes : t.ad.no);

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
    level: (value) => getOptionLabel(Levels, value),
    area_m2: (value) => `${value} m2`,
    type: (value) => getOptionLabel(BuildingAndLandsTypes, value),
    land_type: (value) => getOptionLabel(LandType, value),
    building_type: (value) => getOptionLabel(BuildingType, value),
    building_condition: (value) => getOptionLabel(BuildingCondition, value),
  };

  const buildRows = (keys) =>
    keys
      .map((key) => {
        const value = ad?.details?.[key] ?? ad?.[key];
        if (value === null || value === undefined || value === "") return null;
        const config = getSpecConfig(key);

        return {
          key,
          label: detailLabels[key] || config.label || key,
          value: valueFormatters[key] ? valueFormatters[key](value) : value,
          Icon: config.icon,
        };
      })
      .filter(Boolean);

  const specRows = buildRows([
    "bedrooms",
    "bathrooms",
    "level",
    "area_m2",
    "floors",
    "type",
    "land_type",
    "building_type",
    "building_condition",
  ]);

  const rentFrequencyLabel = getOptionLabel(
    RentFrequencies,
    ad?.rent_frequency,
  );
  const rentPeriodUnitLabel = getOptionLabel(
    RentPeriodUnit,
    ad?.min_rent_period_unit,
  );

  const saleRows = [
    ad?.installment_years && {
      key: "installment_years",
      label: t.ad.installment_years,
      value: ad.installment_years,
    },
    Object.prototype.hasOwnProperty.call(ad || {}, "ready_to_move") && {
      key: "ready_to_move",
      label: t.ad.ready_to_move,
      value: formatBoolean(ad.ready_to_move),
    },
    Object.prototype.hasOwnProperty.call(ad || {}, "furnished") && {
      key: "furnished",
      label: t.ad.furnished,
      value: formatBoolean(ad.furnished),
    },
  ].filter(Boolean);

  const rentRows = [
    ad?.adult_no_max && {
      key: "adult_no_max",
      label: t.ad.max_adults,
      value: ad.adult_no_max,
    },
    ad?.child_no_max && {
      key: "child_no_max",
      label: t.ad.max_children,
      value: ad.child_no_max,
    },
  ].filter(Boolean);

  const amenities = Object.entries(ad?.amenities || {})
    .filter(([_, value]) => value)
    .map(([key]) => {
      const item =
        Amenities.find((amenity) => amenity.key === key) ||
        Amenities.find((amenity) => amenity.id === `am_${key}`);
      return item?.[`name_${locale}`] || item?.name_en || key;
    });

  const getLevelLabel = (levelId) => getOptionLabel(Levels, levelId);
  const salePaymentLabel = getOptionLabel(PaymentMethod, ad?.payment_method);
  const navigationItems = [
    { name: t.market.all_ads, href: "/market" },
    ad?.department?.[`name_${locale}`] && {
      name: ad.department[`name_${locale}`],
      href: getMarketCategoryHref("dep"),
    },
    ad?.category?.[`name_${locale}`] && {
      name: ad.category[`name_${locale}`],
      href: getMarketCategoryHref("cat"),
    },
    ad?.subCategory?.[`name_${locale}`] && {
      name: ad.subCategory[`name_${locale}`],
      href: getMarketCategoryHref("subcat"),
    },
    { name: t.ad.ad_details, href: "" },
  ].filter(Boolean);

  const swiperDirection = "horizontal";
  const slidesView =
    screenSize === "ultra-small" ? 2 : screenSize === "small" ? 3 : 7;
  const space = 6;

  const showMainImageNav = ad?.images?.length > 1;

  const goToImage = (index) => {
    setCurrentImg(index);
    mainSwiperRef.current?.slideTo(index);
    thumbsSwiperRef.current?.slideTo(index);
  };

  const handleMainSlideChange = (swiper) => {
    setCurrentImg(swiper.activeIndex);
    thumbsSwiperRef.current?.slideTo(swiper.activeIndex);
  };

  const handleThumbSlideChange = (swiper) => {
    setCurrentImg(swiper.activeIndex);
    mainSwiperRef.current?.slideTo(swiper.activeIndex);
  };

  const openImagesFullscreen = (index = currentImg) => {
    goToImage(index);
    setFullscreenMode("grid");
    setIsImagesFullscreenOpen(true);
  };

  const closeImagesFullscreen = () => {
    setIsImagesFullscreenOpen(false);
    setFullscreenMode("grid");
  };

  const openFullscreenViewer = (index) => {
    goToImage(index);
    setFullscreenMode("viewer");
  };

  const goToFullscreenImage = (index) => {
    if (!ad?.images?.length) return;
    goToImage(index);
    fullscreenSwiperRef.current?.slideTo(index);
  };

  const goToPreviousFullscreenImage = () => {
    if (!ad?.images?.length) return;
    const previousIndex =
      currentImg === 0 ? ad.images.length - 1 : currentImg - 1;
    goToFullscreenImage(previousIndex);
  };

  const goToNextFullscreenImage = () => {
    if (!ad?.images?.length) return;
    const nextIndex = currentImg === ad.images.length - 1 ? 0 : currentImg + 1;
    goToFullscreenImage(nextIndex);
  };

  useEffect(() => {
    if (!isImagesFullscreenOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeImagesFullscreen();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isImagesFullscreenOpen]);

  const goToPreviousImage = () => {
    if (!ad?.images?.length) return;

    const previousIndex =
      currentImg === 0 ? ad.images.length - 1 : currentImg - 1;
    goToImage(previousIndex);
  };

  const goToNextImage = () => {
    if (!ad?.images?.length) return;

    const nextIndex = currentImg === ad.images.length - 1 ? 0 : currentImg + 1;
    goToImage(nextIndex);
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      router.push(
        `/register?redirect=${encodeURIComponent(`/market/${slug}?dep=${favoriteTableId || tableId || ""}`)}`,
      );
      return;
    }

    if (favLoading || !favoriteTableId || !ad?.id) return;

    const wasFavorite = userHasFavorited;

    try {
      setFavLoading(true);
      await toggleFavorite(favoriteTableId, ad.id);

      setAd((prev) => ({
        ...prev,
        isFavorite: !wasFavorite,
        is_favorite: !wasFavorite,
        favorites_count: wasFavorite
          ? Math.max((prev?.favorites_count || 0) - 1, 0)
          : (prev?.favorites_count || 0) + 1,
      }));

      updateUserFavoritesCount(
        wasFavorite
          ? Math.max((user?.favorites_count || 0) - 1, 0)
          : (user?.favorites_count || 0) + 1,
      );
      playSound(wasFavorite ? "favOff" : "favOn");
    } catch (err) {
      console.error("toggleFavorite err", err);
    } finally {
      setFavLoading(false);
    }
  };

  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return "";

    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "20" + cleaned.slice(1);
    }

    if (cleaned.startsWith("20")) {
      return cleaned;
    }
    return cleaned;
  };

  const locationParts = [
    ad?.area?.[`name_${locale}`],
    ad?.city?.[`name_${locale}`],
    ad?.governorate?.[`name_${locale}`],
    ad?.compound?.[`name_${locale}`],
  ].filter(Boolean);
  const subuser = ad?.subuser || ad?.user;
  const contactOwner = ad?.admin || subuser;
  const listedByName = ad?.admin && !subuser ? "Dawaarly" : subuser?.full_name;
  const ownerAdsHref =
    ad?.admin && !subuser
      ? "/market?owner=dawaarly"
      : subuser?.id
        ? `/market?owner_type=${ad?.subuser ? "subuser" : "user"}&owner_id=${
            subuser.id
          }&owner_name=${encodeURIComponent(subuser.full_name || "")}`
        : "/market";
  const adShareUrl =
    pageUrl ||
    `https://dawaarly.com/market/${slug}?dep=${favoriteTableId || tableId || ""}`;
  const whatsappMessage = encodeURIComponent(`${adShareUrl}\n\n`);

  if (loading) {
    return <AdDetailsSkeleton />;
  }

  return (
    <>
      <div className="single-page container for-product">
        <Navigations items={navigationItems} container="main" />

        <div className="holder big-holder">
          <div
            className="images-holder"
            onContextMenu={preventAdImageContextMenu}
          >
            {ad?.images?.[currentImg] && (
              <div className="img">
                <Swiper
                  dir="ltr"
                  slidesPerView={1}
                  onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
                  onSlideChange={handleMainSlideChange}
                  className="main-img-swiper"
                >
                  {ad?.images?.map((image, index) => (
                    <SwiperSlide key={image?.id || image?.secure_url || index}>
                      <div
                        className="main-image-slide"
                        style={{
                          "--back-image": `url("${image?.secure_url}")`,
                        }}
                        role="button"
                        tabIndex={0}
                        onClick={() => openImagesFullscreen(index)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openImagesFullscreen(index);
                          }
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="main-img protected-ad-image"
                          src={image?.secure_url}
                          alt={ad.title}
                          draggable={false}
                          onContextMenu={preventAdImageContextMenu}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="top">
                  <div className="column">
                    {ad?.featured_priority > 0 ? (
                      <span className="verified featured-badge ellipsis">
                        <BsFillLightningChargeFill /> {t.ad.featured_ad}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    {ad?.is_verified && (
                      <span className="verified verified-badge ellipsis">
                        <BsFillPatchCheckFill /> {t.ad.verified}
                      </span>
                    )}
                  </div>
                  {ad?.images?.length > 1 && (
                    <span className="verified image-counter">
                      <FaImage /> {currentImg + 1} / {ad.images.length}
                    </span>
                  )}
                </div>
                {showMainImageNav && (
                  <>
                    <button
                      type="button"
                      className="main-image-nav prev"
                      onClick={goToPreviousImage}
                      aria-label={t.ad.previous_image}
                    >
                      <FaAngleLeft />
                    </button>
                    <button
                      type="button"
                      className="main-image-nav next"
                      onClick={goToNextImage}
                      aria-label={t.ad.next_image}
                    >
                      <FaAngleRight />
                    </button>
                  </>
                )}
              </div>
            )}
            {ad?.images?.length > 1 && (
              <div className="imgs-swiper-wrapper horizontal">
                <Swiper
                  dir="ltr"
                  key={swiperDirection}
                  direction={swiperDirection}
                  slidesPerView={slidesView}
                  spaceBetween={space}
                  onSwiper={(swiper) => (thumbsSwiperRef.current = swiper)}
                  onSlideChange={handleThumbSlideChange}
                  watchSlidesProgress
                  className="imgs-swiper"
                >
                  {ad?.images?.map((x, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className={`img ${index === currentImg ? "active" : ""}`}
                        onContextMenu={preventAdImageContextMenu}
                        onClick={() => {
                          openImagesFullscreen(index);
                        }}
                      >
                        <Image
                          fill
                          src={x?.secure_url}
                          alt={ad?.name}
                          className="protected-ad-image"
                          draggable={false}
                          onContextMenu={preventAdImageContextMenu}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
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
                      <FiShare2 />{" "}
                      {userHasFavorited ? (
                        <FaHeart
                          role="button"
                          aria-label={t.ad.remove_from_favorites}
                          onClick={handleFavoriteClick}
                          style={{ cursor: favLoading ? "wait" : "pointer" }}
                        />
                      ) : (
                        <FaRegHeart
                          role="button"
                          aria-label={t.ad.add_to_favorites}
                          onClick={handleFavoriteClick}
                          style={{ cursor: favLoading ? "wait" : "pointer" }}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="column-holder">
                    <h5 className="price">
                      {formatCurrency(ad?.price, ad?.currency, locale)}
                      {isRentAd && ad?.rent_frequency
                        ? ` / ${rentFrequencyLabel}`
                        : ""}
                      {isSaleAd && ad?.payment_method
                        ? ` / ${salePaymentLabel}`
                        : ""}
                    </h5>
                    {isRentAd && ad?.deposit_amount && (
                      <h6 className="price-dep">
                        {t.ad.deposit}:{" "}
                        {formatCurrency(
                          ad?.deposit_amount,
                          ad?.currency,
                          locale,
                        )}
                      </h6>
                    )}
                    {isSaleAd && ad?.down_payment && (
                      <h6 className="price-dep">
                        {t.ad.down_payment}:{" "}
                        {formatCurrency(ad.down_payment, ad.currency, locale)}
                      </h6>
                    )}
                  </div>
                  {!screenSize.includes("small") && (
                    <div className="row stats">
                      <span>
                        <FaEye /> {ad?.views_count}
                      </span>
                      {isAdmin && (
                        <span>
                          <BiSolidPurchaseTagAlt /> {ad?.reach_count}
                        </span>
                      )}
                      <span>
                        <FaHeart /> {ad?.favorites_count}
                      </span>
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="area">
                    <FaLocationDot />
                    <span>{locationParts.join("، ")}</span>
                  </div>
                  <p className="time">
                    {formatRelativeDate(ad?.created_at, locale)}{" "}
                  </p>
                </div>

                {screenSize.includes("small") && (
                  <div className="btns">
                    <FiShare2 />{" "}
                    {userHasFavorited ? (
                      <FaHeart
                        role="button"
                        aria-label={t.ad.remove_from_favorites}
                        onClick={handleFavoriteClick}
                        style={{ cursor: favLoading ? "wait" : "pointer" }}
                      />
                    ) : (
                      <FaRegHeart
                        role="button"
                        aria-label={t.ad.add_to_favorites}
                        onClick={handleFavoriteClick}
                        style={{ cursor: favLoading ? "wait" : "pointer" }}
                      />
                    )}
                  </div>
                )}
              </div>

              {specRows.length > 0 && (
                <div className="specifecs card">
                  <h4>{t.ad.specifecs}</h4>
                  <ul>
                    {specRows.map(({ key, label, value, Icon }) => (
                      <li key={key} className="spec-item">
                        {Icon && <Icon className="spec-icon" />}
                        <span className="spec-key">{label}</span>
                        <span className="spec-value">: {value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {saleRows.length > 0 && (
                <div className="specifecs card conditions">
                  <h4>{t.ad.sale_details}</h4>
                  <ul>
                    {saleRows.map((row) => (
                      <li key={row.key} className="spec-item">
                        <span className="spec-key">{row.label}</span>
                        <span className="spec-value">: {row.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {amenities.length > 0 && (
                <div className="amenities card">
                  <h4>{t.ad.amenities}</h4>
                  <ul>
                    {amenities.map((name) => (
                      <li className="amenitie-item" key={name}>
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isRentAd && rentRows.length > 0 && (
                <div className="card conditions">
                  <h4>{t.ad.conditions}</h4>
                  <ul className="">
                    {rentRows.map((row) => (
                      <li key={row.key}>
                        {row.label}: {row.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="specifecs card legacy-hidden">
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
                          : {key === "level" ? getLevelLabel(value) : value}
                          {config?.suffix && ` ${config.suffix}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="amenities card legacy-hidden">
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

              <div className="card conditions legacy-hidden">
                <h4>{t.ad.conditions}</h4>
                <ul className="">
                  {ad?.adult_no_max && (
                    <li>
                      {t.ad.max_adults}: {ad.adult_no_max}
                    </li>
                  )}

                  {ad?.child_no_max > 0 && (
                    <li>
                      {t.ad.max_children}: {ad.child_no_max}
                    </li>
                  )}
                </ul>
              </div>

              <div className="description card">
                <h4>{t.ad.description}</h4>{" "}
                <p style={{ whiteSpace: "pre-line" }}>{ad?.description}</p>
              </div>
              {/* Booking is temporarily hidden.
              {isRentAd && (
                <div className="card booking" id="booknow">
                  <h4>{t.ad.book_now}</h4>

                  {ad?.min_rent_period && (
                    <p className="min_rent_period">
                      {t.ad.minimum_rent_period}{" "}
                      <span>
                        {ad?.min_rent_period}{" "}
                        {
                          RentPeriodUnit.find(
                            (x) => x.id == ad?.min_rent_period_unit,
                          )?.[`name_${locale}`]
                        }
                      </span>
                    </p>
                  )}
                  {ad?.available_from && (
                    <p>
                      {t.ad.available_from}{" "}
                      <span>
                        {" "}
                        {new Date(ad?.available_from).toLocaleDateString(
                          locale,
                        )}{" "}
                        {t.ad.to}:{" "}
                        {new Date(ad?.available_to).toLocaleDateString(locale)}
                      </span>
                    </p>
                  )}
                  <BookingRange data={ad} />
                </div>
              )}
              */}
            </div>
            <div className="right">
              <div className="card user-info">
                <div className="row-holder">
                  <h4>
                    {t.ad.listed_by} {listedByName}
                  </h4>

                  <Link href={ownerAdsHref}>
                    {ad?.admin && !subuser
                      ? t.ad.see_more_ads
                      : t.ad.see_profile}{" "}
                    <FaArrowRight className="arrow" />
                  </Link>
                </div>
                {subuser && (
                  <div className="row-holder">
                    <p>
                      {t.ad.member_since}{" "}
                      {new Date(subuser?.created_at).toLocaleDateString()}
                    </p>
                    {subuser?.active_ads_count > 0 && (
                      <p>
                        {t.ad.other_ads_count.replace(
                          "{count}",
                          subuser.active_ads_count,
                        )}
                      </p>
                    )}
                  </div>
                )}

                <div className="holder">
                  <div className="row">
                    {(!!ad?.admin || ad?.display_phone) && (
                      <button
                        onClick={() => setShowPhoneNumber(true)}
                        className="main-button"
                      >
                        <FaPhone />{" "}
                        {showPhoneNumber
                          ? contactOwner?.phone
                          : t.ad.phone_number}
                      </button>
                    )}

                    {(!!ad?.admin || ad?.display_whatsapp) && (
                      <a
                        href={`https://wa.me/${formatPhoneForWhatsApp(
                          contactOwner?.phone,
                        )}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="main-button whatsapp-button"
                      >
                        <TbBrandWhatsappFilled /> {t.ad.whatsapp}
                      </a>
                    )}
                  </div>

                  {/* Booking is temporarily hidden.
                  {isRentAd && (
                    <Link href="#booknow" className="main-button">
                      {t.ad.book_now}
                    </Link>
                  )}
                  */}
                </div>
              </div>

              {!ad?.admin && (
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
      <AdsSwiper
        type={`category`}
        id={ad?.category?.id}
        tableId={activeTableId}
      />
      <AdsSwiper
        type={`subCategory`}
        id={ad?.subCategory?.id}
        tableId={activeTableId}
      />
      <AdsSwiper type={`city`} id={ad?.city?.id} />

      {isImagesFullscreenOpen && (
        <div className="images-fullscreen" role="dialog" aria-modal="true">
          <div className={`images-container ${fullscreenMode === "viewer" ? "viewer-mode" : ""}`}>
          <div className="top">
            {fullscreenMode === "viewer" ? (
              <button
                type="button"
                className="back-btn"
                onClick={() => setFullscreenMode("grid")}
              >
                Back
              </button>
            ) : (
              <h3>All Images</h3>
            )}
            {fullscreenMode === "viewer" && (
              <span className="viewer-count">
                {currentImg + 1} / {ad?.images?.length || 0}
              </span>
            )}
            <button
              type="button"
              className="close-btn"
              onClick={closeImagesFullscreen}
              aria-label="Close images"
            >
              ×
            </button>
          </div>
            {fullscreenMode === "grid" ? (
              <div className="images-list">
                {ad?.images?.map((image, index) => (
                  <div
                    role="button"
                    tabIndex={0}
                    className="fullscreen-image"
                    key={image?.id || image?.secure_url || index}
                    onClick={() => openFullscreenViewer(index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openFullscreenViewer(index);
                      }
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image?.secure_url}
                      alt={`${ad?.title || "Ad image"} ${index + 1}`}
                      draggable={false}
                      onContextMenu={preventAdImageContextMenu}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Swiper
                  dir="ltr"
                  slidesPerView={1}
                  initialSlide={currentImg}
                  onSwiper={(swiper) => (fullscreenSwiperRef.current = swiper)}
                  onSlideChange={(swiper) => goToImage(swiper.activeIndex)}
                  className="fullscreen-viewer-swiper"
                >
                  {ad?.images?.map((image, index) => (
                    <SwiperSlide key={image?.id || image?.secure_url || index}>
                      <div className="fullscreen-viewer-slide">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image?.secure_url}
                          alt={`${ad?.title || "Ad image"} ${index + 1}`}
                          draggable={false}
                          onContextMenu={preventAdImageContextMenu}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  type="button"
                  className="fullscreen-nav prev"
                  onClick={goToPreviousFullscreenImage}
                  aria-label="Previous image"
                >
                  <FaAngleLeft />
                </button>
                <button
                  type="button"
                  className="fullscreen-nav next"
                  onClick={goToNextFullscreenImage}
                  aria-label="Next image"
                >
                  <FaAngleRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
