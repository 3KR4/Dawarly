"use client";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/tables.css";
import React, { useContext, useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import { settings } from "@/Contexts/settings";
import UsersTable from "@/components/dashboard/UsersTable";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { useNotification } from "@/Contexts/NotificationContext";
import Pagination from "@/components/Tools/Pagination";
import { IoCloseSharp } from "react-icons/io5";
import { Permissions, UserTypes } from "@/data/enums";
import { useAuth } from "@/Contexts/AuthContext";
import { deleteUser, getAllUsers } from "@/services/auth/auth.service";

export default function ActiveAds() {
  const { locale, screenSize } = useContext(settings);
  const t = useTranslate();
  const { addNotification } = useNotification();
  const { loading } = useAuth();

  const [users, setUsers] = useState({
    users: [],
    pagination: {
      page: 1,
      totalPages: 1,
      limit: 12,
      total: 0,
    },
  });

  const [loadingContent, setLoadingContent] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false); // تتحكم بالـ active class
  const [searchConfirmed, setSearchConfirmed] = useState(false); // هل ضغط البحث؟
  const [selectedType, setSelectedType] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // ================= FETCH ADS =================
  const fetchUsers = async (
    page = users.pagination.page,
    search = searchText,
  ) => {
    try {
      setLoadingContent(true);

      // تحويل القيم
      const userTypeId = selectedType?.id || ""; // لو مفيش حاجة، يبقى فاضي
      const permissionsStr = selectedPermissions?.length
        ? selectedPermissions.map((p) => p.id).join(",")
        : "";

      const res = await getAllUsers(
        search,
        userTypeId,
        permissionsStr,
        page || 1,
        users.pagination.limit || 12,
      );

      setUsers({
        users: res.data.users || [], // صححت المفتاح
        pagination: res.data.pagination || users.pagination,
      });
    } catch (err) {
      console.error(err);
      addNotification({
        type: "warning",
        message: err.response.data.message || "Failed to fetch users from server ❌",
      });
    } finally {
      setLoadingContent(false);
    }
  };

  // ================= INITIAL FETCH =================
  useEffect(() => {
    if (!loading) {
      fetchUsers(1);
    }
  }, [loading, selectedType, selectedPermissions]);
  // ================= HANDLERS =================

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      addNotification({
        type: "success",
        message: "User deleted successfully ✅",
      });

      // 1️⃣ نحسب كم عنصر باقي بعد الحذف
      const remainingItems = users?.users?.length - 1;

      // 2️⃣ نقرر الصفحة الجديدة
      const newPage =
        remainingItems === 0 && users.pagination.page > 1
          ? users.pagination.page - 1
          : users.pagination.page;

      // 3️⃣ نعمل fetch بنفس الصفحة والفلاتر
      fetchUsers(newPage);
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong ❌",
      });
    }
  };

  return (
    <div className="dash-holder">
      {/* ================= TOP FILTERS ================= */}
      <div className="top">
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
                fetchUsers(1, "");
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
                fetchUsers(1);
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
          options={UserTypes}
          value={selectedType}
          onChange={(selected) => {
            setSelectedType((prev) => (prev == selected ? null : selected));
          }}
        />
        <SelectOptions
          size="small"
          placeholder={t.ad.status.label}
          options={Permissions}
          value={selectedPermissions.length ? selectedPermissions : null} // مصفوفة العناصر المختارة
          multi={true}
          onChange={(selected) => {
            setSelectedPermissions((prev) => {
              if (prev?.find((item) => item.id === selected.id)) {
                return prev.filter((item) => item.id !== selected.id);
              } else {
                return [...prev, selected];
              }
            });
          }}
        />
      </div>

      {/* ================= ADS TABLE ================= */}
      <UsersTable
        users={users?.users}
        loadingContent={loadingContent}
        removeUser={handleDeleteUser}
        limit={users?.pagination.limit}
      />

      {/* ================= PAGINATION ================= */}
      {users?.pagination?.totalPages > 1 && (
        <Pagination
          pageCount={users?.pagination.totalPages}
          screenSize={screenSize}
          isDashBoard={true}
          currentPage={users?.pagination.page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
