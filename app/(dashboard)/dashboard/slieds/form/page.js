"use client";

import "@/styles/client/forms.css";
import { useSearchParams } from "next/navigation";
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
  users,
  ads,
  slidesEn,
  slidesAr,
} from "@/data";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { FaArrowLeft } from "react-icons/fa6";
import Images from "@/components/Tools/data-collector/Images";
import { Mail, Phone, CircleAlert } from "lucide-react";
import { BsChatDots } from "react-icons/bs";
import { settings } from "@/Contexts/settings";
import { FiUsers } from "react-icons/fi";
import { LuUserCog } from "react-icons/lu";
import Tags from "@/components/Tools/data-collector/Tags";
import { useParams } from "next/navigation";

export default function CreateAd() {
  const { locale } = useContext(settings);
  const t = useTranslate();
  const { slug } = useParams();

  // State للبيانات الديناميكية

  // State لبيانات الإعلان
  const [slied, setSlied] = useState(null);
  const [slieds, setSlieds] = useState(null);

  // State للبيانات الأساسية
  const [images, setImages] = useState([]);

  // State للتواصل

  // State للحقول الديناميكية

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    reset,
  } = useForm();

  // useEffect لتحديث الإعلان بعد تحميل البيانات
  useEffect(() => {
    if (slug) {
      fetchAdData();
    }
  }, [slug, locale]);

  const fetchAdData = async () => {
    setIsLoading(true);
    try {
      // استدعاء API
      // const response = await getService.getAdById(slug);
      // const ad = response.data;

      // بيانات وهمية

      const mockAdData = slieds?.find((x) => x.id == slug);

      if (!mockAdData) {
        alert("الإعلان غير موجود");
        return;
      }

      setSlied(mockAdData);

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
    setValue("link", ad.link);
    setValue("description", ad.description || "");
    if (ad.image) setImages([ad.image]);
  };

  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    if (images.length === 0) {
      newErrors.images = t.ad.images.errors.required;
      hasErrors = true;
    }

    // التحقق من أن الصورة ليست كبيرة جداً
    images.forEach((image, index) => {
      if (typeof image !== "string" && image.size > 5 * 1024 * 1024) {
        // 5MB
        newErrors[`image_${index}`] = "حجم الصورة كبير جداً (الحد الأقصى 5MB)";
        hasErrors = true;
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
      link: data.link,
      description: data.description || "",
      images: images,
    };
    console.log("FINAL REQUEST", finalData);
    if (slug) {
      // تحديث الإعلان
      alert(t.ad.update_success || "تم تحديث الإعلان بنجاح!");
      // try {
      //   const response = await putService.updateAd(slug, finalData);
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
    <div className={`form-holder create-ad `}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* === معلومات أساسية === */}

        {/* عنوان الإعلان */}
        <div className="row-holder">
          <div className="box forInput">
            <label>
              {t.dashboard.forms.slied_title}{" "}
              <span className="required">*</span>
            </label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="text"
                  {...register("adTitle", {
                    required: t.dashboard.forms.slied_title_required,
                    minLength: {
                      value: 6,
                      message:
                        t.dashboard.forms.adTitleValidation ||
                        "Title must be at least 6 characters",
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
          <div className="box forInput right">
            <label>
              {t.dashboard.tables.link} <span>({t.auth.optional})</span>
            </label>
            <div className="inputHolder">
              <div className="holder">
                <input
                  type="text"
                  {...register("link", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: t.dashboard.tables.invalidLink,
                    },
                  })}
                  placeholder={`https://example.com`}
                />
              </div>
              {errors.link && (
                <span className="error">
                  <CircleAlert />
                  {errors.link.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="row-holder">
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
          <div className="right">
            <Images
              images={images}
              setImages={setImages}
              isSubmitted={isSubmitted}
              limit={1}
            />
            {fieldErrors.images && (
              <span className="error">
                <CircleAlert />
                {fieldErrors.images}
              </span>
            )}
          </div>
        </div>

        {/* === زر الإرسال === */}
        <div className="form-section submit-section">
          <button
            type="submit"
            className={`main-button ${
              slug ? "update-button" : "create-button"
            }`}
            onClick={() => setIsSubmitted(true)}
          >
            {slug
              ? t.dashboard.forms.update_slide
              : t.dashboard.forms.create_slide}
          </button>
        </div>
      </form>
    </div>
  );
}
