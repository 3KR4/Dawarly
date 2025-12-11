"use client";
import Image from "next/image";
import Link from "next/link";

import React, { useContext } from "react";

import { settings } from "@/Contexts/settings";

export default function CardItem({ item, type }) {
  const { screenSize } = useContext(settings);

  return (
    <div key={item?._id} className={`ads-card ${type}`}>
      ads-card
    </div>
  );
}
