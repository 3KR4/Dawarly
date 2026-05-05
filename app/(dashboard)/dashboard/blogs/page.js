"use client";
import Pagination from "@/components/Tools/Pagination";
import useTranslate from "@/Contexts/useTranslation";

import Image from "next/image";
import "@/styles/dashboard/tables.css";
import { FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import React, { useContext, useState, useEffect } from "react";
import { useNotification } from "@/Contexts/NotificationContext";

import { settings } from "@/Contexts/settings";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { TbListSearch } from "react-icons/tb";
import {
  deleteSlider,
  getAllSliders,
  updateSlider,
} from "@/services/sliders/sliders.service";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import DynamicMenu from "@/components/Tools/DynamicMenu";
import DeleteConfirm from "@/components/Tools/DeleteConfirm";
import {
  deleteBlog,
  getAllSBlogs,
  updateBlog,
} from "@/services/blogs/blogs.service";
export const BlogsStatuses = [
  {
    id: true,
    name_en: "Published",
    name_ar: "نشط",
    bg: "#E6F9F0",
    tx: "#0F9D58",
  },
  {
    id: false,
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

  const t = useTranslate();
  const [blogs, setBlogs] = useState({
    data: [],
    pagination: {
      page: 1,
      totalPages: 1,
      limit: 7,
      total: 0,
    },
  });
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const fetchBlogs = (page = blogs.pagination.page) => {
    getAllSBlogs(page, blogs.pagination.limit, null)
      .then((res) => {
        setBlogs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoadingContent(false));
  };
  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePageChange = (newPage) => {
    fetchBlogs(newPage);
  };
  const handelChangeStatus = async (id, status) => {
    try {
      const res = await updateBlog(id, {
        is_published: status,
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
      <div className="body">
        <div className="table-container blogs-page">
          <div className="table-header">
            {!screenSize.includes("small") && (
              <>
                <div className="header-item details">
                  {t.dashboard.tables.slide_details}
                </div>
                <div className="header-item">{t.dashboard.tables.link}</div>
                <div className="header-item">
                  {t.dashboard.tables.created_at}
                </div>
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
                  (x) => x.id == item?.is_published,
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
                        <h4 className="item-name">
                          {item?.[`title_${locale}`]}
                        </h4>
                        <p className="ellipsis two">
                          {item?.[`description_${locale}`]}
                        </p>
                      </div>
                    </div>
                    <Link href={item?.link || "/"} className="item-link">
                      {item?.link || "https://dawaarly.com/"}
                    </Link>{" "}
                    <p className="date">
                      {formatRelativeDate(item?.created_at, locale, "detailed")}
                    </p>
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
                      <Link href={`/dashboard/sliders/form?id=${item?.id}`}>
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
