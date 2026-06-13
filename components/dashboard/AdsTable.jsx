"use client";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/Tools/Pagination";
import useTranslate from "@/Contexts/useTranslation";
import { formatCurrency } from "@/utils/formatCurrency";

import Image from "next/image";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Link from "next/link";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { HiExclamation } from "react-icons/hi";
import React, { useContext, useState, useEffect } from "react";
import { specsConfig } from "@/Contexts/specsConfig";

import { settings } from "@/Contexts/settings";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { useNotification } from "@/Contexts/NotificationContext";
import { TbListSearch } from "react-icons/tb";
import { AdStatuses, PaymentMethod, RentFrequencies } from "@/data/enums";
import DeleteConfirm from "@/components/Tools/DeleteConfirm";
import DynamicMenu from "@/components/Tools/DynamicMenu";
import { FaHeart } from "react-icons/fa";
import { getAdTableId } from "@/utils/getAdTableId";

const preventAdImageContextMenu = (e) => {
  e.preventDefault();
};

export default function AdsTable({
  ads,
  loadingContent,
  activeAds,
  removeAd,
  changeStatus,
  page = "dashboard",
  statusChanger = "admin",
  showOwnerDetails = false,
  onOwnerClick,
}) {
  const { screenSize, locale } = useContext(settings);
  const t = useTranslate();
  const { addNotification } = useNotification();
  const [menuType, setMenuType] = useState(null); // form | delete
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [target, setTarget] = useState(null);
  const [rejectInput, setRejectInput] = useState("");
  const isDashboardAdsView = page === "dashboard";
  const isDashboardPendingView = isDashboardAdsView && !activeAds;

  const filteredStatuses = AdStatuses.filter((status) =>
    statusChanger == "client"
      ? ["ACTIVE", "DISABLED", "EXPIRED"].includes(status.id)
      : statusChanger == "admin"
        ? status.id !== "PENDING" && status.id !== "REJECTED"
        : status.id === "ACTIVE" || status.id === "REJECTED",
  );
  const getSpecConfig = (key) => specsConfig[key];
  const getRentFrequencyLabel = (value) =>
    RentFrequencies.find((item) => item.id == value)?.[`name_${locale}`];
  const getPaymentMethodLabel = (value) =>
    PaymentMethod.find((item) => item.id == value)?.[`name_${locale}`];
  const getOwnerInfo = (item) => {
    if (item?.anonymous) {
      return {
        id: item.anonymous.id,
        type: "anonymous",
        name: item.anonymous.full_name,
        phone: item.anonymous.phone,
      };
    }

    if (item?.subuser) {
      return {
        id: item.subuser.id,
        type: "subuser",
        name: item.subuser.full_name,
        phone: item.subuser.phone,
      };
    }

    if (item?.user) {
      return {
        id: item.user.id,
        type: "user",
        name: item.user.full_name,
        phone: item.user.phone,
      };
    }

    if (item?.admin) {
      return {
        id: item.admin.id,
        type: "admin",
        name: item.admin.full_name,
        phone: item.admin.phone,
      };
    }

    return null;
  };

  const closeMenu = () => {
    setMenuType(null);
    setRejectInput("");
    setLoadingSubmit(false);
  };

  const confirmDelete = (rejectInput) => {
    setLoadingSubmit(true);
    if (rejectInput) {
      changeStatus(target, { id: "REJECTED" }, rejectInput);
    } else {
      removeAd(target)
        .then(() => {
          closeMenu();
        })
        .catch(console.error)
        .finally(() => setLoadingSubmit(false));
    }
  };

  return (
    <div className={`body ${page == "user" ? "fluid-container for-user" : ""}`}>
      <div
        className={`table-container products ${
          isDashboardPendingView ? "pending-ads" : ""
        } ${showOwnerDetails ? "with-owner-details" : ""}`}
      >
        <div className="table-header">
          {!screenSize.includes("small") && (
            <>
              <div className="header-item details">
                {t.dashboard.tables.ad_details}
              </div>
              {showOwnerDetails && (
                <div className="header-item">
                  {t.dashboard.tables.owner_details}
                </div>
              )}
              <div className="header-item">
                {isDashboardAdsView ? t.ad.price : t.ad.rentPrice}
              </div>
              {!activeAds && !isDashboardPendingView && (
                <div className="header-item">{t.ad.deposit_amount}</div>
              )}

              <div className="header-item">{t.home.categories}</div>
              <div className="header-item">
                {activeAds
                  ? t.dashboard.tables.created_at
                  : t.dashboard.tables.published_at}
              </div>
              {activeAds && (
                <>
                  <div className="header-item">{t.dashboard.tables.reach}</div>
                </>
              )}
              {statusChanger == "favoriet" ? (
                <div className="header-item">
                  {t.dashboard.tables.specifics}
                </div>
              ) : (
                <div className="header-item">{t.dashboard.tables.status}</div>
              )}

              <div className="header-item">{t.dashboard.tables.actions}</div>
            </>
          )}
        </div>

        <div
          className="table-items"
          style={{
            position: "relative",
            opacity: loadingContent ? "0.6" : "1",
          }}
        >
          {loadingContent && (
            <div className="loading-content">
              <span
                className="loader"
                style={{ opacity: loadingContent ? "1" : "0" }}
              ></span>
            </div>
          )}
          {!ads?.length && !loadingContent ? (
            <div className="no-data-found">
              <TbListSearch />
              <p>
                {activeAds
                  ? "no data found"
                  : page === "user"
                    ? "you didnt post ads yet"
                    : "no more pending ads"}
              </p>
            </div>
          ) : (
            ads?.map((item) => {
              const curentStatus = AdStatuses.find((s) => s.id == item?.status);
              const tableId = getAdTableId(item);
              const itemWithTableId = { ...item, table_id: tableId };
              const ownerInfo = getOwnerInfo(item);
              const rentFrequencyLabel = getRentFrequencyLabel(
                item?.rent_frequency,
              );
              const paymentMethodLabel = getPaymentMethodLabel(
                item?.payment_method,
              );
              const editHref =
                page == "dashboard"
                  ? `/dashboard/ads/form?dep=${tableId}&id=${item?.id}`
                  : `/mylisting/form/${item?.id}?dep=${tableId}`;
              return (
                <div
                  key={`${tableId}-${item?.id}`}
                  className={`table-item ${item?.status}`}
                >
                  <div className="holder">
                    <Link
                      href={`/market/${item?.id}?dep=${tableId}`}
                      className="item-image"
                      onContextMenu={preventAdImageContextMenu}
                    >
                      <Image
                        src={
                          item?.image?.secure_url || "/apartment-mockup.avif"
                        }
                        alt={item?.name}
                        fill
                        className="product-image protected-ad-image"
                        draggable={false}
                        onContextMenu={preventAdImageContextMenu}
                      />
                    </Link>

                    <div className="item-details">
                      <Link
                        href={`/market/${item?.id}?dep=${tableId}`}
                        className="item-name"
                      >
                        {item?.title}
                      </Link>
                      <div className="item-location nisted">
                        <Link
                          href={`/market?gov=${item?.governorate?.id}`}
                          className="link"
                        >
                          {item?.governorate?.[`name_${locale}`]} /
                        </Link>

                        <Link
                          href={`/market?city=${item?.city?.id}`}
                          className="link"
                        >
                          {item?.city?.[`name_${locale}`]}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {showOwnerDetails && (
                    <button
                      type="button"
                      className="owner-details"
                      disabled={!ownerInfo?.id || !onOwnerClick}
                      onClick={() => ownerInfo && onOwnerClick(ownerInfo)}
                    >
                      <div className="column">
                        <span className="owner-name">
                          {ownerInfo?.name || "Unknown owner"}
                        </span>
                        <div className="row">
                          <span
                            className={`owner-type ${ownerInfo?.type || ""}`}
                          >
                            {ownerInfo?.type || "unknown"}
                          </span>
                          <span className="owner-phone">
                            {ownerInfo?.phone || "No phone"}
                          </span>
                        </div>
                      </div>
                    </button>
                  )}

                  {screenSize === "small" || screenSize === "ultra-small" ? (
                    <>
                      <div className="item-categories nisted">
                        <Link
                          href={`/market?dep=${item?.department?.id}`}
                          className="link"
                        >
                          {item?.department?.[`name_${locale}`]} /
                        </Link>

                        <Link
                          href={`/market?cat=${item?.category?.id}`}
                          className="link"
                        >
                          {item?.category?.[`name_${locale}`]}
                        </Link>
                      </div>

                      <div className="item-price" style={{ lineHeight: `1.3` }}>
                        {formatCurrency(item?.price, item?.currency, locale)}
                        {rentFrequencyLabel ? ` - ${rentFrequencyLabel}` : ""}
                        {paymentMethodLabel ? ` - ${paymentMethodLabel}` : ""}
                      </div>
                      {!activeAds && !isDashboardPendingView && (
                        <div
                          className="item-price"
                          style={{ lineHeight: `1.3` }}
                        >
                          {formatCurrency(
                            item?.deposit_amount,
                            item?.currency,
                            locale,
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="item-price" style={{ lineHeight: `1.3` }}>
                        {formatCurrency(item?.price, item?.currency, locale)}
                        {rentFrequencyLabel ? ` ${rentFrequencyLabel}` : ""}
                        {isDashboardAdsView && paymentMethodLabel
                          ? ` - ${paymentMethodLabel}`
                          : ""}
                      </div>
                      {!activeAds && !isDashboardPendingView && (
                        <div
                          className="item-price"
                          style={{ lineHeight: `1.3` }}
                        >
                          {formatCurrency(
                            item?.deposit_amount,
                            item?.currency,
                            locale,
                          )}
                        </div>
                      )}

                      <div className="item-categories nisted">
                        <Link
                          href={`/market?dep=${item?.department?.id}`}
                          className="link"
                        >
                          {item?.department?.[`name_${locale}`]} /
                        </Link>

                        <Link
                          href={`/market?cat=${item?.category?.id}`}
                          className="link"
                        >
                          {item?.category?.[`name_${locale}`]}
                        </Link>
                      </div>
                    </>
                  )}

                  <p className="date">
                    {formatRelativeDate(item?.created_at, locale, "detailed")}
                  </p>
                  {activeAds && (
                    <div className="item-overview">
                      <h4>
                        {item?.views_count} <FaEye />
                      </h4>
                      <h4 className="green">
                        {item?.reach_count} <BiSolidPurchaseTagAlt />
                      </h4>
                      <h4 className="love">
                        {item?.favorites_count} <FaHeart />
                      </h4>
                    </div>
                  )}
                  {statusChanger == "favoriet" ? (
                    <div className="specs-holder">
                      {Object.entries(item?.details || {})
                        .filter(([key]) => {
                          const config = getSpecConfig(key);
                          return config?.showInMini;
                        })
                        .map(([key, value]) => {
                          const config = getSpecConfig(key);
                          const Icon = config?.icon;

                          const displayValue =
                            typeof value === "object"
                              ? (value.label ?? value.value)
                              : value;

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
                  ) : (
                    <div className="item-status">
                      {page === "user" && curentStatus.id == "REJECTED" ? (
                        <Link
                          href={editHref}
                          className="pending rejected-status-link"
                        >
                          <span>{curentStatus?.[`name_${locale}`]}</span>
                          <HiExclamation />
                        </Link>
                      ) : (
                        <SelectOptions
                          size="ultra-small"
                          className={"centerd"}
                          options={filteredStatuses}
                          value={curentStatus}
                          disabled={
                            page === "user" && curentStatus.id == "PENDING"
                          }
                          hiddenIco={
                            page === "user" && curentStatus.id == "PENDING"
                          }
                          locale={locale}
                          onChange={(selected) => {
                            if (selected.id == "REJECTED") {
                              setMenuType("reject");
                              setTarget(itemWithTableId);
                            } else {
                              changeStatus(itemWithTableId, selected);
                            }
                          }}
                        />
                      )}
                    </div>
                  )}

                  <div className="actions">
                    <Link href={`/market/${item?.id}?dep=${tableId}`}>
                      <FaEye className="view" />
                    </Link>
                    <hr />
                    {statusChanger !== "favoriet" && (
                      <>
                        <Link
                          href={editHref}
                        >
                          <MdEdit className="edit" />
                        </Link>

                        <hr />
                      </>
                    )}

                    <FaTrashAlt
                      className="delete"
                      onClick={() => {
                        setMenuType("delete");
                        setTarget(itemWithTableId);
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <DynamicMenu
        open={!!menuType}
        title={
          menuType == "delete" ? t.common.confirmDelete : t.common.rejectReason
        }
        onClose={closeMenu}
      >
        <DeleteConfirm
          menuType={menuType}
          rejectInput={rejectInput}
          setRejectInput={setRejectInput}
          onConfirm={confirmDelete}
          onCancel={closeMenu}
          loading={loadingSubmit}
        />
      </DynamicMenu>
    </div>
  );
}
