"use client";

import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/forms.css";
import "@/styles/dashboard/tables.css";
import "@/styles/dashboard/pages/all-data.css";

import React, { useContext, useState, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { settings } from "@/Contexts/settings";
import CategoriesSwiper from "@/components/home/Sections/CategoriesSwiper";
import DynamicMenu from "@/components/Tools/DynamicMenu";
import DeleteConfirm from "@/components/Tools/DeleteConfirm";
import { useAppData } from "@/Contexts/DataContext";

import {
  createModel,
  updateModel,
  deleteModel,
} from "@/services/data/data.service";
import { RELATIONS } from "@/data/enums";
import { categoriesEn } from "@/data";

export default function SubCategories() {
  const { locale, menuType, setMenuType } = useContext(settings);
  const t = useTranslate();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [history, setHistory] = useState([]);
  const { setCategories, setSubCategories } = useAppData();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* ================= STEPS ================= */
  const placeholders = {
    categories: {
      en: "e.g. Egypt",
      ar: "مثال: مصر",
    },
    subcategories: {
      en: "e.g. Cairo",
      ar: "مثال: القاهرة",
    },
  };
  const steps = {
    categories: 0,
    subcategories: 1,
  };
  const NEXT_STEP = {
    categories: "subcategories",
  };
  /* ================= HANDLERS ================= */

  const getSetterByType = (type) => {
    switch (type) {
      case "categories":
        return setCategories;
      case "subcategories":
        return setSubCategories;
      default:
        return null;
    }
  };

  const handleSelect = (item) => {
    setHistory((prev) => [...prev, item]);
    setSelectedItem(item);
  };

  const handleBack = () => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, -1);
      const last = newHistory[newHistory.length - 1] || null;
      setSelectedItem(last);
      return newHistory;
    });
  };

  const closeMenu = () => {
    setMenuType(null);
    setSelectedTarget(null);
    reset();
  };

  const nextType = NEXT_STEP[selectedItem?.type];
  const relation = RELATIONS[nextType];

  /* ================= SUBMIT ================= */
  const onSubmit = (data) => {
    if (loading) return;
    setLoading(true);

    const payload = {
      name_ar: data.name_ar,
      name_en: data.name_en,
    };
    if (!selectedItem) {
      payload.type = "VACATION";
    }
    if (relation?.parentKey) {
      payload[relation.parentKey] = selectedItem.item.id;
    }

    if (selectedTarget) {
      updateModel(
        relation?.source || relation || "categories",
        selectedTarget?.id,
        payload,
      )
        .then((res) => {
          const { item: updatedItem } = res.data;

          const setter = getSetterByType(nextType || "categories");

          if (setter) {
            setter((prev) =>
              prev.map((item) =>
                item.id === updatedItem.id ? updatedItem : item,
              ),
            );
          }

          closeMenu();
        })
        .catch((err) => alert(err.response?.data?.message))
        .finally(() => setLoading(false));
    } else {
      createModel(relation?.source || relation || "categories", payload)
        .then((res) => {
          const { item: newItem, parent } = res.data;

          const setter = getSetterByType(nextType || "categories");

          if (setter) {
            setter((prev) => [...prev, newItem]);
          }

          // update parent count in UI
          if (parent) {
            const parentSetter = getSetterByType(selectedItem?.type);
            if (parentSetter) {
              parentSetter((prev) =>
                prev.map((p) => (p.id === parent.id ? parent : p)),
              );
            }
          }

          closeMenu();
        })
        .catch((err) => alert(err.response?.data?.message))
        .finally(() => setLoading(false));
    }
  };;

  const confirmDelete = () => {
    if (!selectedTarget) return;
    setLoading(true);

    deleteModel(nextType || relation || "categories", selectedTarget?.id)
      .then((res) => {
        const { parent } = res.data;

        // ✅ احذف من الليست الصح (الـ children)
        const setter = getSetterByType(nextType || "categories");
        if (setter) {
          setter((prev) =>
            prev.filter((item) => item.id !== selectedTarget.id),
          );
        }

        // ✅ حدث الأب
        if (parent) {
          const parentSetter = getSetterByType(selectedItem?.type);
          if (parentSetter) {
            parentSetter((prev) =>
              prev.map((p) => (p.id === parent.id ? parent : p)),
            );
          }
        }

        closeMenu();
      })
      .catch((err) => alert(err.response?.data?.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    reset({
      name_en: selectedTarget?.name_en || "",
      name_ar: selectedTarget?.name_ar || "",
    });
  }, [selectedTarget, reset]);

  /* ================= RENDER ================= */
  return (
    <div className="dash-holder">
      {/* ================= LEFT SIDE ================= */}
      <div className="body">
        <div className="cats-holder">
          {/* COUNTRIES */}
          {steps[selectedItem?.type] === undefined && (
            <CategoriesSwiper
              dashboard={true}
              type="categories"
              setItem={handleSelect}
              target={selectedItem?.item?.id}
              setTarget={setSelectedTarget}
              handleHistory={handleBack}
            />
          )}

          {/* GOVERNORATES */}
          {(steps[selectedItem?.type] === undefined ||
            steps?.[selectedItem?.type] == 0) && (
            <CategoriesSwiper
              viewType={selectedItem ? "grid" : "swiper"}
              dashboard={true}
              type="subcategories"
              target={selectedItem?.item?.id}
              setTarget={setSelectedTarget}
              setItem={handleSelect}
              handleHistory={handleBack}
            />
          )}
        </div>
      </div>

      {/* ================= FORM ================= */}
      <DynamicMenu
        open={!!menuType}
        title={
          selectedTarget
            ? `${menuType === "delete" ? t.actions.delete : t.actions.edit} ${selectedTarget?.[`name_${locale}`]}`
            : `${t.actions.create} ${nextType || "categories"} ${selectedItem ? `in ${selectedItem.item[`name_${locale}`]}` : ""}`
        }
        onClose={closeMenu}
        backStep={false}
      >
        {menuType === "form" && (
          <form className="builder" onSubmit={handleSubmit(onSubmit)}>
            {/* NAMES */}
            <div className="row-holder">
              <div className="box forInput">
                <label>
                  English Name <span className="required">*</span>
                </label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      {...register("name_en", { required: true })}
                      type="text"
                      placeholder={placeholders?.[nextType || "categories"]?.en}
                    />
                  </div>
                </div>
                {errors.name_en && (
                  <span className="error">
                    <CircleAlert /> Required
                  </span>
                )}
              </div>

              <div className="box forInput">
                <label>
                  Arabic Name <span className="required">*</span>
                </label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      {...register("name_ar", { required: true })}
                      type="text"
                      placeholder={placeholders?.[nextType || "categories"]?.ar}
                    />
                  </div>
                </div>
                {errors.name_ar && (
                  <span className="error">
                    <CircleAlert /> Required
                  </span>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="buttons-holder">
              {selectedTarget && (
                <button
                  type="button"
                  className="main-button danger"
                  onClick={() => setMenuType("delete")}
                >
                  Delete
                </button>
              )}
              <button className="main-button" type="submit" disabled={loading}>
                {loading ? (
                  <span className="loader"></span>
                ) : selectedTarget ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        )}

        {menuType === "delete" && (
          <DeleteConfirm
            menuType="delete"
            message="This item will be permanently deleted."
            onConfirm={confirmDelete}
            onCancel={() => setMenuType("form")}
            loading={loading}
          />
        )}
      </DynamicMenu>
    </div>
  );
}
