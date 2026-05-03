"use client";

import "@/styles/client/forms.css";
import "@/styles/dashboard/forms.css";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";
import { CircleAlert } from "lucide-react";
import { useNotification } from "@/Contexts/NotificationContext";
import useRedirectAfterLogin from "@/Contexts/useRedirectAfterLogin";
import FormLangSwitch from "@/components/Tools/FormLangSwitch";

import { createBlog } from "@/services/blogs/blogs.service";

export default function CreateBlogPage() {
  const t = useTranslate();
  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();

  // ================= STATE =================
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("en");

  const [sections, setSections] = useState([]);

  // SEO sync flags
  const [seoEdited, setSeoEdited] = useState({
    title: false,
    desc: false,
  });

  // ================= FORM =================
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      meta_title: { en: "", ar: "" },
      meta_desc: { en: "", ar: "" },
      keywords: "",
    },
  });

  const watchTitle = watch("title");
  const watchDescription = watch("description");

  // ================= SEO AUTO SYNC =================
  useEffect(() => {
    if (!seoEdited.title) {
      setValue(
        `meta_title.${currentLocale}`,
        watchTitle?.[currentLocale] || "",
      );
    }
  }, [watchTitle?.[currentLocale]]);

  useEffect(() => {
    if (!seoEdited.desc) {
      setValue(
        `meta_desc.${currentLocale}`,
        watchDescription?.[currentLocale] || "",
      );
    }
  }, [watchDescription?.[currentLocale]]);

  // ================= SECTIONS =================
  const addSection = (type) => {
    const newSection = {
      id: Date.now(),
      type,
      content: { en: "", ar: "" },
      level: type === "heading" ? 1 : null,
      link: "",
      image_id: null,
    };

    setSections((prev) => [...prev, newSection]);
  };

  const updateSection = (id, field, value) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec)),
    );
  };

  const updateSectionContent = (id, locale, value) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === id
          ? { ...sec, content: { ...sec.content, [locale]: value } }
          : sec,
      ),
    );
  };

  const removeSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  // ================= BUILD PAYLOAD =================
  const buildPayload = (data) => {
    const content_en = sections.map((sec, index) => ({
      type: sec.type,
      order: index + 1,
      content: sec.content.en,
      level: sec.level || null,
      link: sec.link || null,
      image_id: sec.image_id || null,
    }));

    const content_ar = sections.map((sec, index) => ({
      type: sec.type,
      order: index + 1,
      content: sec.content.ar,
      level: sec.level || null,
      link: sec.link || null,
      image_id: sec.image_id || null,
    }));

    return {
      title_en: data.title.en,
      title_ar: data.title.ar,

      description_en: data.description.en,
      description_ar: data.description.ar,

      meta_title_en: data.meta_title.en,
      meta_title_ar: data.meta_title.ar,

      meta_desc_en: data.meta_desc.en,
      meta_desc_ar: data.meta_desc.ar,

      keywords_en: data.keywords,
      keywords_ar: data.keywords,

      content_en,
      content_ar,
    };
  };
  const handleImageUpload = async (file, sectionId) => {
    const formData = new FormData();
    formData.append("files", file);

    const res = await uploadImages("BLOG", 0, formData); // temp

    const uploadedImage = res.data[0];

    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId ? { ...sec, image_id: uploadedImage.id } : sec,
      ),
    );
  };
  // ================= SUBMIT =================
  const onSubmit = async (data) => {
    setIsSubmitted(true);
    setLoadingSubmit(true);

    if (!sections.length) {
      addNotification({
        type: "error",
        message: "Content is required",
      });
      setLoadingSubmit(false);
      return;
    }

    try {
      const payload = buildPayload(data);

      await createBlog(payload);

      addNotification({
        type: "success",
        message: t.blogs?.created || "Blog created",
      });

      redirectAfterLogin("/dashboard/blogs");
    } catch (err) {
      addNotification({
        type: "error",
        message: err.response?.data?.message || err.message || "Error",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ================= UI =================
  return (
    <div className="form-holder">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          position: "relative",
          opacity: loadingContent ? "0.6" : "1",
        }}
      >
        {/* ================= BASIC ================= */}
        <div className="row-holder">
          <div className="column-holder">
            {/* TITLE */}
            <div className="box forInput">
              <label>
                {t.dashboard.forms.title} ({currentLocale}) *
              </label>

              <div className="inputHolder">
                <div className="holder">
                  <input
                    key={currentLocale}
                    {...register(`title.${currentLocale}`, {
                      required: "Required",
                    })}
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

            {/* DESCRIPTION */}
            <div className="box forInput">
              <label>
                {t.dashboard.forms.description} ({currentLocale}) *
              </label>

              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    key={currentLocale}
                    {...register(`description.${currentLocale}`, {
                      required: "Required",
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ADD CONTENT ================= */}
        <div className="row-holder">
          <div className="box">
            <label>{t.blogs?.add_content || "add_content"}</label>

            <div className="content-actions">
              <button type="button" onClick={() => addSection("paragraph")}>
                Paragraph
              </button>

              <button type="button" onClick={() => addSection("heading")}>
                Heading
              </button>

              <button type="button" onClick={() => addSection("image")}>
                Image
              </button>

              <button type="button" onClick={() => addSection("link")}>
                Link
              </button>
            </div>
          </div>
        </div>

        {/* ================= SECTIONS ================= */}
        <div className="row-holder">
          {sections.map((sec) => (
            <div key={sec.id} className="box forInput">
              <label>{sec.type}</label>

              {/* CONTENT */}
              {(sec.type === "paragraph" || sec.type === "heading") && (
                <div className="inputHolder">
                  <div className="holder">
                    <textarea
                      value={sec.content[currentLocale]}
                      onChange={(e) =>
                        updateSectionContent(
                          sec.id,
                          currentLocale,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              )}

              {/* HEADING LEVEL */}
              {sec.type === "heading" && (
                <select
                  value={sec.level}
                  onChange={(e) =>
                    updateSection(sec.id, "level", Number(e.target.value))
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      H{lvl}
                    </option>
                  ))}
                </select>
              )}

              {/* LINK */}
              {sec.type === "link" && (
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      placeholder="https://..."
                      value={sec.link}
                      onChange={(e) =>
                        updateSection(sec.id, "link", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              <button type="button" onClick={() => removeSection(sec.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* ================= SEO ================= */}
        <div className="row-holder">
          <div className="column-holder">
            <div className="box forInput">
              <label>Meta Title ({currentLocale})</label>
              <div className="inputHolder">
                <div className="holder">
                  <input
                    {...register(`meta_title.${currentLocale}`)}
                    onChange={() =>
                      setSeoEdited((prev) => ({ ...prev, title: true }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="box forInput">
              <label>Meta Description ({currentLocale})</label>
              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    {...register(`meta_desc.${currentLocale}`)}
                    onChange={() =>
                      setSeoEdited((prev) => ({ ...prev, desc: true }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="box forInput">
              <label>Keywords</label>
              <div className="inputHolder">
                <div className="holder">
                  <input {...register("keywords")} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SUBMIT ================= */}
        <div className="row-holder submit-section">
          <FormLangSwitch
            curentCreateLocale={currentLocale}
            setCurentCreateLocale={setCurrentLocale}
            loadingSubmit={loadingSubmit}
          />

          <button className="main-button" disabled={loadingSubmit}>
            {loadingSubmit ? "..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}
