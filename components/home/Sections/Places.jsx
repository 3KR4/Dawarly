"use client";
import React from "react";
import Link from "next/link";

import { products } from "@/data";
import AdsCard from "@/components/home/AdsCard";

function Places() {
  return (
    <div className="places">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          top attractions
          <hr />
        </h1>
        <p className="sub-title">
          Step into history and explore Egypt’s most breathtaking landmarks —
          from ancient wonders to timeless treasures.
        </p>
        <Link href={`/market`} className="main-button">
          See More
        </Link>
      </div>

      <div className="grid-holder container">
        {products.map((x) => (
          <AdsCard key={x.id} item={x} type="product" />
        ))}
      </div>
    </div>
  );
}

export default Places;
