"use client";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/tables.css";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import { getAllAds, deleteAd, changeStatus } from "@/services/ads/ads.service";
import { settings } from "@/Contexts/settings";
import AdsTable from "@/components/dashboard/AdsTable";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { useNotification } from "@/Contexts/NotificationContext";
import Pagination from "@/components/Tools/Pagination";
import { IoCloseSharp } from "react-icons/io5";
import { AdStatuses } from "@/data/enums";
import { useAuth } from "@/Contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function ActiveAds() {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const { addNotification } = useNotification();
  const { loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ownerFilterId = searchParams.get("user");
  const ownerFilterType = searchParams.get("user_type");
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
  const [searchActive, setSearchActive] = useState(false);
  const [searchConfirmed, setSearchConfirmed] = useState(false);
  const statusFromUrl = searchParams.get("status");

  const [selectedStatus, setSelectedStatus] = useState(
    AdStatuses.find((status) => status.id === statusFromUrl) || null,
  );
  const statusOptions = AdStatuses.filter((status) => status.id !== "PENDING");

  const fetchAds = useCallback(
    async (page = 1, search) => {
      try {
        setLoadingContent(true);

        const res = await getAllAds({
          scope: "dashboard",
          page,
          limit: adsData.pagination.limit,
          status: selectedStatus?.id || null,
          exclude_status: selectedStatus || ownerFilterId ? null : "PENDING",
          user: ownerFilterId || null,
          user_type: ownerFilterType || null,
          search: search !== undefined ? search : searchText,
        });

        setAdsData((prev) => ({
          ads: res.data.data || [],
          pagination: res.data.pagination || prev.pagination,
        }));
      } catch (err) {
        console.error(err);
        addNotification({
          type: "warning",
          message: "Failed to fetch ads from server ❌",
        });
      } finally {
        setLoadingContent(false);
      }
    },
    [
      addNotification,
      adsData.pagination.limit,
      ownerFilterId,
      ownerFilterType,
      searchText,
      selectedStatus,
    ],
  );

  useEffect(() => {
    if (!loading) {
      fetchAds(1);
    }
  }, [fetchAds, loading]);

  const handlePageChange = (newPage) => {
    fetchAds(newPage);
  };
  const handleOwnerClick = (owner) => {
    if (!owner?.id) return;

    setSelectedStatus(null);
    setSearchText("");
    setSearchActive(false);
    setSearchConfirmed(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("user", owner.id);
    params.set("user_type", owner.type);

    router.push(`/dashboard/ads/all?${params.toString()}`);
  };
  const handelChangeStatus = async (ad, status) => {
    try {
      const res = await changeStatus(ad.table_id, ad.id, { status: status.id });

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
        message: error.response?.data?.message || t.common.somethingWentWrong,
      });
    }
  };
  const handleDeleteAd = async (ad) => {
    try {
      await deleteAd(ad.table_id, ad.id);
      addNotification({
        type: "success",
        message: "Ad deleted successfully ✅",
      });

      const remainingItems = adsData.ads.length - 1;

      const newPage =
        remainingItems === 0 && adsData.pagination.page > 1
          ? adsData.pagination.page - 1
          : adsData.pagination.page;

      fetchAds(newPage);
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || t.common.somethingWentWrong,
      });
    }
  };

  return (
    <div className="dash-holder">
      <div className="top">
        <div className="filters-header">
          <input
            type="text"
            placeholder={t.placeholders.search}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchActive(!!e.target.value);
              setSearchConfirmed(false);
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
            <span
              style={{
                display: "flex",
                cursor: searchActive ? "pointer" : "default",
              }}
              className={`filters-count ${searchActive ? "active" : ""}`}
              onClick={() => {
                if (searchText) setSearchConfirmed(true);
                fetchAds(1);
              }}
            >
              <IoSearchSharp style={{ padding: "7px" }} />
            </span>
          )}
        </div>

        <SelectOptions
          size="small"
          placeholder={t.ad.status.label}
          options={statusOptions}
          value={selectedStatus}
          locale={locale}
          t={t}
          onChange={(selected) => {
            setSelectedStatus((prev) => (prev == selected ? null : selected));
          }}
        />

        <div className="filters-header">
          {t.actions.filterations}
          <span className="filters-count" style={{ display: "flex" }}>
            <LuSettings2 />
          </span>
        </div>
      </div>

      {/* ================= ADS TABLE ================= */}
      <AdsTable
        ads={adsData?.ads}
        loadingContent={loadingContent}
        removeAd={handleDeleteAd}
        changeStatus={handelChangeStatus}
        activeAds={true}
        statusChanger={"admin"}
        showOwnerDetails={true}
        onOwnerClick={handleOwnerClick}
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
