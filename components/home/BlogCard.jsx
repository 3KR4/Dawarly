"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import { settings } from "@/Contexts/settings";
import "@/styles/client/ad-card.css";
import { formatRelativeDate } from "@/utils/formatRelativeDate";

import { FaEye } from "react-icons/fa";
import { IoBook } from "react-icons/io5";

export default function BlogCard({ data, size = "large" }) {
  const { locale } = useContext(settings);

  return (
    <Link
      href={`/blogs/${data?.slug}`}
      className={`blog-card ${size}`}
      key={data.id}
    >
      <div className="image">
        <Image
          className="main-img"
          fill
          src={data?.image?.secure_url}
          alt={data?.[`title_${locale}`]}
        />
      </div>

      <div className="holder">
        <h3 className={`${size == "small" ? "ellipsis" : ""}`}>
          {data?.[`title_${locale}`]}
        </h3>
        <p className={`${size == "small" ? "ellipsis two" : ""}`}>
          {data?.[`description_${locale}`]}
        </p>
        <div className="bottom">
          <span className="time">
            {formatRelativeDate(data?.created_at, locale)}
          </span>
          <div className="row">
            <span sName="views">
              <FaEye />
              {data?.views_count} views
            </span>
            {size !== "small" && (
              <span className="reading">
                <IoBook />
                {data?.reading_time} minute reading time
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
