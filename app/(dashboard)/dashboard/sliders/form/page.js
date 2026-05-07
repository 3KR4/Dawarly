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
import FormLangSwitch from "@/components/Tools/FormLangSwitch";

import {
  getOneSlider,
  createSlider,
  updateSlider,
} from "@/services/sliders/sliders.service";

import { uploadImages, deleteImage } from "@/services/images/images.service";

export default function CreateSliderPage() {
  const t = useTranslate();
  const searchParams = useSearchParams();
  const sliderId = searchParams.get("id");

  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();

  // ===== STATE =====
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);

  const [currentLocale, setCurrentLocale] = useState("en");

  // ===== FORM =====
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      link: "",
    },
  });

  // ===== FETCH (EDIT MODE) =====
  useEffect(() => {
    if (sliderId) fetchSlider();
  }, [sliderId]);

  const fetchSlider = async () => {
    setLoadingContent(true);
    try {
      const res = await getOneSlider(sliderId);
      const slider = res?.data;

      setValue("title", slider.title);
      setValue("description", slider.description);
      setValue("link", slider.link);

      const imgs = slider.image ? [slider.image] : [];
      setImages(imgs);
      setOriginalImages(imgs);
    } catch (err) {
      console.error(err);
      addNotification({
        type: "error",
        message: t.ad.fetch_error || "Error fetching data",
      });
    } finally {
      setLoadingContent(false);
    }
  };

  // ===== HELPERS =====
  const buildPayload = (data) => ({
    title: data.title,
    description: data.description,
    link: data.link,
    is_active: true,
    order: 1,
  });

  const submitSlider = (payload) =>
    sliderId ? updateSlider(sliderId, payload) : createSlider(payload);

  const uploadNewImages = async (id) => {
    const newImages = images.filter((img) => img instanceof File);
    if (!newImages.length) return;

    const formData = new FormData();
    newImages.forEach((file) => {
      formData.append("files", file);
    });

    await uploadImages("SLIDER", id, formData);
  };

  const handleDeletedImages = async (id) => {
    const deleted = originalImages.filter(
      (old) => !images.find((img) => img.id === old.id),
    );

    for (let img of deleted) {
      await deleteImage("SLIDER", id, img.id);
    }
  };

  // ===== SUBMIT =====
  const onSubmit = async (data) => {
    setIsSubmitted(true);
    setLoadingSubmit(true);
    if (!images.length) {
      setLoadingSubmit(false);

      addNotification({
        type: "error",
        message: "Image is required",
      });

      return;
    }
    try {
      const payload = buildPayload(data);

      const res = await submitSlider(payload);

      const finalId = sliderId || res.data.id;

      await uploadNewImages(finalId);

      if (sliderId) {
        await handleDeletedImages(finalId);
      }

      addNotification({
        type: "success",
        message: sliderId
          ? t.dashboard.forms.update_slide
          : t.dashboard.forms.create_slide,
      });

      redirectAfterLogin("/dashboard/sliders");
    } catch (err) {
      console.error(err);

      addNotification({
        type: "error",
        message:
          err.response?.data?.message || err.message || "Something went wrong",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ===== UI =====
  return (
    <div className="form-holder">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          position: "relative",
          opacity: loadingContent ? "0.6" : "1",
        }}
      >
        {loadingContent && (
          <div className="loading-content ">
            <span
              className="loader"
              style={{ opacity: loadingContent ? "1" : "0" }}
            ></span>
          </div>
        )}
        <div className="row-holder two">
          <div className="column-holder">
            <div className="box forInput">
              <label>
                {t.dashboard.forms.slied_title} - ({currentLocale}) *
              </label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    key={currentLocale}
                    {...register(`title.${currentLocale}`, {
                      required: "Required",
                      minLength: {
                        value: 3,
                        message: "Min 3 chars",
                      },
                    })}
                    placeholder={`Title `}
                  />
                </div>
              </div>
              {errors?.title?.[currentLocale] && (
                <span className="error">
                  <CircleAlert />
                  {errors.title[currentLocale].message}
                </span>
              )}
            </div>
            <div className="box forInput">
              <label>Link</label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    {...register("link", {
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                        message: "Invalid URL",
                      },
                    })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              {errors.link && (
                <span className="error">
                  <CircleAlert />
                  {errors.link.message}
                </span>
              )}
            </div>
            <div className="box forInput">
              <label>Description - ({currentLocale})</label>
              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    key={currentLocale}
                    {...register(`description.${currentLocale}`)}
                    rows={4}
                    placeholder={`Description`}
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
              limit={1}
            />
          </div>
        </div>

        {/* SUBMIT */}
        <div className="row-holder submit-section">
          <FormLangSwitch
            curentCreateLocale={currentLocale}
            setCurentCreateLocale={setCurrentLocale}
            loadingSubmit={loadingSubmit}
            editId={sliderId}
          />
          <button
            type="submit"
            className="main-button"
            disabled={loadingSubmit}
            style={{ opacity: loadingSubmit ? "0.6" : "1" }}
          >
            {loadingSubmit ? (
              <span className="loader"></span>
            ) : sliderId ? (
              t.dashboard.forms.update_slide
            ) : (
              t.dashboard.forms.create_slide
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
