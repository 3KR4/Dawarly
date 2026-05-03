"use client";

import "@/styles/client/forms.css";
import "@/styles/dashboard/forms.css";
import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";
import { CircleAlert } from "lucide-react";
import { useNotification } from "@/Contexts/NotificationContext";
import useRedirectAfterLogin from "@/Contexts/useRedirectAfterLogin";
import FormLangSwitch from "@/components/Tools/FormLangSwitch";
import { selectors } from "@/Contexts/selectors";
import { FaPlus } from "react-icons/fa6";

import { createBlog, updateBlog } from "@/services/blogs/blogs.service";
import Images from "@/components/Tools/data-collector/Images";
import Tags from "@/components/Tools/data-collector/Tags";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { uploadImages } from "@/services/images/images.service";

const headingLevels = [
  { id: 1, name_en: "Main Title (H1)", name_ar: "العنوان الرئيسي (H1)" },
  { id: 2, name_en: "Section Title (H2)", name_ar: "عنوان قسم (H2)" },
  { id: 3, name_en: "Subsection Title (H3)", name_ar: "عنوان فرعي (H3)" },
  { id: 4, name_en: "Small Heading (H4)", name_ar: "عنوان صغير (H4)" },
  { id: 5, name_en: "Smaller Heading (H5)", name_ar: "عنوان أصغر (H5)" },
  { id: 6, name_en: "Minor Heading (H6)", name_ar: "عنوان ثانوي (H6)" },
];

