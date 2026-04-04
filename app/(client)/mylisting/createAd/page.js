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
import { crateAd } from "@/services/ads/ads.service";
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
import { IoChatbubblesOutline } from "react-icons/io5";

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
  } = useForm();

  const METHODS = [
    { key: "phone", label: t.ad.contact_via_phone, icon: Phone },
    { key: "chat", label: t.ad.contact_via_email, icon: IoChatbubblesOutline },
  ];

  const handleErrors = (type, value) => {
    setFieldErrors((prev) => ({ ...prev, [type]: value }));
  };

  // ======= VALIDATION =======

  // ======= BUILD PAYLOAD =======
  const buildPayload = (data) => ({
    title: data.adTitle,
    description: data.description || "",
    categoryId: selectedCats.cat,
    subCategoryId: selectedCats.subCat,
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
        !!data.adTitle &&
        !!selectedLocations.gov &&
        !!selectedLocations.city &&
        images.length > 0;

      const errors = {
        gov: !selectedLocations.gov ? t.ad.errors.governorate : "",
        city: !selectedLocations.city ? t.ad.errors.city : "",
      };

      Object.entries(errors).forEach(([key, value]) => {
        handleErrors(key, value);
      });
      if (!isFormValid) {
        return;
      }

      setStep(STEPS.ALL_DETAILS);
    }

    if (step === STEPS.ALL_DETAILS) {
      setIsSubmitted(true);

      const isFormValid = !!data.bedrooms && !!data.bathrooms && !!data.level;

      if (!isFormValid) {
        return;
      }

      setStep(STEPS.CONTACT);
      return;
    }

    if (step === STEPS.CONTACT) {
      const hasSelectedContact = Object.values(selectedContactMethods).some(
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
            message: finalAdId ? t.ad.ad_updated : t.ad.ad_created,
          });
          redirectAfterLogin("/mylisting");
        } catch (err) {
          console.error("Error:", err);
          let message = "An error occurred";
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
                    {...register("rentalDuration")}
                    placeholder={t.ad.durationValuePlaceholder}
                  />
                </div>
              </div>
            </div>

            <SelectOptions
              label={t.ad.durationUnit}
              placeholder={t.ad.select}
              options={RentFrequencies}
              value={additionalData.minRentalUnit}
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
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
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
            {/* === تفاصيل التسعير === */}
            <div className="form-section">
              <h2 className="section-title">
                {t.dashboard.tables.pricing_details}
              </h2>
              <div
                className="row-holder"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
                <div className="box forInput">
                  <label>
                    {t.ad.rentPrice} <span className="required">*</span>
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register("rentAmount", {
                          required: t.dashboard.forms.errors.priceRequired,
                          min: {
                            value: 1,
                            message: t.dashboard.forms.errors.priceMin,
                          },
                        })}
                        placeholder={t.ad.rentPricePlaceholder}
                      />
                    </div>
                    {errors.rentAmount && (
                      <span className="error">
                        <CircleAlert />
                        {errors.rentAmount.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="box forInput">
                  <label>
                    {t.ad.deposit_amount} <span className="required">*</span>
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register("deposit_amount", {
                          required:
                            t.dashboard.forms.errors.deposit_amount_reqire,
                          min: {
                            value: 1,
                            message:
                              t.dashboard.forms.errors.deposit_amount_Min,
                          },
                        })}
                        placeholder={t.ad.deposit_amount_Placeholder}
                      />
                    </div>
                    {errors.deposit_amount && (
                      <span className="error">
                        <CircleAlert />
                        {errors.deposit_amount.message}
                      </span>
                    )}
                  </div>
                </div>

                <SelectOptions
                  label={t.enum.currencies}
                  placeholder={t.location.select_currency}
                  options={Currencies}
                  value={additionalData?.currency || null}
                  onChange={(item) => {
                    handleErrors("currency", null);
                    setAdditionalData((prev) => ({
                      ...prev,
                      currency: item,
                    }));
                  }}
                  error={fieldErrors.currency}
                  required={true}
                />

                <SelectOptions
                  label={t.enum.frequency}
                  placeholder={t.location.select_frequency}
                  options={RentFrequencies}
                  value={additionalData?.frequency || null}
                  onChange={(item) => {
                    handleErrors("frequency", null);
                    setAdditionalData((prev) => ({
                      ...prev,
                      frequency: item,
                    }));
                  }}
                  error={fieldErrors.frequency}
                  required={true}
                />
              </div>
            </div>

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
            <div className="form-section">
              <h2 className="section-title">
                {t.dashboard.tables.property_details}
              </h2>
              <div
                className="row-holder"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                <div className="box forInput">
                  <label>
                    {t.ad.bedrooms} <span className="required">*</span>
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register("bedrooms", {
                          required: t.dashboard.forms.errors.required,
                          min: {
                            value: 1,
                            message: t.dashboard.forms.errors.minOne,
                          },
                          max: {
                            value: 100,
                            message: t.ad.errors.maxHundred,
                          },
                        })}
                        placeholder={t.ad.bedroomsPlaceholder}
                      />
                    </div>
                    {errors.bedrooms && (
                      <span className="error">
                        <CircleAlert />
                        {errors.bedrooms.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="box forInput">
                  <label>
                    {t.ad.bathrooms} <span className="required">*</span>
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register("bathrooms", {
                          required: t.dashboard.forms.errors.required,
                          min: {
                            value: 1,
                            message: t.dashboard.forms.errors.minOne,
                          },
                          max: {
                            value: 100,
                            message: t.ad.errors.maxHundred,
                          },
                        })}
                        placeholder={t.ad.bathroomsPlaceholder}
                      />
                    </div>
                    {errors.bathrooms && (
                      <span className="error">
                        <CircleAlert />
                        {errors.bathrooms.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="box forInput">
                  <label>
                    {t.ad.level} <span className="required">*</span>
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register("level", {
                          required: t.dashboard.forms.errors.required,
                          min: {
                            value: 0,
                            message: t.dashboard.forms.errors.minZero,
                          },
                          max: {
                            value: 100,
                            message: t.ad.errors.maxHundred,
                          },
                        })}
                        placeholder={t.ad.levelPlaceholder}
                      />
                    </div>
                    {errors.level && (
                      <span className="error">
                        <CircleAlert />
                        {errors.level.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <RenderRentAvailability />
            <div className="form-section">
              <h2 className="section-title">
                {t.dashboard.tables.guest_capacity}
              </h2>
              <div
                className="row-holder"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
                <div className="box forInput">
                  <label>
                    {t.ad.childMax} <span className="required">*</span>
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register("child_no_max", {
                          required: t.dashboard.forms.errors.required,
                          min: {
                            value: 0,
                            message: t.dashboard.forms.errors.minZero,
                          },
                          max: {
                            value: 100,
                            message: t.ad.errors.maxHundred,
                          },
                        })}
                        placeholder={t.ad.childMaxPlaceholder}
                      />
                    </div>
                    {errors.child_no_max && (
                      <span className="error">
                        <CircleAlert />
                        {errors.child_no_max.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="box forInput">
                  <label>
                    {t.ad.adultMax} <span className="required">*</span>
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register("adult_no_max", {
                          required: t.dashboard.forms.errors.required,
                          min: {
                            value: 1,
                            message: t.dashboard.forms.errors.minOne,
                          },
                          max: {
                            value: 100,
                            message: t.ad.errors.maxHundred,
                          },
                        })}
                        placeholder={t.ad.adultMaxPlaceholder}
                      />
                    </div>
                    {errors.adult_no_max && (
                      <span className="error">
                        <CircleAlert />
                        {errors.adult_no_max.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-section">
              <h2 className="section-title">{t.ad.amenities}</h2>
              <div className="dynamicFilters-holder">
                <div className="box forInput">
                  <div className="options-grid flex">
                    {Amenities.map((option) => {
                      const displayLabel =
                        locale === "ar" ? option.name_ar : option.name_en;
                      const isActive = selectedAmenities.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          className={`option-box small ${isActive ? "active" : ""}`}
                          onClick={() => {
                            if (isActive) {
                              setSelectedAmenities((prev) =>
                                prev.filter((v) => v !== option.id),
                              );
                            } else {
                              setSelectedAmenities((prev) => [
                                ...prev,
                                option.id,
                              ]);
                            }
                          }}
                        >
                          {displayLabel}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="box forInput">
              <label>{t.dashboard.forms.description}</label>
              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    {...register("description")}
                    placeholder={t.dashboard.forms.descriptionPlaceholder}
                    rows={4}
                  />
                </div>
              </div>
            </div>
            <Tags />
          </>
        )}

        {/* ================= CONTACT STEP 5 ================= */}
        {step === STEPS.CONTACT && (
          <>
            <div className="options-grid verfiyMethod">
              {METHODS.map(({ key, label, icon: Icon }) => {
                const isActive = selectedContactMethods[key];

                return (
                  <div
                    key={key}
                    className={`option-box ${
                      isActive ? "active" : ""
                    } ${fieldErrors.contact ? "error-border" : ""}`}
                    onClick={() => {
                      setSelectedContactMethods((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }));
                    }}
                  >
                    <Icon className="cat-icon" />
                    <span>{label}</span>
                  </div>
                );
              })}
              {fieldErrors.contact && (
                <div className="box forInput">
                  <span className="error">
                    <CircleAlert />
                    {fieldErrors.contact}
                  </span>
                </div>
              )}
            </div>
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

// if (field.uiType === "boolean") {
//   return (
//     <div className="box forInput" key={field.key}>
//       <label>
//         {field.label}
//         {` `}
//         {field.required ? (
//           <span className="required">*</span>
//         ) : (
//           <span>({t.auth.optional})</span>
//         )}
//       </label>
//       <div className="options-grid flex">
//         {field.options?.map((option) => {
//           const displayLabel =
//             option.label || (option.value ? t.ad.yes : t.ad.no);
//           const isSelected =
//             dynamicValues[field.key] === option.value;

//           return (
//             <div
//               key={option.value.toString()}
//               className={`option-box small ${
//                 isSelected ? "active" : ""
//               } ${fieldErrors[field.key] ? "error-border" : ""}`}
//               onClick={() =>
//                 handleDynamicChange(field.key, option.value)
//               }
//             >
//               {displayLabel}
//             </div>
//           );
//         }) || (
//           <>
//             <div
//               className={`option-box small ${
//                 dynamicValues[field.key] === true ? "active" : ""
//               }`}
//               onClick={() => handleDynamicChange(field.key, true)}
//             >
//               {t.ad.yes}
//             </div>
//             <div
//               className={`option-box small ${
//                 dynamicValues[field.key] === false ? "active" : ""
//               }`}
//               onClick={() =>
//                 handleDynamicChange(field.key, false)
//               }
//             >
//               {t.ad.no}
//             </div>
//           </>
//         )}
//       </div>
//       {fieldErrors[field.key] && (
//         <span className="error">
//           <CircleAlert />
//           {fieldErrors[field.key]}
//         </span>
//       )}
//     </div>
//   );
// }

//                   <div className="box forInput" key={field.key}>
//       <label>
//         {field.label}
//         {` `}
//         {field.required ? (
//           <span className="required">*</span>
//         ) : (
//           <span>({t.auth.optional})</span>
//         )}
//       </label>
//       <div className="options-grid flex">
//         {field.options.map((option) => {
//           const displayLabel = option.label || option.value;
//           const isSelected =
//             dynamicValues[field.key]?.value === option.value;

//           return (
//             <div
//               key={option.id || option.value}
//               className={`option-box small ${
//                 isSelected ? "active" : ""
//               } ${fieldErrors[field.key] ? "error-border" : ""}`}
//               onClick={() =>
//                 handleDynamicChange(field.key, option)
//               }
//             >
//               {displayLabel}
//             </div>
//           );
//         })}
//       </div>
//       {fieldErrors[field.key] && (
//         <span className="error">
//           <CircleAlert />
//           {fieldErrors[field.key]}
//         </span>
//       )}
//     </div>
