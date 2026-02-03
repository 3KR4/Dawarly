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
  const [openCatId, setOpenCatId] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const wrapperRef = useRef(null);

  // إضافة SubCategory
  const handleAddSub = (categoryId) => {
    if (!inputValue.trim()) return;

    const newSub = { id: Date.now(), name: inputValue.trim(), categoryId };
    setSubCat((prev) => [...prev, newSub]);
    setInputValue("");
    setOpenCatId(null);
  };

  // تعديل SubCategory
  const handleEditSub = () => {
    if (!inputValue.trim() || inputValue === editingSub.name) return;

    setSubCat((prev) =>
      prev.map((item) =>
        item.id === editingSub.id ? { ...item, name: inputValue } : item,
      ),
    );
    setEditingSub(null);
    setInputValue("");
    setOpenCatId(null);
  };

  // حذف SubCategory
  const handleDeleteSub = () => {
    if (!editingSub) return;
    setSubCat((prev) => prev.filter((item) => item.id !== editingSub.id));
    setEditingSub(null);
    setInputValue("");
    setOpenCatId(null);
  };

  // Detect click outside لإغلاق الـ Input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpenCatId(null);
        setEditingSub(null);
        setInputValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reusable Input Component
  const SubInput = ({ categoryId, autoFocus = true }) => {
    const isDelete = editingSub && inputValue.trim() === "";

    return (
      <div className="input-holder">
        <input
          autoFocus={autoFocus}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            editingSub ? "edit sub category" : "enter new sub category"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (editingSub) {
                if (isDelete) handleDeleteSub();
                else handleEditSub();
              } else handleAddSub(categoryId);
            }
            if (e.key === "Escape") {
              setOpenCatId(null);
              setEditingSub(null);
              setInputValue("");
            }
          }}
        />
        <span
          className={
            editingSub
              ? (inputValue === editingSub.name && !isDelete) ||
                (!inputValue.trim() && !isDelete)
                ? "disabled"
                : ""
              : !inputValue.trim()
                ? "disabled"
                : ""
          }
          onClick={() => {
            if (editingSub) {
              if (isDelete) handleDeleteSub();
              else handleEditSub();
            } else handleAddSub(categoryId);
          }}
        >
          {isDelete
            ? t.actions.delete
            : editingSub
              ? t.actions.edit
              : t.actions.add}
        </span>
      </div>
    );
  };

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
                {subCat
                  .filter((x) => x.categoryId === cat.id)
                  .map((sub) => (
                    <React.Fragment key={sub.id}>
                      {editingSub?.id !== sub.id ? (
                        <li
                          onClick={() => {
                            setEditingSub(sub);
                            setOpenCatId(sub.categoryId);
                            setInputValue(sub.name);
                          }}
                        >
                          {sub.name} <MdEdit />
                        </li>
                      ) : (
                        <SubInput categoryId={cat.id} />
                      )}
                    </React.Fragment>
                  ))}

                {/* Input للإضافة الجديدة تحت القائمة */}
                {openCatId === cat.id && !editingSub && (
                  <SubInput categoryId={cat.id} />
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