export default function CreateBlogPage() {
  const t = useTranslate();
  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();

  // ================= STATE =================
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("en");

  const { tags, setTags } = useContext(selectors);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [images, setImages] = useState([]);
  const [sectionImages, setSectionImages] = useState({});
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
    const id = Date.now();

    const newSection = {
      id,
      type,

      // multilingual content
      content: { en: "", ar: "" },

      // multilingual label (for button only but safe for all)
      label: { en: "", ar: "" },

      // fixed fields
      level: type === "heading" ? 1 : null,
      link: "",
      image_id: null,
    };

    setSections((prev) => [...prev, newSection]);

    if (type === "image") {
      setSectionImages((prev) => ({
        ...prev,
        [id]: [],
      }));
    }
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
          ? {
              ...sec,
              content: {
                ...sec.content,
                [locale]: value,
              },
            }
          : sec,
      ),
    );
  };

  const updateSectionLabel = (id, locale, value) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === id
          ? {
              ...sec,
              label: {
                ...sec.label,
                [locale]: value,
              },
            }
          : sec,
      ),
    );
  };

  const removeSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  // ================= BUILD PAYLOAD =================
  const buildPayload = (data, sectionsWithImages) => {
    return {
      title_en: data.title.en,
      title_ar: data.title.ar,

      description_en: data.description.en,
      description_ar: data.description.ar,

      content_en: sectionsWithImages.map((sec, index) => ({
        type: sec.type,
        order: index + 1,

        content: sec.content?.en || "",
        label: sec.label?.en || "",

        level: sec.level || null,
        link: sec.link || null,
        image_id: sec.image_id || null,
      })),

      content_ar: sectionsWithImages.map((sec, index) => ({
        type: sec.type,
        order: index + 1,

        content: sec.content?.ar || "",
        label: sec.label?.ar || "",

        level: sec.level || null,
        link: sec.link || null,
        image_id: sec.image_id || null,
      })),
    };
  };
  const getSectionCount = (type) =>
    sections.filter((s) => s.type === type).length;

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
      const createRes = await createBlog({
        title_en: data.title["en"],
        title_ar: data.title["ar"],
        description_en: data.description["en"],
        description_ar: data.description["ar"],
        meta_title_en: data.meta_title["en"],
        meta_title_ar: data.meta_title["ar"],
        meta_desc_en: data.meta_desc["en"],
        meta_desc_ar: data.meta_desc["ar"],
        tags: Array.isArray(tags) ? tags.join(",") : "",
      });

      const blogId = createRes.data.id;

      // ================= 2. UPLOAD MAIN IMAGES =================
      let uploadedImages = [];

      if (images.length) {
        const formData = new FormData();
        images.forEach((img) => {
          formData.append("files", img);
        });

        console.log(images);
        console.log(formData);

        const imageRes = await uploadImages("BLOG", blogId, formData);
        uploadedImages = imageRes.data || [];
      }

      let imageIndex = 0;

      const sectionsWithMainImages = sections.map((sec) => {
        if (sec.type === "image") {
          const img = uploadedImages[imageIndex];
          imageIndex++;

          return {
            ...sec,
            image_id: img?.id || null,
          };
        }
        return sec;
      });

      // ================= 3. UPLOAD SECTION IMAGES =================
      const sectionImageMap = {};

      for (const sec of sectionsWithMainImages) {
        if (sec.type === "image") {
          const files = sectionImages[sec.id] || [];

          if (!files.length) continue;

          const formData = new FormData();
          files.forEach((img) => {
            formData.append("files", img);
          });

          const res = await uploadImages("BLOG", blogId, formData);

          sectionImageMap[sec.id] = res.data?.[0]?.id || null;
        }
      }

      const finalSections = sectionsWithMainImages.map((sec) => ({
        ...sec,
        image_id: sectionImageMap[sec.id] || sec.image_id || null,
      }));

      // ================= 4. UPDATE BLOG =================
      await updateBlog(blogId, buildPayload(data, finalSections));

      // ================= SUCCESS =================
      addNotification({
        type: "success",
        message: "Blog created successfully",
      });

      redirectAfterLogin("/dashboard/blogs");
    } catch (err) {
      addNotification({
        type: "error",
        message: err.response?.data?.message || err.message,
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
        <div className="form-section">
          <h2 className="section-title">{"blog details"}</h2>
          <div className="row-holder two">
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
                      placeholder={"enter the blog title"}
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
                      placeholder={"enter the blog description"}
                      {...register(`description.${currentLocale}`, {
                        required: "Required",
                      })}
                    />
                  </div>
                </div>
              </div>
              <Images
                images={images}
                setImages={setImages}
                isSubmitted={isSubmitted}
                isEditing={null}
                disabled={null}
                limit={1}
              />
            </div>
            <div className="column-holder">
              <div className="box forInput">
                <label>Meta Title ({currentLocale})</label>
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      key={currentLocale}
                      placeholder={"enter the meta title"}
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
                      key={currentLocale}
                      placeholder={"enter the meta description"}
                      {...register(`meta_desc.${currentLocale}`)}
                      onChange={() =>
                        setSeoEdited((prev) => ({ ...prev, desc: true }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Tags disabled={null} />
            </div>
          </div>
        </div>

        {/* ================= ADD CONTENT ================= */}
        <div className="form-section blog-content">
          <h2 className="section-title">{"blog content"}</h2>
          <div className="header">
            <button type="button" onClick={() => addSection("heading")}>
              <FaPlus /> Heading{" "}
              <span>{getSectionCount("heading") || "0"}</span>
            </button>
            <button type="button" onClick={() => addSection("paragraph")}>
              <FaPlus /> Paragraph{" "}
              <span>{getSectionCount("paragraph") || "0"}</span>
            </button>
            <button type="button" onClick={() => addSection("image")}>
              <FaPlus /> Image <span>{getSectionCount("image") || "0"}</span>
            </button>

            <button type="button" onClick={() => addSection("link")}>
              <FaPlus /> Link <span>{getSectionCount("link") || "0"}</span>
            </button>
            <button type="button" onClick={() => addSection("button")}>
              <FaPlus /> Button <span>{getSectionCount("button") || "0"}</span>
            </button>
          </div>

        {/* ================= SECTIONS ================= */}
        {sections.map((sec) => (
          <div key={sec.id} className="box forInput">
            <div className="top-label">
              <label>{sec.type}</label>
              <button type="button" onClick={() => removeSection(sec.id)}>
                Delete
              </button>
            </div>

            {/* HEADING LEVEL */}

            {sec.type === "heading" && (
              <>
                <SelectOptions
                  placeholder={"Choose heading level / اختر مستوى العنوان"}
                  options={headingLevels}
                  value={headingLevels.find((lvl) => lvl.id === sec.level)}
                  onChange={(item) => updateSection(sec.id, "level", item.id)}
                />

                <div className="inputHolder">
                  <div className="holder">
                    <input
                      value={sec.content?.[currentLocale] || ""}
                      placeholder={"enter the heading"}
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
              </>
            )}
            {sec.type === "paragraph" && (
              <div className="inputHolder">
                <div className="holder">
                  <textarea
                    value={sec.content?.[currentLocale] || ""}
                    placeholder={"enter the paragraph"}
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

            {/* LINK */}
            {sec.type === "link" && (
              <div className="inputHolder">
                <div className="holder">
                  <input
                    placeholder="https://..."
                    value={sec.link || ""}
                    onChange={(e) =>
                      updateSection(sec.id, "link", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
            {/* button */}
            {sec.type === "button" && (
              <div className="row-holder two">
                <div className="inputHolder">
                  <div className="holder">
                    <input
                      placeholder="button label"
                      value={sec.label?.[currentLocale] || ""}
                      onChange={(e) =>
                        updateSectionLabel(
                          sec.id,
                          currentLocale,
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="inputHolder">
                  <div className="holder">
                    <input
                      placeholder="https://..."
                      value={sec.link || ""}
                      onChange={(e) =>
                        updateSection(sec.id, "link", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            {sec.type === "image" && (
              <Images
                images={sectionImages[sec.id] || []}
                setImages={(newImages) =>
                  setSectionImages((prev) => ({
                    ...prev,
                    [sec.id]:
                      typeof newImages === "function"
                        ? newImages(prev[sec.id] || [])
                        : newImages,
                  }))
                }
                limit={1}
                sectionMode={true}
                sectionId={sec.id}
              />
            )}
          </div>
        ))}
        </div>


        {/* ================= SUBMIT ================= */}
        <div className="row-holder submit-section two">
          <FormLangSwitch
            curentCreateLocale={currentLocale}
            setCurentCreateLocale={setCurrentLocale}
            loadingSubmit={loadingSubmit}
          />

          <button
            type="submit"
            className="main-button"
            disabled={loadingSubmit}
            style={{ opacity: loadingSubmit ? "0.6" : "1" }}
          >
            {loadingSubmit ? (
              <span className="loader"></span>
            ) : null ? (
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
