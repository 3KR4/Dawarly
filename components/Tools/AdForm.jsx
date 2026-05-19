"use client";

import "@/styles/client/forms.css";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import Images from "@/components/Tools/data-collector/Images";
import { Phone, CircleAlert } from "lucide-react";
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
import {
  Amenities,
  Currencies,
  InstallmentYears,
  Levels,
  PaymentMethod,
  Priority,
  RentFrequencies,
  RentPeriodUnit,
} from "@/data/enums";
import { useNotification } from "@/Contexts/NotificationContext";
import { selectors } from "@/Contexts/selectors";
import useRedirectAfterLogin from "@/Contexts/useRedirectAfterLogin";
import { useAuth } from "@/Contexts/AuthContext";
import { getAllUsers } from "@/services/auth/auth.service";
import { deleteImage, uploadImages } from "@/services/images/images.service";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  getTableRule,
  isFieldAllowed,
  isFieldRequired,
} from "@/data/tablesRules";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";

const OWNER_FIELDS = [
  "owner_no1",
  "owner_no2",
  "delivery_no1",
  "delivery_no2",
  "payment_no1",
  "payment_no2",
];

const getNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? null : numericValue;
};

const getBooleanAdField = (ad, field) =>
  Boolean(ad?.[field] ?? ad?.details?.[field]);
const getAdField = (ad, field) => ad?.[field] ?? ad?.details?.[field] ?? null;

const getNumericRules = (
  requiredMessage,
  minMessage,
  maxMessage,
  required = false,
) => {
  const rules = {
    min: {
      value: 1,
      message: minMessage,
    },
  };

  if (maxMessage) {
    rules.max = {
      value: 100,
      message: maxMessage,
    };
  }

  if (required) {
    rules.required = requiredMessage;
  }

  return rules;
};

