"use client";

import "@/styles/client/forms.css";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import Images from "@/components/Tools/data-collector/Images";
import Tags from "@/components/Tools/data-collector/Tags";
import { Phone, CircleAlert } from "lucide-react";
import { settings } from "@/Contexts/settings";
import { selectors } from "@/Contexts/selectors";
import { IoChatbubblesOutline } from "react-icons/io5";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  crateAd,
  createAnonymousAd,
  updateAd,
  getOneAd,
  assignAdmin,
  changeStatus,
} from "@/services/ads/ads.service";
import { useAppData } from "@/Contexts/DataContext";
import {
  Amenities,
  BuildingAndLandsTypes,
  BuildingCondition,
  BuildingType,
  Currencies,
  InstallmentYears,
  LandType,
  Levels,
  PaymentMethod,
  Priority,
  RentFrequencies,
  RentPeriodUnit,
} from "@/data/enums";
import { useNotification } from "@/Contexts/NotificationContext";
import useRedirectAfterLogin from "@/Contexts/useRedirectAfterLogin";
import { useAuth } from "@/Contexts/AuthContext";
import { getAllUsers } from "@/services/auth/auth.service";
import {
  deleteImage,
  updateImage,
  uploadImages,
} from "@/services/images/images.service";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  getTableRule,
  isFieldAllowed,
  isFieldRequired,
} from "@/data/tablesRules";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";
import CatCard from "@/components/home/CatCard";
import DynamicMenu from "@/components/Tools/DynamicMenu";
import DeleteConfirm from "@/components/Tools/DeleteConfirm";
import { useRouter } from "next/navigation";

const getNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? null : numericValue;
};

const getBooleanAdField = (ad, field) =>
  Boolean(ad?.[field] ?? ad?.details?.[field]);
const getAdField = (ad, field) => ad?.[field] ?? ad?.details?.[field] ?? null;
const formatTagsForInput = (tags) => {
  if (Array.isArray(tags)) return tags.join(", ");
  if (typeof tags !== "string") return tags || "";

  try {
    const parsedTags = JSON.parse(tags);
    return Array.isArray(parsedTags) ? parsedTags.join(", ") : tags;
  } catch {
    return tags;
  }
};
const parseTagsForState = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof tags !== "string") return [];

  try {
    const parsedTags = JSON.parse(tags);
    if (Array.isArray(parsedTags)) {
      return parsedTags.map((tag) => String(tag).trim()).filter(Boolean);
    }
  } catch {}

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};
const getAdIdFromResponse = (res) =>
  res?.data?.adId ??
  res?.data?.id ??
  res?.data?.ad?.id ??
  res?.data?.data?.adId ??
  res?.data?.data?.id ??
  res?.data?.data?.ad?.id ??
  null;

const AD_TITLE_MAX_LENGTH = 191;
const AD_DESCRIPTION_MAX_LENGTH = 1200;

const getMaxLengthMessage = (message, limit) =>
  message?.replace("{limit}", limit) || `Must be ${limit} characters or less`;

const DescriptionField = ({ disabled, errors, register, t }) => (
  <div className="box forInput">
    <label>{t.dashboard.forms.description}</label>
    <div className="inputHolder">
      <div className="holder">
        <textarea
          {...register("description", {
            required:
              t.ad.errors.description ||
              t.dashboard.forms.errors.required ||
              "Description is required",
            maxLength: {
              value: AD_DESCRIPTION_MAX_LENGTH,
              message: getMaxLengthMessage(
                t.ad.errors.descriptionMax ||
                  t.dashboard.forms.errors.descriptionMax,
                AD_DESCRIPTION_MAX_LENGTH,
              ),
            },
          })}
          maxLength={AD_DESCRIPTION_MAX_LENGTH}
          placeholder={t.dashboard.forms.descriptionPlaceholder}
          rows={4}
          disabled={disabled}
        />
      </div>
      {errors.description && (
        <span className="error">
          <CircleAlert />
          {errors.description.message}
        </span>
      )}
    </div>
  </div>
);

const isVacationTable = (table) =>
  table?.name_en?.toLowerCase()?.includes("vacation");

const isSaleTable = (table) =>
  table?.name_en?.toLowerCase()?.includes("for sale");

const isRentTable = (table) =>
  table?.name_en?.toLowerCase()?.includes("for rent");

const cleanTableName = (name = "") =>
  name
    .replace(/for sale/i, "")
    .replace(/for rent/i, "")
    .trim();

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

