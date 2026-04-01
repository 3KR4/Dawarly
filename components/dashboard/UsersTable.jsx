"use client";
import React, { useContext, useMemo } from "react";
import { settings } from "@/Contexts/settings";
import useTranslate from "@/Contexts/useTranslation";
import { TbListSearch } from "react-icons/tb";
import { FaTrashAlt } from "react-icons/fa";
import { Permissions, UserTypes } from "@/data/enums";
import Link from "next/link";
import { FaCrown } from "react-icons/fa6";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { MdEdit } from "react-icons/md";

export default function UsersTable({
  users = [],
  loadingContent,
  removeUser,
  page = "dashboard",
}) {
  const { screenSize, locale } = useContext(settings);
  const t = useTranslate();

  // ✅ Map بدل find (Performance)
  const permissionsMap = useMemo(() => {
    return Permissions.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }, []);

  const userTypesMap = useMemo(() => {
    return UserTypes.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }, []);

  return (
    <div
      className={`body ${page === "user" ? "fluid-container for-user" : ""}`}
    >
      <div className="table-container for-users">
        {/* ================= HEADER ================= */}
        <div className="table-header">
          {!screenSize.includes("small") && (
            <>
              <div className="header-item details">User</div>
              <div className="header-item">Phone</div>
              <div className="header-item">email</div>
              <div className="header-item">Permissions</div>
              <div className="header-item">active Ads</div>
              <div className="header-item">join at</div>
              <div className="header-item">Actions</div>
            </>
          )}
        </div>

        {/* ================= BODY ================= */}
        <div
          className="table-items"
          style={{
            position: "relative",
            opacity: loadingContent ? "0.6" : "1",
          }}
        >
          {/* 🔄 Loading */}
          {loadingContent && (
            <div className="loading-content">
              <span className="loader"></span>
            </div>
          )}

          {/* ❌ No Data */}
          {!users?.length && !loadingContent ? (
            <div className="no-data-found">
              <TbListSearch />
              <p>No users found</p>
            </div>
          ) : (
            users.map((user) => {
              const type = userTypesMap[user.user_type];
              const isSuper = user.is_super_admin;

              return (
                <div key={user.id} className="table-item">
                  <div className="holder">
                    <div className="item-details">
                      <div
                        className="name-letters"
                        style={{ background: type?.bg, color: type?.tx }}
                      >
                        {user.full_name
                          ?.split(" ")
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("")}
                      </div>
                      <div className="right">
                        <Link href={`/`} className="item-name">
                          {user.full_name}
                        </Link>
                        <div className="item-categories">
                          <span
                            style={{
                              color: type?.tx,
                              fontSize: "13px",
                              fontWeight: "800",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px", // مسافة بسيطة بين النص والأيقونة
                                fontWeight: 600,
                                color: type?.tx, // أخضر لو سوبر أدمن، أو لون النوع العادي
                              }}
                            >
                              {isSuper && <FaCrown />}

                              {(() => {
                                if (user.is_super_admin) {
                                  return locale === "en"
                                    ? "Super Admin"
                                    : "مسؤول عام";
                                }

                                const label =
                                  type?.[`name_${locale}`] || user.user_type;

                                if (
                                  locale === "en" &&
                                  label?.length > 1 &&
                                  label.endsWith("s")
                                ) {
                                  return label.slice(0, -1);
                                }

                                return label;
                              })()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 📱 Phone */}
                  <div className="item-price">{user.phone}</div>
                  <div className="item-price">{user.email}</div>

                  {/* 🔐 Permissions */}
                  <div
                    className="item-categories nisted"
                    style={{ gap: `3px 4px` }}
                  >
                    {type.id === "SUBUSER" ? (
                      <span style={{color: type?.tx}}>{user.subscription_ads_limit} active ads</span>
                    ) : user.permissions?.length ? (
                      <>
                        {user.permissions.slice(0, 4).map((p, index) => {
                          const permission = permissionsMap[p];
                          const name = permission?.[`name_${locale}`] || p;

                          return (
                            <span key={p}>
                              {name}
                              {index <
                                Math.min(3, user.permissions.length - 1) &&
                                " / "}
                            </span>
                          );
                        })}

                        {user.permissions.length > 4 && (
                          <span
                            style={{ cursor: "pointer" }}
                            title={user.permissions
                              .slice(4)
                              .map(
                                (p) =>
                                  permissionsMap[p]?.[`name_${locale}`] || p,
                              )
                              .join(" / ")}
                          >
                            {" / "}+{user.permissions.length - 4} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </div>

                  {/* 📊 Active Ads */}
                  <div className="item-overview onlyOne">
                    <h4 style={{ background: type?.bg, color: type?.tx }}>
                      {user.active_ads_count > 0 ? user.active_ads_count : "-"}
                    </h4>
                  </div>
                  <p className="date">
                    {formatRelativeDate(user?.created_at, locale, "detailed")}
                  </p>
                  {/* ⚙️ Actions */}
                  <div className="actions">
                    <Link
                      href={
                        page == "dashboard"
                          ? `/dashboard/users/form?id=${user?.id}`
                          : `/mylisting/form/${user?.id}`
                      }
                    >
                      <MdEdit className="edit" />
                    </Link>

                    <hr />
                    <FaTrashAlt
                      className="delete"
                      onClick={() => removeUser(user.id)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
