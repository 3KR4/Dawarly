"use client";

import Link from "next/link";
import { useState } from "react";
import ar from "@/lang/ar";
import en from "@/lang/en";

export default function NotFound() {
  const [locale] = useState(() => {
    if (typeof window === "undefined") return "ar";
    return localStorage.getItem("locale") || "ar";
  });
  const t = locale === "en" ? en : ar;

  return (
    <div className="error-page container">
      <h1>404</h1>
      <h4>{t.notFound.title}</h4>
      <p>{t.notFound.description}</p>
      <Link href={`/`} className={`main-button`}>
        {t.notFound.backHome}
      </Link>
    </div>
  );
}
