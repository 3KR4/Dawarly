"use client";
import "@/styles/client/forms.css";
import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";
import governoratesEn from "@/data/governoratesEn.json";
import governoratesAr from "@/data/governoratesAr.json";
import citiesEn from "@/data/citiesEn.json";
import citiesAr from "@/data/citiesAr.json";
import {
  categoriesEn,
  categoriesAr,
  subcategoriesEn,
  subcategoriesAr,
  propertiesFiltersEn,
  propertiesFiltersAr,
} from "@/data";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import CatCard from "@/components/home/CatCard";
import { FaArrowLeft } from "react-icons/fa6";
import Images from "@/components/Tools/data-collector/Images";
import { Mail, Phone, CircleAlert } from "lucide-react";
import { BsChatDots } from "react-icons/bs";
import { settings } from "@/Contexts/settings";

export default function CreateAd() {
  const { locale } = useContext(settings);

  const t = useTranslate();
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchdynamicFilters = async () => {
      // try {
      //   const { data } = await getService.getDynamicFilters(6);
      //   setDynamicFilters(
      //     data || locale == "en" ? propertiesFiltersEn : propertiesFiltersAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setDynamicFilters(locale == "en" ? propertiesFiltersEn : propertiesFiltersAr);
      // }
      setDynamicFilters(
        locale == "en" ? propertiesFiltersEn : propertiesFiltersAr,
      );
      setCategories(locale == "en" ? categoriesEn : categoriesAr);
      setSubcategories(locale == "en" ? subcategoriesEn : subcategoriesAr);
      setGovernorates(locale == "en" ? governoratesEn : governoratesAr);
      setCities(locale == "en" ? citiesEn : citiesAr);
    };
    fetchdynamicFilters();
  }, [locale]);

  const STEPS = {
    CATEGORIES: 1,
    SUB_CATEGORIES: 2,
    BASICS: 3,
    ALL_DETAILS: 4,
    CONTACT: 5,
  };

  const METHODS = [
    {
      key: "email",
      label: t.create.ad.contact_via_email,
      icon: Mail,
    },
    {
      key: "phone",
      label: t.create.ad.contact_via_phone,
      icon: Phone,
    },
    {
      key: "chat",
      label: t.create.ad.contact_via_chat,
      icon: BsChatDots,
    },
  ];

  const [step, setStep] = useState(STEPS.CATEGORIES);
  const [category, setCategory] = useState();
  const [subCategory, setSubCategory] = useState();
  const [userAddress, setUserAddress] = useState({
    gov: null,
    city: null,
  });
  const [images, setImages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableMethod = {
    chat: true,
    email: true,
    phone: true,
  };
  const [selectedContact, setSelectedContact] = useState({
    chat: false,
    email: false,
    phone: false,
  });

  const [dynamicValues, setDynamicValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const handleDynamicChange = (key, value) => {
    setDynamicValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear error when value is selected
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    if (step === STEPS.ALL_DETAILS) {
      const newErrors = {};
      let hasErrors = false;

      dynamicFilters.forEach((field) => {
        if (field.required) {
          const value = dynamicValues[field.key];
          let isEmpty = false;

          if (field.uiType === "select") {
            isEmpty = !value || !value.id;
          } else if (field.uiType === "radio") {
            isEmpty = !value || !value.value;
          } else if (field.uiType === "boolean") {
            isEmpty = value === undefined;
          } else if (field.uiType === "multiSelect") {
            isEmpty = !value || !Array.isArray(value) || value.length === 0;
          } else if (field.uiType === "input") {
            isEmpty = !value && value !== 0;
          }

          if (isEmpty) {
            newErrors[field.key] =
              field.requiredMessage || `${field.label} is required`;
            hasErrors = true;
          }

          if (field.uiType === "input" && field.validation?.pattern && value) {
            const pattern = field.validation.pattern.value;
            const message = field.validation.pattern.message;

            if (!pattern.test(value.toString())) {
              newErrors[field.key] = message;
              hasErrors = true;
            }
          }
        }
      });

      if (hasErrors) {
        setFieldErrors(newErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
      }

      setFieldErrors({});
      return true;
    }

    if (step === STEPS.CONTACT) {
      const hasSelectedContact = Object.values(selectedContact).some(
        (v) => v === true,
      );

      if (!hasSelectedContact) {
        setFieldErrors((prev) => ({
          ...prev,
          contact:
            t.create.ad.contact_method_required ||
            "Please select at least one contact method",
        }));
        return false;
      }

      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.contact;
        return newErrors;
      });

      return true;
    }

    return true;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  const handleAddress = (type, value) => {
    setUserAddress((prev) => ({ ...prev, [type]: value }));
  };

  const filteredCities = cities.filter(
    (c) => c.governorate_id === userAddress.gov?.id,
  );

  const onSubmit = async (data) => {
    if (step === STEPS.CATEGORIES) {
      if (!category) return;
      setStep(STEPS.SUB_CATEGORIES);
      return;
    }

    if (step === STEPS.SUB_CATEGORIES) {
      if (!subCategory) return;
      setStep(STEPS.BASICS);
      return;
    }

    if (step === STEPS.BASICS) {
      setIsSubmitted(true);
      const isFormValid = await trigger(["adTitle"]);
      if (!isFormValid || images.length === 0) {
        return;
      }
      setStep(STEPS.ALL_DETAILS);
      return;
    }

    if (step === STEPS.ALL_DETAILS) {
      const isValid = validateStep();
      if (!isValid) {
        return;
      }
      setStep(STEPS.CONTACT);
      return;
    }

    if (step === STEPS.CONTACT) {
      const hasSelectedContact = Object.values(selectedContact).some(
        (v) => v === true,
      );
      if (!hasSelectedContact) {
        setFieldErrors((prev) => ({
          ...prev,
          contact:
            t.create.ad.contact_method_required ||
            "Please select at least one contact method",
        }));
        return;
      }

      // تحضير البيانات للإرسال
      const finalData = {
        title: data.adTitle,
        description: dynamicValues.description || "",
        categoryId: category,
        subCategoryId: subCategory,
        images: images,
        additionalDetail: dynamicValues,
        location: {
          governorate: userAddress.gov,
          city: userAddress.city,
        },
        contactMethods: selectedContact,
      };

      console.log("FINAL REQUEST", finalData);
      alert(t.create.ad.submission_success || "تم تجميع البيانات بنجاح!");
    }
  };

  const titles = {
    [STEPS.CATEGORIES]: t.create.ad.choose_category,
    [STEPS.SUB_CATEGORIES]: t.create.ad.choose_sub_category,
    [STEPS.BASICS]: t.create.ad.ad_basics,
    [STEPS.ALL_DETAILS]: t.create.ad.ad_details,
    [STEPS.CONTACT]: t.create.ad.contact_information,
  };

  const descriptions = {
    [STEPS.CATEGORIES]: t.create.ad.choose_category_description,
    [STEPS.SUB_CATEGORIES]: t.create.ad.choose_sub_category_description,
    [STEPS.BASICS]: t.create.ad.ad_basics_description,
    [STEPS.ALL_DETAILS]: t.create.ad.ad_details_description,
    [STEPS.CONTACT]: t.create.ad.contact_information_description,
  };

  return (
    <div className="form-holder create-ad">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="top">
          <h1>{titles[step]}</h1>
          <p>{descriptions[step]}</p>
          {step !== 1 && (
            <FaArrowLeft
              className="arrow"
              onClick={() => setStep((prev) => prev - 1)}
            />
          )}
        </div>
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

        {/* ================= CATEGORIES STEP 1 ================= */}
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

        {/* ================= BASICS STEP 3 ================= */}
        {step === STEPS.BASICS && (
          <>
            <div className="box forInput">
              <label>{t.create.ad.placeholders.adTitle}</label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    {...register("adTitle", {
                      required: t.create.ad.errors.adTitle,
                      minLength: {
                        value: 6,
                        message: t.create.ad.errors.adTitleValidation,
                      },
                    })}
                    placeholder={t.create.ad.placeholders.adTitle}
                  />
                </div>
                {errors.adTitle && (
                  <span className="error">
                    <CircleAlert />
                    {errors.adTitle.message}
                  </span>
                )}
              </div>
            </div>
            <SelectOptions
              label={t.location.yourGovernorate}
              placeholder={t.location.selectGovernorate}
              options={governorates}
              value={userAddress.gov ? userAddress.gov.name : ""}
              tPath="governorates"
              onChange={(item) => {
                handleAddress("gov", item);
                handleAddress("city", null);
              }}
            />

            <SelectOptions
              label={t.location.yourCity}
              placeholder={t.location.selectCity}
              options={filteredCities}
              value={userAddress.city ? userAddress.city.name : ""}
              tPath="cities"
              disabled={!userAddress.gov}
              onChange={(item) => handleAddress("city", item)}
            />
            <Images
              images={images}
              setImages={setImages}
              isSubmitted={isSubmitted}
            />
          </>
        )}

        {/* ================= ALL_DETAILS STEP 4 ================= */}
        {step === STEPS.ALL_DETAILS && (
          <>
            {/* ========== الحقول الديناميكية من dynamicFilters ========== */}
            {dynamicFilters.map((field) => {
              /* ========== INPUT (المساحة، السعر، إلخ) ========== */
              if (field.uiType === "input") {
                return (
                  <div className="box forInput" key={field.key}>
                    <label>
                      {field.label}
                      {field.required ? (
                        <span className="required">*</span>
                      ) : (
                        <span>({t.auth.optional})</span>
                      )}
                    </label>
                    <div className="inputHolder">
                      <div className="holder">
                        <input
                          type={field.inputType || "text"}
                          value={dynamicValues[field.key] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleDynamicChange(field.key, value);

                            if (field.validation?.pattern && value) {
                              const pattern = field.validation.pattern.value;
                              const message = field.validation.pattern.message;

                              if (!pattern.test(value)) {
                                setFieldErrors((prev) => ({
                                  ...prev,
                                  [field.key]: message,
                                }));
                              } else if (fieldErrors[field.key]) {
                                setFieldErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors[field.key];
                                  return newErrors;
                                });
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (field.required && !value) {
                              setFieldErrors((prev) => ({
                                ...prev,
                                [field.key]: field.requiredMessage,
                              }));
                            }
                          }}
                          placeholder={field.placeholder}
                        />
                      </div>
                      {fieldErrors[field.key] && (
                        <span className="error">
                          <CircleAlert />
                          {fieldErrors[field.key]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              /* ========== SELECT ========== */
              if (field.uiType === "select") {
                return (
                  <SelectOptions
                    key={field.key}
                    label={field.label}
                    placeholder={field.placeholder || field.label}
                    options={field.options}
                    value={dynamicValues[field.key] || ""}
                    tPath={field.tPath}
                    noTranslate={field.noTranslate}
                    required={field.required}
                    error={fieldErrors[field.key]}
                    locale={locale}
                    t={t}
                    onChange={(item) => handleDynamicChange(field.key, item)}
                  />
                );
              }

              /* ========== RADIO ========== */
              if (field.uiType === "radio") {
                return (
                  <div className="box forInput" key={field.key}>
                    <label>
                      {field.label}
                      {` `}
                      {field.required ? (
                        <span className="required">*</span>
                      ) : (
                        <span>({t.auth.optional})</span>
                      )}
                    </label>
                    <div className="options-grid flex">
                      {field.options.map((option) => {
                        const displayLabel = option.label || option.value;
                        const isSelected =
                          dynamicValues[field.key]?.value === option.value;

                        return (
                          <div
                            key={option.id || option.value}
                            className={`option-box small ${
                              isSelected ? "active" : ""
                            } ${fieldErrors[field.key] ? "error-border" : ""}`}
                            onClick={() =>
                              handleDynamicChange(field.key, option)
                            }
                          >
                            {displayLabel}
                          </div>
                        );
                      })}
                    </div>
                    {fieldErrors[field.key] && (
                      <span className="error">
                        <CircleAlert />
                        {fieldErrors[field.key]}
                      </span>
                    )}
                  </div>
                );
              }

              /* ========== BOOLEAN ========== */
              if (field.uiType === "boolean") {
                return (
                  <div className="box forInput" key={field.key}>
                    <label>
                      {field.label}
                      {` `}
                      {field.required ? (
                        <span className="required">*</span>
                      ) : (
                        <span>({t.auth.optional})</span>
                      )}
                    </label>
                    <div className="options-grid flex">
                      {field.options?.map((option) => {
                        const displayLabel =
                          option.label || (option.value ? "Yes" : "No");
                        const isSelected =
                          dynamicValues[field.key] === option.value;

                        return (
                          <div
                            key={option.value.toString()}
                            className={`option-box small ${
                              isSelected ? "active" : ""
                            } ${fieldErrors[field.key] ? "error-border" : ""}`}
                            onClick={() =>
                              handleDynamicChange(field.key, option.value)
                            }
                          >
                            {displayLabel}
                          </div>
                        );
                      }) || (
                        <>
                          <div
                            className={`option-box small ${
                              dynamicValues[field.key] === true ? "active" : ""
                            }`}
                            onClick={() => handleDynamicChange(field.key, true)}
                          >
                            {locale === "ar" ? "نعم" : "Yes"}
                          </div>
                          <div
                            className={`option-box small ${
                              dynamicValues[field.key] === false ? "active" : ""
                            }`}
                            onClick={() =>
                              handleDynamicChange(field.key, false)
                            }
                          >
                            {locale === "ar" ? "لا" : "No"}
                          </div>
                        </>
                      )}
                    </div>
                    {fieldErrors[field.key] && (
                      <span className="error">
                        <CircleAlert />
                        {fieldErrors[field.key]}
                      </span>
                    )}
                  </div>
                );
              }

              /* ========== MULTI SELECT ========== */
              if (field.uiType === "multiSelect") {
                const selectedValues = dynamicValues[field.key] || [];

                return (
                  <div className="box forInput" key={field.key}>
                    <label>
                      {field.label}
                      {` `}
                      {field.required ? (
                        <span className="required">*</span>
                      ) : (
                        <span>({t.auth.optional})</span>
                      )}
                    </label>
                    <div className="options-grid flex">
                      {field.options.map((option) => {
                        const displayLabel = option.label || option.value;
                        const isActive = selectedValues.includes(option.value);

                        return (
                          <div
                            key={option.id || option.value}
                            className={`option-box small ${
                              isActive ? "active" : ""
                            } ${fieldErrors[field.key] ? "error-border" : ""}`}
                            onClick={() => {
                              if (isActive) {
                                handleDynamicChange(
                                  field.key,
                                  selectedValues.filter(
                                    (v) => v !== option.value,
                                  ),
                                );
                              } else {
                                handleDynamicChange(field.key, [
                                  ...selectedValues,
                                  option.value,
                                ]);
                              }
                            }}
                          >
                            {displayLabel}
                          </div>
                        );
                      })}
                    </div>
                    {fieldErrors[field.key] && (
                      <span className="error">
                        <CircleAlert />
                        {fieldErrors[field.key]}
                      </span>
                    )}
                  </div>
                );
              }

              return null;
            })}

            {/* ========== DESCRIPTION ========== */}
            <div className="box forInput">
              <label>
                {t.dashboard.forms.description || "Description"}{" "}
                <span>({t.auth.optional || "Optional"})</span>
              </label>
              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    value={dynamicValues.description || ""}
                    onChange={(e) =>
                      handleDynamicChange("description", e.target.value)
                    }
                    placeholder={t.dashboard.forms.descriptionPlaceholder}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= CONTACT STEP 5 ================= */}
        {step === STEPS.CONTACT && (
          <>
            <div className="options-grid verfiyMethod">
              {METHODS.map(({ key, label, icon: Icon }) => {
                const isDisabled = !availableMethod[key];
                const isActive = selectedContact[key];

                return (
                  <div
                    key={key}
                    className={`option-box ${
                      isDisabled ? "disable" : isActive ? "active" : ""
                    } ${fieldErrors.contact ? "error-border" : ""}`}
                    onClick={() => {
                      if (isDisabled) return;

                      setSelectedContact((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }));

                      if (fieldErrors.contact) {
                        setFieldErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.contact;
                          return newErrors;
                        });
                      }
                    }}
                  >
                    <Icon className="cat-icon" />
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
            {fieldErrors.contact && (
              <div className="box forInput">
                <span className="error">
                  <CircleAlert />
                  {fieldErrors.contact}
                </span>
              </div>
            )}
          </>
        )}

        {/* ================= BUTTON ================= */}
        {step !== STEPS.CATEGORIES && step !== STEPS.SUB_CATEGORIES && (
          <button type="submit" className="main-button">
            {step === STEPS.CONTACT
              ? t.create.ad.create_your_ad
              : t.actions.next}
          </button>
        )}
      </form>
    </div>
  );
}
