"use client";
import React, { useContext } from "react";
import "@/styles/dashboard/tables.css";
import "@/styles/dashboard/globals.css";
import Link from "next/link";
import Navigations from "@/components/Tools/Navigations";

import { settings } from "@/Contexts/settings";
import { getDashboardBreadcrumb } from "@/utils/getBreadcrumbItems";
import { IoMenu, IoLanguage } from "react-icons/io5";
import { dashboardRoutes } from "@/data";

function Head() {
  const { pathname, searchParams, screenSize, locale, setIsNavOpen } =
    useContext(settings);

  const breadcrumbItems = getDashboardBreadcrumb(
    pathname,
    searchParams,
    locale,
  );

  const mainKey = breadcrumbItems[0]?.key;
  const canCreate = dashboardRoutes[mainKey]?.canCreate;
  console.log(breadcrumbItems);

  return (
    <div className="head">
      <div className="holder">
        {screenSize !== "large" && (
          <IoMenu
            style={{ fontSize: "25px" }}
            onClick={() => {
              setIsNavOpen(true);
            }}
          />
        )}

        <Navigations
          items={breadcrumbItems}
          container="no"
          isDashBoard={true}
        />
      </div>

      {!pathname.includes("/form") && canCreate && (
        <div className="right">
          <Link href={`/dashboard/${mainKey}/form`} className="main-button">
            {locale === "ar" ? "إضافة" : "Create"} {breadcrumbItems[0]?.name}
          </Link>
        </div>
      )}
    </div>
  );
}

export default Head;
