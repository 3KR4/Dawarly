"use client";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/tables.css";
import "@/styles/dashboard/globals.css";
import React, { useContext, useEffect, useState } from "react";
import { deleteAd, changeStatus } from "@/services/ads/ads.service";
import { settings } from "@/Contexts/settings";
import AdsTable from "@/components/dashboard/AdsTable";
import { useNotification } from "@/Contexts/NotificationContext";
import Pagination from "@/components/Tools/Pagination";
import { getFavorites, toggleFavorite } from "@/services/favorites/favorites.service";
import Navigations from "@/components/Tools/Navigations";

export default function Favorites() {
  const { screenSize } = useContext(settings);
  const t = useTranslate();
  const { addNotification } = useNotification();
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

  const fetchAds = async (page = 1) => {
    try {
      setLoadingContent(true);

      const res = await getFavorites(page, adsData.pagination.limit);

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
  useEffect(() => {
    fetchAds(1);
  }, []);
  const handlePageChange = (newPage) => {
    fetchAds(newPage);
  };

  const handleFavoriteClick = async (id) => {
    try {
      await toggleFavorite(id);

      const remainingItems = adsData.ads.length - 1;

      // 2️⃣ نقرر الصفحة الجديدة
      const newPage =
        remainingItems === 0 && adsData.pagination.page > 1
          ? adsData.pagination.page - 1
          : adsData.pagination.page;

      // 3️⃣ نعمل fetch بنفس الصفحة والفلاتر
      fetchAds(newPage);
    } catch (err) {
      console.error("toggleFavorite err", err);
      addNotification({
        type: "warning",
        message: err.response?.data?.message || "Something went wrong ❌",
      });
    }
  };

  return (
    <div className="dash-holder for-client fluid-container">
      <Navigations
        items={[{ name: t.home.yourFavoriteList, href: "" }]}
        container="fluid"
      />

      <AdsTable
        ads={adsData?.ads}
        loadingContent={loadingContent}
        removeAd={handleFavoriteClick}
        activeAds={false}
        page={`user`}
        statusChanger={"favoriet"}
      />

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
