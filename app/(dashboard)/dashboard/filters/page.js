"use client";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/tables.css";
import "@/styles/dashboard/pages/filters.css";
import { MdEdit } from "react-icons/md";
import React, { useContext, useState, useEffect, useRef } from "react";
import {
  subcategoriesAr,
  subcategoriesEn,
  propertiesFiltersEn,
  propertiesFiltersAr,
} from "@/data";
import { settings } from "@/Contexts/settings";
import { specsConfig } from "@/Contexts/specsConfig";
import { FaEyeLowVision } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { RxComponentBoolean } from "react-icons/rx";
import { IoMdRadioButtonOn } from "react-icons/io";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { CircleAlert } from "lucide-react";
import "@/styles/client/forms.css";
import "@/styles/dashboard/forms.css";
import { TiPlus } from "react-icons/ti";

export default function SubCategories() {
  const { locale } = useContext(settings);
  const t = useTranslate();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      key: "",
      label: "",
      placeholder: "",
      uiType: "",
      options: [{ label: "", value: "" }],
    },
  });

  const uiType = watch("uiType");

  const [filters, setFilters] = useState([]);

  useEffect(() => {
    setFilters(locale === "en" ? propertiesFiltersEn : propertiesFiltersAr);
  }, [locale]);

  // حالة Input
  const [activFilters, setActivFilters] = useState(null);
  const getSpecConfig = (key) => specsConfig[key];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = (data) => {
    const finalConfig = {
      key: data.key,
      label: data.label,
      placeholder: data.placeholder,
      uiType: data.uiType,
      required: true,
      ...(data.uiType !== "input" && { options: data.options }),
    };

    console.log("FINAL CONFIG 👉", finalConfig);
  };

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="filters-holder">
          {filters?.map((filt) => {
            const config = getSpecConfig(filt.key);
            const Icon = config?.icon;
            return (
              <div key={filt.key} className="filter-body">
                {Icon ? <Icon /> : <FaRegEyeSlash />}
                <h4>{filt.label}</h4>

                <div className="row">
                  <li>
                    {`uiType`}:{" "}
                    <span>
                      {filt.uiType}{" "}
                      {filt.uiType == "select" ? (
                        <FaBarsStaggered />
                      ) : filt.uiType == "boolean" ? (
                        <RxComponentBoolean />
                      ) : (
                        <IoMdRadioButtonOn />
                      )}
                    </span>
                  </li>
                  <li>
                    {`required`}:{" "}
                    <span>{filt.required ? "required" : "optional"}</span>
                  </li>
                </div>
                <li>
                  <span>conented with 5 sub categories</span>
                </li>
                <div className="edit-filter-btn">
                  <MdEdit />
                  {t.actions.edit}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="dynamic-menu">
        <div className="forFilters">
          <div className="top">
            <div className="hidden-element" style={{ width: "30px" }}></div>
            <h4 className="title">
              {locale == "ar" && t.dashboard.filters.Filter_data}
              {t.xxxxx || ""}
              {locale == "en" && t.dashboard.filters.Filter_data}
            </h4>
            <IoIosClose className="close" />
          </div>

          <form className="builder" onSubmit={handleSubmit(onSubmit)}>
            {/* KEY */}
            <div className="box forInput">
              <label>{t.dashboard.forms.filterKey}</label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    placeholder="property_type"
                    {...register("key", {
                      required: "Key is required",
                    })}
                  />
                </div>
                {errors.key && (
                  <span className="error">
                    <CircleAlert />
                    {errors.key.message}
                  </span>
                )}
              </div>
            </div>

            {/* LABEL */}
            <div className="box forInput">
              <label>{t.dashboard.forms.Label}</label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    placeholder="Property Type"
                    {...register("label", {
                      required: "Label is required",
                    })}
                  />
                </div>
                {errors.label && (
                  <span className="error">
                    <CircleAlert />
                    {errors.label.message}
                  </span>
                )}
              </div>
            </div>

            {/* PLACEHOLDER */}
            <div className="box forInput">
              <label>{t.dashboard.forms.Placeholder}</label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    placeholder="Select type"
                    {...register("placeholder", {
                      required: "Placeholder is required",
                    })}
                  />
                </div>
                {errors.placeholder && (
                  <span className="error">
                    <CircleAlert />
                    {errors.placeholder.message}
                  </span>
                )}
              </div>
            </div>

            {/* UI TYPE (SelectOptions) */}
            <Controller
              name="uiType"
              control={control}
              rules={{ required: "UI type is required" }}
              render={({ field }) => (
                <SelectOptions
                  label="UI Type"
                  placeholder="Select the UI type"
                  options={["input", "select", "radio", "boolean"]}
                  value={field.value}
                  error={errors.uiType?.message}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />

            {/* OPTIONS */}
            {uiType && uiType !== "input" && (
              <div className="options">
                <div className="top">
                  {t.dashboard.forms.Options}{" "}
                  <button
                    type="button"
                    className="edit-filter-btn"
                    style={{ position: "relative" }}
                    onClick={() => append({ label: "", value: "" })}
                  >
                    <TiPlus /> {t.actions.AddOption}
                  </button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="box forInput">
                    <div className="inputHolder">
                      <div className="holder">
                        <input
                          placeholder="Label"
                          {...register(`options.${index}.label`, {
                            required: "Option label required",
                          })}
                        />
                      </div>
                      <div className="holder">
                        <input
                          placeholder="Value"
                          {...register(`options.${index}.value`, {
                            required: "Option value required",
                          })}
                        />
                      </div>

                      <IoIosClose
                        className="close"
                        onClick={() => remove(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="main-button" type="submit">
              {t.actions.Create_Filter}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
