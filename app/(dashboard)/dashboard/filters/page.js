"use client";

import React, { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { IoIosClose } from "react-icons/io";
import { CircleAlert } from "lucide-react";
import { RxComponentBoolean } from "react-icons/rx";
import { IoMdRadioButtonOn } from "react-icons/io";

import DynamicMenu from "@/components/Tools/DynamicMenu";
import DeleteConfirm from "@/components/Tools/DeleteConfirm";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import CatCard from "@/components/home/CatCard";

import { settings } from "@/Contexts/settings";
import useTranslate from "@/Contexts/useTranslation";
import { specsConfig } from "@/Contexts/specsConfig";
import { categoriesEn, categoriesAr } from "@/data";
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
  getFilterOptions,
} from "@/services/filters/filters.service";
import { getAllSubCats } from "@/services/subCategories/subCats.service";
import { FaBarsStaggered } from "react-icons/fa6";

import "@/styles/client/forms.css";
import "@/styles/dashboard/forms.css";
import "@/styles/dashboard/pages/filters.css";

export default function FiltersPage() {
  const { locale, setOnCreate } = useContext(settings);
  const t = useTranslate();

  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  console.log(subCategory);

  const STEPS = { CATEGORIES: 1, SUB_CATEGORIES: 2, FORM: 3 };
  const [step, setStep] = useState(STEPS.CATEGORIES);

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

  const [mode, setMode] = useState(null); // create | edit
  const [menuType, setMenuType] = useState(null); // form | delete
  const [editingFilter, setEditingFilter] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [curentCreateLocale, setCurentCreateLocale] = useState(locale);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      key: "",
      type: "",
      label: { en: "", ar: "" },
      required: true,
      filterable: true,
      options: [{ value: "", translations: { en: "", ar: "" } }],
    },
  });

  const uiType = watch("type");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const options = useWatch({
    control,
    name: "options",
    defaultValue: [],
  });

  useEffect(() => {
    setCategories(locale === "en" ? categoriesEn : categoriesAr);
    getAllSubCats(locale)
      .then((res) => setSubCategories(res.data.data))
      .catch(console.error);
    getAllFilter(locale)
      .then((res) => setFilters(res.data.data))
      .catch(console.error);
  }, [locale]);

  useEffect(() => {
    setOnCreate(() => openCreate);

    return () => setOnCreate(null); // cleanup مهم
  }, []);

  const openCreate = () => {
    setMode("create");
    setMenuType("form");
    setEditingFilter(null);
    setOriginalData(null);
    setStep(STEPS.CATEGORIES);
    reset({
      key: "",
      type: "",
      label: { en: "", ar: "" },
      required: true,
      filterable: true,
      options: [{ value: "", translations: { en: "", ar: "" } }],
    });
  };

  const openEdit = async (filter) => {
    setMode("edit");
    setMenuType("form");
    setStep(STEPS.FORM);
    setEditingFilter(filter);

    try {
      /* ===== 1. GET FILTER ===== */
      const filterRes = await getOneFilter(filter.id);
      const data = filterRes.data.data;
      console.log("data", data);

      /* ===== 2. BUILD LABEL TRANSLATIONS ===== */
      const labelTranslations = { en: "", ar: "" };
      data.translations?.forEach((t) => {
        labelTranslations[t.lang] = t.label;
      });
      console.log("labelTranslations", labelTranslations);

      /* ===== 3. GET OPTIONS (EN & AR) ===== */
      const [optionsEn, optionsAr] = await Promise.all([
        getFilterOptions(filter.id, "en"),
        getFilterOptions(filter.id, "ar"),
      ]);

      /* ===== 4. MERGE OPTIONS ===== */
      const optionsMap = {};

      optionsEn.data.data.forEach((opt) => {
        optionsMap[opt.id] = {
          id: opt.id,
          value: opt.value,
          translations: { en: opt.label, ar: "" },
        };
      });

      optionsAr.data.data.forEach((opt) => {
        if (!optionsMap[opt.id]) {
          optionsMap[opt.id] = {
            id: opt.id,
            value: opt.value,
            translations: { en: "", ar: opt.label },
          };
        } else {
          optionsMap[opt.id].translations.ar = opt.label;
        }
      });

      const mergedOptions = Object.values(optionsMap);

      console.log("mergedOptions", mergedOptions);

      /* ===== 5. RESET FORM ===== */
      reset({
        key: data.key,
        type: { value: data.type, label: data.type },
        label: labelTranslations,
        required: data.required,
        filterable: data.filterable,
        options:
          mergedOptions.length > 0
            ? mergedOptions
            : [{ value: "", translations: { en: "", ar: "" } }],
      });

      setOriginalData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const closeMenu = () => {
    setMenuType(null);
    setMode(null);
    setEditingFilter(null);
    setOriginalData(null);
    reset();
    setStep(STEPS.CATEGORIES);
    setCategory(null);
    setSubCategory(null);
  };

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      /* ===== CREATE ===== */
      if (mode === "create") {
        const payload = {
          key: data.key,
          type: data.type.value, // أو data.type حسب SelectOptions
          required: data.required,
          filterable: data.filterable,
          translations: [
            { lang: "en", label: data.label.en },
            { lang: "ar", label: data.label.ar },
          ],
          options:
            data.type.value !== "input"
              ? data.options.map((opt) => ({
                  value: opt.value,
                  translations: [
                    { lang: "en", label: opt.translations.en },
                    { lang: "ar", label: opt.translations.ar },
                  ],
                }))
              : [],
        };

        const res = await createFilter(subCategory, payload);

        setFilters((prev) => {
          const updated = { ...prev };
          if (!updated[subCategory]) updated[subCategory] = [];
          updated[subCategory].push(res.data.data);
          return updated;
        });

        closeMenu();
      }
      /* ===== EDIT ===== */
      if (mode === "edit") {
        await updateFilter(editingFilter.id, {
          key: data.key,
          type: data.type,
          required: data.required,
          filterable: data.filterable,
        });

        const transId = editingFilter.translations.find(
          (t) => t.lang === curentCreateLocale,
        ).id;
        await updateFilterLang(transId, {
          label: data.label[curentCreateLocale],
        });

        for (const opt of data.options) {
          if (!opt.id) {
            await createOption(editingFilter.id, {
              value: opt.value,
              translations: [
                { lang: "en", label: opt.translations.en },
                { lang: "ar", label: opt.translations.ar },
              ],
            });
          } else {
            await updateOption(opt.id, { value: opt.value });
            const optTransId = opt.translations?.find(
              (t) => t.lang === curentCreateLocale,
            )?.id;
            if (optTransId)
              await updateOptionLang(optTransId, {
                label: opt.translations[curentCreateLocale],
              });
          }
        }

        setFilters((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((subCat) => {
            updated[subCat] = updated[subCat].map((f) =>
              f.id === editingFilter.id
                ? { ...f, key: data.key, label: data.label[curentCreateLocale] }
                : f,
            );
          });
          return updated;
        });
        closeMenu();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteFilter(editingFilter.id);
      setFilters((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((subCat) => {
          updated[subCat] = updated[subCat].filter(
            (f) => f.id !== editingFilter.id,
          );
        });
        return updated;
      });
      closeMenu();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="dash-holder for-filters">
      <div className="body">
        <div className="filters-holder">
          {Object.entries(filters).map(([subCat, filtersList]) => (
            <div key={subCat} className="sub-category-group">
              <h3 className="sub-category-title">{subCat}</h3>
              {filtersList.map((filt) => {
                const Icon = specsConfig[filt.key]?.icon;
                return (
                  <div key={filt.key} className="filter-body">
                    {Icon && <Icon />}
                    <div className="top-data">
                      <h4>{filt.label}</h4>
                      <div
                        className="edit-filter-btn"
                        onClick={() => openEdit(filt)}
                      >
                        <MdEdit /> Edit
                      </div>
                    </div>

                    <div className="row">
                      <li>
                        required:{" "}
                        <span>{filt.required ? "required" : "optional"}</span>
                      </li>
                      <li>
                        filterable:{" "}
                        <span>{filt.filterable ? "true" : "false"}</span>
                      </li>
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
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <DynamicMenu
        open={!!menuType}
        title={titles[step]}
        descriptions={descriptions[step]}
        onClose={closeMenu}
        step={step}
        setStep={setStep}
      >
        {menuType === "form" && (
          <>
            {/* Steps Holder */}
            {mode !== "edit" && (
              <div className="steps-holder">
                {Object.values(STEPS).map((s, i, arr) => (
                  <div key={s} className="step-wrapper">
                    <div
                      className={`step ${step > s ? "done" : ""} ${
                        step === s ? "current" : ""
                      }`}
                    >
                      {s}
                    </div>
                    {i !== arr.length - 1 && <span className="bar"></span>}
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Categories */}
            {mode !== "edit" && step === STEPS.CATEGORIES && (
              <div className="options-grid">
                {categories.map((cat) => (
                  <CatCard
                    key={cat.id}
                    data={cat}
                    position="when-create-ad"
                    type="cat"
                    activeClass={cat.id === category}
                    onSelect={() => {
                      setCategory(cat.id);
                      setStep(STEPS.SUB_CATEGORIES);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Step 2: Sub Categories */}
            {mode !== "edit" && step === STEPS.SUB_CATEGORIES && (
              <div className="options-grid">
                {subCategories
                  .filter((x) => x.categoryName === category)
                  .map((subCat) => (
                    <CatCard
                      key={subCat.id}
                      data={subCat}
                      position="when-create-ad"
                      type="sub-cat"
                      activeClass={subCat.id === subCategory}
                      onSelect={() => {
                        setSubCategory(subCat.id);
                        setStep(STEPS.FORM);
                      }}
                    />
                  ))}
              </div>
            )}

            {/* Step 3: Form */}
            {step === STEPS.FORM && (
              <form className="builder" onSubmit={handleSubmit(onSubmit)}>
                {/* Lang switch */}
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

                {/* Key */}
                <div className="box forInput">
                  <label>{t.dashboard.forms.filterKey}</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        placeholder="filter key"
                        {...register("key", { required: true })}
                      />
                    </div>
                  </div>
                  {errors.key && (
                    <span className="error">
                      <CircleAlert /> Key is required
                    </span>
                  )}
                </div>

                {/* Label */}
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
                            ? "Filter Name"
                            : "اسم الفلتر"
                        }
                        value={watch(`label.${curentCreateLocale}`)}
                        onChange={(e) =>
                          setValue(
                            `label.${curentCreateLocale}`,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  {errors.label && (
                    <span className="error">
                      <CircleAlert /> Label is required
                    </span>
                  )}
                </div>

                {/* UI Type */}
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <SelectOptions
                      label="UI Type"
                      options={[
                        { value: "input", name: "input" },
                        { value: "select", name: "select" },
                        { value: "radio", name: "radio" },
                        { value: "boolean", name: "boolean" },
                      ]}
                      value={field.value}
                      placeholder={"select the Ui type"}
                      onChange={field.onChange}
                    />
                  )}
                />

                {/* Required */}
                <div className="form-holder">
                  <div className="box forInput ">
                    <label>Required</label>
                    <div className="options-grid flex">
                      {["true", "false"].map((val) => (
                        <div
                          key={val}
                          className={`option-box small ${
                            watch("required").toString() === val ? "active" : ""
                          }`}
                          onClick={() => setValue("required", val === "true")}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filterable */}
                <div className="form-holder">
                  <div className="box forInput ">
                    <label>Filterable</label>
                    <div className="options-grid flex">
                      {["true", "false"].map((val) => (
                        <div
                          key={val}
                          className={`option-box small ${
                            watch("filterable").toString() === val
                              ? "active"
                              : ""
                          }`}
                          onClick={() => setValue("filterable", val === "true")}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Options */}
                {/* Options */}
                {uiType !== "input" && (
                  <div className="options">
                    <div className="top-holder">
                      <h4>
                        Filter options ({curentCreateLocale.toUpperCase()})
                      </h4>
                      <button
                        type="button"
                        className="main-button"
                        onClick={() => {
                          // تحقق إن كل options الحالية فيها value و label للإنجليزي والعربي
                          const allFilled = options.every(
                            (opt) =>
                              opt.value?.trim() &&
                              opt.translations?.en?.trim() &&
                              opt.translations?.ar?.trim(),
                          );

                          if (allFilled) {
                            append({
                              value: "",
                              translations: { en: "", ar: "" },
                            });
                          } else {
                            alert(
                              "Please fill all Value and Label fields for all existing options before adding a new one.",
                            );
                          }
                        }}
                      >
                        <TiPlus /> Add Option
                      </button>
                    </div>

                    {fields.map((field, index) => (
                      <div key={field.id} className="box forInput row">
                        <label>{`Option ${index + 1}`}</label>
                        <div className="inputHolder">
                          <div className="holder">
                            {/* Input Value */}
                            <input
                              type="text"
                              placeholder="Value"
                              {...register(`options.${index}.value`, {
                                required: "Value is required",
                              })}
                            />
                            {errors.options?.[index]?.value && (
                              <span className="error small">
                                <CircleAlert size={14} /> Value is required
                              </span>
                            )}
                          </div>
                          <div className="holder">
                            {/* Input Label للغة الحالية */}
                            <input
                              type="text"
                              placeholder={`Label (${curentCreateLocale.toUpperCase()})`}
                              value={
                                watch(
                                  `options.${index}.translations.${curentCreateLocale}`,
                                ) || ""
                              }
                              onChange={(e) =>
                                setValue(
                                  `options.${index}.translations.${curentCreateLocale}`,
                                  e.target.value,
                                )
                              }
                            />

                            {errors.options?.[index]?.translations?.[
                              curentCreateLocale
                            ] && (
                              <span className="error small">
                                <CircleAlert size={14} /> Label is required
                              </span>
                            )}
                          </div>
                          <IoIosClose
                            className="close"
                            onClick={() => {
                              if (fields.length > 1) remove(index);
                              else {
                                setValue(`options.${index}.value`, "");
                                setValue(
                                  `options.${index}.translations.${curentCreateLocale}`,
                                  "",
                                );
                              }
                            }}
                          />
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
