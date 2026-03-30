"use client";
import "@/styles/client/forms.css";
import "@/styles/dashboard/forms.css";

import React, { useState, useContext, useEffect, useMemo } from "react";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { Mail, Phone, UserRound, CircleAlert } from "lucide-react";
import { getOneUser } from "@/services/auth/auth.service";
import { useAuth } from "@/Contexts/AuthContext";
import { useAppData } from "@/Contexts/DataContext";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";
import { useSearchParams } from "next/navigation";

export default function UsersForm() {
  const { governorates, subCategories, cities, fetchCities } = useAppData();
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const t = useTranslate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [additionalData, setAdditionalData] = useState({
    gov: null,
    city: null,
    gender: null,
  });

  const handleAdditionalData = (type, value) => {
    setAdditionalData((prev) => ({ ...prev, [type]: value }));
  };

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoadingContent(true);
    try {
      const res = await getOneUser(userId);
      const ad = res?.data;
      if (!ad) return alert(t.ad.fetch_error);
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
      setLoadingContent(false);
    }
  };

  const onSubmit = async (data) => {
    setLoadingSubmit((prev) => ({ ...prev, submit: true }));
    try {
    } catch (err) {
      console.log(err.response.data.message);
      addNotification({
        type: "warning",
        message: err.response.data.message,
      });
    } finally {
      setLoadingSubmit((prev) => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className={`form-holder create-ad`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          position: "relative",
          opacity: loadingContent ? "0.6" : "1",
        }}
      >
        <div className="form-section right">
          <h2 className="section-title">{t.ad.admin_contact}</h2>
          <div
            className="row-holder"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            <div className="box forInput">
              <label>{t.auth.fullName}</label>
              <div className="inputHolder">
                <div className="holder">
                  <UserRound />
                  <input
                    type="text"
                    {...register("fullname", {
                      required: t.auth.errors.requiredFullName,
                      validate: (value) => {
                        const words = value.trim().split(/\s+/);
                        if (words.length < 2)
                          return t.auth.errors.fullNameTwoWords;
                        for (let i = 0; i < words.length; i++) {
                          if (words[i].length < 3) {
                            if (i === 0) return t.auth.errors.firstNameShort;
                            if (i === 1) return t.auth.errors.lastNameShort;
                            return `Word ${i + 1} must be at least 3 characters`;
                          }
                        }
                        return true;
                      },
                    })}
                    placeholder={t.auth.placeholders.fullName}
                  />
                </div>
                {errors.fullname && (
                  <span className="error">
                    <CircleAlert />
                    {errors.fullname.message}
                  </span>
                )}
              </div>
            </div>
            <div className="box forInput">
              <label>{t.auth.email}</label>
              <div className="inputHolder">
                <div className="holder">
                  <Mail />
                  <input
                    type="email"
                    {...register("email", {
                      required: t.auth.errors.requiredEmail,
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: t.auth.errors.invalidEmail,
                      },
                    })}
                    placeholder={t.auth.placeholders.email}
                  />
                </div>
                {errors.email && (
                  <span className="error">
                    <CircleAlert />
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>
            <div className="box forInput">
              <label>{t.auth.phone}</label>
              <div className="inputHolder">
                <div className="holder">
                  <Phone />
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone", {
                      required: t.auth.errors.requiredPhone,
                      pattern: {
                        value: /^[0-9]{7,15}$/,
                        message: t.auth.errors.invalidPhone,
                      },
                    })}
                    placeholder={t.auth.placeholders.phone}
                  />
                </div>
                {errors.phone && (
                  <span className="error">
                    <CircleAlert />
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= ADDRESS SELECTION ================= */}
        <div
          className="row-holder"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          <SelectOptions
            label={t.location.yourGovernorate}
            placeholder={t.location.selectGovernorate}
            options={governorates}
            value={additionalData?.gov || null}
            type="govs"
            onChange={(item) => {
              handleAdditionalData("gov", item);
              handleAdditionalData("city", null);
              handleErrors("gov", null);
            }}
            required={true}
          />
          <SelectOptions
            label={t.location.yourCity}
            placeholder={t.location.selectCity}
            options={cities}
            value={additionalData?.city || null}
            type="citys"
            disabled={!additionalData?.gov}
            onChange={(item) => {
              handleAdditionalData("city", item);
              handleErrors("city", null);
            }}
            required={true}
          />
        </div>

        <button
          type={"submit"}
          className="main-button"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (
            <span className="loader"></span>
          ) : (
            t.auth.saveUser || "save and update"
          )}
        </button>
      </form>
    </div>
  );
}

{
  /* ================= INTERESTS SELECTION ================= */
}
{
  /* {step === STEPS.INTERESTS && (
          <div className="options-grid">
            {subCategories?.map((cat) => {
              const Icon = cat?.icon;
              const active = selectedCategories.includes(cat.id);

              return (
                <div
                  key={cat.id}
                  className={`option-box ${active ? "active" : ""}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <Icon className="cat-icon" />
                  <span>{cat[`name_${locale}`]}</span>
                </div>
              );
            })}
          </div>
        )} */
}
{
  /* <div className="box forInput">
          <label>{t.auth.password}</label>
          <div className="inputHolder password">
            <div className="holder">
              <LockKeyhole />
              <input
                type={passEye.password ? "text" : "password"}
                {...register("password", {
                  required: t.auth.errors.requiredPassword,
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?~\-]).{8,}$/,
                    message: t.auth.errors.passwordWeak,
                  },
                })}
                placeholder={t.auth.placeholders.password}
              />
              {passEye.password ? (
                <Eye
                  className="eye"
                  onClick={() => setPassEye((p) => ({ ...p, password: false }))}
                />
              ) : (
                <EyeOff
                  className="eye"
                  onClick={() => setPassEye((p) => ({ ...p, password: true }))}
                />
              )}
            </div>
            {errors.password && (
              <span className="error">
                <CircleAlert />
                {errors.password.message}
              </span>
            )}
          </div>
        </div>
        <div className="box forInput">
          <label>{t.auth.confirmPassword}</label>
          <div className="inputHolder password">
            <div className="holder">
              <LockKeyhole />
              <input
                type={passEye.confirm ? "text" : "password"}
                {...register("passwordConfirmation", {
                  required: t.auth.errors.requiredPassword,
                  validate: (value) =>
                    value === password ? true : t.auth.errors.passwordMismatch,
                })}
                placeholder={t.auth.placeholders.confirmPassword}
              />
              {passEye.confirm ? (
                <Eye
                  className="eye"
                  onClick={() => setPassEye((p) => ({ ...p, confirm: false }))}
                />
              ) : (
                <EyeOff
                  className="eye"
                  onClick={() => setPassEye((p) => ({ ...p, confirm: true }))}
                />
              )}
            </div>
            {errors.passwordConfirmation && (
              <span className="error">
                <CircleAlert />
                {errors.passwordConfirmation.message}
              </span>
            )}
          </div>
        </div> */
}
