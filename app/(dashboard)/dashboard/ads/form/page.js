"use client";
import "@/styles/client/forms.css";
import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
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
  users,
  ads,
} from "@/data";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { FaArrowLeft } from "react-icons/fa6";
import Images from "@/components/Tools/data-collector/Images";
import { Mail, Phone, CircleAlert } from "lucide-react";
import { BsChatDots } from "react-icons/bs";
import { settings } from "@/Contexts/settings";
import { FiUsers } from "react-icons/fi";
import { LuUserCog } from "react-icons/lu";

export default function CreateAd() {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const searchParams = useSearchParams();
  const adId = searchParams.get("id"); // جلب الـ id من الـ URL

  // State للبيانات الديناميكية
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // State لبيانات الإعلان
  const [adData, setAdData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State للبيانات الأساسية
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedMediatorMethod, setSelectedMediatorMethod] = useState({
    id: 1,
    name: t.ad.userToUser,
  });

  // State للتواصل
  const [selectedContactMethods, setSelectedContactMethods] = useState({
    chat: false,
    email: false,
    phone: false,
  });

  // State للحقول الديناميكية
  const [dynamicValues, setDynamicValues] = useState({});

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localeDataLoaded, setLocaleDataLoaded] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    // تحميل البيانات حسب الـ locale
    setDynamicFilters(
      locale == "en" ? propertiesFiltersEn : propertiesFiltersAr,
    );
    setCategories(locale == "en" ? categoriesEn : categoriesAr);
    setSubcategories(locale == "en" ? subcategoriesEn : subcategoriesAr);
    setGovernorates(locale == "en" ? governoratesEn : governoratesAr);
    setCities(locale == "en" ? citiesEn : citiesAr);

    setLocaleDataLoaded(true); // دلوقتي البيانات جاهزة

    setIsEditable(false);
  }, [locale]);

  // useEffect لتحديث الإعلان بعد تحميل البيانات
  useEffect(() => {
    if (adId && localeDataLoaded) {
      fetchAdData();
    }
    setIsEditable(false);
  }, [adId, localeDataLoaded]);

  const fetchAdData = async () => {
    setIsLoading(true);
    try {
      // استدعاء API
      // const response = await getService.getAdById(adId);
      // const ad = response.data;

      // بيانات وهمية
      const mockAdData = ads?.find((x) => x.id == adId);

      if (!mockAdData) {
        alert("الإعلان غير موجود");
        return;
      }

      setAdData(mockAdData);

      // ملء الفورم
      fillFormWithAdData(mockAdData);
    } catch (error) {
      console.error("Error fetching ad data:", error);
      alert(t.ad.fetch_error || "حدث خطأ أثناء جلب بيانات الإعلان");
    } finally {
      setIsLoading(false);
    }
  };

  const fillFormWithAdData = (ad) => {
    // ملء حقول العنوان والسعر والوصف
    setValue("adTitle", ad.title);
    setValue("price", ad.price);
    setValue("description", ad.description || "");

    // ملء الفئات
    const category = categories.find((c) => c.id == ad.category);

    const subCategory = subcategories.find((s) => s.id == ad.sub_category);

    if (category) setSelectedCategory(category);
    if (subCategory) setSelectedSubCategory(subCategory);

    // ملء الموقع
    if (ad.area) {
      const governorate = governorates.find((g) => g.id == ad.area.governorate);
      const city = cities.find((c) => c.id == ad.area.city);

      if (governorate) setSelectedGovernorate(governorate);
      if (city) setSelectedCity(city);

      console.log("governorate", governorate);
    }

    // ملء الصور
    if (ad.images) setImages(ad.images);

    // ملء بيانات المشرف
    if (ad.admin) {
      const adminUser = users.find((u) => u.id === ad.admin.id);
      if (adminUser) {
        setSelectedAdmin({
          id: adminUser.id,
          name: `${adminUser.first_name} ${adminUser.last_name}`,
          email: adminUser.email,
          phone: adminUser.phone,
        });
      }
    }

    // ملء طريقة الوساطة
    if (ad.mediatorMethod) {
      setSelectedMediatorMethod(ad.mediatorMethod);
    }

    // ملء طرق التواصل
    if (ad.contactMethods) {
      setSelectedContactMethods(ad.contactMethods);
    }

    // ملء الحقول الديناميكية
    if (ad.specifecs) {
      setDynamicValues(ad.specifecs);
    }
  };

  // تصفية المدن حسب المحافظة المختارة
  const filteredCities = cities.filter(
    (c) => c.governorate_id === selectedGovernorate?.id,
  );

  const adminOptions = users.map((user) => ({
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    phone: user.phone,
  }));

  const contactMethod = [
    {
      id: 1,
      name: t.ad.userToUser,
    },
    {
      id: 2,
      name: t.ad.userToAdmin,
    },
  ];

  // تصفية الفئات الفرعية حسب الفئة المختارة
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(
        (sub) => sub?.categoryId == selectedCategory?.id,
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  // طرق التواصل المتاحة
  const METHODS = [
    {
      key: "email",
      label: "user to user" || t.ad.contact_via_email,
      icon: FiUsers,
    },
    {
      key: "phone",
      label: "user to admin" || t.ad.contact_via_phone,
      icon: LuUserCog,
    },
  ];

  // معالجة تغيير الحقول الديناميكية
  const handleDynamicChange = (key, value) => {
    setDynamicValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // التحقق من صحة جميع الحقول
  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    // التحقق من الحقول الإلزامية الأساسية
    if (!selectedCategory) {
      newErrors.category = t.ad.errors.category;
      hasErrors = true;
    }

    if (!selectedSubCategory) {
      newErrors.subCategory = t.ad.errors.subCategory;
      hasErrors = true;
    }

    if (!selectedGovernorate) {
      newErrors.governorate = t.ad.errors.governorate;
      hasErrors = true;
    }

    if (!selectedCity) {
      newErrors.city = t.ad.errors.city;
      hasErrors = true;
    }

    if (selectedMediatorMethod?.id == 2 && !selectedAdmin) {
      newErrors.admin = t.ad.errors.admin;
      hasErrors = true;
    }

    if (images.length === 0) {
      newErrors.images = t.ad.images.errors.required;
      hasErrors = true;
    }

    // التحقق من اختيار طريقة اتصال واحدة على الأقل
    const hasSelectedContact = Object.values(selectedContactMethods).some(
      (v) => v === true,
    );
    if (!hasSelectedContact) {
      newErrors.contact =
        t.ad.contact_method_required ||
        "Please select at least one contact method";
      hasErrors = true;
    }

    // التحقق من الحقول الديناميكية الإلزامية
    dynamicFilters.forEach((field) => {
      if (!field.required) return;

      const value = dynamicValues[field.key];
      let isEmpty = false;

      switch (field.uiType) {
        case "select":
          isEmpty = !value || !value.id;
          break;

        case "radio":
          isEmpty = value === undefined || value === null;
          break;

        case "boolean":
          isEmpty = typeof value !== "boolean";
          break;

        case "multiSelect":
          isEmpty = !Array.isArray(value) || value.length === 0;
          break;

        case "input":
          isEmpty = value === undefined || value === null || value === "";
          break;

        default:
          break;
      }

      if (isEmpty) {
        newErrors[field.key] =
          field.requiredMessage || `${field.label} is required`;
        hasErrors = true;
        return;
      }

      // pattern validation (لو موجود)
      if (
        field.uiType === "input" &&
        field.validation?.pattern &&
        value !== undefined &&
        value !== ""
      ) {
        const { value: pattern, message } = field.validation.pattern;

        if (!pattern.test(String(value))) {
          newErrors[field.key] = message;
          hasErrors = true;
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
  };

  // معالجة إرسال النموذج
  const onSubmit = async (data) => {
    // التحقق من صحة الحقول الأساسية
    const isCustomValid = validateForm();

    if (!isCustomValid) return;

    // تحضير البيانات للإرسال
    const finalData = {
      title: data.adTitle,
      price: data.price,
      description: data.description || "",
      categoryId: selectedCategory,
      subCategoryId: selectedSubCategory,
      images: images,
      additionalDetail: dynamicValues,
      location: {
        governorate: selectedGovernorate,
        city: selectedCity,
      },
      contactMethods: selectedContactMethods,
      adminId: selectedAdmin?.id,
      mediatorMethod: selectedMediatorMethod,
    };

    // إذا كان تعديلاً، أضف الـ ID
    if (adId) {
      finalData.id = adId;
    }

    console.log("FINAL REQUEST", finalData);

    if (adId) {
      // تحديث الإعلان
      alert(t.ad.update_success || "تم تحديث الإعلان بنجاح!");
      // try {
      //   const response = await putService.updateAd(adId, finalData);
      //   console.log("Ad updated successfully:", response);
      //   alert(t.ad.update_success || "تم تحديث الإعلان بنجاح!");
      // } catch (error) {
      //   console.error("Error updating ad:", error);
      //   alert(t.ad.update_error || "حدث خطأ أثناء تحديث الإعلان");
      // }
    } else {
      // إنشاء إعلان جديد
      alert(t.ad.submission_success || "تم إنشاء الإعلان بنجاح!");
      // try {
      //   const response = await postService.createAd(finalData);
      //   console.log("Ad created successfully:", response);
      //   alert(t.ad.submission_success || "تم إنشاء الإعلان بنجاح!");
      // } catch (error) {
      //   console.error("Error creating ad:", error);
      //   alert(t.ad.submission_error || "حدث خطأ أثناء إنشاء الإعلان");
      // }
    }
  };

  // عرض الحقول الديناميكية
  const renderDynamicField = (field) => {
    switch (field.uiType) {
      case "input":
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
                  disabled={!isEditable}
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

      case "select":
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
            disabled={!isEditable}
            t={t}
            onChange={(item) => handleDynamicChange(field.key, item)}
          />
        );

      case "radio":
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
                  dynamicValues[field.key]?.toString().toLowerCase() ===
                  option.value?.toString().toLowerCase();

                return (
                  <div
                    key={option.id || option.value}
                    className={`option-box small ${
                      !isEditable ? "disabled" : isSelected ? "active" : ""
                    } ${fieldErrors[field.key] ? "error-border" : ""}`}
                    onClick={() => {
                      if (!isEditable) return;
                      handleDynamicChange(field.key, option);
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

      case "boolean":
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
                  dynamicValues[field.key].value == option.value;

                return (
                  <div
                    key={option.value.toString()}
                    className={`option-box small ${
                      !isEditable ? "disabled" : isSelected ? "active" : ""
                    } ${fieldErrors[field.key] ? "error-border" : ""}`}
                    onClick={() => {
                      if (!isEditable) return;
                      handleDynamicChange(field.key, option.value);
                    }}
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
                    {locale === "ar" ? "نعم" : t.ad.yes}
                  </div>
                  <div
                    className={`option-box small ${
                      dynamicValues[field.key] === false ? "active" : ""
                    }`}
                    onClick={() => handleDynamicChange(field.key, false)}
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

      case "multiSelect":
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
                          selectedValues.filter((v) => v !== option.value),
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

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="form-holder create-ad admin-create-ad">
        <div className="loading-state">
          <p>{t.ad.loading || "جاري تحميل البيانات..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-holder create-ad admin-create-ad">
      {/* <div className="page-header">
        {adId && (
          <p className="ad-id">
            {t.ad.ad_id || "رقم الإعلان"}: {adId}
          </p>
        )}
      </div> */}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* === معلومات أساسية === */}
        <div className="form-section">
          <h2 className="section-title">{t.ad.basic_info}</h2>

          {/* عنوان الإعلان */}
          <div className="row-holder">
            <div className="left">
              <div className="box forInput">
                <label>
                  {t.ad.placeholders.adTitle}{" "}
                  <span className="required">*</span>
                </label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      type="text"
                      {...register("adTitle", {
                        required: t.ad.errors.adTitle || "Ad title is required",
                        minLength: {
                          value: 6,
                          message:
                            t.ad.errors.adTitleValidation ||
                            "Title must be at least 6 characters",
                        },
                      })}
                      disabled={!isEditable}
                      placeholder={
                        t.ad.placeholders.adTitle || "Enter ad title"
                      }
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
                <label>
                  {t.dashboard.forms.price} <span className="required">*</span>
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
                      disabled={!isEditable}
                      placeholder={t.dashboard.forms.pricePlaceholder}
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
              {/* الوصف */}
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
                isEditing={!!adId} // إضافة خاصية التعديل
              />
              {fieldErrors.images && (
                <span className="error">
                  <CircleAlert />
                  {fieldErrors.images}
                </span>
              )}
            </div>
          </div>

          {/* === الصور === */}
        </div>
        <div className="row-holder">
          {/* === الفئة والتصنيف === */}
          <div className="form-section">
            <h2 className="section-title">{t.ad.category_info}</h2>

            {/* الفئة الرئيسية */}
            <SelectOptions
              label={t.ad.choose_category}
              placeholder={t.ad.choose_category}
              options={categories}
              value={selectedCategory ? selectedCategory.name : ""}
              tPath="categories"
              required={true}
              error={fieldErrors.category}
              locale={locale}
              t={t}
              disabled={!isEditable}
              onChange={(item) => setSelectedCategory(item)}
            />

            {/* الفئة الفرعية */}
            <SelectOptions
              label={t.ad.choose_sub_category}
              placeholder={t.ad.choose_sub_category}
              options={filteredSubcategories}
              value={selectedSubCategory ? selectedSubCategory.name : ""}
              tPath="subcategories"
              required={true}
              error={fieldErrors.subCategory}
              locale={locale}
              t={t}
              disabled={!isEditable || !selectedCategory}
              onChange={(item) => setSelectedSubCategory(item)}
            />
          </div>

          {/* === الموقع === */}
          <div className="form-section">
            <h2 className="section-title">{t.dashboard.tables.location}</h2>

            {/* المحافظة */}
            <SelectOptions
              label={t.location.yourGovernorate}
              placeholder={t.location.selectGovernorate}
              options={governorates}
              value={selectedGovernorate ? selectedGovernorate.name : ""}
              tPath="governorates"
              required={true}
              error={fieldErrors.governorate}
              locale={locale}
              disabled={!isEditable}
              t={t}
              onChange={(item) => {
                setSelectedGovernorate(item);
                setSelectedCity(null);
              }}
            />

            {/* المدينة */}
            <SelectOptions
              label={t.location.yourCity}
              placeholder={t.location.selectCity}
              options={filteredCities}
              value={selectedCity ? selectedCity.name : ""}
              tPath="cities"
              required={true}
              error={fieldErrors.city}
              locale={locale}
              t={t}
              disabled={!isEditable || !selectedGovernorate}
              onChange={(item) => setSelectedCity(item)}
            />
          </div>
          <div className="form-section">
            <h2 className="section-title">{t.ad.admin_contact}</h2>

            <SelectOptions
              label={t.ad.theContactMethod}
              placeholder={""}
              options={contactMethod}
              value={selectedMediatorMethod ? selectedMediatorMethod.name : ""}
              required={false}
              locale={locale}
              t={t}
              onChange={(item) => {
                setSelectedMediatorMethod(item);
              }}
            />
            <SelectOptions
              label={t.ad.choose_admin}
              placeholder={t.ad.select_admin}
              options={adminOptions}
              value={selectedAdmin ? selectedAdmin.name : ""}
              required={true}
              error={fieldErrors.admin}
              locale={locale}
              t={t}
              disabled={selectedMediatorMethod?.id == 1}
              onChange={(item) => {
                setSelectedAdmin(item);
                if (fieldErrors.admin) {
                  setFieldErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.admin;
                    return newErrors;
                  });
                }
              }}
            />
          </div>
        </div>

        {/* === الحقول الديناميكية === */}
        {selectedSubCategory && dynamicFilters.length > 0 && (
          <div className="form-section">
            <h2 className="section-title">{t.ad.additional_details}</h2>
            <div className="dynamicFilters-holder">
              {dynamicFilters.map((field) => renderDynamicField(field))}
            </div>
          </div>
        )}

        {/* === طرق التواصل === */}
        <div className="form-section">
          <h2 className="section-title">{t.ad.theContactMethod}</h2>
          <div className="options-grid verfiyMethod">
            {METHODS.map(({ key, label, icon: Icon }) => {
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
        </div>

        {/* === زر الإرسال === */}
        <div className="form-section submit-section">
          <button
            type="submit"
            className={`main-button ${adId ? "update-button" : "create-button"}`}
            onClick={() => setIsSubmitted(true)}
          >
            {adId
              ? t.ad.update_ad || "تحديث الإعلان"
              : t.ad.create_your_ad || "إنشاء الإعلان"}
          </button>
        </div>
      </form>
    </div>
  );
}
