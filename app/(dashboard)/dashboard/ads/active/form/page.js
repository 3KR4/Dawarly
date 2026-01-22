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
import { FaArrowLeft } from "react-icons/fa6";
import Images from "@/components/Tools/data-collector/Images";
import { Mail, Phone, CircleAlert } from "lucide-react";
import { BsChatDots } from "react-icons/bs";
import { settings } from "@/Contexts/settings";

export default function CreateAd() {
  const { locale } = useContext(settings);
  const t = useTranslate();

  // State للبيانات الديناميكية
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // State للبيانات الأساسية
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [images, setImages] = useState([]);

  // State للتواصل
  const [selectedContactMethods, setSelectedContactMethods] = useState({
    chat: false,
    email: false,
    phone: false,
  });

  // State للحقول الديناميكية
  const [dynamicValues, setDynamicValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  // تحميل البيانات
  useEffect(() => {
    const fetchData = async () => {
      setDynamicFilters(
        locale == "en" ? propertiesFiltersEn : propertiesFiltersAr,
      );
      setCategories(locale == "en" ? categoriesEn : categoriesAr);
      setSubcategories(locale == "en" ? subcategoriesEn : subcategoriesAr);
      setGovernorates(locale == "en" ? governoratesEn : governoratesAr);
      setCities(locale == "en" ? citiesEn : citiesAr);
    };
    fetchData();
  }, [locale]);

  // تصفية المدن حسب المحافظة المختارة
  const filteredCities = cities.filter(
    (c) => c.governorate_id === selectedGovernorate?.id,
  );

  // تصفية الفئات الفرعية حسب الفئة المختارة
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(
        (sub) => sub?.categoryId == selectedCategory?.id,
      );
      setFilteredSubcategories(filtered);
      // إعادة تعيين الفئة الفرعية عند تغيير الفئة الرئيسية
      setSelectedSubCategory(null);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  // طرق التواصل المتاحة
  const METHODS = [
    {
      key: "email",
      label: t.create.ad.contact_via_email || "Contact via Email",
      icon: Mail,
    },
    {
      key: "phone",
      label: t.create.ad.contact_via_phone || "Contact via Phone",
      icon: Phone,
    },
    {
      key: "chat",
      label: t.create.ad.contact_via_chat || "Contact via Chat",
      icon: BsChatDots,
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm();

  // معالجة تغيير الحقول الديناميكية
  const handleDynamicChange = (key, value) => {
    setDynamicValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    // مسح الخطأ عند اختيار قيمة
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
      newErrors.category =
        t.create.ad.errors.category || "Category is required";
      hasErrors = true;
    }

    if (!selectedSubCategory) {
      newErrors.subCategory =
        t.create.ad.errors.subCategory || "Subcategory is required";
      hasErrors = true;
    }

    if (!selectedGovernorate) {
      newErrors.governorate =
        t.location.errors.governorate || "Governorate is required";
      hasErrors = true;
    }

    if (!selectedCity) {
      newErrors.city = t.location.errors.city || "City is required";
      hasErrors = true;
    }

    if (images.length === 0) {
      newErrors.images =
        t.create.ad.errors.images || "At least one image is required";
      hasErrors = true;
    }

    // التحقق من اختيار طريقة اتصال واحدة على الأقل
    const hasSelectedContact = Object.values(selectedContactMethods).some(
      (v) => v === true,
    );
    if (!hasSelectedContact) {
      newErrors.contact =
        t.create.ad.contact_method_required ||
        "Please select at least one contact method";
      hasErrors = true;
    }

    // التحقق من الحقول الديناميكية الإلزامية
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
  };

  // معالجة إرسال النموذج
  const onSubmit = async (data) => {
    // التحقق من صحة الحقول الأساسية
    const isFormValid = await trigger(["adTitle", "description"]);
    if (!isFormValid) {
      return;
    }

    // التحقق من صحة جميع الحقول
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    // تحضير البيانات للإرسال
    const finalData = {
      title: data.adTitle,
      description: data.description || dynamicValues.description || "",
      categoryId: selectedCategory?.id,
      subCategoryId: selectedSubCategory?.id,
      images: images,
      additionalDetail: dynamicValues,
      location: {
        governorate: selectedGovernorate,
        city: selectedCity,
      },
      contactMethods: selectedContactMethods,
    };

    console.log("FINAL REQUEST", finalData);
    alert(t.create.ad.submission_success || "تم إنشاء الإعلان بنجاح!");

    // هنا يمكنك إضافة استدعاء API لإرسال البيانات
    // try {
    //   const response = await postService.createAd(finalData);
    //   console.log("Ad created successfully:", response);
    //   alert(t.create.ad.submission_success || "تم إنشاء الإعلان بنجاح!");
    // } catch (error) {
    //   console.error("Error creating ad:", error);
    //   alert(t.create.ad.submission_error || "حدث خطأ أثناء إنشاء الإعلان");
    // }
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
                  dynamicValues[field.key]?.value === option.value;

                return (
                  <div
                    key={option.id || option.value}
                    className={`option-box small ${
                      isSelected ? "active" : ""
                    } ${fieldErrors[field.key] ? "error-border" : ""}`}
                    onClick={() => handleDynamicChange(field.key, option)}
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
                  option.label || (option.value ? "Yes" : "No");
                const isSelected = dynamicValues[field.key] === option.value;

                return (
                  <div
                    key={option.value.toString()}
                    className={`option-box small ${
                      isSelected ? "active" : ""
                    } ${fieldErrors[field.key] ? "error-border" : ""}`}
                    onClick={() => handleDynamicChange(field.key, option.value)}
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
                    onClick={() => handleDynamicChange(field.key, false)}
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

  return (
    <div className="form-holder create-ad admin-create-ad">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="top">
          <h1>{t.create.ad.create_ad || "Create New Ad"}</h1>
          <p>
            {t.create.ad.admin_create_description ||
              "Fill all the details below to create a new advertisement"}
          </p>
        </div>

        {/* === معلومات أساسية === */}
        <div className="form-section">
          <h2 className="section-title">
            {t.create.ad.basic_info || "Basic Information"}
          </h2>

          {/* عنوان الإعلان */}
          <div className="box forInput">
            <label>
              {t.create.ad.placeholders.adTitle || "Ad Title"}{" "}
              <span className="required">*</span>
            </label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="text"
                  {...register("adTitle", {
                    required:
                      t.create.ad.errors.adTitle || "Ad title is required",
                    minLength: {
                      value: 6,
                      message:
                        t.create.ad.errors.adTitleValidation ||
                        "Title must be at least 6 characters",
                    },
                  })}
                  placeholder={
                    t.create.ad.placeholders.adTitle || "Enter ad title"
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

          {/* الوصف */}
          <div className="box forInput">
            <label>{t.dashboard.forms.description || "Description"}</label>
            <div className="inputHolder">
              <div className="holder">
                <textarea
                  {...register("description")}
                  placeholder={
                    t.dashboard.forms.descriptionPlaceholder ||
                    "Enter ad description"
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* === الفئة والتصنيف === */}
        <div className="form-section">
          <h2 className="section-title">
            {t.create.ad.category_info || "Category Information"}
          </h2>

          {/* الفئة الرئيسية */}
          <SelectOptions
            label={t.create.ad.choose_category || "Category"}
            placeholder={t.create.ad.choose_category || "Select Category"}
            options={categories}
            value={selectedCategory ? selectedCategory.name : ""}
            tPath="categories"
            required={true}
            error={fieldErrors.category}
            locale={locale}
            t={t}
            onChange={(item) => setSelectedCategory(item)}
          />

          {/* الفئة الفرعية */}
          <SelectOptions
            label={t.create.ad.choose_sub_category || "Subcategory"}
            placeholder={
              t.create.ad.choose_sub_category || "Select Subcategory"
            }
            options={filteredSubcategories}
            value={selectedSubCategory ? selectedSubCategory.name : ""}
            tPath="subcategories"
            required={true}
            error={fieldErrors.subCategory}
            locale={locale}
            t={t}
            disabled={!selectedCategory}
            onChange={(item) => setSelectedSubCategory(item)}
          />
        </div>

        {/* === الموقع === */}
        <div className="form-section">
          <h2 className="section-title">{t.location.location || "Location"}</h2>

          {/* المحافظة */}
          <SelectOptions
            label={t.location.yourGovernorate || "Governorate"}
            placeholder={t.location.selectGovernorate || "Select Governorate"}
            options={governorates}
            value={selectedGovernorate ? selectedGovernorate.name : ""}
            tPath="governorates"
            required={true}
            error={fieldErrors.governorate}
            locale={locale}
            t={t}
            onChange={(item) => {
              setSelectedGovernorate(item);
              setSelectedCity(null);
            }}
          />

          {/* المدينة */}
          <SelectOptions
            label={t.location.yourCity || "City"}
            placeholder={t.location.selectCity || "Select City"}
            options={filteredCities}
            value={selectedCity ? selectedCity.name : ""}
            tPath="cities"
            required={true}
            error={fieldErrors.city}
            locale={locale}
            t={t}
            disabled={!selectedGovernorate}
            onChange={(item) => setSelectedCity(item)}
          />
        </div>

        {/* === الصور === */}
        <div className="form-section">
          <h2 className="section-title">
            {t.create.ad.images || "Images"} <span className="required">*</span>
          </h2>
          <Images images={images} setImages={setImages} isSubmitted={false} />
          {fieldErrors.images && (
            <span className="error">
              <CircleAlert />
              {fieldErrors.images}
            </span>
          )}
        </div>

        {/* === الحقول الديناميكية === */}
        {dynamicFilters.length > 0 && (
          <div className="form-section">
            <h2 className="section-title">
              {t.create.ad.ad_details || "Ad Details"}
            </h2>
            {dynamicFilters.map((field) => renderDynamicField(field))}
          </div>
        )}

        {/* === طرق التواصل === */}
        <div className="form-section">
          <h2 className="section-title">
            {t.create.ad.contact_information || "Contact Information"}
          </h2>
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
          <button type="submit" className="main-button">
            {t.create.ad.create_your_ad || "Create Advertisement"}
          </button>
        </div>
      </form>
    </div>
  );
}
