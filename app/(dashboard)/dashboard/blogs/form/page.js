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

import {
  createBlog,
  getOneBlog,
  updateBlog,
} from "@/services/blogs/blogs.service";
import Images from "@/components/Tools/data-collector/Images";
import Tags from "@/components/Tools/data-collector/Tags";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { uploadImages } from "@/services/images/images.service";
import { useSearchParams } from "next/navigation";

const headingLevels = [
  { id: 1, name_en: "Main Title (H1)", name_ar: "العنوان الرئيسي (H1)" },
  { id: 2, name_en: "Section Title (H2)", name_ar: "عنوان قسم (H2)" },
  { id: 3, name_en: "Subsection Title (H3)", name_ar: "عنوان فرعي (H3)" },
  { id: 4, name_en: "Small Heading (H4)", name_ar: "عنوان صغير (H4)" },
  { id: 5, name_en: "Smaller Heading (H5)", name_ar: "عنوان أصغر (H5)" },
  { id: 6, name_en: "Minor Heading (H6)", name_ar: "عنوان ثانوي (H6)" },
];

export default function CreateBlogPage() {
  const searchParams = useSearchParams();

  const blogSlug = searchParams.get("slug");

  const t = useTranslate();
  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();

  // ================= STATE =================
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("en");

  const { tags, setTags } = useContext(selectors);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [coverImage, setCoverImage] = useState([]);
  const [sectionImages, setSectionImages] = useState({});

  console.log(sectionImages);

  const [sections, setSections] = useState([]);
  const [blogId, setBlogId] = useState(null);

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

  // ===== FETCH (EDIT MODE) =====
  useEffect(() => {
    if (blogSlug) fetchBlog();
  }, [blogSlug]);

  const fetchBlog = async () => {
    setLoadingContent(true);
    try {
      const res = await getOneBlog(blogSlug);
      const blog = res?.data;
      setBlogId(blog.id);
      // ===== FORM =====
      setValue("title.en", blog.title_en);
      setValue("title.ar", blog.title_ar);

      setValue("description.en", blog.description_en);
      setValue("description.ar", blog.description_ar);

      setValue("meta_title.en", blog.meta_title_en);
      setValue("meta_title.ar", blog.meta_title_ar);

      setValue("meta_desc.en", blog.meta_desc_en);
      setValue("meta_desc.ar", blog.meta_desc_ar);

      setTags(blog.tags ? blog.tags.split(",").map((tag) => tag.trim()) : []);
      // ===== SECTIONS =====
      const mergedSections = blog.content_en.map((enSec, index) => {
        const arSec = blog.content_ar[index];

        return {
          id: Date.now() + index,
          type: enSec.type,

          content: {
            en: enSec.content || "",
            ar: arSec?.content || "",
          },

          label: {
            en: enSec.label || "",
            ar: arSec?.label || "",
          },

          level: enSec.level || null,
          link: enSec.link || "",
          image_id: enSec.image_id || null,

          image: enSec.image || null,
          items: enSec.list || arSec?.list || [],
        };
      });

      setSections(mergedSections);

      // ===== COVER =====
      if (blog.cover) {
        setCoverImage([blog.cover]);
      }

      // ===== SECTION IMAGES =====
      const sectionImgs = {};

      mergedSections.forEach((sec) => {
        if (sec.type === "image" && sec.image) {
          sectionImgs[sec.id] = [sec.image];
        }
      });

      setSectionImages(sectionImgs);
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
    // ================= CHECK ONLY LAST SECTION =================
    const lastSection = sections[sections.length - 1];

    if (lastSection) {
      const isLastEmpty = (() => {
        switch (lastSection.type) {
          case "heading":
          case "paragraph":
            return (
              !lastSection.content?.en?.trim() &&
              !lastSection.content?.ar?.trim()
            );

          case "link":
            return !lastSection.link?.trim();

          case "button":
            return (
              !lastSection.label?.en?.trim() && !lastSection.label?.ar?.trim()
            );

          case "image":
            return (
              !sectionImages?.[lastSection.id] ||
              sectionImages[lastSection.id].length === 0
            );

          default:
            return false;
        }
      })();

      if (isLastEmpty) {
        addNotification({
          type: "error",
          message:
            "Please complete the current section before adding a new one",
        });
        return;
      }
    }

    // ================= CREATE NEW SECTION =================
    const id = Date.now();

    const newSection = {
      id,
      type,
      content: { en: "", ar: "" },
      label: { en: "", ar: "" },
      level: type === "heading" ? 1 : null,
      link: "",
      image_id: null,
      items: type === "list" ? [] : undefined,
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
        list: sec.type === "list" ? sec.items || [] : null,
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
    if (!coverImage?.length) {
      addNotification({
        type: "error",
        message: "Cover image is required",
      });
      return;
    }
    setIsSubmitted(true);
    setLoadingSubmit(true);

    if (!sections.length) {
      addNotification({ type: "error", message: "Content is required" });
      setLoadingSubmit(false);
      return;
    }

    try {
      let currentBlogId = blogId;
      let coverId = null;

      // ================= CREATE BLOG =================
      if (!blogSlug) {
        const createRes = await createBlog({
          title_en: data.title.en,
          title_ar: data.title.ar,
          description_en: data.description.en,
          description_ar: data.description.ar,
          meta_title_en: data.meta_title.en,
          meta_title_ar: data.meta_title.ar,
          meta_desc_en: data.meta_desc.en,
          meta_desc_ar: data.meta_desc.ar,
          tags: tags?.join(",") || "",
        });

        currentBlogId = createRes?.data?.id;
      }

      // ================= COVER IMAGE UPLOAD =================
      const coverFile = coverImage?.[0]?.file;

      if (coverFile instanceof File) {
        const formData = new FormData();
        formData.append("files", coverFile);
        formData.append("is_cover", "true");
        await uploadImages("BLOG", currentBlogId, formData);
      }

      // ================= SECTION IMAGES UPLOAD =================
      const sectionImageMap = {};

      console.log("step: upload sections images");

      for (const sec of sections) {
        if (sec.type !== "image") continue;

        const images = sectionImages?.[sec.id] || [];

        const newFiles = images
          .filter((img) => img?.file instanceof File)
          .map((img) => img.file);

        if (!newFiles.length) continue;

        const formData = new FormData();
        newFiles.forEach((file) => formData.append("files", file));
        formData.append("is_cover", "false");
        const res = await uploadImages("BLOG", currentBlogId, formData);

        const uploadedId = res?.data?.[0]?.id ?? null;

        sectionImageMap[sec.id] = uploadedId;

        console.log("section uploaded:", uploadedId);
      }

      // ================= MERGE SECTIONS =================
      const finalSections = sections.map((sec) => ({
        ...sec,
        image_id: sectionImageMap?.[sec.id] ?? sec.image_id ?? null,
      }));

      // ================= BUILD PAYLOAD =================
      const payload = buildPayload(data, finalSections);

      // ================= ATTACH COVER =================
      if (coverId) {
        payload.cover_id = coverId;
      }

      // ================= UPDATE BLOG =================
      await updateBlog(currentBlogId, payload);

      addNotification({
        type: "success",
        message: blogId
          ? "Blog updated successfully"
          : "Blog created successfully",
      });

      redirectAfterLogin("/dashboard/blogs");
    } catch (err) {
      addNotification({
        type: "error",
        message: err?.response?.data?.message || err?.message,
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
        {loadingContent && (
          <div className="loading-content ">
            <span
              className="loader"
              style={{ opacity: loadingContent ? "1" : "0" }}
            ></span>
          </div>
        )}
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
                images={coverImage}
                setImages={setCoverImage}
                isSubmitted={isSubmitted}
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
            <button type="button" onClick={() => addSection("list")}>
              <FaPlus /> list <span>{getSectionCount("list") || "0"}</span>
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
              {sec.type === "list" && (
                <div className="inputHolder for-list">
                  <div
                    className="holder"
                    style={{
                      alignItems: "flex-start",
                    }}
                  >
                    <ul style={{ flex: 1 }}>
                      {(sec.items || []).map((item, index) => {
                        console.log("item:", sec.items);
                        return (
                          <li key={item.id}>
                            <div className="inputHolder">
                              <div className="holder">
                                <input
                                  value={item.value}
                                  placeholder="list item..."
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    setSections((prev) =>
                                      prev.map((s) => {
                                        if (s.id !== sec.id) return s;

                                        const updatedItems = [
                                          ...(s.items || []),
                                        ];
                                        updatedItems[index].value = value;

                                        return { ...s, items: updatedItems };
                                      }),
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <button
                      type="button"
                      className="main-button"
                      onClick={() => {
                        setSections((prev) =>
                          prev.map((s) => {
                            if (s.id !== sec.id) return s;

                            const items = s.items || [];

                            // ================= VALIDATION =================
                            const lastItem = items[items.length - 1];

                            if (lastItem && !lastItem.value?.trim()) {
                              addNotification({
                                type: "error",
                                message:
                                  "Please fill last item before adding new one",
                              });
                              return s;
                            }

                            return {
                              ...s,
                              items: [...items, { id: Date.now(), value: "" }],
                            };
                          }),
                        );
                      }}
                    >
                      + Add new line
                    </button>
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
            ) : blogSlug ? (
              t.dashboard.forms.update || "update blog"
            ) : (
              t.dashboard.forms.create || "create blog"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
