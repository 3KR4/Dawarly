"use client";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import React, { useContext } from "react";
import { formatEGP } from "@/utils/formatCurrency";
import { settings } from "@/Contexts/settings";
import "@/styles/client/ad-card.css";
import { formatRelativeDate } from "@/utils/formatRelativeDate";

export default function CardItem({ data, type }) {
  const { locale } = useContext(settings);

  return (
    <div key={data?.id} className={`ad-card ${type}`}>
      <div className="image-holder">
        <Image fill src={data?.images[0]} alt={data?.title} />
        {/* <div className="top">
          <div className="info">
            <span className={`category`}>{data?.sub_category.name}</span>
            <span className={`status`}>{data?.status}</span>
            <span className={`condition`}>{data?.condition}</span>
          </div>
          {data?.id == 102 ? <FaHeart className="active" /> : <FaRegHeart />}
        </div> */}
      </div>
      <div className="body">
        <div className="row-holder">
          <h4 className="ellipsis">{data?.title}</h4>
          <span className={`category`}>{data?.sub_category.name}</span>
        </div>
        <div className="row-holder">
          <h3>{formatEGP(data?.price, locale)}</h3>
          <span className={`status`}>{data?.status}</span>
          <span className={`condition`}>{data?.condition}</span>
        </div>
      </div>
      <div className="date-area">
        <p className="area">
          {data?.area.governorate}, {data?.area.city}
        </p>
        <p className="date">
          {formatRelativeDate(data?.creation_date, locale)}
        </p>
      </div>
    </div>
  );
}
