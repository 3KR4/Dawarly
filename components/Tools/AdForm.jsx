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
import { IoChatbubblesOutline } from "react-icons/io5";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Tags from "@/components/Tools/data-collector/Tags";
import {
  crateAd,
  updateAd,
  getOneAd,
  assignAdmin,
} from "@/services/ads/ads.service";
import { useAppData } from "@/Contexts/DataContext";
import { Amenities, Currencies, Levels, RentFrequencies } from "@/data/enums";
import { useNotification } from "@/Contexts/NotificationContext";
import { selectors } from "@/Contexts/selectors";
import useRedirectAfterLogin from "@/Contexts/useRedirectAfterLogin";
import { useAuth } from "@/Contexts/AuthContext";
import { getAllUsers } from "@/services/auth/auth.service";
import { deleteImage, uploadImages } from "@/services/images/images.service";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";
export default function AdForm({ type = "client", adId }) {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const { governorates, categories, subCategories, cities, areas, compounds } =
    useAppData();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();
  const { tags, setTags } = useContext(selectors);

  // ======= FORM STATES =======
  const [adData, setAdData] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [allAdmins, setAllAdmins] = useState([]);
  const canAssignAdmin =
    user?.permissions?.includes("ASSIGN_RESPONSIBILITY") ||
    user?.is_super_admin;
  const [loadingContent, setLoadingContnet] = useState(false);
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
  const [originalImages, setOriginalImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [additionalData, setAdditionalData] = useState({
    currency: Currencies[0],
    frequency: null,
    minRentalUnit: null,
    level: Levels[0],
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

  // ======= FETCH AD DATA IF EDITING =======
  useEffect(() => {
    if (adId) fetchAdData();
  }, [adId]);

  // fetch admins
  useEffect(() => {
    console.log(adId, canAssignAdmin);

    if (adId && canAssignAdmin) {
      fetchAdmins();
    }
  }, [adId, canAssignAdmin]);

  const fetchAdData = async () => {
    setLoadingContnet(true);
    try {
      const res = await getOneAd(adId);
      const ad = res?.data;
      if (!ad) return alert(t.ad.fetch_error);
      setAdData(ad);
      setIsEditable(canEditAd(ad));
      fillFormWithAdData(ad);
    } catch (error) {
      console.error("Error fetching ad data:", error);
      addNotification({
        type: "error",
        message: t.ad.fetch_error,
      });
    } finally {
      setLoadingContnet(false);
    }
  };
  const fetchAdmins = async () => {
    try {
      const res = await getAllUsers("", "ADMIN", "CHANGE_ADS_STATUS", 1, 10000);
      const admins = res?.data.users;
      if (!admins) return alert(t.ad.fetch_error);

      const userExists = admins.some((admin) => admin.id === user.id);

      const updatedAdmins = userExists ? admins : [...admins, user];

      setAllAdmins(updatedAdmins);
    } catch (error) {
      console.log(error);

      addNotification({
        type: "error",
        message: error.message,
      });
    }
  };

  const canEditAd = (ad) => {
    if (!ad) return false;
    const currentUser = { id: 1, role: "admin" };
    return ad.user_id === currentUser?.id || currentUser?.role === "admin";
  };

  const fillFormWithAdData = (ad) => {
    setValue("adTitle", ad.title);
    setValue("rentAmount", ad.rent_amount);
    setValue("deposit_amount", ad.deposit_amount);
    setValue("description", ad.description || "");
    setValue("bedrooms", ad.details.bedrooms);
    setValue("bathrooms", ad.details.bathrooms);
    setValue("child_no_max", ad.child_no_max);
    setValue("adult_no_max", ad.adult_no_max);
    setValue("rentalDuration", ad.min_rent_period);
    setValue("payment_no1", ad.payment_no1);
    setValue("payment_no2", ad.payment_no2);
    setValue("delivery_no1", ad.delivery_no1);
    setValue("delivery_no2", ad.delivery_no2);
    setValue("Owner_No1", ad.Owner_No1);
    setValue("Owner_No2", ad.Owner_No2);

    setSelectedCats({
      cat: ad.Categories,
      subCat: ad.SubCategories,
    });

    setSelectedLocations({
      gov: ad.governorate,
      city: ad.city,
      area: ad.area,
      compound: ad.compound,
    });

    setImages(ad.images);
    setOriginalImages(ad.images);
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toISOString().slice(0, 10);
    };
    setRentAvailability({
      from: formatDate(ad.available_from),
      to: formatDate(ad.available_to),
    });
    setAdditionalData({
      currency: Currencies.find((x) => x.id == ad.rent_currency),
      frequency: RentFrequencies.find((x) => x.id == ad.rent_frequency),
      minRentalUnit: RentFrequencies.find(
        (x) => x.id == ad.min_rent_period_unit,
      ),
      level: Levels.find((x) => x.id == ad.details.level),
    });

    const activeAmenities = Amenities.filter(
      (item) => ad?.amenities?.[item.key],
    ).map((item) => item.id);

    setSelectedAmenities(activeAmenities);
    setTags(ad.tags);

    if (ad.admin) {
      setSelectedAdmin(ad.admin);
      setSelectedMediatorMethod({ id: 2, name: t.ad.userToAdmin });
    }
    setSelectedContactMethods({
      phone: ad.display_phone,
      chat: ad.display_whatsapp,
    });
  };

  const contactMethod = [
    { id: 1, name: t.ad.userToUser },
    { id: 2, name: t.ad.userToAdmin },
  ];

  const METHODS = [
    { key: "phone", label: t.ad.contact_via_phone, icon: Phone },
    { key: "chat", label: t.ad.contact_via_chat, icon: IoChatbubblesOutline },
  ];

  const handleErrors = (type, value) => {
    setFieldErrors((prev) => ({ ...prev, [type]: value }));
  };

  // ======= VALIDATION =======
  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    if (!selectedCats.cat) {
      newErrors.cat = t.ad.errors.category;
      hasErrors = true;
    }
    if (!selectedCats.subCat) {
      newErrors.subCat = t.ad.errors.subCategory;
      hasErrors = true;
    }
    if (!selectedLocations.gov) {
      newErrors.gov = t.ad.errors.governorate;
      hasErrors = true;
    }
    if (!selectedLocations.city) {
      newErrors.city = t.ad.errors.city;
      hasErrors = true;
    }
    if (selectedMediatorMethod?.id == 2 && !selectedAdmin) {
      newErrors.admin = t.ad.errors.admin;
      hasErrors = true;
    }
    if (images?.length === 0) {
      newErrors.images = t.ad.images.errors.required;
      hasErrors = true;
    }
    if (!additionalData.currency) {
      newErrors.currency = t.ad.errors.currency;
      hasErrors = true;
    }
    if (!additionalData.frequency) {
      newErrors.frequency = t.ad.errors.frequency;
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    setFieldErrors({});
    return true;
  };

  // ======= BUILD PAYLOAD =======
  const buildPayload = (data) => ({
    title: data.adTitle,
    description: data.description || "",
    categoryId: selectedCats.cat?.id,
    subCategoryId: selectedCats.subCat?.id,
    display_phone: selectedContactMethods.phone,
    display_whatsapp: selectedContactMethods.chat,
    display_dawaarly_contact: selectedMediatorMethod?.id === 2,
    payment_no1: data.payment_no1 ? data.payment_no1 : null,
    payment_no2: data.payment_no2 ? data.payment_no2 : null,
    Owner_No1: data.Owner_No1 ? data.Owner_No1 : null,
    Owner_No2: data.Owner_No2 ? data.Owner_No2 : null,
    delivery_no1: data.delivery_no1 ? data.delivery_no1 : null,
    delivery_no2: data.delivery_no2 ? data.delivery_no2 : null,
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
    level: additionalData.level?.id,
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

  const submitAd = async (payload) =>
    adId ? updateAd(adId, payload) : crateAd(payload);

  const uploadNewImages = async (adId) => {
    const safeImages = Array.isArray(images) ? images : [];

    const newImages = safeImages.filter((img) => img instanceof File);

    if (newImages.length === 0) return;

    const formData = new FormData();

    newImages.forEach((file) => {
      formData.append("files", file);
    });

    await uploadImages("AD", adId, formData);
  };
  const handleDeletedImages = async (adId) => {
    const safeOriginal = Array.isArray(originalImages) ? originalImages : [];
    const safeImages = Array.isArray(images) ? images : [];

    const deletedImages = safeOriginal.filter(
      (oldImg) => !safeImages.some((img) => img?.id === oldImg?.id),
    );

    for (const img of deletedImages) {
      await deleteImage("AD", adId, img.id);
    }
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
    if (!validateForm()) return;
    const payload = buildPayload(data);
    console.log("FINAL REQUEST", payload);
    setLoadingSubmit(true);
    try {
      const res = await submitAd(payload);
      const finalAdId = adId || res.data.adId;
      await uploadNewImages(finalAdId);
      if (adId) {
        await handleDeletedImages(finalAdId);
      }
      if (selectedAdmin) {
        await assignAdmin(adId, { admin_id: selectedAdmin.id });
      }

      addNotification({
        type: "success",
        message: adId ? t.ad.ad_updated : t.ad.ad_created,
      });
      redirectAfterLogin(
        type == "client" ? "/mylisting" : "/dashboard/ads/all",
      );
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
  };
  const datePickerTextFieldProps = {
    fullWidth: true,
    sx: {
      "& .MuiInputBase-root": {
        height: "42px",
        borderRadius: "10px",
        backgroundColor: "transparent",

        // ❌ remove ALL states here
        boxShadow: "none",
      },

      // 🔥 remove hover effect
      "& .MuiInputBase-root:hover": {
        boxShadow: "none",
        backgroundColor: "transparent",
      },

      // 🔥 remove focus effect
      "& .MuiInputBase-root.Mui-focused": {
        boxShadow: "none",
        backgroundColor: "transparent",
      },

      "& .MuiInputBase-root:focus-within": {
        boxShadow: "none",
        backgroundColor: "transparent",
      },

      // ❌ remove fieldset completely (important)
      "& fieldset": {
        border: "none !important",
      },

      "& .MuiOutlinedInput-notchedOutline": {
        border: "none !important",
      },

      // label
      "& .MuiInputLabel-root": {
        color: "var(--paragraph)",
        fontSize: "14px",
        fontWeight: 600,
      },

      "& .MuiInputLabel-root.Mui-focused": {
        color: "var(--paragraph)",
      },

      "& .MuiPickersSectionList-root": {
        height: "42.5px",
        display: "flex",
        alignItems: "center",
        fontSize: "13px", // 👈 هنا حجم الخط
        fontWeight: 500, // اختياري
      },
      // input
      "& .MuiInputBase-input": {
        height: "42.5px",
        boxSizing: "border-box",
      },

      "& .MuiInputAdornment-root": {
        height: "42px",
        display: "flex",
        alignItems: "center",
      },

      "& .MuiIconButton-root": {
        height: "32px",
        width: "32px",
      },
    },
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <div
        className={`form-holder create-ad ${
          type == "client" ? "user-create-ad" : "admin-create-ad"
        }`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            position: "relative",
            opacity: loadingContent ? "0.6" : "1",
          }}
        >
          {loadingContent && (
            <div className="loading-content cover">
              <span
                className="loader"
                style={{ opacity: loadingContent ? "1" : "0" }}
              ></span>
            </div>
          )}
          {type == "admin" && adId && canAssignAdmin && allAdmins && (
            <div className="form-section right">
              <h2 className="section-title">{t.ad.admin_contact}</h2>
              <div className="row-holder two">
                <SelectOptions
                  label={t.ad.theContactMethod}
                  placeholder={""}
                  options={contactMethod}
                  value={selectedMediatorMethod}
                  required={false}
                  onChange={(item) => {
                    setSelectedMediatorMethod(item);
                  }}
                />
                <SelectOptions
                  label={t.ad.choose_admin}
                  placeholder={t.ad.select_admin}
                  options={allAdmins}
                  type={"users"}
                  value={selectedAdmin}
                  required={true}
                  error={fieldErrors.admin}
                  disabled={selectedMediatorMethod?.id == 1}
                  onChange={(item) => {
                    setSelectedAdmin(item);
                    handleErrors("admin", null);
                  }}
                />
              </div>
            </div>
          )}
          {/* === معلومات أساسية === */}
          <div className="form-section">
            <h2 className="section-title">{t.ad.basic_info}</h2>

            <div className="row-holder two">
              <div className="left">
                <div className="box forInput">
                  <label>
                    {t.dashboard.forms.title || "Title"}{" "}
                    <span className="required">*</span>
                  </label>
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
                        disabled={!isEditable}
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

                <div className="box forInput">
                  <label>{t.dashboard.forms.description}</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <textarea
                        {...register("description")}
                        placeholder={t.dashboard.forms.descriptionPlaceholder}
                        rows={4}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="right">
                <Images
                  images={images}
                  setImages={setImages}
                  isSubmitted={isSubmitted}
                  isEditing={!!adId}
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>

          {/* === الفئة والتصنيف === */}
          <div className="form-section">
            <h2 className="section-title">{t.ad.category_info}</h2>

            <div className="row-holder two">
              <SelectOptions
                label={t.ad.choose_category}
                placeholder={t.ad.select_category}
                options={categories}
                value={selectedCats.cat}
                onChange={(item) => {
                  setSelectedCats({
                    cat: item,
                    subCat: null,
                  });
                  handleErrors("cat", null);
                }}
                error={fieldErrors.cat}
                required={true}
              />

              <SelectOptions
                label={t.ad.choose_sub_category}
                placeholder={t.ad.select_sub_category}
                options={subCategories.filter(
                  (s) => s.category_id === selectedCats.cat?.id,
                )}
                value={selectedCats.subCat}
                disabled={!selectedCats.cat}
                onChange={(item) => {
                  setSelectedCats((prev) => ({
                    ...prev,
                    subCat: item,
                  }));
                  handleErrors("subCat", null);
                }}
                error={fieldErrors.subCat}
                required={true}
              />
            </div>
          </div>

          {/* === الموقع === */}
          <div className="form-section">
            <h2 className="section-title">{t.dashboard.tables.location}</h2>
            <div
              className="row-holder"
              style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
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
                options={compounds.filter((m) => {
                  if (selectedLocations.area?.id) {
                    return m.area_id === selectedLocations.area.id;
                  }

                  if (selectedLocations.city?.id) {
                    return m.city_id === selectedLocations.city.id;
                  }

                  return false;
                })}
                value={selectedLocations.compound}
                disabled={!selectedLocations.area && !selectedLocations.city}
                onChange={(item) => {
                  setSelectedLocations((prev) => ({
                    ...prev,
                    compound: item,
                  }));
                }}
              />
            </div>
          </div>

          {/* === تفاصيل العقار === */}
          <div className="form-section">
            <h2 className="section-title">
              {t.dashboard.tables.property_details}
            </h2>
            <div className={`row-holder ${type == "client" ? "two" : ""}`}>
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
                      disabled={!isEditable}
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
                      disabled={!isEditable}
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

              <SelectOptions
                label={t.ad.level}
                placeholder={t.ad.levelPlaceholder}
                options={Levels}
                value={additionalData?.level}
                onChange={(item) => {
                  setAdditionalData((prev) => ({
                    ...prev,
                    level: item,
                  }));
                  handleErrors("level", null);
                }}
                error={fieldErrors.level}
                required
              />
            </div>
          </div>

          {/* === تفاصيل التسعير === */}
          <div className="form-section">
            <h2 className="section-title">
              {t.dashboard.tables.pricing_details}
            </h2>
            <div className="row-holder two">
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
                      disabled={!isEditable}
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
                          message: t.dashboard.forms.errors.deposit_amount_Min,
                        },
                      })}
                      disabled={!isEditable}
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
                value={additionalData?.currency}
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

          <div className="form-section for-dates">
            <h2 className="section-title">{t.ad.rental_period}</h2>

            <div className="row-holder for-dates two">
              <div className="box forInput">
                <label>
                  {t.ad.from} <span className="required">*</span>
                </label>
                <div className="inputHolder">
                  <div className="holder">
                    <DatePicker
                      format="YYYY-MM-DD"
                      value={
                        rentAvailability.from
                          ? dayjs(rentAvailability.from)
                          : null
                      }
                      onChange={(newValue) => {
                        const formattedFrom = newValue
                          ? newValue.format("YYYY-MM-DD")
                          : "";

                        setRentAvailability((prev) => {
                          const shouldResetTo =
                            formattedFrom &&
                            prev.to &&
                            dayjs(prev.to).isBefore(
                              dayjs(formattedFrom),
                              "day",
                            );

                          return {
                            ...prev,
                            from: formattedFrom,
                            to: shouldResetTo ? "" : prev.to,
                          };
                        });
                      }}
                      slotProps={{
                        textField: datePickerTextFieldProps,
                      }}
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
                    <DatePicker
                      format="YYYY-MM-DD"
                      value={
                        rentAvailability.to ? dayjs(rentAvailability.to) : null
                      }
                      minDate={
                        rentAvailability.from
                          ? dayjs(rentAvailability.from)
                          : undefined
                      }
                      onChange={(newValue) =>
                        setRentAvailability((prev) => ({
                          ...prev,
                          to: newValue ? newValue.format("YYYY-MM-DD") : "",
                        }))
                      }
                      slotProps={{
                        textField: datePickerTextFieldProps,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">{t.ad.minimumRentalDuration}</h2>

            <div className="row-holder for-dates two">
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

          {/* === سعة الضيوف === */}
          <div className="form-section">
            <h2 className="section-title">{"Guest Capacity"}</h2>
            <div className="row-holder two">
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
                      disabled={!isEditable}
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
                      disabled={!isEditable}
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
            <h2 className="section-title">{"Current property data"}</h2>
            <div className="row-holder two">
              <div className="box forInput">
                <label>{"Owner number 1 "}</label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      type="text"
                      {...register("Owner_No1")}
                      disabled={!isEditable}
                      placeholder={"enter Owner number 1"}
                    />
                  </div>
                </div>
              </div>

              <div className="box forInput">
                <label>{"Owner number 2 "}</label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      type="text"
                      {...register("Owner_No2")}
                      disabled={!isEditable}
                      placeholder={"enter Owner number 2"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row-holder two">
              <div className="box forInput">
                <label>{"delivery number 1"}</label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      type="text"
                      {...register("delivery_no1")}
                      disabled={!isEditable}
                      placeholder={"enter delivery number 1"}
                    />
                  </div>
                </div>
              </div>

              <div className="box forInput">
                <label>{"delivery number 2 "}</label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      type="text"
                      {...register("delivery_no2")}
                      disabled={!isEditable}
                      placeholder={"enter delivery number 2"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row-holder two">
              <div className="box forInput">
                <label>{"payment number 1"}</label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      type="text"
                      {...register("payment_no1")}
                      disabled={!isEditable}
                      placeholder={"enter payment number 1"}
                    />
                  </div>
                </div>
              </div>

              <div className="box forInput">
                <label>{"payment number 2"}</label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      type="text"
                      {...register("payment_no2")}
                      disabled={!isEditable}
                      placeholder={"enter payment number 2"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === المميزات === */}
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

          <Tags disabled={!isEditable} />

          {((type === "admin" && !!adData?.subuser) || type === "client") && (
            <div className="form-section">
              <h2 className="section-title">{t.ad.theContactMethod}</h2>
              <div className="options-grid verfiyMethod">
                {METHODS.map(({ key, label, icon: Icon }) => {
                  const isActive = selectedContactMethods[key];

                  return (
                    <div
                      key={key}
                      className={`option-box ${isActive ? "active" : ""} ${
                        fieldErrors.contact ? "error-border" : ""
                      }`}
                      onClick={() => {
                        setSelectedContactMethods((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }));
                        handleErrors("contact", null);
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
            </div>
          )}

          {/* === زر الإرسال === */}
          <div className="form-section submit-section">
            <button
              type="submit"
              className={`main-button ${
                adId ? "update-button" : "create-button"
              }`}
              onClick={() => setIsSubmitted(true)}
              disabled={loadingSubmit}
            >
              {loadingSubmit
                ? locale === "ar"
                  ? "جاري..."
                  : "Loading..."
                : adId
                  ? t.ad.update_ad
                  : t.ad.create_your_ad}
            </button>
          </div>
        </form>
      </div>
    </LocalizationProvider>
  );
}
