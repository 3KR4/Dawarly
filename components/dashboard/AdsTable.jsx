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
import React, { useContext, useState, useEffect } from "react";
import { specsConfig } from "@/Contexts/specsConfig";

import { settings } from "@/Contexts/settings";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { useNotification } from "@/Contexts/NotificationContext";
import { deleteAd } from "@/services/ads/ads.service";
import { TbListSearch } from "react-icons/tb";
import { AdStatuses, RentFrequencies } from "@/data/enums";
import DeleteConfirm from "@/components/Tools/DeleteConfirm";
import DynamicMenu from "@/components/Tools/DynamicMenu";

export default function AdsTable({
  ads,
  loadingContent,
  activeAds,
  removeAd,
  changeStatus,
  page = "dashboard",
  statusChanger = "admin",
}) {
  const { screenSize, locale } = useContext(settings);
  const t = useTranslate();
  const { addNotification } = useNotification();
  const [menuType, setMenuType] = useState(null); // form | delete
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [target, setTarget] = useState(null);
  const [rejectInput, setRejectInput] = useState("");

  const filteredStatuses = AdStatuses.filter((status) =>
    statusChanger == "client"
      ? status.id == "ACTIVE" || status.id == "DISABLED"
      : statusChanger == "admin"
        ? status.id !== "PENDING" && status.id !== "REJECTED"
        : status.id === "ACTIVE" || status.id === "REJECTED",
  );
  const getSpecConfig = (key) => specsConfig[key];

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
        .finaly(setLoadingSubmit(false));
    }
  };

  return (
    <div className={`body ${page == "user" ? "fluid-container for-user" : ""}`}>
      <div
        className={`table-container products ${!activeAds ? "pending-ads" : ""}`}
      >
        <div className="table-header">
          {!screenSize.includes("small") && (
            <>
              <div className="header-item details">
                {t.dashboard.tables.ad_details}
              </div>
              <div className="header-item">{t.ad.rentPrice}</div>
              {!activeAds && (
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
              return (
                <div key={item?.id} className={`table-item ${item?.status}`}>
                  <div className="holder">
                    <Link href={`/`} className="item-image">
                      <Image
                        src={
                          item?.images?.[0]?.secure_url ||
                          "/apartment-mockup.avif"
                        }
                        alt={item?.name}
                        fill
                        className="product-image"
                      />
                    </Link>

                    <div className="item-details">
                      <Link href={`/market/${item?.id}`} className="item-name">
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

                  {screenSize === "small" || screenSize === "ultra-small" ? (
                    <>
                      <div className="item-categories nisted">
                        <Link
                          href={`/market?cat=${item?.Categories?.id}`}
                          className="link"
                        >
                          {item?.Categories?.[`name_${locale}`]} /
                        </Link>

                        <Link
                          href={`/market?subcat=${item?.SubCategories?.id}`}
                          className="link"
                        >
                          {item?.SubCategories?.[`name_${locale}`]}
                        </Link>
                      </div>

                      <div className="item-price" style={{ lineHeight: `1.3` }}>
                        {formatCurrency(item?.price, item?.currency, locale)}
                      </div>
                      {!activeAds && (
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
                        {formatCurrency(item?.price, item?.currency, locale)}{" "}
                        {
                          RentFrequencies?.find(
                            (x) => x.id == item?.rent_frequency,
                          )?.[`name_${locale}`]
                        }
                      </div>
                      {!activeAds && (
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
                          href={`/market?cat=${item?.Categories?.id}`}
                          className="link"
                        >
                          {item?.Categories?.[`name_${locale}`]} /
                        </Link>

                        <Link
                          href={`/market?subcat=${item?.SubCategories?.id}`}
                          className="link"
                        >
                          {item?.SubCategories?.[`name_${locale}`]}
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
                            setTarget(item?.id);
                          } else {
                            changeStatus(item?.id, selected);
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="actions">
                    <Link href={`/market/${item?.id}`}>
                      <FaEye className="view" />
                    </Link>
                    <hr />
                    {statusChanger !== "favoriet" && (
                      <>
                        <Link
                          href={
                            page == "dashboard"
                              ? `/dashboard/ads/form?id=${item?.id}`
                              : `/mylisting/form/${item?.id}`
                          }
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
                        setTarget(item?.id);
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
        title={menuType == "delete" ? "Confirm Delete" : "reject reason"}
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
