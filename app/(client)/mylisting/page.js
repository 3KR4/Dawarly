"use client";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/tables.css";
import "@/styles/dashboard/globals.css";
import React, { useContext, useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import {
  getAllAds,
  deleteAd,
  userAds,
  changeStatus,
} from "@/services/ads/ads.service";
import { settings } from "@/Contexts/settings";
import AdsTable from "@/components/dashboard/AdsTable";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { useNotification } from "@/Contexts/NotificationContext";
import Pagination from "@/components/Tools/Pagination";
import { IoCloseSharp } from "react-icons/io5";
import { AdStatuses } from "@/data/enums";
import { useAuth } from "@/Contexts/AuthContext";
import Link from "next/link";

export default function MyAdsListing() {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const { addNotification } = useNotification();
  const { user, loading } = useAuth();
  // 🌟 State واحدة للإعلانات + Pagination
  const [adsData, setAdsData] = useState({
    ads: [],
    pagination: {
      page: 1,
      totalPages: 1,
      limit: 10,
      total: 0,
    },
  });

  const [loadingContent, setLoadingContent] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false); // تتحكم بالـ active class
  const [searchConfirmed, setSearchConfirmed] = useState(false); // هل ضغط البحث؟
  const [selectedStatus, setSelectedStatus] = useState(null);

  // ================= FETCH ADS =================
  const fetchAds = async (page = 1, search) => {
    try {
      setLoadingContent(true);

      const res = await userAds(
        user.id,
        selectedStatus?.id ? selectedStatus.id : undefined,
        search !== undefined ? search : searchText,
        page,
        adsData.pagination.limit,
      );

      setAdsData({
        ads: res.data.data || [],
        pagination: res.data.pagination || adsData.pagination,
      });
    } catch (err) {
      console.error(err);
      addNotification({
        type: "warning",
        message: "Failed to fetch ads from server ❌",
      });
    } finally {
      setLoadingContent(false);
    }
  };

  // ================= INITIAL FETCH =================
  useEffect(() => {
    if (!loading) {
      fetchAds(1);
    }
  }, [loading, selectedStatus]);
  // ================= HANDLERS =================

  const handlePageChange = (newPage) => {
    fetchAds(newPage);
  };

  const handelChangeStatus = async (id, status) => {
    console.log("status:", status);

    try {
      const res = await changeStatus(id, { status: status.id });

      addNotification({
        type: "success",
        message: res?.data?.message,
      });

      const remainingItems = adsData.ads.length - 1;

      // 2️⃣ نقرر الصفحة الجديدة
      const newPage =
        remainingItems === 0 && adsData.pagination.page > 1
          ? adsData.pagination.page - 1
          : adsData.pagination.page;

      // 3️⃣ نعمل fetch بنفس الصفحة والفلاتر
      fetchAds(newPage);
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong ❌",
      });
    }
  };

  const handleDeleteAd = async (id) => {
    try {
      await deleteAd(id);
      addNotification({
        type: "success",
        message: "Ad deleted successfully ✅",
      });

      // 1️⃣ نحسب كم عنصر باقي بعد الحذف
      const remainingItems = adsData.ads.length - 1;

      // 2️⃣ نقرر الصفحة الجديدة
      const newPage =
        remainingItems === 0 && adsData.pagination.page > 1
          ? adsData.pagination.page - 1
          : adsData.pagination.page;

      // 3️⃣ نعمل fetch بنفس الصفحة والفلاتر
      fetchAds(newPage);
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong ❌",
      });
    }
  };

  return (
    <div className="dash-holder for-client fluid-container">
      {/* Top filters */}

      <div className="top ">
        {/* 🔍 Search */}
        <div className="filters-header">
          <input
            type="text"
            placeholder={t.placeholders.search}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchActive(!!e.target.value); // أي نص => active
              setSearchConfirmed(false); // الكتابة الجديدة تلغي التأكيد
            }}
          />

          {searchConfirmed ? (
            <span
              style={{ display: "flex", cursor: "pointer" }}
              className="filters-count delete"
              onClick={() => {
                setSearchText("");
                setSearchActive(false);
                setSearchConfirmed(false);
                fetchAds(1, "");
              }}
            >
              <IoCloseSharp style={{ padding: "7px" }} />
            </span>
          ) : (
            // 🔍 Search عادي
            <span
              style={{
                display: "flex",
                cursor: searchActive ? "pointer" : "default",
              }}
              className={`filters-count ${searchActive ? "active" : ""}`}
              onClick={() => {
                if (searchText) setSearchConfirmed(true); // اضغط بحث => يتحول لـ X
                fetchAds(1);
              }}
            >
              <IoSearchSharp style={{ padding: "7px" }} />
            </span>
          )}
        </div>

        {/* 🎯 Status Filter */}
        <SelectOptions
          size="small"
          placeholder={t.ad.status.label}
          options={AdStatuses}
          value={selectedStatus}
          locale={locale}
          t={t}
          onChange={(selected) => {
            setSelectedStatus((prev) => (prev == selected ? null : selected));
          }}
        />

        {/* ⚙️ Filters UI */}
        <div className="filters-header">
          {t.actions.filterations}
          <span className="filters-count" style={{ display: "flex" }}>
            <LuSettings2 />
          </span>
        </div>
        <Link
          href="/mylisting/createAd"
          className="main-button"
          style={{ height: "35px" }}
        >
          {t.ad.create_ad}
        </Link>
      </div>

      {/* ================= ADS TABLE ================= */}
      <AdsTable
        ads={adsData?.ads}
        loadingContent={loadingContent}
        removeAd={handleDeleteAd}
        changeStatus={handelChangeStatus}
        activeAds={false}
        page={`user`}
        statusChanger={"client"}
      />

      {/* ================= PAGINATION ================= */}
      {adsData?.pagination?.totalPages > 1 && (
        <Pagination
          pageCount={adsData?.pagination.totalPages}
          screenSize={screenSize}
          isDashBoard={true}
          currentPage={adsData?.pagination.page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
