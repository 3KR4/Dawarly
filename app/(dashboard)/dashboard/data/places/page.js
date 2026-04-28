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

export default function SubCategories() {
  const { locale, menuType, setMenuType } = useContext(settings);
  const t = useTranslate();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [history, setHistory] = useState([]);
  const {
    setCountries,
    setGovernorates,
    setCities,
    setAreas,
    setCompounds,
  } = useAppData();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* ================= STEPS ================= */
const placeholders = {
  countries: {
    en: "e.g. Egypt",
    ar: "مثال: مصر",
  },
  governorates: {
    en: "e.g. Cairo",
    ar: "مثال: القاهرة",
  },
  cities: {
    en: "e.g. Nasr City",
    ar: "مثال: مدينة نصر",
  },
  areas: {
    en: "e.g. Heliopolis",
    ar: "مثال: مصر الجديدة",
  },
  compounds: {
    en: "e.g. Palm Hills",
    ar: "مثال: بالم هيلز",
  },
};
  const steps = {
    countries: 0,
    governorates: 1,
    cities: 2,
    areas: 3,
    compounds: 4,
  };
  const NEXT_STEP = {
    countries: "governorates",
    governorates: "cities",
    cities: "areas",
    areas: "compounds",
  };
  /* ================= HANDLERS ================= */

  const getSetterByType = (type) => {
    switch (type) {
      case "countries":
        return setCountries;
      case "governorates":
        return setGovernorates;
      case "cities":
        return setCities;
      case "areas":
        return setAreas;
      case "compounds":
        return setCompounds;
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
    setSelectedTarget(null)
    reset()
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

    if (relation?.parentKey) {
      payload[relation.parentKey] = selectedItem.item.id;
    }

    if (relation?.parentKey2 && history.length > 1) {
      payload[relation?.parentKey2] = history[history.length - 2]?.item?.id;
    }

    if (selectedTarget) {
      updateModel(
        relation?.source || relation || "countries",
        selectedTarget?.id,
        payload,
      )
        .then((res) => {
          const { item: updatedItem } = res.data;

          const setter = getSetterByType(nextType || "countries");

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
      createModel(relation?.source || relation || "countries", payload)
        .then((res) => {
          const { item: newItem, parent } = res.data;

          const setter = getSetterByType(nextType || "countries");

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
  };

const confirmDelete = () => {
  if (!selectedTarget) return;
  setLoading(true);

  deleteModel(nextType || relation || "countries", selectedTarget?.id)
    .then((res) => {
      const { parent } = res.data;

      // ✅ احذف من الليست الصح (الـ children)
      const setter = getSetterByType(nextType || "countries");
      if (setter) {
        setter((prev) => prev.filter((item) => item.id !== selectedTarget.id));
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
              type="countries"
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
              type="governorates"
              target={selectedItem?.item?.id}
              setTarget={setSelectedTarget}
              setItem={handleSelect}
              handleHistory={handleBack}
            />
          )}

          {(steps[selectedItem?.type] === undefined ||
            steps?.[selectedItem?.type] == 1) && (
            <CategoriesSwiper
              viewType={selectedItem ? "grid" : "swiper"}
              dashboard={true}
              type={`cities`}
              target={selectedItem?.item?.id}
              setTarget={setSelectedTarget}
              setItem={handleSelect}
              handleHistory={handleBack}
            />
          )}

          {(steps[selectedItem?.type] === undefined ||
            steps?.[selectedItem?.type] == 2) && (
            <CategoriesSwiper
              viewType={selectedItem ? "grid" : "swiper"}
              dashboard={true}
              type={`areas`}
              target={selectedItem?.item?.id}
              setTarget={setSelectedTarget}
              setItem={handleSelect}
              handleHistory={handleBack}
            />
          )}

          {(steps[selectedItem?.type] === undefined ||
            steps?.[selectedItem?.type] == 3) && (
            <CategoriesSwiper
              viewType={selectedItem ? "grid" : "swiper"}
              dashboard={true}
              type={`compounds`}
              setItem={handleSelect}
              target={selectedItem?.item?.id}
              setTarget={setSelectedTarget}
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
            : `${t.actions.create} ${nextType || "countries"} ${selectedItem ? `in ${selectedItem.item[`name_${locale}`]}` : ""}`
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
                      placeholder={placeholders?.[nextType || "countries"]?.en}
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
                      placeholder={placeholders?.[nextType || "countries"]?.ar}
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
