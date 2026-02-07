"use client";

import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/forms.css";
import "@/styles/dashboard/tables.css";
import "@/styles/dashboard/pages/filters.css";

import React, { useContext, useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { CircleAlert } from "lucide-react";
import { TiPlus } from "react-icons/ti";
import { IoIosClose, IoMdRadioButtonOn } from "react-icons/io";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { RxComponentBoolean } from "react-icons/rx";

import { settings } from "@/Contexts/settings";
import { specsConfig } from "@/Contexts/specsConfig";

import DynamicMenu from "@/components/Tools/DynamicMenu";
import DeleteConfirm from "@/components/Tools/DeleteConfirm";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";

import {
  getAllFilter,
  getOneFilter,
  createFilter,
  updateFilter,
  updateFilterLang,
  deleteFilter,
  createOption,
  updateOption,
  updateOptionLang,
  deleteOption,
} from "@/services/filters/filters.service";
import { FaBarsStaggered } from "react-icons/fa6";
import CatCard from "@/components/home/CatCard";

export default function FiltersPage() {

  
  const { locale } = useContext(settings);
  const t = useTranslate();

  const [filters, setFilters] = useState([]);
  console.log(filters);

    const STEPS = {
    CATEGORIES: 1,
    SUB_CATEGORIES: 2,
    FORM: 3,

  };
    const [step, setStep] = useState(STEPS.CATEGORIES);

      const [category, setCategory] = useState();
  const titles = {
    [STEPS.CATEGORIES]: t.ad.choose_category,
    [STEPS.SUB_CATEGORIES]: t.ad.choose_sub_category,
    [STEPS.FORM]: t.ad.filter_form,
  };

  const descriptions = {
    [STEPS.CATEGORIES]: t.ad.choose_category_description,
    [STEPS.SUB_CATEGORIES]: t.ad.choose_sub_category_description,
    [STEPS.FORM]: t.ad.filter_form_description,

  };


  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState(null); // create | edit
  const [menuType, setMenuType] = useState(null); // form | delete
  const [editingFilter, setEditingFilter] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      key: "",
      type: "",
      label: "",
      options: [],
    },
  });

  const uiType = watch("type");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  /* ================= EFFECTS ================= */

  useEffect(() => {
    getAllFilter(locale)
      .then((res) => setFilters(res.data.data))
      .catch(console.error);
  }, [locale]);

  /* ================= HANDLERS ================= */

  const openCreate = () => {
    setMode("create");
    setMenuType("form");
    setEditingFilter(null);
    setOriginalData(null);
    reset({
      key: "",
      type: "",
      label: "",
      options: [],
    });
  };

  const openEdit = (filter) => {
    setMode("edit");
    setMenuType("form");
    setEditingFilter(filter);

    getOneFilter(filter.id, locale).then((res) => {
      const data = res.data.data;

      reset({
        key: data.key,
        type: data.type,
        label: data.translations?.label || "",
        options:
          data.options?.map((o) => ({
            id: o.id,
            value: o.value,
            label: o.translations?.label || "",
          })) || [],
      });

      setOriginalData(data);
    });
  };

  const closeMenu = () => {
    setMenuType(null);
    setMode(null);
    setEditingFilter(null);
    setOriginalData(null);
    reset();
  };

  /* ================= SUBMIT ================= */

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      /* ===== CREATE ===== */
      if (mode === "create") {
        const payload = {
          key: data.key,
          type: data.type,
          required: true,
          filterable: true,
          translations: [
            { lang: "en", label: data.label },
            { lang: "ar", label: data.label },
          ],
        };

        const res = await createFilter(payload);
        const filterId = res.data.data.id;

        if (data.type !== "input") {
          for (const opt of data.options) {
            await createOption(filterId, {
              value: opt.value,
              translations: [
                { lang: "en", label: opt.label },
                { lang: "ar", label: opt.label },
              ],
            });
          }
        }

        setFilters((prev) => [...prev, res.data.data]);
        closeMenu();
      }

      /* ===== EDIT ===== */
      if (mode === "edit") {
        if (data.key !== originalData.key || data.type !== originalData.type) {
          await updateFilter(editingFilter.id, {
            key: data.key,
            type: data.type,
          });
        }

        if (data.label !== originalData.translations?.label) {
          await updateFilterLang(editingFilter.id, {
            label: data.label,
          });
        }

        for (const opt of data.options) {
          if (!opt.id) {
            await createOption(editingFilter.id, {
              value: opt.value,
              translations: [
                { lang: "en", label: opt.label },
                { lang: "ar", label: opt.label },
              ],
            });
          } else {
            await updateOption(opt.id, { value: opt.value });
            await updateOptionLang(opt.id, { label: opt.label });
          }
        }

        setFilters((prev) =>
          prev.map((f) =>
            f.id === editingFilter.id
              ? { ...f, key: data.key, label: data.label }
              : f,
          ),
        );

        closeMenu();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    setLoading(true);
    deleteFilter(editingFilter.id)
      .then(() => {
        setFilters((prev) => prev.filter((f) => f.id !== editingFilter.id));
        closeMenu();
      })
      .finally(() => setLoading(false));
  };

  /* ================= RENDER ================= */

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="filters-holder">
          <button className="main-button" onClick={openCreate}>
            <TiPlus /> Create Filter
          </button>