export default function AdForm({
  type = "client",
  adId,
  initialTableId = null,
  stepped = false,
  anonymousMode = false,
  reviewActions = false,
}) {
  const isClientCreateCard = type === "client";

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
  const { user, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();
  const router = useRouter();
  const { tags, setTags } = useContext(selectors);

  const [adData, setAdData] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [allAdmins, setAllAdmins] = useState([]);
  const canAssignAdmin =
    user?.permissions?.includes("ASSIGN_RESPONSIBILITY") ||
    user?.is_super_admin;
  const [loadingContent, setLoadingContnet] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingReviewAction, setLoadingReviewAction] = useState(false);
  const [reviewMenuOpen, setReviewMenuOpen] = useState(false);
  const [updateWarningOpen, setUpdateWarningOpen] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState(null);
  const [rejectInput, setRejectInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactSubmitAttempted, setContactSubmitAttempted] = useState(false);
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
  const [selectedAdmin, setSelectedAdmin] = useState(
    type === "admin" && !adId ? user : null,
  );
  const [selectedMediatorMethod, setSelectedMediatorMethod] = useState({
    id: type === "admin" && !adId ? 2 : 1,
    name: type === "admin" && !adId ? t.ad.userToAdmin : t.ad.userToUser,
  });
  const [selectedContactMethods, setSelectedContactMethods] = useState({
    chat: false,
    phone: false,
  });
  const [checkBoxes, setCheckBoxes] = useState({
    isFurnished: false,
    isReadyToMove: false,
    isVerified: false,
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
    installmentYears: null,
    buildingAndLandsType: null,
    landType: null,
    buildingType: null,
    buildingCondition: null,
    priority: Priority[3],
  });
  const [rentAvailability, setRentAvailability] = useState({
    from: "",
    to: "",
  });
  const isStepped = stepped && type === "client" && !adId;
  const isRequestMode = anonymousMode;
  const needsAnonymousContact = isRequestMode && !authLoading && !user;
  const rejectReason =
    adData?.reason ||
    adData?.reject_reason ||
    adData?.rejection_reason ||
    adData?.rejected_reason ||
    "";
  const STEPS = {
    DEPARTMENT: 1,
    CATEGORY: 1,
    BASICS: 2,
    DETAILS: 3,
    OWNER: needsAnonymousContact ? 4 : null,
    CONTACT: needsAnonymousContact ? 5 : 4,
  };
  const STEP_FLOW = [...new Set(Object.values(STEPS).filter(Boolean))];
  const [step, setStep] = useState(STEPS.DEPARTMENT);
  const isAnonymous = needsAnonymousContact;
  const [selectedRootGroup, setSelectedRootGroup] = useState(null);
  const [selectedVacationGroup, setSelectedVacationGroup] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    getValues,
  } = useForm();

  const createAdNavigation = useMemo(() => {
    const getSubCategories = (categoryId) =>
      subCategories.filter(
        (subCategory) => subCategory.category_id === categoryId,
      );

    const vacationTables = tables.filter(isVacationTable);
    const vacationMap = {};

    vacationTables.forEach((table) => {
      const mode = isSaleTable(table) ? "sale" : "rent";

      categories
        .filter((category) => category.table_id === table.id)
        .forEach((category) => {
          const key = category.name_en.toLowerCase();

          if (!vacationMap[key]) {
            vacationMap[key] = {
              id: key,
              name_en: category.name_en,
              name_ar: category.name_ar,
              items: [],
            };
          }

          vacationMap[key].items.push({
            ...category,
            id: `${category.id}_${mode}`,
            category_id: category.id,
            table_id: table.id,
            mode,
            name_en:
              mode === "sale"
                ? `${category.name_en} For Sale`
                : `${category.name_en} For Rent`,
            name_ar:
              mode === "sale"
                ? `${category.name_ar} للبيع`
                : `${category.name_ar} للإيجار`,
            children: getSubCategories(category.id),
          });
        });
    });

    const vacationRoot = {
      id: "vacation_homes",
      name_en: "Vacation Homes",
      name_ar: "عقارات مصيفية",
      children: Object.values(vacationMap).map((item) => ({
        id: item.id,
        name_en: item.name_en,
        name_ar: item.name_ar,
        children: item.items,
      })),
    };

    const saleRoot = {
      id: "properties_sale",
      name_en: "Properties for Sale",
      name_ar: "عقارات للبيع",
      children: [],
    };

    const rentRoot = {
      id: "properties_rent",
      name_en: "Properties for Rent",
      name_ar: "عقارات للإيجار",
      children: [],
    };

    tables
      .filter(
        (table) =>
          !isVacationTable(table) && (isSaleTable(table) || isRentTable(table)),
      )
      .forEach((table) => {
        const root = isSaleTable(table) ? saleRoot : rentRoot;

        root.children.push({
          ...table,
          table_id: table.id,
          name_en: cleanTableName(table.name_en),
          name_ar: cleanTableName(table.name_ar),
          children: categories
            .filter((category) => category.table_id === table.id)
            .map((category) => ({
              ...category,
              children: getSubCategories(category.id),
            })),
        });
      });

    const otherTables = tables.filter(
      (table) =>
        !isVacationTable(table) && !isSaleTable(table) && !isRentTable(table),
    );

    return [
      vacationRoot,
      saleRoot,
      rentRoot,
      ...otherTables.map((table) => ({
        id: table.id,
        name_en: table.name_en,
        name_ar: table.name_ar,
        children: [
          {
            ...table,
            table_id: table.id,
            children: categories
              .filter((category) => category.table_id === table.id)
              .map((category) => ({
                ...category,
                children: getSubCategories(category.id),
              })),
          },
        ],
      })),
    ].filter((group) => group.children.length > 0);
  }, [categories, subCategories, tables]);

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
  const isHomes = [1, 2, 3, 4, 5, 6]?.includes(tableId);

  const allowedAmenities = useMemo(
    () => Amenities.filter((item) => amenityFields?.includes(item.id)),
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
  const shouldForceAdminContact = Boolean(adId && adData && !adData.subuser);
  const adminContactMethodOptions = shouldForceAdminContact
    ? contactMethod.filter((method) => method.id === 2)
    : contactMethod;
  const canReviewPendingAd =
    reviewActions && type === "admin" && adId && adData?.status === "PENDING";
  const uploaderInfo = useMemo(() => {
    if (!adId || !adData) return null;

    const source = adData.anonymous
      ? {
          type: locale === "ar" ? "زائر" : "Anonymous",
          data: adData.anonymous,
        }
      : adData.subuser
        ? {
            type: locale === "ar" ? "سبيوزر" : "Subuser",
            data: adData.subuser,
          }
        : adData.user
          ? {
              type: locale === "ar" ? "مستخدم" : "User",
              data: adData.user,
            }
          : adData.admin
            ? {
                type: locale === "ar" ? "أدمن" : "Admin",
                data: adData.admin,
              }
            : null;

    if (!source) return null;

    return {
      type: source.type,
      name: source.data?.full_name || "-",
      email: source.data?.email || "-",
      phone: source.data?.phone || "-",
      ip: source.data?.ip_address || null,
    };
  }, [adData, adId, locale]);

  const methods = [
    { key: "phone", label: t.ad.contact_via_phone, icon: Phone },
    { key: "chat", label: t.ad.contact_via_chat, icon: IoChatbubblesOutline },
  ];

  const validationFieldLabels = {
    dep: "Department",
    cat: "Category",
    subCat: "Sub category",
    gov: "Governorate",
    city: "City",
    admin: "Responsible admin",
    images: "Images",
    currency: "Currency",
    contact: "Contact method",
    anonymous_full_name: "Anonymous full name",
    anonymous_contact: "Anonymous email or phone",
    level: "Level",
    payment_method: "Payment method",
    frequency: "Rent frequency",
    type: "Building or land",
    land_type: "Land type",
    building_type: "Building type",
    building_condition: "Building condition",
  };

  const logValidationAndScroll = (source, validationErrors) => {
    const readableErrors = Object.fromEntries(
      Object.entries(validationErrors).map(([field, message]) => [
        validationFieldLabels[field] || field,
        message,
      ]),
    );

    console.log("[AdForm validation]", source, validationErrors);
    console.log("[AdForm validation readable]", source, readableErrors);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (adId && initialTableId) {
      fetchAdData();
    }
  }, [adId, initialTableId]);

  useEffect(() => {
    if (step > STEPS.CONTACT) {
      setStep(STEPS.CONTACT);
    }
  }, [STEPS.CONTACT, step]);

  useEffect(() => {
    if (!adId) {
      setTags([]);
    }
  }, [adId, setTags]);

  useEffect(() => {
    if (!isRequestMode || !user) return;

    setValue("anonymous_full_name", user.full_name || "");
    setValue("anonymous_email", user.email || "");
    setValue("anonymous_phone", user.phone || "");
  }, [isRequestMode, setValue, user]);

  useEffect(() => {
    if (adId && canAssignAdmin) {
      fetchAdmins();
    }
  }, [adId, canAssignAdmin]);

  useEffect(() => {
    if (shouldForceAdminContact) {
      setSelectedMediatorMethod({ id: 2, name: t.ad.userToAdmin });
    }
  }, [shouldForceAdminContact, t.ad.userToAdmin]);

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

      const res = await getOneAd(
        targetTableId,
        adId,
        type === "admin" ? { scope: "dashboard" } : undefined,
      );
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
    const ownerId =
      ad.subuser?.id ??
      ad.subuser_id ??
      ad.user?.id ??
      ad.user_id ??
      ad.admin?.id ??
      ad.admin_id;
    return (
      ownerId === user.id || user.user_type === "ADMIN" || user.is_super_admin
    );
  };

  const fillFormWithAdData = (ad) => {
    setValue("adTitle", ad.title || "");
    setValue("rentAmount", ad.price || "");
    setValue("deposit_amount", getAdField(ad, "deposit_amount") || "");
    setValue("description", ad.description || "");
    setValue("tags", formatTagsForInput(ad.tags));
    setTags(parseTagsForState(ad.tags));
    setValue("bedrooms", getAdField(ad, "bedrooms") || "");
    setValue("bathrooms", getAdField(ad, "bathrooms") || "");
    setValue("area_m2", getAdField(ad, "area_m2") || "");
    setValue("child_no_max", getAdField(ad, "child_no_max") || "");
    setValue("adult_no_max", getAdField(ad, "adult_no_max") || "");
    setValue("rentalDuration", getAdField(ad, "min_rent_period") || "");
    setValue("downPayment", getAdField(ad, "down_payment") || "");
    setValue("floors", getAdField(ad, "floors") || "");

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
      installmentYears:
        InstallmentYears.find(
          (item) => item.id == getAdField(ad, "installment_years"),
        ) || null,
      buildingAndLandsType:
        BuildingAndLandsTypes.find(
          (item) => item.id == getAdField(ad, "type"),
        ) || null,
      landType:
        LandType.find((item) => item.id == getAdField(ad, "land_type")) || null,
      buildingType:
        BuildingType.find(
          (item) => item.id == getAdField(ad, "building_type"),
        ) || null,
      buildingCondition:
        BuildingCondition.find(
          (item) =>
            item.id ==
            (getAdField(ad, "building_condition") ||
              getAdField(ad, "usage_type")),
        ) || null,
      priority:
        Priority.find(
          (item) => item.id == getAdField(ad, "featured_priority"),
        ) || Priority[1],
    });

    setCheckBoxes({
      isFurnished: getBooleanAdField(ad, "furnished"),
      isReadyToMove: getBooleanAdField(ad, "ready_to_move"),
      isVerified: getBooleanAdField(ad, "is_verified"),
    });

    const activeAmenities = Amenities.filter((item) => {
      const nestedValue = ad?.amenities?.[item.key];
      const flatValue = ad?.[item.id] ?? ad?.[item.key];
      return Boolean(nestedValue || flatValue);
    }).map((item) => item.id);

    setSelectedAmenities(activeAmenities);

    if (ad.admin || !ad.subuser) {
      setSelectedAdmin(ad.admin || null);
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
    if (needsAnonymousContact) {
      if (!data.anonymous_full_name) {
        newErrors.anonymous_full_name = t.dashboard.forms.errors.required;
      }
      if (!data.anonymous_email && !data.anonymous_phone) {
        newErrors.anonymous_contact =
          "Please add either an email or a phone number";
      }
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
    if (
      showBuildingLandDetails &&
      additionalData.buildingAndLandsType?.id === "LAND" &&
      !additionalData.landType
    ) {
      newErrors.land_type = t.dashboard.forms.errors.required;
    }
    if (
      showBuildingLandDetails &&
      additionalData.buildingAndLandsType?.id === "BUILDING" &&
      !additionalData.buildingType
    ) {
      newErrors.building_type = t.dashboard.forms.errors.required;
    }
    if (
      showBuildingLandDetails &&
      additionalData.buildingAndLandsType?.id === "BUILDING" &&
      !additionalData.buildingCondition
    ) {
      newErrors.building_condition = t.dashboard.forms.errors.required;
    }
    if (
      isFieldRequired(tableId, "type") &&
      !additionalData.buildingAndLandsType
    ) {
      newErrors.type = t.dashboard.forms.errors.required;
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      logValidationAndScroll("submit", newErrors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const mapAmenities = () => {
    return allowedAmenities.reduce((accumulator, item) => {
      accumulator[item.id] = selectedAmenities?.includes(item.id);
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
      tags: tags.join(","),
    };

    if (needsAnonymousContact) {
      payload.anonymous = {
        full_name: data.anonymous_full_name,
        email: data.anonymous_email || null,
        phone: data.anonymous_phone || null,
      };
    }

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
    if (isFieldAllowed(tableId, "type")) {
      const entityType = additionalData.buildingAndLandsType?.id || null;

      payload.type = entityType;
      payload.land_type =
        entityType === "LAND" ? additionalData.landType?.id || null : null;
      payload.building_type =
        entityType === "BUILDING"
          ? additionalData.buildingType?.id || null
          : null;
      payload.building_condition =
        entityType === "BUILDING"
          ? additionalData.buildingCondition?.id || null
          : null;
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
    if (type === "admin") {
      payload.is_verified = checkBoxes.isVerified;
      payload.featured_priority = additionalData.priority?.id ?? 0;
    }

    return {
      ...payload,
      ...mapAmenities(),
    };
  };

  const submitAd = async (payload) => {
    if (adId) return updateAd(tableId, adId, payload);
    return anonymousMode && !user
      ? createAnonymousAd(tableId, payload)
      : crateAd(tableId, payload);
  };

  const uploadNewImages = async (targetAdId) => {
    const newImages = images
      .map((img, index) => ({ ...img, order: index }))
      .filter((img) => img?.file instanceof File);
    if (newImages.length === 0) return;

    const formData = new FormData();
    const coverIndex = images[0]?.file instanceof File ? 0 : -1;
    formData.append("cover_index", String(coverIndex));

    newImages.forEach((img) => {
      formData.append("files", img.file);
      formData.append("orders", String(img.order));
    });

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    await uploadImages("AD", targetAdId, formData, tableId);
  };

  const syncExistingImageOrders = async (targetAdId) => {
    const existingImages = images
      .map((img, index) => ({ ...img, nextOrder: index }))
      .filter((img) => img?.id && !(img?.file instanceof File));

    await Promise.all(
      existingImages.map((img) => {
        const currentOrder = Number(img.order);

        if (currentOrder === img.nextOrder) return Promise.resolve();

        return updateImage("AD", targetAdId, img.id, { order: img.nextOrder });
      }),
    );
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
    type: "required",
    land_type: "required",
    building_type: "required",
    building_condition: "required",
  };

  const stepTitles = {
    [STEPS.DEPARTMENT]: selectedRootGroup
      ? t.ad.choose_category
      : t.ad.choose_table || "Choose department",
    [STEPS.BASICS]: t.ad.ad_basics,
    [STEPS.DETAILS]: t.ad.ad_details,
    ...(needsAnonymousContact && {
      [STEPS.OWNER]: "Your contact details",
    }),
    [STEPS.CONTACT]: t.ad.contact_information,
  };

  const stepDescriptions = {
    [STEPS.DEPARTMENT]: selectedRootGroup
      ? t.ad.choose_category_description
      : t.ad.choose_category_description ||
        "Select the department that best fits your ad.",
    [STEPS.BASICS]: t.ad.ad_basics_description,
    [STEPS.DETAILS]: t.ad.ad_details_description,
    ...(needsAnonymousContact && {
      [STEPS.OWNER]:
        "Add your contact details so the admin can review your ad request.",
    }),
    [STEPS.CONTACT]: t.ad.contact_information_description,
  };

  const isStepVisible = (targetStep) => !isStepped || step === targetStep;
  const getStepClass = (targetStep) =>
    isStepVisible(targetStep) ? "" : "step-hidden";

  const validateCurrentStep = async () => {
    if (!isStepped) return true;

    const newErrors = {};

    if (step === STEPS.DEPARTMENT) {
      if (!selectedRootGroup) newErrors.dep = t.ad.select_table;
    }

    if (step === STEPS.CATEGORY) {
      if (!selectedCats.dep) newErrors.dep = t.ad.select_table;
      if (
        isFieldRequired(tableId, "type") &&
        !additionalData.buildingAndLandsType
      ) {
        newErrors.type = t.dashboard.forms.errors.required;
      }
      if (!selectedCats.cat) newErrors.cat = t.ad.errors.category;
      if (filteredSubCategories.length > 0 && !selectedCats.subCat) {
        newErrors.subCat =
          t.ad.errors.subCategory || "Please choose a subcategory";
      }
    }

    if (step === STEPS.DETAILS) {
      if (
        showBuildingLandDetails &&
        additionalData.buildingAndLandsType?.id === "LAND" &&
        !additionalData.landType
      ) {
        newErrors.land_type = t.dashboard.forms.errors.required;
      }
      if (
        showBuildingLandDetails &&
        additionalData.buildingAndLandsType?.id === "BUILDING" &&
        !additionalData.buildingType
      ) {
        newErrors.building_type = t.dashboard.forms.errors.required;
      }
      if (
        showBuildingLandDetails &&
        additionalData.buildingAndLandsType?.id === "BUILDING" &&
        !additionalData.buildingCondition
      ) {
        newErrors.building_condition = t.dashboard.forms.errors.required;
      }
    }

    if (step === STEPS.BASICS) {
      const basicsFields = ["adTitle", "rentAmount"];
      if (type === "admin") {
        basicsFields.push("description");
      }

      if (
        isFieldAllowed(tableId, "area_m2") &&
        (showCommercialDetails || showBuildingLandDetails)
      ) {
        basicsFields.push("area_m2");
      }

      const basicsValid = await trigger(basicsFields);
      if (!selectedLocations.gov) newErrors.gov = t.ad.errors.governorate;
      if (!selectedLocations.city) newErrors.city = t.ad.errors.city;
      if (!additionalData.currency) newErrors.currency = t.ad.errors.currency;
      if (images.length === 0) newErrors.images = t.ad.images.errors.required;
      if (!basicsValid) {
        setIsSubmitted(true);
      }
    }

    if (step === STEPS.DETAILS) {
      const detailsFields = [
        "bedrooms",
        "bathrooms",
        "adult_no_max",
        "child_no_max",
      ];
      if (type !== "admin") {
        detailsFields.push("description");
      }

      if (!showCommercialDetails && !showBuildingLandDetails) {
        detailsFields.push("area_m2");
      }

      const detailsValid = await trigger(detailsFields);
      if (isFieldRequired(tableId, "level") && !additionalData.level) {
        newErrors.level = t.dashboard.forms.errors.required;
      }
      if (
        isFieldRequired(tableId, "payment_method") &&
        !additionalData.payment
      ) {
        newErrors.payment_method = t.dashboard.forms.errors.required;
      }
      if (
        isFieldRequired(tableId, "rent_frequency") &&
        !additionalData.frequency
      ) {
        newErrors.frequency = t.ad.errors.frequency;
      }
      if (!detailsValid) {
        setIsSubmitted(true);
      }
    }

    if (needsAnonymousContact && step === STEPS.OWNER) {
      const anonymousValid = await trigger([
        "anonymous_full_name",
        "anonymous_email",
        "anonymous_phone",
      ]);
      const anonymousValues = getValues();
      const hasAnonymousContact =
        Boolean(anonymousValues.anonymous_email) ||
        Boolean(anonymousValues.anonymous_phone);

      if (!hasAnonymousContact) {
        newErrors.anonymous_contact =
          "Please add either an email or a phone number";
      }
      if (!anonymousValid) {
        setIsSubmitted(true);
      }
    }

    if (step === STEPS.CONTACT) {
      if (!selectedContactMethods.phone && !selectedContactMethods.chat) {
        newErrors.contact =
          t.ad.contact_method_required || "Please choose a contact method";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      logValidationAndScroll(`step ${step}`, newErrors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const goNextStep = async () => {
    if (!(await validateCurrentStep())) return;
    setStep((prev) => Math.min(prev + 1, STEPS.CONTACT));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPreviousStep = () => {
    setFieldErrors({});
    if (isStepped && step === STEPS.CATEGORY) {
      if (selectedRootGroup?.id === "vacation_homes") {
        if (selectedCats.cat) {
          setSelectedCats({
            dep: null,
            cat: null,
            subCat: null,
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        if (selectedVacationGroup) {
          setSelectedVacationGroup(null);
          setSelectedCats({
            dep: null,
            cat: null,
            subCat: null,
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      if (selectedCats.cat) {
        setSelectedCats((prev) => ({
          ...prev,
          cat: null,
          subCat: null,
        }));
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (showBuildingLandDetails && additionalData.buildingAndLandsType) {
        setAdditionalData((prev) => ({
          ...prev,
          buildingAndLandsType: null,
          landType: null,
          buildingType: null,
          buildingCondition: null,
        }));
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (selectedCats.dep) {
        setSelectedCats({
          dep: null,
          cat: null,
          subCat: null,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (selectedRootGroup) {
        setSelectedRootGroup(null);
        resetAdTaxonomy();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    setStep((prev) => Math.max(prev - 1, STEPS.DEPARTMENT));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAdTaxonomy = () => {
    setSelectedCats({
      dep: null,
      cat: null,
      subCat: null,
    });
    setSelectedVacationGroup(null);
    setSelectedAmenities([]);
    setAdditionalData((prev) => ({
      ...prev,
      buildingAndLandsType: null,
      landType: null,
      buildingType: null,
      buildingCondition: null,
    }));
  };

  const selectRootGroup = (group) => {
    setSelectedRootGroup(group);
    resetAdTaxonomy();
    setFieldErrors({});
    setStep(STEPS.CATEGORY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectTable = (table) => {
    const fullTable =
      tables.find((item) => item.id === table.table_id) || table;

    setSelectedCats({
      dep: fullTable,
      cat: null,
      subCat: null,
    });
    setSelectedAmenities([]);
    handleErrors("dep", null);
    handleErrors("cat", null);
    handleErrors("subCat", null);
  };

  const selectCategory = (category) => {
    const fullCategory =
      categories.find(
        (item) => item.id === (category.category_id || category.id),
      ) || category;

    setSelectedCats((prev) => ({
      ...prev,
      cat: fullCategory,
      subCat: null,
    }));
    handleErrors("cat", null);
    handleErrors("subCat", null);
  };

  const selectTableCategory = (table, category) => {
    const fullTable =
      tables.find((item) => item.id === table.table_id) || table;
    const fullCategory =
      categories.find(
        (item) => item.id === (category.category_id || category.id),
      ) || category;

    setSelectedCats({
      dep: fullTable,
      cat: fullCategory,
      subCat: null,
    });
    setSelectedAmenities([]);
    handleErrors("dep", null);
    handleErrors("cat", null);
    handleErrors("subCat", null);
  };

  const selectVacationItem = (item) => {
    const table = tables.find((target) => target.id === item.table_id);
    const category = categories.find(
      (target) => target.id === item.category_id,
    );

    if (!table || !category) return;

    setSelectedCats({
      dep: table,
      cat: category,
      subCat: null,
    });
    handleErrors("dep", null);
    handleErrors("cat", null);
    handleErrors("subCat", null);
  };

  const closeReviewMenu = () => {
    setReviewMenuOpen(false);
    setRejectInput("");
    setLoadingReviewAction(false);
  };

  const handleReviewStatus = async (status, reason) => {
    const targetTableId = Number(initialTableId || tableId);
    if (!targetTableId || !adId) return;

    setLoadingReviewAction(true);
    try {
      if (status === "ACTIVE") {
        setIsSubmitted(true);
        setContactSubmitAttempted(true);

        const isFormValid = await trigger();
        const currentData = getValues();

        if (!isFormValid || !validateForm(currentData)) {
          return;
        }

        const savedAdId = await submitValidatedAd(currentData, {
          redirectOnSuccess: false,
          showSuccessNotification: false,
        });

        if (!savedAdId) {
          return;
        }
      }

      await changeStatus(targetTableId, adId, {
        status,
        ...(reason ? { reason } : {}),
      });

      addNotification({
        type: "success",
        message:
          status === "ACTIVE"
            ? locale === "ar"
              ? "تم قبول الإعلان"
              : "Ad accepted"
            : locale === "ar"
              ? "تم رفض الإعلان"
              : "Ad rejected",
      });

      router.push("/dashboard/ads/pending");
    } catch (error) {
      addNotification({
        type: "error",
        message: error.response?.data?.message || t.common.somethingWentWrong,
      });
    } finally {
      setLoadingReviewAction(false);
      closeReviewMenu();
    }
  };

  const closeUpdateWarning = () => {
    setUpdateWarningOpen(false);
    setPendingSubmitData(null);
  };

  const canGoBackInTaxonomy =
    isStepped &&
    step === STEPS.CATEGORY &&
    Boolean(
      selectedRootGroup ||
      selectedVacationGroup ||
      selectedCats.dep ||
      selectedCats.cat ||
      selectedCats.subCat,
    );
  const showCategoryRootTitle =
    !selectedCats.dep && !selectedVacationGroup && !selectedCats.cat;

  const submitValidatedAd = async (
    data,
    { redirectOnSuccess = true, showSuccessNotification = true } = {},
  ) => {
    const payload = buildPayload(data);
    setLoadingSubmit(true);

    try {
      const res = await submitAd(payload);
      const finalAdId = adId || getAdIdFromResponse(res);

      if (!finalAdId) {
        throw new Error("Ad was saved, but the created ad id was not returned");
      }

      if (adId) {
        await syncExistingImageOrders(finalAdId);
      }
      await uploadNewImages(finalAdId);
      if (adId) {
        await handleDeletedImages(finalAdId);
      }
      if (type === "admin" && adId) {
        if (selectedMediatorMethod?.id === 2 && selectedAdmin) {
          await assignAdmin(tableId, finalAdId, { admin_id: selectedAdmin.id });
        } else if (selectedMediatorMethod?.id === 1) {
          await assignAdmin(tableId, finalAdId, { admin_id: null });
        }
      }

      if (showSuccessNotification) {
        addNotification({
          type: "success",
          message: adId ? t.ad.ad_updated : t.ad.ad_created,
        });
      }

      if (redirectOnSuccess) {
        redirectAfterLogin(
          anonymousMode
            ? "/"
            : type === "client"
              ? "/mylisting"
              : "/dashboard/ads/all",
        );
      }

      return finalAdId;
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
      return null;
    } finally {
      setLoadingSubmit(false);
    }
  };

  const onSubmit = async (data) => {
    if (!validateForm(data)) return;

    if (type === "client" && adId && user?.user_type === "USER") {
      setPendingSubmitData(data);
      setUpdateWarningOpen(true);
      return;
    }

    await submitValidatedAd(data);
  };

  const confirmUserUpdate = async () => {
    if (!pendingSubmitData) return;
    await submitValidatedAd(pendingSubmitData);
  };

  const onInvalidSubmit = (validationErrors) => {
    setIsSubmitted(true);
    setContactSubmitAttempted(true);
    logValidationAndScroll("react-hook-form submit", validationErrors);
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
  const showContactErrors = contactSubmitAttempted;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <div
        className={`form-holder create-ad ${type === "client" ? "user-create-ad" : "admin-create-ad"}`}
      >
        <form
          onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
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

          {isStepped && (
            <>
              <div className="top">
                <h1>{stepTitles[step]}</h1>
                <p>{stepDescriptions[step]}</p>
              </div>
              <div className="steps-holder">
                {STEP_FLOW.map((stepItem, index, arr) => (
                  <div className="step-wrapper" key={stepItem}>
                    <div
                      className={`step ${
                        step > stepItem ? "done" : ""
                      } ${step === stepItem ? "current" : ""}`}
                    >
                      {stepItem}
                    </div>
                    {index !== arr.length - 1 && <span className="bar"></span>}
                  </div>
                ))}
              </div>
            </>
          )}

          {rejectReason && (
            <div className="form-section reject-reason-banner">
              <h2 className="section-title">{t.common.rejectReason}</h2>
              <p>{rejectReason}</p>
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
                    options={adminContactMethodOptions}
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

          {type === "admin" && adId && uploaderInfo && (
            <div className="form-section uploader-summary">
              <h2 className="section-title">
                {locale === "ar" ? "بيانات الرافع" : "Uploader details"}
              </h2>
              <div className="uploader-summary-grid">
                <div>
                  <span>{locale === "ar" ? "النوع" : "Type"}</span>
                  <strong>{uploaderInfo.type}</strong>
                </div>
                <div>
                  <span>{locale === "ar" ? "الاسم" : "Name"}</span>
                  <strong>{uploaderInfo.name}</strong>
                </div>
                <div>
                  <span>{locale === "ar" ? "البريد" : "Email"}</span>
                  <strong>{uploaderInfo.email}</strong>
                </div>
                <div>
                  <span>{locale === "ar" ? "الهاتف" : "Phone"}</span>
                  <strong>{uploaderInfo.phone}</strong>
                </div>
                {uploaderInfo.ip && (
                  <div>
                    <span>IP</span>
                    <strong>{uploaderInfo.ip}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {isStepped && step === STEPS.DEPARTMENT && !selectedRootGroup && (
            <div className="form-section category-picker-step">
              <h2 className="section-title">{t.ad.choose_table}</h2>
              {fieldErrors.dep && (
                <span className="error">
                  <CircleAlert />
                  {fieldErrors.dep}
                </span>
              )}
              <div className="options-grid">
                {createAdNavigation.map((group) => (
                  <CatCard
                    key={group.id}
                    data={group}
                    type="tables"
                    position="when-create-ad"
                    className={isClientCreateCard ? "user-create-card" : ""}
                    hideCount={isClientCreateCard}
                    activeClass={selectedRootGroup?.id === group.id}
                    onSelect={() => selectRootGroup(group)}
                  />
                ))}
              </div>
            </div>
          )}

          {isStepped && step === STEPS.CATEGORY && selectedRootGroup && (
            <div className="form-section category-picker-step">
              {showCategoryRootTitle && (
                <h2 className="section-title">
                  {selectedRootGroup?.[`name_${locale}`] ||
                    t.ad.choose_category}
                </h2>
              )}
              {fieldErrors.dep && (
                <span className="error">
                  <CircleAlert />
                  {fieldErrors.dep}
                </span>
              )}
              {fieldErrors.cat && (
                <span className="error">
                  <CircleAlert />
                  {fieldErrors.cat}
                </span>
              )}

              {selectedCats.cat && filteredSubCategories.length > 0 ? (
                <>
                  <h2 className="section-title">{t.ad.choose_sub_category}</h2>
                  {fieldErrors.subCat && (
                    <span className="error">
                      <CircleAlert />
                      {fieldErrors.subCat}
                    </span>
                  )}
                  <div className="options-grid">
                    {filteredSubCategories.map((subCategory) => (
                      <div
                        key={subCategory.id}
                        className={`cat-card ${isClientCreateCard ? "user-create-card" : ""} ${
                          selectedCats.subCat?.id === subCategory.id
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedCats((prev) => ({
                            ...prev,
                            subCat: subCategory,
                          }));
                          handleErrors("subCat", null);
                          setStep(STEPS.BASICS);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <h4 className="cat-name ellipsis">
                          {subCategory?.[`name_${locale}`]}
                        </h4>
                      </div>
                    ))}
                  </div>
                </>
              ) : selectedRootGroup?.id === "vacation_homes" ? (
                <>
                  {selectedVacationGroup?.children?.length > 0 ? (
                    <>
                      <h2 className="section-title">
                        {selectedVacationGroup?.[`name_${locale}`]}
                      </h2>
                      <div className="options-grid">
                        {selectedVacationGroup.children.map((item) => (
                          <div
                            key={item.id}
                            className={`cat-card ${isClientCreateCard ? "user-create-card" : ""} ${
                              selectedCats.dep?.id === item.table_id &&
                              selectedCats.cat?.id === item.category_id
                                ? "active"
                                : ""
                            }`}
                            onClick={() => selectVacationItem(item)}
                          >
                            <h4 className="cat-name ellipsis">
                              {item?.[`name_${locale}`]}
                            </h4>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="options-grid">
                      {selectedRootGroup.children.map((type) => (
                        <div
                          key={type.id}
                          className={`cat-card ${isClientCreateCard ? "user-create-card" : ""} ${
                            selectedVacationGroup?.id === type.id
                              ? "active"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedVacationGroup(type);
                            setSelectedCats({
                              dep: null,
                              cat: null,
                              subCat: null,
                            });
                          }}
                        >
                          <h4 className="cat-name ellipsis">
                            {type?.[`name_${locale}`]}
                          </h4>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {selectedCats.dep && filteredCategories.length > 0 ? (
                    <>
                      {showBuildingLandDetails &&
                      !additionalData.buildingAndLandsType ? (
                        <>
                          <h2 className="section-title">{t.common.type}</h2>
                          {fieldErrors.type && (
                            <span className="error">
                              <CircleAlert />
                              {fieldErrors.type}
                            </span>
                          )}
                          <div className="options-grid">
                            {BuildingAndLandsTypes.map((item) => (
                              <div
                                key={item.id}
                                className={`cat-card ${isClientCreateCard ? "user-create-card" : ""} ${
                                  additionalData.buildingAndLandsType?.id ===
                                  item.id
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setAdditionalData((prev) => ({
                                    ...prev,
                                    buildingAndLandsType: item,
                                    landType: null,
                                    buildingType: null,
                                    buildingCondition: null,
                                  }));
                                  handleErrors("type", null);
                                  handleErrors("land_type", null);
                                  handleErrors("building_type", null);
                                  handleErrors("building_condition", null);
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                              >
                                <h4 className="cat-name ellipsis">
                                  {item?.[`name_${locale}`]}
                                </h4>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <h2 className="section-title">
                            {t.ad.choose_category}
                          </h2>
                          <div className="options-grid">
                            {filteredCategories.map((category) => (
                              <CatCard
                                key={category.id}
                                data={category}
                                type="categories"
                                position="when-create-ad"
                                className={
                                  isClientCreateCard ? "user-create-card" : ""
                                }
                                hideCount={isClientCreateCard}
                                activeClass={
                                  selectedCats.cat?.id === category.id
                                }
                                onSelect={() => {
                                  selectTableCategory(
                                    selectedCats.dep,
                                    category,
                                  );

                                  const hasSubCategories = subCategories.some(
                                    (subCategory) =>
                                      subCategory.category_id === category.id,
                                  );

                                  if (!hasSubCategories) {
                                    setStep(STEPS.BASICS);
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    });
                                  }
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="options-grid">
                      {selectedRootGroup?.children?.map((table) => (
                        <CatCard
                          key={table.id}
                          data={table}
                          type="tables"
                          position="when-create-ad"
                          className={
                            isClientCreateCard ? "user-create-card" : ""
                          }
                          hideCount={isClientCreateCard}
                          activeClass={selectedCats.dep?.id === table.table_id}
                          onSelect={() => selectTable(table)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div className={`form-section ${getStepClass(STEPS.BASICS)}`}>
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
                          maxLength: {
                            value: AD_TITLE_MAX_LENGTH,
                            message: getMaxLengthMessage(
                              t.ad.errors.adTitleMax ||
                                t.dashboard.forms.errors.titleMax,
                              AD_TITLE_MAX_LENGTH,
                            ),
                          },
                        })}
                        maxLength={AD_TITLE_MAX_LENGTH}
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

                {(type === "admin" || adId) && (
                  <DescriptionField
                    disabled={!isEditable}
                    errors={errors}
                    register={register}
                    t={t}
                  />
                )}
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

          <div className={`form-section ${getStepClass(STEPS.BASICS)}`}>
            <h2 className="section-title">{t.dashboard.tables.location}</h2>
            <div className="row-holder client-two-grid">
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

          <div
            className={`form-section ${
              isStepped ? "step-hidden" : getStepClass(STEPS.CATEGORY)
            }`}
          >
            <h2 className="section-title">{t.ad.category_info}</h2>
            <div
              className={`row-holder ${
                !showBuildingLandDetails ? "three" : ""
              }`}
            >
              {!isStepped && (
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
                    setAdditionalData((prev) => ({
                      ...prev,
                      buildingAndLandsType: null,
                      landType: null,
                      buildingType: null,
                      buildingCondition: null,
                    }));
                    handleErrors("dep", null);
                    handleErrors("cat", null);
                    handleErrors("type", null);
                    handleErrors("land_type", null);
                    handleErrors("building_type", null);
                    handleErrors("building_condition", null);
                  }}
                  error={fieldErrors.dep}
                  disabled={Boolean(adId)}
                  required
                />
              )}
              {showBuildingLandDetails && (
                <SelectOptions
                  label="Type"
                  placeholder={t.common.selectType}
                  options={BuildingAndLandsTypes}
                  value={additionalData.buildingAndLandsType}
                  disabled={!isEditable}
                  onChange={(item) => {
                    setAdditionalData((prev) => ({
                      ...prev,
                      buildingAndLandsType: item,
                      landType: null,
                      buildingType: null,
                      buildingCondition: null,
                    }));
                    handleErrors("type", null);
                    handleErrors("land_type", null);
                    handleErrors("building_type", null);
                    handleErrors("building_condition", null);
                  }}
                  error={fieldErrors.type}
                  required={isFieldRequired(tableId, "type")}
                />
              )}
              {!isStepped && (
                <>
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
                </>
              )}
            </div>
          </div>

          {showPropertyDetails && (
            <div className={`form-section ${getStepClass(STEPS.DETAILS)}`}>
              <h2 className="section-title">
                {t.dashboard.tables.property_details}
              </h2>
              <div className="row-holder client-four-grid">
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
                        {...register("area_m2", {
                          min: {
                            value: 1,
                            message: t.dashboard.forms.errors.minOne,
                          },
                        })}
                        disabled={!isEditable}
                        placeholder={
                          t.ad.area_m2Placeholder || "area_m2Placeholder"
                        }
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

          {showBuildingLandDetails &&
            additionalData?.buildingAndLandsType?.id && (
              <div className={`form-section ${getStepClass(STEPS.DETAILS)}`}>
                <h2 className="section-title">
                  {t.dashboard.tables.property_details}
                </h2>
                <div className="row-holder client-three-grid">
                  {additionalData?.buildingAndLandsType?.id == "BUILDING" ? (
                    <SelectOptions
                      label="Building Type"
                      placeholder={t.common.selectBuildingType}
                      options={BuildingType}
                      value={additionalData.buildingType}
                      onChange={(item) => {
                        setAdditionalData((prev) => ({
                          ...prev,
                          buildingType: item,
                        }));
                        handleErrors("building_type", null);
                      }}
                      disabled={!isEditable}
                      error={fieldErrors.building_type}
                      required
                    />
                  ) : (
                    <SelectOptions
                      label="Land Type"
                      placeholder={t.common.selectLandType}
                      options={LandType}
                      value={additionalData.landType}
                      onChange={(item) => {
                        setAdditionalData((prev) => ({
                          ...prev,
                          landType: item,
                        }));
                        handleErrors("land_type", null);
                      }}
                      disabled={!isEditable}
                      error={fieldErrors.land_type}
                      required
                    />
                  )}
                  {additionalData?.buildingAndLandsType?.id == "BUILDING" && (
                    <SelectOptions
                      label="Building Condition"
                      placeholder={t.common.selectBuildingCondition}
                      options={BuildingCondition}
                      value={additionalData.buildingCondition}
                      onChange={(item) => {
                        setAdditionalData((prev) => ({
                          ...prev,
                          buildingCondition: item,
                        }));
                        handleErrors("building_condition", null);
                      }}
                      disabled={!isEditable}
                      error={fieldErrors.building_condition}
                      required
                    />
                  )}

                  {additionalData?.buildingAndLandsType?.id == "BUILDING" &&
                    isFieldAllowed(tableId, "floors") && (
                      <div className="box forInput">
                        <label>{t.common.floors}</label>
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
                              placeholder={t.common.enterFloorsCount}
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

          <div className={`form-section ${getStepClass(STEPS.BASICS)}`}>
            <h2 className="section-title">
              {t.dashboard.tables.pricing_details}
            </h2>
            <div
              className={`row-holder client-two-grid ${
                !showRentDetails ? "two" : ""
              }`}
            >
              <div className="box forInput">
                <label>
                  {showRentDetails ? t.ad.rentPrice : t.ad.price}{" "}
                  <span className="required">*</span>
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

            {isFieldAllowed(tableId, "area_m2") &&
              (showCommercialDetails || showBuildingLandDetails) && (
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
                        {...register("area_m2", {
                          required: isFieldRequired(tableId, "area_m2")
                            ? t.dashboard.forms.errors.required
                            : false,
                          min: {
                            value: 1,
                            message: t.dashboard.forms.errors.minOne,
                          },
                        })}
                        disabled={!isEditable}
                        placeholder={
                          t.ad.area_m2Placeholder || "area_m2Placeholder"
                        }
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
              )}
          </div>

          {showRentDetails && (
            <>
              <div
                className={`form-section for-dates ${getStepClass(STEPS.DETAILS)}`}
              >
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

              <div className={`form-section ${getStepClass(STEPS.DETAILS)}`}>
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
            <div className={`form-section ${getStepClass(STEPS.DETAILS)}`}>
              <h2 className="section-title">
                {isVacation ? "Guest Capacity" : "Occupancy Details"}
              </h2>
              <div className="row-holder client-two-grid two">
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
            <div className={`form-section ${getStepClass(STEPS.DETAILS)}`}>
              <h2 className="section-title">{t.common.saleOptions}</h2>
              <div className="row-holder client-three-grid three">
                <SelectOptions
                  label="Payment Method"
                  placeholder={
                    t.ad.PaymentMethod || t.common.selectPaymentMethod
                  }
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
                    placeholder={
                      t.ad.installmentYears || t.common.selectYearsCount
                    }
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
                <div className="row-holder client-two-grid two">
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

          {allowedAmenities.length > 0 && (
            <div className={`form-section ${getStepClass(STEPS.DETAILS)}`}>
              <h2 className="section-title">{t.ad.amenities}</h2>
              <div className="dynamicFilters-holder">
                <div className="box forInput">
                  <div className="options-grid flex">
                    {allowedAmenities.map((option) => {
                      const displayLabel =
                        locale === "ar" ? option.name_ar : option.name_en;
                      const isActive = selectedAmenities?.includes(option.id);

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

          <div className={`form-section ${getStepClass(STEPS.DETAILS)}`}>
            {type !== "admin" && !adId && (
              <DescriptionField
                disabled={!isEditable}
                errors={errors}
                register={register}
                t={t}
              />
            )}

            {type === "admin" && (
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
            )}

            <Tags disabled={!isEditable} />
          </div>

          {needsAnonymousContact && (
            <div className={`form-section ${getStepClass(STEPS.OWNER)}`}>
              <h2 className="section-title">
                {t.ad.contact_information || "Contact information"}
              </h2>
              <div className="row-holder two">
                <div className="box forInput">
                  <label>
                    {t.auth?.fullName || "Full name"}{" "}
                    <span className="required">*</span>
                  </label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="text"
                        {...register("anonymous_full_name", {
                          required: t.dashboard.forms.errors.required,
                        })}
                        disabled={!!user || !isEditable}
                        placeholder={t.auth?.fullName || t.common.fullName}
                      />
                    </div>
                    {errors.anonymous_full_name && (
                      <span className="error">
                        <CircleAlert />
                        {errors.anonymous_full_name.message}
                      </span>
                    )}
                    {fieldErrors.anonymous_full_name && (
                      <span className="error">
                        <CircleAlert />
                        {fieldErrors.anonymous_full_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="box forInput">
                  <label>{t.auth?.email || "Email"}</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="email"
                        {...register("anonymous_email")}
                        disabled={!!user || !isEditable}
                        placeholder={t.auth?.email || t.common.emailAddress}
                      />
                    </div>
                  </div>
                </div>
                <div className="box forInput">
                  <label>{t.auth?.phone || "Phone"}</label>
                  <div className="inputHolder">
                    <div className="holder">
                      <input
                        type="tel"
                        {...register("anonymous_phone")}
                        disabled={!!user || !isEditable}
                        placeholder={t.auth?.phone || t.common.phone}
                      />
                    </div>
                  </div>
                </div>
                {fieldErrors.anonymous_contact && (
                  <div className="box forInput">
                    <span className="error">
                      <CircleAlert />
                      {fieldErrors.anonymous_contact}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {((type === "admin" && !!adData?.subuser) || type === "client") && (
            <div className={`form-section ${getStepClass(STEPS.CONTACT)}`}>
              <h2 className="section-title">{t.ad.theContactMethod}</h2>
              <div className="options-grid verfiyMethod">
                {methods.map(({ key, label, icon: Icon }) => {
                  const isActive = selectedContactMethods[key];

                  return (
                    <div
                      key={key}
                      className={`option-box ${isActive ? "active" : ""} ${
                        showContactErrors && fieldErrors.contact
                          ? "error-border"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedContactMethods((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }));
                        setContactSubmitAttempted(false);
                        handleErrors("contact", null);
                      }}
                    >
                      <Icon className="cat-icon" />
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
              {showContactErrors && fieldErrors.contact && (
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
            {canReviewPendingAd && (
              <>
                <button
                  type="button"
                  className="main-button create-button"
                  onClick={() => handleReviewStatus("ACTIVE")}
                  disabled={loadingSubmit || loadingReviewAction}
                >
                  {loadingReviewAction ? (
                    <span className="loader"></span>
                  ) : locale === "ar" ? (
                    "قبول"
                  ) : (
                    "Accept"
                  )}
                </button>
                <button
                  type="button"
                  className="main-button danger"
                  onClick={() => setReviewMenuOpen(true)}
                  disabled={loadingSubmit || loadingReviewAction}
                >
                  {locale === "ar" ? "رفض" : "Reject"}
                </button>
              </>
            )}
            {isStepped && (step > STEPS.DEPARTMENT || canGoBackInTaxonomy) && (
              <button
                type="button"
                className="main-button update-button"
                onClick={goPreviousStep}
                disabled={loadingSubmit}
              >
                {t.actions?.back || "Back"}
              </button>
            )}
            {isStepped && step < STEPS.CONTACT ? (
              <button
                type="button"
                className="main-button create-button"
                onClick={goNextStep}
                disabled={loadingSubmit}
              >
                {t.actions.next}
              </button>
            ) : (
              <button
                type="submit"
                className={`main-button ${adId ? "update-button" : "create-button"}`}
                onClick={() => {
                  setIsSubmitted(true);
                  setContactSubmitAttempted(true);
                }}
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
            )}
          </div>
        </form>
        <DynamicMenu
          open={reviewMenuOpen}
          title={t.common.rejectReason}
          onClose={closeReviewMenu}
        >
          <DeleteConfirm
            menuType="reject"
            rejectInput={rejectInput}
            setRejectInput={setRejectInput}
            onConfirm={(reason) => handleReviewStatus("REJECTED", reason)}
            onCancel={closeReviewMenu}
            loading={loadingReviewAction}
          />
        </DynamicMenu>
        <DynamicMenu
          open={updateWarningOpen}
          title={t.confirm.updatePendingTitle}
          onClose={closeUpdateWarning}
        >
          <DeleteConfirm
            menuType="updateWarning"
            onConfirm={confirmUserUpdate}
            onCancel={closeUpdateWarning}
            loading={loadingSubmit}
          />
        </DynamicMenu>
      </div>
    </LocalizationProvider>
  );
}
