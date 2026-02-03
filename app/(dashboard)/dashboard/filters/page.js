"use client";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/tables.css";
import "@/styles/dashboard/pages/categories.css";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import React, { useContext, useState, useEffect, useRef } from "react";
import {
  subcategoriesAr,
  subcategoriesEn,
  categoriesEn,
  categoriesAr,
} from "@/data";
import { settings } from "@/Contexts/settings";

export default function SubCategories() {
  const { locale } = useContext(settings);
  const t = useTranslate();

  const [catat, setCat] = useState([]);
  const [subCat, setSubCat] = useState([]);

  useEffect(() => {
    setCat(locale === "en" ? categoriesEn : categoriesAr);
    setSubCat(locale === "en" ? subcategoriesEn : subcategoriesAr);
  }, [locale]);

  // حالة Input
  const [activFilters, setActivFilters] = useState(null);

  return (
    <div className="dash-holder" ref={wrapperRef}>
      <div className="body">
        <div className="cats-holder">
          {catat?.map((cat) => (
            <div key={cat.id} className="cat-body">
              <h4
                onClick={() => {
                  setOpenCatId(cat.id);
                  setEditingSub(null);
                  setInputValue("");
                }}
              >
                {cat.name} <FaPlus />
              </h4>
              <ul>
                {subCat.map((sub) => (
                  <li
                    onClick={() => {
                      setEditingSub(sub);
                      setOpenCatId(sub.categoryId);
                      setInputValue(sub.name);
                    }}
                  >
                    {sub.name} <MdEdit />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="dynamic-menu">
        <div className="forFilters">
          <h4>xxxx filter</h4>

        </div>
      </div>
    </div>
  );
}
