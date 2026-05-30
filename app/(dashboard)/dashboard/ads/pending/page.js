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

  // ================= FETCH ADS =================
  const fetchAds = useCallback(
    async (page = 1) => {
      try {
        setLoadingContent(true);

        const res = await getAllAds({
          scope: "dashboard",
          page,
          limit: adsData.pagination.limit,
          status: "PENDING",
          user: ownerFilterId || null,
          user_type: ownerFilterType || null,
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
    [addNotification, adsData.pagination.limit, ownerFilterId, ownerFilterType],
  );

  // ================= INITIAL FETCH =================
  useEffect(() => {
    if (!loading) {
      fetchAds(1);
    }
  }, [fetchAds, loading]);
  // ================= HANDLERS =================
  const handleDeleteAd = async (ad) => {
    try {
      await deleteAd(ad.table_id, ad.id);

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
  const handelChangeStatus = async (ad, status, reason) => {
    try {
      await changeStatus(ad.table_id, ad.id, { status: status.id, reason });

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

  const handlePageChange = (newPage) => {
    fetchAds(newPage);
  };
  const handleOwnerClick = (owner) => {
    if (!owner?.id) return;

    const params = new URLSearchParams();
    params.set("user", owner.id);
    params.set("user_type", owner.type);

    router.push(`/dashboard/ads/all?${params.toString()}`);
  };

  return (
    <div className="dash-holder">
      {/* ================= ADS TABLE ================= */}
      <AdsTable
        ads={adsData?.ads}
        loadingContent={loadingContent}
        removeAd={handleDeleteAd}
        changeStatus={handelChangeStatus}
        activeAds={false}
        statusChanger={"aprover"}
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

// <AdsTable
//   activeAds={true}
//   statusChanger={"admin"}

// />

// <AdsTable
//   changeStatus={handelChangeStatus}
//   activeAds={false}
//   statusChanger={"client"}
// />

// <AdsTable
//   changeStatus={handelChangeStatus}
//   activeAds={false}
//   statusChanger={"admin"}
// />;