{Object.entries(filters || {}).map(([subCategoryName, filtersList]) => (
  <div key={subCategoryName} className="sub-category-group">
    <h3 className="sub-category-title">{subCategoryName}</h3>

    {filtersList.map((filt) => {
      const Icon = specsConfig[filt.key]?.icon;

      return (
        <div key={filt.id} className="filter-body">
          {Icon && <Icon />}
          <h4>{filt.label}</h4>

          <div className="row">
            <li>
              uiType:{" "}
              <span>
                {filt.type}{" "}
                {filt.type === "select" ? (
                  <FaBarsStaggered />
                ) : filt.type === "boolean" ? (
                  <RxComponentBoolean />
                ) : (
                  <IoMdRadioButtonOn />
                )}
              </span>
            </li>

            <li>
              required:{" "}
              <span>{filt.required ? "required" : "optional"}</span>
            </li>
          </div>

          <li>
            <span>
              contained in {filtersList.length} sub categories
            </span>
          </li>

          <div
            className="edit-filter-btn"
            onClick={() => openEdit(filt)}
          >
            <MdEdit /> Edit
          </div>
        </div>
      );
    })}
  </div>
))}

        </div>
      </div>

      {/* ================= DYNAMIC MENU ================= */}

      <DynamicMenu
        open={!!menuType}
        title={}
        descriptions={}
        onClose={closeMenu}
      >
        {menuType === "form" && (
          <>
                  <div className="steps-holder">
          {Object.values(STEPS).map((stepItem, index, arr) => (
            <div className="step-wrapper" key={stepItem}>
              <div
                className={`step 
                  ${step > stepItem ? "done" : ""} 
                  ${step === stepItem ? "current" : ""}
                `}
              >
                {stepItem}
              </div>
              {index !== arr.length - 1 && <span className="bar"></span>}
            </div>
          ))}
        </div>
        {step === STEPS.CATEGORIES && (
          <div className="options-grid">
            {categories.map((cat) => (
              <CatCard
                key={cat?.id}
                data={cat}
                position={`when-create-ad`}
                type={`cat`}
                activeClass={cat?.id == category}
                onSelect={() => {
                  setCategory(cat?.id);
                  setStep(STEPS.SUB_CATEGORIES);
                }}
              />
            ))}
          </div>
        )}

        {/* ================= SUB_CATEGORIES STEP 2 ================= */}
        {step === STEPS.SUB_CATEGORIES && (
          <div className="options-grid verfiyMethod">
            {subcategories
              ?.filter((x) => x?.categoryId == category)
              ?.map((subCat) => (
                <CatCard
                  key={subCat?.id}
                  data={subCat}
                  position={`when-create-ad`}
                  type={`sub-cat`}
                  activeClass={subCat?.id == subCategory}
                  onSelect={() => {
                    setSubCategory(subCat?.id);
                    setStep(STEPS.BASICS);
                  }}
                />
              ))}
          </div>
        )}
        {step === STEPS.FORM && (

          <form className="builder" onSubmit={handleSubmit(onSubmit)}>
            {/* KEY */}
            <div className="box forInput">
              <label>Key</label>
              <div className="inputHolder">
                <div className="holder">
                  <input {...register("key", { required: true })} />
                </div>
              </div>
              {errors.key && (
                <span className="error">
                  <CircleAlert /> Key is required
                </span>
              )}
            </div>

            {/* LABEL */}
            <div className="box forInput">
              <label>Label</label>
              <div className="inputHolder">
                <div className="holder">
                  <input {...register("label", { required: true })} />
                </div>
              </div>
            </div>

            {/* TYPE */}
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <SelectOptions
                  label="UI Type"
                  options={["input", "select", "radio", "boolean"]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* OPTIONS */}
            {uiType !== "input" && (
              <div className="options">
                <button
                  type="button"
                  className="edit-filter-btn"
                  onClick={() => append({ value: "", label: "" })}
                >
                  <TiPlus /> Add Option
                </button>

                {fields.map((field, index) => (
                  <div key={field.id} className="box forInput">
                    <div className="inputHolder">
                      <input {...register(`options.${index}.label`)} />
                      <input {...register(`options.${index}.value`)} />
                      <IoIosClose onClick={() => remove(index)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="buttons-holder">
              {mode === "edit" && (
                <button
                  type="button"
                  className="main-button danger"
                  onClick={() => setMenuType("delete")}
                >
                  Delete
                </button>
              )}

              <button className="main-button" disabled={loading}>
                {loading ? <span className="loader" /> : "Save"}
              </button>
            </div>
          </form>
        )}

          </>
        )}

        {menuType === "delete" && (
          <DeleteConfirm
            message="This filter will be permanently deleted."
            loading={loading}
            onCancel={() => setMenuType("form")}
            onConfirm={confirmDelete}
          />
        )}
      </DynamicMenu>
    </div>
  );
}
