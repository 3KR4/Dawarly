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
  const { setTables, setCategories, setSubCategories } = useAppData();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const placeholders = {
    categories: {
      en: "e.g. Apartment",
      ar: "مثال: شقة",
    },
    subcategories: {
      en: "e.g. Penthouse",
      ar: "مثال: بنتهاوس",
    },
  };

  const steps = {
    tables: -1,
    categories: 0,
    subcategories: 1,
  };

  const NEXT_STEP = {
    tables: "categories",
    categories: "subcategories",
  };

  const getSetterByType = (type) => {
    switch (type) {
      case "tables":
        return setTables;
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

  const currentType = NEXT_STEP[selectedItem?.type] || "categories";
  const relation = RELATIONS[currentType];
  const canCreateAtCurrentLevel =
    selectedItem?.type === "tables" || selectedItem?.type === "categories";

  const onSubmit = (data) => {
    if (loading) return;

    if (!selectedTarget && !canCreateAtCurrentLevel) {
      alert("Please select a table first to create a category.");
      return;
    }

    setLoading(true);

    const payload = {
      name_ar: data.name_ar,
      name_en: data.name_en,
    };

    if (relation?.parentKey && selectedItem?.item?.id) {
      payload[relation.parentKey] = selectedItem.item.id;
    }

    const model = relation?.source || "categories";
    const setter = getSetterByType(currentType);

    if (selectedTarget) {
      updateModel(model, selectedTarget.id, payload)
        .then((res) => {
          const { item: updatedItem, parent } = res.data;

          if (setter) {
            setter((prev) =>
              prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
            );
          }

          if (parent) {
            const parentSetter = getSetterByType(selectedItem?.type);
            if (parentSetter) {
              parentSetter((prev) =>
                prev.map((item) => (item.id === parent.id ? parent : item)),
              );
            }
          }

          closeMenu();
        })
        .catch((err) => alert(err.response?.data?.message))
        .finally(() => setLoading(false));

      return;
    }

    createModel(model, payload)
      .then((res) => {
        const { item: newItem, parent } = res.data;

        if (setter) {
          setter((prev) => [...prev, newItem]);
        }

        if (parent) {
          const parentSetter = getSetterByType(selectedItem?.type);
          if (parentSetter) {
            parentSetter((prev) =>
              prev.map((item) => (item.id === parent.id ? parent : item)),
            );
          }
        }

        closeMenu();
      })
      .catch((err) => alert(err.response?.data?.message))
      .finally(() => setLoading(false));
  };

  const confirmDelete = () => {
    if (!selectedTarget) return;
    setLoading(true);

    const model = relation?.source || "categories";
    const setter = getSetterByType(currentType);

    deleteModel(model, selectedTarget.id)
      .then((res) => {
        const { parent } = res.data;

        if (setter) {
          setter((prev) => prev.filter((item) => item.id !== selectedTarget.id));
        }

        if (parent) {
          const parentSetter = getSetterByType(selectedItem?.type);
          if (parentSetter) {
            parentSetter((prev) =>
              prev.map((item) => (item.id === parent.id ? parent : item)),
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

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="cats-holder">
          {steps[selectedItem?.type] === undefined && (
            <CategoriesSwiper
              dashboard={true}
              type="tables"
              setItem={handleSelect}
              target={selectedItem?.item?.id}
              setTarget={setSelectedTarget}
              handleHistory={handleBack}
            />
          )}

          {(steps[selectedItem?.type] === undefined ||
            steps[selectedItem?.type] === 0) && (
            <CategoriesSwiper
              dashboard={true}
              type="categories"
              setItem={handleSelect}
              target={selectedItem?.item?.id}
              setTarget={setSelectedTarget}
              handleHistory={handleBack}
            />
          )}

          {(steps[selectedItem?.type] === undefined ||
            steps[selectedItem?.type] === 1) && (
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

      <DynamicMenu
        open={!!menuType}
        title={
          selectedTarget
            ? `${menuType === "delete" ? t.actions.delete : t.actions.edit} ${selectedTarget?.[`name_${locale}`]}`
            : `${t.actions.create} ${currentType} ${selectedItem ? `in ${selectedItem.item[`name_${locale}`]}` : ""}`
        }
        onClose={closeMenu}
        backStep={false}
      >
        {menuType === "form" &&
          (!selectedTarget && !canCreateAtCurrentLevel ? (
            <div className="builder">
              <div className="row-holder">
                <div className="box">
                  <label>Selection Required</label>
                  <p>
                    Please select a table to create a category, or select a
                    category to create a subcategory.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form className="builder" onSubmit={handleSubmit(onSubmit)}>
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
                        placeholder={placeholders?.[currentType]?.en}
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
                        placeholder={placeholders?.[currentType]?.ar}
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
          ))}

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
