"use client";

import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/forms.css";
import "@/styles/dashboard/tables.css";
import "@/styles/dashboard/pages/categories.css";

import React, { useContext, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CircleAlert } from "lucide-react";

import { useForm } from "react-hook-form";

import { categoriesEn, categoriesAr } from "@/data";
import { settings } from "@/Contexts/settings";

import DynamicMenu from "@/components/Tools/DynamicMenu";
import DeleteConfirm from "@/components/Tools/DeleteConfirm";

import {
  getAllSubCats,
  getOneSubCat,
  createSubCat,
  updateSubCat,
  updateSubCatLang,
  deleteSubCat,
} from "@/services/subCategories/subCats.service";

export default function SubCategories() {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* ================= STATES ================= */

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [mode, setMode] = useState(null); // create | edit
  const [menuType, setMenuType] = useState(null); // form | delete

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editingSub, setEditingSub] = useState(null);

  const [curentCreateLocale, setCurentCreateLocale] = useState("en");

  const [translations, setTranslations] = useState({ en: "", ar: "" });
  const [originalData, setOriginalData] = useState(null);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    setCategories(locale === "en" ? categoriesEn : categoriesAr);

    getAllSubCats(locale)
      .then((res) => {
        setSubCategories(res.data.data);
      })
      .catch(console.error);
  }, [locale]);

  /* ================= HANDLERS ================= */

  const handleCreateClick = (catId) => {
    setMode("create");
    setMenuType("form");
    setSelectedCategoryId(catId);
    setEditingSub(null);
    setTranslations({ en: "", ar: "" });
    setOriginalData(null);
    setCurentCreateLocale("en");
    reset({ key: "" });
  };

  const handleEditClick = (sub) => {
    setMode("edit");
    setMenuType("form");
    setEditingSub(sub);
    setCurentCreateLocale("en");

    getOneSubCat(sub.id, locale)
      .then((res) => {
        const data = res.data.data;

        setTranslations({
          en: data.translations.en || "",
          ar: data.translations.ar || "",
        });

        setOriginalData({
          key: data.key,
          translations: data.translations,
        });

        reset({ key: data.key });
      })
      .catch(console.error);
  };

  const openDeleteConfirm = () => {
    setMenuType("delete");
  };

  const closeMenu = () => {
    setMode(null);
    setMenuType(null);
    setEditingSub(null);
    setSelectedCategoryId(null);
    setTranslations({ en: "", ar: "" });
    setOriginalData(null);
  };

  /* ================= SUBMIT ================= */

  const onSubmit = (data) => {
    if (loading) return; // تمنع الضغط المتكرر

    setLoading(true);

    if (mode === "create") {
      const payload = {
        key: data.key,
        categoryName: selectedCategoryId.toString(),
        translations: [
          { lang: "en", name: translations.en },
          { lang: "ar", name: translations.ar },
        ],
      };

      createSubCat(payload)
        .then((res) => {
          const newSub = {
            ...res.data.data,
            name: res.data.data.translations?.find((x) => x.lang === locale)
              ?.name,
          };

          setSubCategories((prev) => [...prev, newSub]);
          closeMenu();
        })
        .catch((err) => alert(err.response?.data?.mes))
        .finally(() => setLoading(false));
    }

    if (mode === "edit") {
      if (!originalData) {
        setLoading(false);
        return;
      }

      const requests = [];

      if (data.key !== originalData.key) {
        requests.push(updateSubCat(editingSub.id, { key: data.key }));
      }

      ["en", "ar"].forEach((lng) => {
        if (translations[lng] !== originalData.translations[lng]) {
          requests.push(
            updateSubCatLang(editingSub.id, {
              lang: lng,
              name: translations[lng],
            }),
          );
        }
      });

      Promise.all(requests)
        .then(() => {
          setSubCategories((prev) =>
            prev.map((item) =>
              item.id === editingSub.id
                ? {
                    ...item,
                    key: data.key,
                    name: translations[locale],
                  }
                : item,
            ),
          );

          closeMenu();
        })
        .catch((err) => alert(err.response?.data?.mes))
        .finally(() => setLoading(false));
    }
  };

  const confirmDelete = () => {
    if (!editingSub) return;
    setLoading(true);
    deleteSubCat(editingSub.id)
      .then(() => {
        setSubCategories((prev) =>
          prev.filter((item) => item.id !== editingSub.id),
        );
        closeMenu();
        setLoading(false);
      })
      .catch(console.error);
  };

  /* ================= RENDER ================= */

  return (
    <div className="dash-holder">
      {/* ================= LEFT SIDE ================= */}
      <div className="body">
        <div className="cats-holder">
          {categories.map((cat) => (
            <div key={cat.id} className="cat-body">
              <h4 onClick={() => handleCreateClick(cat.id)}>
                {cat.name} <FaPlus />
              </h4>

              <ul>
                {subCategories
                  ?.filter((x) => x.categoryName == cat.id)
                  ?.map((sub) => (
                    <li key={sub.id} onClick={() => handleEditClick(sub)}>
                      {sub.name || "."} <MdEdit />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DYNAMIC MENU ================= */}

      <DynamicMenu
        open={!!menuType}
        title={
          menuType === "delete"
            ? "Confirm Delete"
            : mode === "create"
              ? "Create Sub Category"
              : "Edit Sub Category"
        }
        onClose={closeMenu}
      >
        {/* ===== FORM ===== */}
        {menuType === "form" && (
          <>
            {/* LANGUAGE SWITCH */}
            <div className="lang-switch">
              {["en", "ar"].map((lng) => (
                <button
                  key={lng}
                  type="button"
                  className={curentCreateLocale === lng ? "active" : ""}
                  onClick={() => setCurentCreateLocale(lng)}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>

            <form className="builder" onSubmit={handleSubmit(onSubmit)}>
              {/* KEY */}
              <div className="box forInput">
                <label>
                  Key <span className="required">*</span>
                </label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      type="text"
                      placeholder="property_type"
                      {...register("key", { required: "Key is required" })}
                    />
                  </div>
                </div>
                {errors.key && (
                  <span className="error">
                    <CircleAlert /> {errors.key.message}
                  </span>
                )}
              </div>

              {/* NAME */}
              <div className="box forInput">
                <label>
                  Name ({curentCreateLocale.toUpperCase()}){" "}
                  <span className="required">*</span>
                </label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      type="text"
                      placeholder={
                        curentCreateLocale === "en"
                          ? "Houses for Sale"
                          : "بيوت للبيع"
                      }
                      value={translations[curentCreateLocale]}
                      onChange={(e) =>
                        setTranslations((prev) => ({
                          ...prev,
                          [curentCreateLocale]: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="buttons-holder">
                {mode === "edit" && (
                  <button
                    type="button"
                    className="main-button danger"
                    onClick={openDeleteConfirm}
                  >
                    Delete
                  </button>
                )}

                <button
                  className="main-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span class="loader"></span>
                  ) : mode === "create" ? (
                    "Create"
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ===== DELETE CONFIRM ===== */}
        {menuType === "delete" && (
          <DeleteConfirm
            message="This sub category will be permanently deleted."
            onConfirm={confirmDelete}
            onCancel={() => setMenuType("form")}
            loading={loading}
          />
        )}
      </DynamicMenu>
    </div>
  );
}
