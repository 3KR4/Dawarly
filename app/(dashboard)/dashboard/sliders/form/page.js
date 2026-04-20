"use client";
import "@/styles/client/forms.css";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import useTranslate from "@/Contexts/useTranslation";
import Images from "@/components/Tools/data-collector/Images";
import { CircleAlert } from "lucide-react";

import { useNotification } from "@/Contexts/NotificationContext";
import useRedirectAfterLogin from "@/Contexts/useRedirectAfterLogin";
import { deleteImage, uploadImages } from "@/services/images/images.service";

export default function CreateAd() {
  const t = useTranslate();

  const searchParams = useSearchParams();
  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();

  // ======= FORM STATES =======
  const [sliderData, setSliderData] = useState(null);
  const [loadingContent, setLoadingContnet] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [images, setImages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // ======= FETCH AD DATA IF EDITING =======
  useEffect(() => {
    if (sliderId) fetchAdData();
  }, [sliderId]);

  const fetchAdData = async () => {
    setLoadingContnet(true);
    try {
      const res = await getOneAd(sliderId);
      const slider = res?.data;
      if (!slider) return alert(t.ad.fetch_error);
      setSliderData(slider);
      fillFormWithAdData(slider);
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

  const fillFormWithAdData = (x) => {
    setValue("title", x.title);
    setValue("description", x.description);
    setValue("link", x.link);
    setImages(x.image);
  };

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

    if (hasErrors) {
      setFieldErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const buildPayload = (data) => ({
    title: data.title,
    description: data.description,
    link: data.link,
  });

  const submitAd = async (payload) =>
    sliderId ? updateAd(sliderId, payload) : crateAd(payload);

  const uploadNewImages = async (sliderId) => {
    const newImages = images.filter((img) => img instanceof File);

    if (newimages?.length === 0) return;

    const formData = new FormData();

    newImages.forEach((file) => {
      formData.append("files", file);
    });

    await uploadImages("SLIDER", sliderId, formData);
  };
  const handleDeletedImages = async (sliderId) => {
    const deletedImages = originalImages.filter(
      (oldImg) => !images.find((img) => img.id === oldImg.id),
    );

    for (let img of deletedImages) {
      await deleteImage("SLIDER", sliderId, img.id);
    }
  };
  const fieldErrorMap = {
    title: "title",
    description: "description",
    link: "link",
  };
  const onSubmit = async (data) => {
    if (!validateForm()) return;
    const payload = buildPayload(data);
    setLoadingSubmit(true);
    try {
      const res = await submitAd(payload);
      const finalsliderId = sliderId || res.data.sliderId;
      await uploadNewImages(finalsliderId);
      if (sliderId) {
        await handleDeletedImages(finalsliderId);
      }
      if (selectedAdmin) {
        await assignAdmin(sliderId, { admin_id: selectedAdmin.id });
      }

      addNotification({
        type: "success",
        message: sliderId ? t.ad.ad_updated : t.ad.ad_created,
      });
      redirectAfterLogin("/dashboard/ads/all");
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
  return (
    <div className={`form-holder create-ad `}>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <div className="form-section submit-section">
          <button
            type="submit"
            className={`main-button ${id ? "update-button" : "create-button"}`}
            onClick={() => setIsSubmitted(true)}
          >
            {id
              ? t.dashboard.forms.update_slide
              : t.dashboard.forms.create_slide}
          </button>
        </div>
      </form>
    </div>
  );
}