export default function AdForm({ type = "client", adId, initialTableId = null }) {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const {
    governorates,
    tables,
    categories,
    subCategories,
    cities,
    areas,
    compounds,
  } = useAppData();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();
  const { tags, setTags } = useContext(selectors);

  const [adData, setAdData] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [allAdmins, setAllAdmins] = useState([]);
  const canAssignAdmin =
    user?.permissions?.includes("ASSIGN_RESPONSIBILITY") ||
    user?.is_super_admin;
  const [loadingContent, setLoadingContnet] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedCats, setSelectedCats] = useState({
    dep: null,
    cat: null,
    subCat: null,
  });
  const [selectedLocations, setSelectedLocations] = useState({
    gov: null,
    city: null,
    area: null,
    compound: null,
  });
  const [selectedAdmin, setSelectedAdmin] = useState(adId ? null : user);
  const [selectedMediatorMethod, setSelectedMediatorMethod] = useState({
    id: adId ? 1 : 2,
    name: adId ? t.ad.userToUser : t.ad.userToAdmin,
  });
  const [selectedContactMethods, setSelectedContactMethods] = useState({
    chat: false,
    phone: false,
  });
  const [checkBoxes, setCheckBoxes] = useState({
    isVerified: !adId,
    isFurnished: false,
    isReadyToMove: false,
  });
  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [additionalData, setAdditionalData] = useState({
    currency: Currencies[0],
    frequency: null,
    minRentalUnit: null,
    payment: null,
    level: Levels[0],
    priority: Priority[1],
    installmentYears: null,
  });
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

  const tableId = Number(selectedCats.dep?.id);
  const currentRule = useMemo(() => getTableRule(tableId), [tableId]);
  const {
    isVacation,
    showPropertyDetails,
    showCommercialDetails,
    showBuildingLandDetails,
    showSaleDetails,
    showRentDetails,
    amenityFields,  
  } = currentRule;
  const isPropertyLike =
    showPropertyDetails || showCommercialDetails || showBuildingLandDetails;
  const isHomes = [1, 2, 3, 4, 5, 6].includes(tableId);

  const allowedAmenities = useMemo(
    () => Amenities.filter((item) => amenityFields.includes(item.id)),
    [amenityFields],
  );

  const filteredCategories = useMemo(
    () => categories.filter((item) => item.table_id == selectedCats.dep?.id),
    [categories, selectedCats.dep?.id],
  );

  const filteredSubCategories = useMemo(
    () =>
      subCategories.filter((item) => item.category_id == selectedCats.cat?.id),
    [selectedCats.cat?.id, subCategories],
  );

  const toggleCheckBox = (key) => {
    setCheckBoxes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleErrors = (key, value) => {
    setFieldErrors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const contactMethod = [
    { id: 1, name: t.ad.userToUser },
    { id: 2, name: t.ad.userToAdmin },
  ];

  const methods = [
    { key: "phone", label: t.ad.contact_via_phone, icon: Phone },
    { key: "chat", label: t.ad.contact_via_chat, icon: IoChatbubblesOutline },
  ];

  useEffect(() => {
    if (adId && initialTableId) {
      fetchAdData();
    }
  }, [adId, initialTableId]);

  useEffect(() => {
    if (adId && canAssignAdmin) {
      fetchAdmins();
    }
  }, [adId, canAssignAdmin]);

  useEffect(() => {
    if (!adData || selectedCats.dep || !tables.length) return;

    const selectedDep =
      tables.find((table) => table.id == adData?.Categories?.table_id) ||
      tables.find((table) => table.id == adData?.table_id) ||
      tables.find((table) => table.id == adData?.Table?.id) ||
      null;

    if (selectedDep) {
      setSelectedCats((prev) => ({
        ...prev,
        dep: selectedDep,
      }));
    }
  }, [adData, selectedCats.dep, tables]);

  const fetchAdData = async () => {
    setLoadingContnet(true);
    try {
      const targetTableId = Number(initialTableId || tableId);
      if (!targetTableId || !adId) return;

      const res = await getOneAd(targetTableId, adId);
      console.log(res?.data);
      
      const ad = res?.data;
      if (!ad) return;

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
      const admins = res?.data?.users || [];
      const userExists = admins.some((admin) => admin.id === user?.id);
      setAllAdmins(userExists ? admins : [...admins, user].filter(Boolean));
    } catch (error) {
      addNotification({
        type: "error",
        message: error.message,
      });
    }
  };

  const canEditAd = (ad) => {
    if (!ad || !user) return false;
    return (
      ad.user_id === user.id || user.role === "admin" || user.is_super_admin
    );
  };

  const fillFormWithAdData = (ad) => {
    setValue("adTitle", ad.title || "");
    setValue("rentAmount", ad.price || "");
    setValue("deposit_amount", getAdField(ad, "deposit_amount") || "");
    setValue("description", ad.description || "");
    setValue("bedrooms", getAdField(ad, "bedrooms") || "");
    setValue("bathrooms", getAdField(ad, "bathrooms") || "");
    setValue("area_m2", getAdField(ad, "area_m2") || "");
    setValue("child_no_max", getAdField(ad, "child_no_max") || "");
    setValue("adult_no_max", getAdField(ad, "adult_no_max") || "");
    setValue("rentalDuration", getAdField(ad, "min_rent_period") || "");
    setValue("downPayment", getAdField(ad, "down_payment") || "");
    setValue("land_type", getAdField(ad, "land_type") || "");
    setValue("usage_type", getAdField(ad, "usage_type") || "");
    setValue("floors", getAdField(ad, "floors") || "");

    OWNER_FIELDS.forEach((field) => {
      setValue(field, getAdField(ad, field) || "");
    });

    setSelectedCats({
      dep: ad.department || null,
      cat: ad.category || null,
      subCat: ad.subCategory || null,
    });

    setSelectedLocations({
      gov: ad.governorate || null,
      city: ad.city || null,
      area: ad.area || null,
      compound: ad.compound || null,
    });

    setImages(ad.images || []);
    setOriginalImages(ad.images || []);

    const formatDate = (value) => {
      if (!value) return "";
      return new Date(value).toISOString().slice(0, 10);
    };

    setRentAvailability({
      from: formatDate(ad.available_from),
      to: formatDate(ad.available_to),
    });

    setAdditionalData({
      currency:
        Currencies.find((item) => item.id == ad.currency) || Currencies[0],
      frequency:
        RentFrequencies.find(
          (item) => item.id == getAdField(ad, "rent_frequency"),
        ) || null,
      minRentalUnit:
        RentPeriodUnit.find(
          (item) => item.id == getAdField(ad, "min_rent_period_unit"),
        ) || null,
      payment:
        PaymentMethod.find(
          (item) => item.id == getAdField(ad, "payment_method"),
        ) || null,
      level:
        Levels.find((item) => item.id == getAdField(ad, "level")) || Levels[0],
      priority:
        Priority.find(
          (item) => item.id == getAdField(ad, "featured_priority"),
        ) || Priority[1],
      installmentYears:
        InstallmentYears.find(
          (item) => item.id == getAdField(ad, "installment_years"),
        ) || null,
    });

    setCheckBoxes({
      isVerified: getBooleanAdField(ad, "is_verified"),
      isFurnished: getBooleanAdField(ad, "furnished"),
      isReadyToMove: getBooleanAdField(ad, "ready_to_move"),
    });

    const activeAmenities = Amenities.filter((item) => {
      const nestedValue = ad?.amenities?.[item.key];
      const flatValue = ad?.[item.id] ?? ad?.[item.key];
      return Boolean(nestedValue || flatValue);
    }).map((item) => item.id);

    setSelectedAmenities(activeAmenities);
    setTags(Array.isArray(ad.tags) ? ad.tags : []);

    if (ad.admin) {
      setSelectedAdmin(ad.admin);
      setSelectedMediatorMethod({ id: 2, name: t.ad.userToAdmin });
    }

    setSelectedContactMethods({
      phone: Boolean(ad.display_phone),
      chat: Boolean(ad.display_whatsapp),
    });
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!selectedCats.dep) {
      newErrors.dep = t.ad.select_table;
    }
    if (!selectedCats.cat) {
      newErrors.cat = t.ad.errors.category;
    }
    if (!selectedLocations.gov) {
      newErrors.gov = t.ad.errors.governorate;
    }
    if (!selectedLocations.city) {
      newErrors.city = t.ad.errors.city;
    }
    if (selectedMediatorMethod?.id === 2 && !selectedAdmin) {
      newErrors.admin = t.ad.errors.admin;
    }
    if (images.length === 0) {
      newErrors.images = t.ad.images.errors.required;
    }
    if (!additionalData.currency) {
      newErrors.currency = t.ad.errors.currency;
    }
    if (
      !selectedContactMethods.phone &&
      !selectedContactMethods.chat &&
      selectedMediatorMethod?.id !== 2
    ) {
      newErrors.contact =
        t.ad.contact_method_required || "Please choose a contact method";
    }
    if (isFieldRequired(tableId, "level") && !additionalData.level) {
      newErrors.level = t.dashboard.forms.errors.required;
    }
    if (isFieldRequired(tableId, "payment_method") && !additionalData.payment) {
      newErrors.payment_method = t.dashboard.forms.errors.required;
    }
    if (
      isFieldRequired(tableId, "rent_frequency") &&
      !additionalData.frequency
    ) {
      newErrors.frequency = t.ad.errors.frequency;
    }
    if (isFieldRequired(tableId, "land_type") && !data.land_type?.trim()) {
      newErrors.land_type = t.dashboard.forms.errors.required;
    }
    if (isFieldRequired(tableId, "usage_type") && !data.usage_type?.trim()) {
      newErrors.usage_type = t.dashboard.forms.errors.required;
    }

    if (Object.keys(newErrors).length > 0) {
      console.log(newErrors);

      setFieldErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const mapAmenities = () => {
    return allowedAmenities.reduce((accumulator, item) => {
      accumulator[item.id] = selectedAmenities.includes(item.id);
      return accumulator;
    }, {});
  };

  const buildPayload = (data) => {
    const payload = {
      title: data.adTitle,
      description: data.description || "",
      categoryId: selectedCats.cat?.id,
      subCategoryId: selectedCats.subCat?.id || null,
      table_id: selectedCats.dep?.id,
      price: Number(data.rentAmount),
      currency: additionalData.currency?.id,
      country_id: 1,
      governorate_id: selectedLocations.gov?.id,
      city_id: selectedLocations.city?.id,
      area_id: selectedLocations.area?.id || null,
      compound_id: selectedLocations.compound?.id || null,
      display_phone: selectedContactMethods.phone,
      display_whatsapp: selectedContactMethods.chat,
      display_dawaarly_contact: selectedMediatorMethod?.id === 2,
      tags,
      is_verified: checkBoxes.isVerified,
      featured_priority: additionalData.priority?.id ?? 0,
    };

    OWNER_FIELDS.forEach((field) => {
      if (isFieldAllowed(tableId, field)) {
        payload[field] = data[field] || null;
      }
    });

    if (isFieldAllowed(tableId, "bedrooms")) {
      payload.bedrooms = getNumberOrNull(data.bedrooms);
    }
    if (isFieldAllowed(tableId, "bathrooms")) {
      payload.bathrooms = getNumberOrNull(data.bathrooms);
    }
    if (isFieldAllowed(tableId, "level")) {
      payload.level = getNumberOrNull(additionalData.level?.id);
    }
    if (isFieldAllowed(tableId, "area_m2")) {
      payload.area_m2 = getNumberOrNull(data.area_m2);
    }
    if (isFieldAllowed(tableId, "land_type")) {
      payload.land_type = data.land_type?.trim() || null;
    }
    if (isFieldAllowed(tableId, "usage_type")) {
      payload.usage_type = data.usage_type?.trim() || null;
    }
    if (isFieldAllowed(tableId, "floors")) {
      payload.floors = getNumberOrNull(data.floors);
    }
    if (isFieldAllowed(tableId, "payment_method")) {
      payload.payment_method = additionalData.payment?.id || null;
    }
    if (isFieldAllowed(tableId, "ready_to_move")) {
      payload.ready_to_move = checkBoxes.isReadyToMove;
    }
    if (isFieldAllowed(tableId, "furnished")) {
      payload.furnished = checkBoxes.isFurnished;
    }
    if (isFieldAllowed(tableId, "down_payment")) {
      payload.down_payment = getNumberOrNull(data.downPayment);
    }
    if (isFieldAllowed(tableId, "installment_years")) {
      payload.installment_years = additionalData.installmentYears?.id || null;
    }
    if (isFieldAllowed(tableId, "deposit_amount")) {
      payload.deposit_amount = getNumberOrNull(data.deposit_amount);
    }
    if (isFieldAllowed(tableId, "rent_frequency")) {
      payload.rent_frequency = additionalData.frequency?.id || null;
    }
    if (isFieldAllowed(tableId, "min_rent_period")) {
      payload.min_rent_period = getNumberOrNull(data.rentalDuration);
    }
    if (isFieldAllowed(tableId, "min_rent_period_unit")) {
      payload.min_rent_period_unit = additionalData.minRentalUnit?.id || null;
    }
    if (isFieldAllowed(tableId, "available_from")) {
      payload.available_from = rentAvailability.from
        ? new Date(rentAvailability.from).toISOString()
        : null;
    }
    if (isFieldAllowed(tableId, "available_to")) {
      payload.available_to = rentAvailability.to
        ? new Date(rentAvailability.to).toISOString()
        : null;
    }
    if (isFieldAllowed(tableId, "adult_no_max")) {
      payload.adult_no_max = getNumberOrNull(data.adult_no_max);
    }
    if (isFieldAllowed(tableId, "child_no_max")) {
      payload.child_no_max = getNumberOrNull(data.child_no_max);
    }

    return {
      ...payload,
      ...mapAmenities(),
    };
  };

  const submitAd = async (payload) => {
    return adId ? updateAd(tableId, adId, payload) : crateAd(tableId, payload);
  };

  const uploadNewImages = async (targetAdId) => {
    const newImages = images.filter((img) => img?.file instanceof File);
    if (newImages.length === 0) return;

    const formData = new FormData();
    newImages.forEach((img) => {
      formData.append("files", img.file);
    });

    await uploadImages("AD", targetAdId, formData);
  };

  const handleDeletedImages = async (targetAdId) => {
    const deletedImages = originalImages.filter(
      (oldImg) => !images.some((img) => img?.id === oldImg?.id),
    );

    for (const img of deletedImages) {
      await deleteImage("AD", targetAdId, img.id);
    }
  };

  const fieldErrorMap = {
    title: "adTitle",
    categoryId: "category",
    table_id: "dep",
    governorate_id: "governorate",
    city_id: "city",
    currency: "currency",
    rent_frequency: "frequency",
    payment_method: "required",
    deposit_amount: "deposit_amount_reqire",
    price: "priceRequired",
    bedrooms: "required",
    bathrooms: "required",
    level: "required",
    country_id: "required",
    land_type: "required",
    usage_type: "required",
  };

  const onSubmit = async (data) => {
    if (!validateForm(data)) return;

    const payload = buildPayload(data);
    setLoadingSubmit(true);

    try {
      const res = await submitAd(payload);
      const finalAdId = adId || res?.data?.adId || res?.data?.id;

      if (finalAdId) {
        await uploadNewImages(finalAdId);
        if (adId) {
          await handleDeletedImages(finalAdId);
        }
        if (selectedAdmin) {
          await assignAdmin(tableId, finalAdId, { admin_id: selectedAdmin.id });
        }
      }

      addNotification({
        type: "success",
        message: adId ? t.ad.ad_updated : t.ad.ad_created,
      });

      redirectAfterLogin(
        type === "client" ? "/mylisting" : "/dashboard/ads/all",
      );
    } catch (err) {
      let message = "An error occurred";

      if (err.response?.data?.errors) {
        message = err.response.data.errors
          .map((item) => {
            const key = fieldErrorMap[item.field];
            return key ? t.ad.errors[key] || item.message : item.message;
          })
          .join(" \n ");
      } else {
        message = err.response?.data?.message || err.message || message;
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
        boxShadow: "none",
      },
      "& .MuiInputBase-root:hover": {
        boxShadow: "none",
        backgroundColor: "transparent",
      },
      "& .MuiInputBase-root.Mui-focused": {
        boxShadow: "none",
        backgroundColor: "transparent",
      },
      "& .MuiInputBase-root:focus-within": {
        boxShadow: "none",
        backgroundColor: "transparent",
      },
      "& fieldset": {
        border: "none !important",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none !important",
      },
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
        fontSize: "13px",
        fontWeight: 500,
      },
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
        className={`form-holder ${type === "client" ? "user-create-ad" : "admin-create-ad"}`}
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

          {type === "admin" &&
            adId &&
            canAssignAdmin &&
            allAdmins.length > 0 && (
              <div className="form-section right">
                <h2 className="section-title">{t.ad.admin_contact}</h2>
                <div className="row-holder two">
                  <SelectOptions
                    label={t.ad.theContactMethod}
                    placeholder=""
                    options={contactMethod}
                    value={selectedMediatorMethod}
                    onChange={setSelectedMediatorMethod}
                  />
                  <SelectOptions
                    label={t.ad.choose_admin}
                    placeholder={t.ad.select_admin}
                    options={allAdmins}
                    type="users"
                    value={selectedAdmin}
                    required={selectedMediatorMethod?.id === 2}
                    error={fieldErrors.admin}
                    disabled={selectedMediatorMethod?.id === 1}
                    onChange={(item) => {
                      setSelectedAdmin(item);
                      handleErrors("admin", null);
                    }}
                  />
                </div>
              </div>
            )}

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
                {fieldErrors.images && (
                  <div className="box forInput">
                    <span className="error">
                      <CircleAlert />
                      {fieldErrors.images}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">{t.ad.category_info}</h2>
            <div className="row-holder">
              <SelectOptions
                label={t.ad.choose_table}
                placeholder={t.ad.select_table}
                options={tables}
                value={selectedCats.dep}
                onChange={(item) => {
                  setSelectedCats({
                    dep: item,
                    cat: null,
                    subCat: null,
                  });
                  setSelectedAmenities([]);
                  handleErrors("dep", null);
                  handleErrors("cat", null);
                }}
                error={fieldErrors.dep}
                required
              />
              <SelectOptions
                label={t.ad.choose_category}
                placeholder={t.ad.select_category}
                options={filteredCategories}
                value={selectedCats.cat}
                disabled={!selectedCats.dep}
                onChange={(item) => {
                  setSelectedCats((prev) => ({
                    ...prev,
                    cat: item,
                    subCat: null,
                  }));
                  handleErrors("cat", null);
                }}
                error={fieldErrors.cat}
                required
              />
              <SelectOptions
                label={t.ad.choose_sub_category}
                placeholder={t.ad.select_sub_category}
                options={filteredSubCategories}
                value={selectedCats.subCat}
                disabled={!selectedCats.cat}
                onChange={(item) => {
                  setSelectedCats((prev) => ({
                    ...prev,
                    subCat: item,
                  }));
                }}
              />
            </div>
          </div>

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
                required
              />

              <SelectOptions
                label={t.location.yourCity}
                placeholder={t.location.selectCity}
                options={cities.filter(
                  (item) => item.governorate_id === selectedLocations.gov?.id,
                )}
                value={selectedLocations.city}
                disabled={!selectedLocations.gov}
                onChange={(item) => {
                  setSelectedLocations((prev) => ({
                    ...prev,
                    city: item,
                    area: null,
                    compound: null,
                  }));
                  handleErrors("city", null);
                }}
                error={fieldErrors.city}
                required
              />

              <SelectOptions
                label={t.location.yourArea}
                placeholder={t.location.selectArea}
                options={areas.filter(
                  (item) => item.city_id === selectedLocations.city?.id,
                )}
                value={selectedLocations.area}
                disabled={!selectedLocations.city}
                onChange={(item) => {
                  setSelectedLocations((prev) => ({
                    ...prev,
                    area: item,
                    compound: null,
                  }));
                }}
              />

              <SelectOptions
                label={t.location.yourCompound}
                placeholder={t.location.selectCompound}
                options={compounds.filter((item) => {
                  if (selectedLocations.area?.id)
                    return item.area_id === selectedLocations.area.id;
                  if (selectedLocations.city?.id)
                    return item.city_id === selectedLocations.city.id;
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

          {showPropertyDetails && (
            <div className="form-section">
              <h2 className="section-title">
                {t.dashboard.tables.property_details}
              </h2>
              <div
                className={`row-holder ${type === "client" ? "two" : ""}`}
                style={{
                  gridTemplateColumns: `repeat(${isHomes ? 4 : 2}, 1fr)`,
                }}
              >
                <div className="box forInput">
                  <label>
                    {t.ad.bedrooms}{" "}
                    {isFieldRequired(tableId, "bedrooms") && (
                      <span className="required">*</span>
                    )}
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register(
                          "bedrooms",
                          getNumericRules(
                            t.dashboard.forms.errors.required,
                            t.dashboard.forms.errors.minOne,
                            t.ad.errors.maxHundred,
                            isFieldRequired(tableId, "bedrooms"),
                          ),
                        )}
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
                    {t.ad.bathrooms}{" "}
                    {isFieldRequired(tableId, "bathrooms") && (
                      <span className="required">*</span>
                    )}
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register(
                          "bathrooms",
                          getNumericRules(
                            t.dashboard.forms.errors.required,
                            t.dashboard.forms.errors.minOne,
                            t.ad.errors.maxHundred,
                            isFieldRequired(tableId, "bathrooms"),
                          ),
                        )}
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

                <div className="box forInput">
                  <label>
                    {t.ad.area_m2}{" "}
                    {isFieldRequired(tableId, "area_m2") && (
                      <span className="required">*</span>
                    )}
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register(
                          "area_m2",
                          getNumericRules(
                            t.dashboard.forms.errors.required,
                            t.dashboard.forms.errors.minOne,
                            t.ad.errors.maxHundred,
                            isFieldRequired(tableId, "area_m2"),
                          ),
                        )}
                        disabled={!isEditable}
                        placeholder={t.ad.area_m2Placeholder}
                      />
                    </div>
                    {errors.area_m2 && (
                      <span className="error">
                        <CircleAlert />
                        {errors.area_m2.message}
                      </span>
                    )}
                  </div>
                </div>

                <SelectOptions
                  label={t.ad.level}
                  placeholder={t.ad.levelPlaceholder}
                  options={Levels}
                  value={additionalData.level}
                  onChange={(item) => {
                    setAdditionalData((prev) => ({
                      ...prev,
                      level: item,
                    }));
                    handleErrors("level", null);
                  }}
                  error={fieldErrors.level}
                  required={isFieldRequired(tableId, "level")}
                />
              </div>
            </div>
          )}

          {showCommercialDetails && (
            <div className="form-section">
              <h2 className="section-title">
                {t.dashboard.tables.property_details}
              </h2>
              <div className="row-holder two">
                <div className="box forInput">
                  <label>
                    {t.ad.area_m2}{" "}
                    {isFieldRequired(tableId, "area_m2") && (
                      <span className="required">*</span>
                    )}
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register(
                          "area_m2",
                          getNumericRules(
                            t.dashboard.forms.errors.required,
                            t.dashboard.forms.errors.minOne,
                            t.ad.errors.maxHundred,
                            isFieldRequired(tableId, "area_m2"),
                          ),
                        )}
                        disabled={!isEditable}
                        placeholder={t.ad.area_m2Placeholder}
                      />
                    </div>
                    {errors.area_m2 && (
                      <span className="error">
                        <CircleAlert />
                        {errors.area_m2.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showBuildingLandDetails && (
            <div className="form-section">
              <h2 className="section-title">
                {t.dashboard.tables.property_details}
              </h2>
              <div
                className="row-holder"
                style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
              >
                <div className="box forInput">
                  <label>
                    {t.ad.area_m2}{" "}
                    {isFieldRequired(tableId, "area_m2") && (
                      <span className="required">*</span>
                    )}
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="number"
                        {...register(
                          "area_m2",
                          getNumericRules(
                            t.dashboard.forms.errors.required,
                            t.dashboard.forms.errors.minOne,
                            t.ad.errors.maxHundred,
                            isFieldRequired(tableId, "area_m2"),
                          ),
                        )}
                        disabled={!isEditable}
                        placeholder={t.ad.area_m2Placeholder}
                      />
                    </div>
                    {errors.area_m2 && (
                      <span className="error">
                        <CircleAlert />
                        {errors.area_m2.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="box forInput">
                  <label>
                    Land Type{" "}
                    {isFieldRequired(tableId, "land_type") && (
                      <span className="required">*</span>
                    )}
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="text"
                        {...register("land_type")}
                        disabled={!isEditable}
                        placeholder="Enter land type"
                      />
                    </div>
                    {fieldErrors.land_type && (
                      <span className="error">
                        <CircleAlert />
                        {fieldErrors.land_type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="box forInput">
                  <label>
                    Usage Type{" "}
                    {isFieldRequired(tableId, "usage_type") && (
                      <span className="required">*</span>
                    )}
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="text"
                        {...register("usage_type")}
                        disabled={!isEditable}
                        placeholder="Enter usage type"
                      />
                    </div>
                    {fieldErrors.usage_type && (
                      <span className="error">
                        <CircleAlert />
                        {fieldErrors.usage_type}
                      </span>
                    )}
                  </div>
                </div>

                {isFieldAllowed(tableId, "floors") && (
                  <div className="box forInput">
                    <label>Floors</label>
                    <div className="inputHolder">
                      <div className="holder">
                        <input
                          type="number"
                          {...register("floors", {
                            min: {
                              value: 1,
                              message: t.dashboard.forms.errors.minOne,
                            },
                          })}
                          disabled={!isEditable}
                          placeholder="Enter floors count"
                        />
                      </div>
                      {errors.floors && (
                        <span className="error">
                          <CircleAlert />
                          {errors.floors.message}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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

              <SelectOptions
                label={t.enum.currencies}
                placeholder={t.location.select_currency}
                options={Currencies}
                value={additionalData.currency}
                onChange={(item) => {
                  handleErrors("currency", null);
                  setAdditionalData((prev) => ({
                    ...prev,
                    currency: item,
                  }));
                }}
                error={fieldErrors.currency}
                required
              />

              {showRentDetails && (
                <>
                  <div className="box forInput">
                    <label>
                      {t.ad.deposit_amount}{" "}
                      {isFieldRequired(tableId, "deposit_amount") && (
                        <span className="required">*</span>
                      )}
                    </label>
                    <div className="inputHolder">
                      <div className="holder">
                        <input
                          type="number"
                          {...register(
                            "deposit_amount",
                            getNumericRules(
                              t.dashboard.forms.errors.deposit_amount_reqire,
                              t.dashboard.forms.errors.deposit_amount_Min,
                              null,
                              isFieldRequired(tableId, "deposit_amount"),
                            ),
                          )}
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
                    label={t.enum.frequency}
                    placeholder={t.location.select_frequency}
                    options={RentFrequencies}
                    value={additionalData.frequency}
                    onChange={(item) => {
                      handleErrors("frequency", null);
                      setAdditionalData((prev) => ({
                        ...prev,
                        frequency: item,
                      }));
                    }}
                    error={fieldErrors.frequency}
                    required={isFieldRequired(tableId, "rent_frequency")}
                  />
                </>
              )}
            </div>
          </div>

          {showRentDetails && (
            <>
              <div className="form-section for-dates">
                <h2 className="section-title">{t.ad.rental_period}</h2>
                <div className="row-holder for-dates two">
                  <div className="box forInput">
                    <label>{t.ad.from}</label>
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
                            setRentAvailability((prev) => ({
                              ...prev,
                              from: formattedFrom,
                              to:
                                formattedFrom &&
                                prev.to &&
                                dayjs(prev.to).isBefore(
                                  dayjs(formattedFrom),
                                  "day",
                                )
                                  ? ""
                                  : prev.to,
                            }));
                          }}
                          slotProps={{
                            textField: datePickerTextFieldProps,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="box forInput right">
                    <label>{t.ad.to}</label>
                    <div className="inputHolder">
                      <div className="holder">
                        <DatePicker
                          format="YYYY-MM-DD"
                          value={
                            rentAvailability.to
                              ? dayjs(rentAvailability.to)
                              : null
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
                    <label>{t.ad.durationValue}</label>
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
                    options={RentPeriodUnit}
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
          )}

          {(isFieldAllowed(tableId, "adult_no_max") ||
            isFieldAllowed(tableId, "child_no_max")) && (
            <div className="form-section">
              <h2 className="section-title">
                {isVacation ? "Guest Capacity" : "Occupancy Details"}
              </h2>
              <div className="row-holder two">
                {isFieldAllowed(tableId, "child_no_max") && (
                  <div className="box forInput">
                    <label>{t.ad.childMax}</label>
                    <div className="inputHolder">
                      <div className="holder">
                        <input
                          type="number"
                          {...register("child_no_max", {
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
                )}

                {isFieldAllowed(tableId, "adult_no_max") && (
                  <div className="box forInput">
                    <label>
                      {t.ad.adultMax}{" "}
                      {isFieldRequired(tableId, "adult_no_max") && (
                        <span className="required">*</span>
                      )}
                    </label>
                    <div className="inputHolder">
                      <div className="holder">
                        <input
                          type="number"
                          {...register("adult_no_max", {
                            required: isFieldRequired(tableId, "adult_no_max")
                              ? t.dashboard.forms.errors.required
                              : false,
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
                )}
              </div>
            </div>
          )}

          {showSaleDetails && (
            <div className="form-section">
              <h2 className="section-title">Sale Options</h2>
              <div className="row-holder two">
                <SelectOptions
                  label="Payment Method"
                  placeholder={t.ad.PaymentMethod || "Select payment method"}
                  options={PaymentMethod}
                  value={additionalData.payment}
                  onChange={(item) => {
                    setAdditionalData((prev) => ({
                      ...prev,
                      payment: item,
                    }));
                    handleErrors("payment_method", null);
                  }}
                  error={fieldErrors.payment_method}
                  required={isFieldRequired(tableId, "payment_method")}
                />
                {isFieldAllowed(tableId, "installment_years") && (
                  <SelectOptions
                    label="Installment Years"
                    placeholder={t.ad.installmentYears || "Select years count"}
                    options={InstallmentYears}
                    value={additionalData.installmentYears}
                    onChange={(item) => {
                      setAdditionalData((prev) => ({
                        ...prev,
                        installmentYears: item,
                      }));
                    }}
                  />
                )}
                {isFieldAllowed(tableId, "down_payment") && (
                  <div className="box forInput">
                    <label>{t.ad.down_payment || "Down payment"}</label>
                    <div className="inputHolder">
                      <div className="holder">
                        <input
                          type="number"
                          {...register("downPayment", {
                            min: {
                              value: 1,
                              message:
                                t.dashboard.forms.errors.downPaymentMin ||
                                "Invalid down payment",
                            },
                          })}
                          disabled={!isEditable}
                          placeholder={
                            t.ad.downPaymentPlaceholder || "Enter down payment"
                          }
                        />
                      </div>
                      {errors.downPayment && (
                        <span className="error">
                          <CircleAlert />
                          {errors.downPayment.message}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {(isFieldAllowed(tableId, "furnished") ||
                isFieldAllowed(tableId, "ready_to_move")) && (
                <div className="row-holder two">
                  {isFieldAllowed(tableId, "furnished") && (
                    <div className="box forInput">
                      <div className="inputHolder">
                        <div
                          className="holder"
                          style={{ padding: "7px", cursor: "pointer" }}
                          onClick={() => toggleCheckBox("isFurnished")}
                        >
                          <div className="checkbox-wrapper-13">
                            <input
                              id="isFurnished"
                              type="checkbox"
                              checked={checkBoxes.isFurnished}
                              onChange={() => toggleCheckBox("isFurnished")}
                              onClick={(event) => event.stopPropagation()}
                            />
                            <label htmlFor="isFurnished">
                              {checkBoxes.isFurnished
                                ? "Property is furnished"
                                : "Property is not furnished"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isFieldAllowed(tableId, "ready_to_move") && (
                    <div className="box forInput">
                      <div className="inputHolder">
                        <div
                          className="holder"
                          style={{ padding: "7px", cursor: "pointer" }}
                          onClick={() => toggleCheckBox("isReadyToMove")}
                        >
                          <div className="checkbox-wrapper-13">
                            <input
                              id="isReadyToMove"
                              type="checkbox"
                              checked={checkBoxes.isReadyToMove}
                              onChange={() => toggleCheckBox("isReadyToMove")}
                              onClick={(event) => event.stopPropagation()}
                            />
                            <label htmlFor="isReadyToMove">
                              {checkBoxes.isReadyToMove
                                ? "Property is ready to move"
                                : "Property is not ready to move"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {isPropertyLike && (
            <div className="form-section">
              <h2 className="section-title">Current Property Data</h2>
              <div className="row-holder two">
                <div className="box forInput">
                  <label>Owner number 1</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="text"
                        {...register("owner_no1")}
                        disabled={!isEditable}
                        placeholder="Enter owner number 1"
                      />
                    </div>
                  </div>
                </div>
                <div className="box forInput">
                  <label>Owner number 2</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="text"
                        {...register("owner_no2")}
                        disabled={!isEditable}
                        placeholder="Enter owner number 2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row-holder two">
                <div className="box forInput">
                  <label>Delivery number 1</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="text"
                        {...register("delivery_no1")}
                        disabled={!isEditable}
                        placeholder="Enter delivery number 1"
                      />
                    </div>
                  </div>
                </div>
                <div className="box forInput">
                  <label>Delivery number 2</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="text"
                        {...register("delivery_no2")}
                        disabled={!isEditable}
                        placeholder="Enter delivery number 2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row-holder two">
                <div className="box forInput">
                  <label>Payment number 1</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="text"
                        {...register("payment_no1")}
                        disabled={!isEditable}
                        placeholder="Enter payment number 1"
                      />
                    </div>
                  </div>
                </div>
                <div className="box forInput">
                  <label>Payment number 2</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="text"
                        {...register("payment_no2")}
                        disabled={!isEditable}
                        placeholder="Enter payment number 2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-section">
            <h2 className="section-title">
              {t.ad.priority_verification || "Priority and verification"}
            </h2>
            <div
              className="row-holder"
              style={{ gridTemplateColumns: "0.5fr 1fr" }}
            >
              <div className="box forInput">
                <div className="inputHolder">
                  <div
                    className="holder"
                    style={{ padding: "7px", cursor: "pointer" }}
                    onClick={() => toggleCheckBox("isVerified")}
                  >
                    <div className="checkbox-wrapper-13">
                      <input
                        id="isVerified"
                        type="checkbox"
                        checked={checkBoxes.isVerified}
                        onChange={() => toggleCheckBox("isVerified")}
                        onClick={(event) => event.stopPropagation()}
                      />
                      <label htmlFor="isVerified">
                        {checkBoxes.isVerified
                          ? "Ad verified"
                          : "Ad is not verified"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <SelectOptions
                placeholder={t.ad.priorityPlaceholder || "Priority"}
                options={Priority}
                value={additionalData.priority}
                onChange={(item) => {
                  setAdditionalData((prev) => ({
                    ...prev,
                    priority: item,
                  }));
                }}
              />
            </div>
          </div>

          {allowedAmenities.length > 0 && (
            <div className="form-section">
              <h2 className="section-title">{t.ad.amenities}</h2>
              <div className="dynamicFilters-holder">
                <div className="box forInput">
                  <div className="options-grid flex">
                    {allowedAmenities.map((option) => {
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
                                prev.filter((value) => value !== option.id),
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
          )}

          <Tags disabled={!isEditable} />

          {((type === "admin" && !!adData?.subuser) || type === "client") && (
            <div className="form-section">
              <h2 className="section-title">{t.ad.theContactMethod}</h2>
              <div className="options-grid verfiyMethod">
                {methods.map(({ key, label, icon: Icon }) => {
                  const isActive = selectedContactMethods[key];

                  return (
                    <div
                      key={key}
                      className={`option-box ${isActive ? "active" : ""} ${fieldErrors.contact ? "error-border" : ""}`}
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

          <div className="form-section submit-section">
            <button
              type="submit"
              className={`main-button ${adId ? "update-button" : "create-button"}`}
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
