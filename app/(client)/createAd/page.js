"use client";

import "@/styles/client/forms.css";
import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import useTranslate from "@/Contexts/useTranslation";
import { users } from "@/data";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import Images from "@/components/Tools/data-collector/Images";
import { Mail, Phone, CircleAlert } from "lucide-react";
import { settings } from "@/Contexts/settings";
import Tags from "@/components/Tools/data-collector/Tags";
import {
  crateAd,
  updateAd,
  getOneAd,
  assignAdmin,
} from "@/services/ads/ads.service";
import { useAppData } from "@/Contexts/DataContext";
import { Amenities, Currencies, RentFrequencies } from "@/data/enums";
import { useNotification } from "@/Contexts/NotificationContext";
import { selectors } from "@/Contexts/selectors";
import useRedirectAfterLogin from "@/Contexts/useRedirectAfterLogin";
import { useAuth } from "@/Contexts/AuthContext";
import { getAllUsers } from "@/services/auth/auth.service";
import { deleteImage, uploadImages } from "@/services/images/images.service";
import { FaArrowLeft } from "react-icons/fa";
import CatCard from "@/components/home/CatCard";

export default function CreateAd() {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const { governorates, categories, subCategories, cities, areas, compounds } =
    useAppData();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();
  const { tags, setTags } = useContext(selectors);

  const STEPS = {
    CATEGORIES: 1,
    SUB_CATEGORIES: 2,
    BASICS: 3,
    ALL_DETAILS: 4,
    CONTACT: 5,
  };

  const [step, setStep] = useState(STEPS.CATEGORIES);

  // ======= FORM STATES =======
  const [adData, setAdData] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [allAdmins, setAllAdmins] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [selectedCats, setSelectedCats] = useState({ cat: null, subCat: null });

  const [selectedLocations, setSelectedLocations] = useState({
    gov: null,
    city: null,
    area: null,
    compound: null,
  });

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedMediatorMethod, setSelectedMediatorMethod] = useState({
    id: 1,
    name: t.ad.userToUser,
  });
  const [selectedContactMethods, setSelectedContactMethods] = useState({
    chat: false,
    phone: false,
  });

  const [images, setImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [additionalData, setAdditionalData] = useState({
    currency: null,
    frequency: null,
    minRentalUnit: null,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [rentAvailability, setRentAvailability] = useState({
    from: "",
    to: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const METHODS = [
    { key: "email", label: t.ad.contact_via_email, icon: Mail },
    { key: "phone", label: t.ad.contact_via_phone, icon: Phone },
  ];

  const handleErrors = (type, value) => {
    setFieldErrors((prev) => ({ ...prev, [type]: value }));
  };

  // ======= VALIDATION =======

  // ======= BUILD PAYLOAD =======
  const buildPayload = (data) => ({
    title: data.adTitle,
    description: data.description || "",
    categoryId: selectedCats.cat?.id,
    subCategoryId: selectedCats.subCat?.id,
    display_phone: selectedContactMethods.phone,
    display_whatsapp: selectedContactMethods.chat,
    display_dawaarly_contact: selectedMediatorMethod?.id === 2,
    rent_amount: Number(data.rentAmount),
    rent_currency: additionalData.currency?.id,
    rent_frequency: additionalData.frequency?.id,
    deposit_amount: Number(data.deposit_amount),
    min_rent_period: Number(data.rentalDuration),
    min_rent_period_unit: additionalData.minRentalUnit?.id,
    available_from: rentAvailability.from
      ? new Date(rentAvailability.from).toISOString()
      : null,
    available_to: rentAvailability.to
      ? new Date(rentAvailability.to).toISOString()
      : null,
    country_id: 1,
    governorate_id: selectedLocations.gov?.id,
    city_id: selectedLocations.city?.id,
    area_id: selectedLocations.area?.id || null,
    compound_id: selectedLocations.compound?.id || null,
    bedrooms: Number(data.bedrooms),
    bathrooms: Number(data.bathrooms),
    level: Number(data.level),
    adult_no_max: Number(data.adult_no_max),
    child_no_max: Number(data.child_no_max),
    tags: tags,
    ...mapAmenities(selectedAmenities),
  });

  const mapAmenities = (selected) => {
    const result = {};
    Amenities.forEach((am) => {
      result[am.id] = selected.includes(am.id);
    });
    return result;
  };

  const uploadNewImages = async (adId) => {
    const newImages = images.filter((img) => img instanceof File);

    if (newImages.length === 0) return;

    const formData = new FormData();

    newImages.forEach((file) => {
      formData.append("files", file);
    });

    await uploadImages("AD", adId, formData);
  };

  const fieldErrorMap = {
    title: "adTitle",
    categoryId: "category",
    subCategoryId: "subCategory",
    governorate_id: "governorate",
    city_id: "city",
    rent_currency: "currency",
    rent_frequency: "frequency",
    deposit_amount: "deposit_amount_reqire",
    rent_amount: "priceRequired",
    bedrooms: "required",
    bathrooms: "required",
    level: "required",
    country_id: "required",
  };
  const onSubmit = async (data) => {
    if (step === STEPS.CATEGORIES) {
      if (!selectedCats.cat) return;
      setStep(STEPS.SUB_CATEGORIES);
      return;
    }

    if (step === STEPS.SUB_CATEGORIES) {
      if (!selectedCats.subCat) return;
      setStep(STEPS.BASICS);
      return;
    }

    if (step === STEPS.BASICS) {
      setIsSubmitted(true);

      const isFormValid =
        data.adTitle &&
        selectedLocations.gov &&
        selectedLocations.city &&
        images.length !== 0;

      const errors = {
        gov: !userAddress.gov ? t.ad.errors.governorate : "",
        city: !userAddress.city ? t.ad.errors.city : "",
      };

      if (!isFormValid) {
        return;
      }

      setStep(STEPS.ALL_DETAILS);
    }

    if (step === STEPS.ALL_DETAILS) {
      const isValid = additionalData.currency && additionalData.frequency;
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
          contact: t.ad.contact_method_required,
        }));
        return;
      } else {
        const payload = buildPayload(data);
        console.log("FINAL REQUEST", payload);
        setLoadingSubmit(true);
        try {
          const res = await crateAd(payload);
          const finalAdId = res.data.adId;
          await uploadNewImages(finalAdId);

          addNotification({
            type: "success",
            message: adId ? t.ad.ad_updated : t.ad.ad_created,
          });
          redirectAfterLogin("/mylisting");
        } catch (err) {
          console.error("Error:", err);
          let message = "An error occurred";
          // 🔥 لو فيه validation errors
          if (err.response?.data?.errors) {
            const backendErrors = err.response.data.errors;

            const translatedErrors = backendErrors.map((e) => {
              const key = fieldErrorMap[e.field];
              return key ? t.ad.errors[key] : e.message;
            });

            message = translatedErrors.join(" \n ");
          } else {
            message =
              err.response?.data?.message || err.message || "An error occurred";
          }

          addNotification({
            type: "error",
            message,
          });
        } finally {
          setLoadingSubmit(false);
        }
      }
    }
  };

  const RenderRentAvailability = () => {
    return (
      <>
        <div className="form-section">
          <h2 className="section-title">{t.ad.rental_period}</h2>

          <div className="row-holder for-dates">
            <div className="box forInput">
              <label>
                {t.ad.from} <span className="required">*</span>
              </label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="date"
                    value={rentAvailability.from}
                    disabled={!isEditable}
                    onChange={(e) =>
                      setRentAvailability((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="box forInput right">
              <label>
                {t.ad.to} <span className="required">*</span>
              </label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="date"
                    value={rentAvailability.to}
                    min={rentAvailability.from}
                    disabled={!isEditable}
                    onChange={(e) =>
                      setRentAvailability((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">{t.ad.minimumRentalDuration}</h2>

          <div className="row-holder for-dates">
            <div className="box forInput right">
              <label>
                {t.ad.durationValue} <span className="required">*</span>
              </label>

              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="number"
                    min={1}
                    disabled={!isEditable}
                    {...register("rentalDuration", {
                      required: t.ad.errors.rentalDuration,
                    })}
                    placeholder={t.ad.durationValuePlaceholder}
                  />
                </div>
                {errors.rentalDuration && (
                  <span className="error">
                    <CircleAlert />
                    {errors.rentalDuration.message}
                  </span>
                )}
              </div>
            </div>

            <SelectOptions
              label={t.ad.durationUnit}
              placeholder={t.ad.select}
              options={RentFrequencies}
              value={additionalData.minRentalUnit}
              required={true}
              disabled={!isEditable}
              onChange={(item) =>
                setAdditionalData((prev) => ({
                  ...prev,
                  minRentalUnit: item,
                }))
              }
            />
          </div>
        </div>
      </>
    );
  };

  const titles = {
    [STEPS.CATEGORIES]: t.ad.choose_category,
    [STEPS.SUB_CATEGORIES]: t.ad.choose_sub_category,
    [STEPS.BASICS]: t.ad.ad_basics,
    [STEPS.ALL_DETAILS]: t.ad.ad_details,
    [STEPS.CONTACT]: t.ad.contact_information,
  };

  const descriptions = {
    [STEPS.CATEGORIES]: t.ad.choose_category_description,
    [STEPS.SUB_CATEGORIES]: t.ad.choose_sub_category_description,
    [STEPS.BASICS]: t.ad.ad_basics_description,
    [STEPS.ALL_DETAILS]: t.ad.ad_details_description,
    [STEPS.CONTACT]: t.ad.contact_information_description,
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
                activeClass={cat?.id == selectedCats.cat}
                onSelect={() => {
                  setSelectedCats({ cat: cat?.id, subCat: null });
                  setStep(STEPS.SUB_CATEGORIES);
                }}
              />
            ))}
          </div>
        )}

        {/* ================= SUB_CATEGORIES STEP 2 ================= */}
        {step === STEPS.SUB_CATEGORIES && (
          <div className="options-grid verfiyMethod">
            {subCategories
              ?.filter((x) => x?.category_id == selectedCats.cat)
              ?.map((subCat) => (
                <CatCard
                  key={subCat?.id}
                  data={subCat}
                  position={`when-create-ad`}
                  type={`sub-cat`}
                  activeClass={subCat?.id == selectedCats.subCat}
                  onSelect={() => {
                    setSelectedCats((prev) => ({
                      ...prev,
                      subCat: subCat?.id,
                    }));

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
              <label>{t.ad.placeholders.adTitle}</label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="text"
                    {...register("adTitle", {
                      required: t.ad.errors.adTitle,
                      minLength: {
                        value: 6,
                        message: t.ad.errors.adTitleValidation,
                      },
                    })}
                    placeholder={t.ad.placeholders.adTitle}
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
            <div className="form-section">
              <h2 className="section-title">{t.dashboard.tables.location}</h2>
              <div
                className="row-holder"
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                <SelectOptions
                  label={t.location.yourGovernorate}
                  placeholder={t.location.selectGovernorate}
                  options={governorates}
                  value={selectedLocations.gov}
                  onChange={(item) => {
                    setSelectedLocations({
                      gov: item,
                      city: null,
                      area: null,
                      compound: null,
                    });
                    handleErrors("gov", null);
                  }}
                  error={fieldErrors.gov}
                  required={true}
                />

                <SelectOptions
                  label={t.location.yourCity}
                  placeholder={t.location.selectCity}
                  options={cities.filter(
                    (c) => c.governorate_id === selectedLocations.gov?.id,
                  )}
                  value={selectedLocations.city}
                  disabled={!selectedLocations.gov}
                  onChange={(item) => {
                    setSelectedLocations((prev) => ({
                      ...prev,
                      city: item,
                      area: null,
                    }));
                    handleErrors("city", null);
                  }}
                  error={fieldErrors.city}
                />

                <SelectOptions
                  label={t.location.yourArea}
                  placeholder={t.location.selectArea}
                  options={areas.filter(
                    (a) => a.city_id === selectedLocations.city?.id,
                  )}
                  value={selectedLocations.area}
                  disabled={!selectedLocations.city}
                  onChange={(item) => {
                    setSelectedLocations((prev) => ({
                      ...prev,
                      area: item,
                    }));
                  }}
                />

                <SelectOptions
                  label={t.location.yourCompound}
                  placeholder={t.location.selectCompound}
                  options={compounds}
                  value={selectedLocations.compound}
                  onChange={(item) => {
                    setSelectedLocations((prev) => ({
                      ...prev,
                      compound: item,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="box forInput">
              <label>
                {category == 2 ? t.ad.rentPrice : t.dashboard.forms.price}

                <span className="required">*</span>
              </label>

              <div className="inputHolder">
                <div className="holder">
                  <input
                    type="number"
                    {...register("price", {
                      required: t.dashboard.forms.errors.priceRequired,
                      min: {
                        value: 1,
                        message: t.dashboard.forms.errors.priceMin,
                      },
                    })}
                    placeholder={
                      category == 2
                        ? t.ad.rentPricePlaceholder
                        : t.dashboard.forms.pricePlaceholder
                    }
                  />
                </div>

                {errors.price && (
                  <span className="error">
                    <CircleAlert />
                    {errors.price.message}
                  </span>
                )}
              </div>
            </div>
            {category === 2 && (
              <RenderRentAvailability
                t={t}
                rentAvailability={rentAvailability}
                setRentAvailability={setRentAvailability}
                isEditable={true} // أو أي شرط عندك
              />
            )}
            {category == 2 && (
              <div className="form-section">
                <h2 className="section-title" style={{ fontSize: "17px" }}>
                  {t.ad.minimumRentalDuration}
                </h2>

                <div className="row-holder for-dates">
                  {/* الرقم */}
                  <div className="box forInput">
                    <label>
                      {t.ad.durationValue} <span className="required">*</span>
                    </label>

                    <div className="inputHolder">
                      <div className="holder">
                        <input
                          type="number"
                          min={1}
                          value={minRentalDuration.value}
                          onChange={(e) =>
                            setMinRentalDuration((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                          placeholder={t.ad.durationValuePlaceholder}
                        />
                      </div>
                    </div>
                  </div>

                  {/* الوحدة باستخدام SelectOptions */}
                  <SelectOptions
                    label={t.ad.durationUnit}
                    placeholder={t.ad.select}
                    options={RENT_DURATION_UNITS}
                    value={minRentalDuration.unit}
                    tPath="ad" // 👈 مهم
                    required={true}
                    locale={locale}
                    t={t}
                    onChange={(item) =>
                      setMinRentalDuration((prev) => ({
                        ...prev,
                        unit: item,
                      }))
                    }
                  />
                </div>
              </div>
            )}
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
                          option.label || (option.value ? t.ad.yes : t.ad.no);
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
                            {t.ad.yes}
                          </div>
                          <div
                            className={`option-box small ${
                              dynamicValues[field.key] === false ? "active" : ""
                            }`}
                            onClick={() =>
                              handleDynamicChange(field.key, false)
                            }
                          >
                            {t.ad.no}
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

            <Tags />

            {/* ========== DESCRIPTION ========== */}
            <div className="box forInput">
              <label>
                {t.dashboard.forms.description} <span>({t.auth.optional})</span>
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
            {step === STEPS.CONTACT ? t.ad.create_your_ad : t.actions.next}
          </button>
        )}
      </form>
    </div>
  );
}
