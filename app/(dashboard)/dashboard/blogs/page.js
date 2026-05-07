"use client";
import Pagination from "@/components/Tools/Pagination";
import useTranslate from "@/Contexts/useTranslation";
import { IoSearchSharp } from "react-icons/io5";
import Image from "next/image";
import "@/styles/dashboard/tables.css";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import React, { useContext, useState, useEffect } from "react";
import { useNotification } from "@/Contexts/NotificationContext";
import { settings } from "@/Contexts/settings";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { TbListSearch } from "react-icons/tb";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import DynamicMenu from "@/components/Tools/DynamicMenu";
import DeleteConfirm from "@/components/Tools/DeleteConfirm";
import {
  deleteBlog,
  getAllBlogs,
  updateBlog,
} from "@/services/blogs/blogs.service";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
export const BlogsStatuses = [
  {
    id: "published",
    name_en: "Published",
    name_ar: "نشط",
    bg: "#E6F9F0",
    tx: "#0F9D58",
  },
  {
    id: "unpublished",
    name_en: "Disabled",
    name_ar: "معطل",
    bg: "#F1F3F4",
    tx: "#5F6368",
  },
];
export default function Blogs() {
  const { screenSize, locale } = useContext(settings);
  const { addNotification } = useNotification();
  const [target, setTarget] = useState(null);
  const [menuType, setMenuType] = useState(null); // form | delete

  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchConfirmed, setSearchConfirmed] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  console.log(selectedStatus);

  const t = useTranslate();
  const [blogs, setBlogs] = useState({
    data: [],
    pagination: {
      page: 1,
      totalPages: 1,
      limit: 6,
      total: 0,
    },
  });
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const fetchBlogs = (page = blogs.pagination.page, search) => {
    getAllBlogs(
      page,
      blogs.pagination.limit,
      selectedStatus?.id || null,
      search !== undefined ? search : searchText,
    )
      .then((res) => {
        setBlogs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoadingContent(false));
  };
  useEffect(() => {
    fetchBlogs(1, searchText);
  }, [selectedStatus]);

  const handlePageChange = (newPage) => {
    fetchBlogs(newPage);
  };
  const handelChangeStatus = async (id, status) => {
    try {
      const res = await updateBlog(id, {
        is_published: status == "published" ? true : false,
      });

      const remainingItems = blogs.data.length - 1;

      // 2️⃣ نقرر الصفحة الجديدة
      const newPage =
        remainingItems === 0 && blogs.pagination.page > 1
          ? blogs.pagination.page - 1
          : blogs.pagination.page;

      // 3️⃣ نعمل fetch بنفس الصفحة والفلاتر
      fetchBlogs(newPage);

      addNotification({
        type: "success",
        message: res?.data?.message,
      });
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong ❌",
      });
    }
  };

  const confirmDelete = () => {
    setLoadingSubmit(true);

    deleteBlog(target)
      .then(() => {
        closeMenu();
        const remainingItems = blogs.data.length - 1;

        // 2️⃣ نقرر الصفحة الجديدة
        const newPage =
          remainingItems === 0 && blogs.pagination.page > 1
            ? blogs.pagination.page - 1
            : blogs.pagination.page;

        // 3️⃣ نعمل fetch بنفس الصفحة والفلاتر
        fetchBlogs(newPage);
      })
      .catch(console.error)
      .finaly(setLoadingSubmit(false));
  };

  const closeMenu = () => {
    setMenuType(null);
    setLoadingSubmit(false);
  };

  return (
    <div className="dash-holder">
      <div className="top two">
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
          options={BlogsStatuses}
          value={selectedStatus}
          locale={locale}
          t={t}
          onChange={(selected) => {
            setSelectedStatus((prev) => (prev == selected ? null : selected));
          }}
        />
      </div>
      <div className="body for-blogs">
        <div className="table-container ">
          <div className="table-header">
            {!screenSize.includes("small") && (
              <>
                <div className="header-item details">
                  {t.dashboard.tables.slide_details}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.created_at}
                </div>
                <div className="header-item">{t.dashboard.tables.reach}</div>

                <div className="header-item">{t.dashboard.tables.status}</div>
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
            {!blogs?.data?.length && !loadingContent ? (
              <div className="no-data-found">
                <TbListSearch />
                <p>you didnt create blogs yet</p>
              </div>
            ) : (
              blogs?.data?.map((item) => {
                let isActive = BlogsStatuses.find(
                  (x) =>
                    x.id === (item?.is_published ? "published" : "unpublished"),
                );
                return (
                  <div key={item?.id} className="table-item">
                    <div className="holder">
                      <Link href={`/`} className="item-image">
                        <Image
                          src={item?.image?.secure_url}
                          alt={item?.title?.[locale]}
                          fill
                          className="product-image"
                        />
                      </Link>
                      <div className="item-details">
                        <h4 className="item-name ellipsis">
                          {item?.[`title_${locale}`]}
                        </h4>
                        <p className="ellipsis two">
                          {item?.[`description_${locale}`]}
                        </p>
                      </div>
                    </div>

                    <p className="date">
                      {formatRelativeDate(item?.created_at, locale, "detailed")}
                    </p>
                    <div className="item-overview">
                      <h4>
                        {item?.views_count} <FaEye />
                      </h4>
                      <h4 className="green">
                        {item?.reach_count} <BiSolidPurchaseTagAlt />
                      </h4>
                    </div>
                    <div className="item-status">
                      <SelectOptions
                        size="ultra-small"
                        className={"centerd"}
                        options={BlogsStatuses}
                        value={isActive}
                        locale={locale}
                        onChange={(selected) => {
                          handelChangeStatus(item?.id, selected.id);
                        }}
                      />
                    </div>
                    <div className="actions">
                      <Link href={`/blogs/${item?.slug}`}>
                        <FaEye className="view" />
                      </Link>
                      <hr />

                      <Link href={`/dashboard/blogs/form?slug=${item?.slug}`}>
                        <MdEdit className="edit" />
                      </Link>
                      <hr />
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
        {blogs?.pagination?.totalPages > 1 && (
          <Pagination
            pageCount={blogs?.pagination.totalPages}
            screenSize={screenSize}
            isDashBoard={true}
            currentPage={blogs?.pagination.page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <DynamicMenu
        open={!!menuType}
        title={"Confirm Delete"}
        onClose={closeMenu}
      >
        <DeleteConfirm
          menuType={"delete"}
          onConfirm={confirmDelete}
          onCancel={closeMenu}
          loading={loadingSubmit}
        />
      </DynamicMenu>
    </div>
  );
}
