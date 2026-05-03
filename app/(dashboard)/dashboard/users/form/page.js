"use client";
import "@/styles/client/forms.css";
import "@/styles/dashboard/forms.css";

import React, { useState, useContext, useEffect } from "react";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { Mail, Phone, UserRound, CircleAlert } from "lucide-react";
import {
  change_ads_limit,
  getOneUser,
  make_suber_admin,
  updatePermissions,
  updateRole,
  updateSubscriperProfile,
  updateUserProfile,
} from "@/services/auth/auth.service";
import { PiTiktokLogo } from "react-icons/pi";
import { FiFacebook } from "react-icons/fi";
import { AiOutlineProduct } from "react-icons/ai";

import { useAppData } from "@/Contexts/DataContext";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";
import { useSearchParams } from "next/navigation";
import { UserTypes, Permissions } from "@/data/enums";
import { useAuth } from "@/Contexts/AuthContext";
import { useNotification } from "@/Contexts/NotificationContext";
import useRedirectAfterLogin from "@/Contexts/useRedirectAfterLogin";

const superAdminOption = {
  id: "SUPER", // قيمة مميزة
  name_en: "Super Admin",
  name_ar: "سوبر أدمن",
  bg: "#ffd7007a", // ذهبي
  tx: "#555555",
};

export default function UsersForm() {
  const { governorates, cities } = useAppData();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const redirectAfterLogin = useRedirectAfterLogin();

  const [originalData, setOriginalData] = useState(null);

  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const t = useTranslate();
  const [selectedType, setSelectedType] = useState({
    id: "USER",
    name_en: "Users",
    name_ar: "المستخدمين",
    tx: "#1E88E5", // أزرق غامق
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const isMyProfile = userId == user?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    if (!userId) return;
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoadingContent(true);
    try {
      const res = await getOneUser(userId);
      const userData = res?.data;

      if (!userData) return alert(t.ad.fetch_error);

      reset({
        fullname: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        facebook_link: userData.facebook_link || "",
        tiktok_link: userData.tiktok_link || "",
        subscription_ads_limit: userData.subscription_ads_limit || 0,
      });
      let typeForSelect = UserTypes.find((p) => p.id == userData.user_type);
      if (userData.is_super_admin) {
        typeForSelect = superAdminOption;
      }

      setSelectedType(typeForSelect);

      const permsForSelect = Permissions.filter((p) =>
        userData?.permissions?.includes(p.id),
      );

      setSelectedPermissions(permsForSelect);

      setAdditionalData({
        gov: userData.governorate || null,
        city: userData.city || null,
      });
      setOriginalData({
        full_name: userData.full_name || "",
        phone: userData.phone || "",
        governorate_id: userData.governorate?.id || null,
        city_id: userData.city?.id || null,
        tiktok_link: userData.tiktok_link || "",
        facebook_link: userData.facebook_link || "",
        subscription_ads_limit: userData.subscription_ads_limit || 0,
        permissions: userData.permissions || [],
        user_type: userData.user_type,
        is_super_admin: userData.is_super_admin,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      addNotification({
        type: "error",
        message: t.ad.fetch_error,
      });
    } finally {
      setLoadingContent(false);
    }
  };

  const onSubmit = async (data) => {
    setLoadingSubmit(true);

    const updates = {};

    // ------------------ 1) User Profile ------------------
    const profileChanged =
      data.fullname !== originalData.full_name ||
      data.phone !== originalData.phone ||
      additionalData.gov?.id !== originalData.governorate_id ||
      additionalData.city?.id !== originalData.city_id;

    if (profileChanged) {
      updates.profile = {
        full_name: data.fullname,
        phone: data.phone,
        governorate_id: additionalData.gov?.id || null,
        city_id: additionalData.city?.id || null,
      };
    }

    // ------------------ 2) Subscriber Profile ------------------
    const subChanged =
      data.facebook_link !== originalData.facebook_link ||
      data.tiktok_link !== originalData.tiktok_link;

    if (subChanged) {
      updates.subscriber = {
        facebook_link: data.facebook_link,
        tiktok_link: data.tiktok_link,
      };
    }

    // ------------------ 3) Permissions ------------------
    const selectedPermsIds = [...selectedPermissions].map((p) => p.id).sort();

    const originalPerms = [...(originalData.permissions || [])].sort();

    const permsChanged =
      selectedPermsIds.length !== originalPerms.length ||
      selectedPermsIds.some((id, i) => id !== originalPerms[i]);

    if (permsChanged) {
      updates.permissions = selectedPermsIds;
    }

    // ------------------ 4) Role + Super Admin ------------------
    let newRole = selectedType?.id;
    let makeSuper = originalData.is_super_admin;

    // 👇 تحويل SUPER → ADMIN + is_super_admin
    if (selectedType?.id === "SUPER") {
      newRole = "ADMIN";
      makeSuper = true;
    } else {
      makeSuper = false;
    }

    // 👇 لو رجع من SUPER لـ ADMIN
    if (selectedType?.id === "ADMIN" && originalData.is_super_admin) {
      makeSuper = false;
    }

    const roleChanged =
      newRole !== originalData.user_type && selectedType?.id !== "SUPER"; // 👈 مهم

    if (roleChanged) {
      updates.role = newRole;
    }

    const superChanged = makeSuper !== originalData.is_super_admin;

    if (superChanged) {
      updates.suber_admin = makeSuper;
    }

    // ------------------ 5) Ads Limit ------------------
    const adsLimitChanged =
      data.subscription_ads_limit !== originalData.subscription_ads_limit;
    console.log("adsLimitChanged:", adsLimitChanged);
    console.log("data.subscription_ads_limit:", data.subscription_ads_limit);
    console.log(
      "originalData.subscription_ads_limit:",
      originalData.subscription_ads_limit,
    );

    if (adsLimitChanged) {
      updates.ads_limit = data.subscription_ads_limit;
    }

    // ------------------ 6) تنفيذ الريكوستات ------------------
    try {
      const messages = [];

      if (updates.profile) {
        const res = await updateUserProfile(updates.profile);
        if (res?.data?.message) messages.push(res.data.message);
      }

      if (updates.subscriber) {
        const res = await updateSubscriperProfile(updates.subscriber);
        if (res?.data?.message) messages.push(res.data.message);
      }

      if (updates.suber_admin !== undefined) {
        const res = await make_suber_admin(userId, {
          makeSuper: updates.suber_admin,
        });
        if (res?.data?.message) messages.push(res.data.message);
      }

      if (updates.role) {
        const res = await updateRole(userId, { user_type: updates.role });
        if (res?.data?.message) messages.push(res.data.message);
      }

      if (updates.permissions) {
        const res = await updatePermissions(userId, {
          permissions: updates.permissions,
        });
        if (res?.data?.message) messages.push(res.data.message);
      }

      if (updates.ads_limit !== undefined) {
        const res = await change_ads_limit(userId, {
          subscription_ads_limit: updates.ads_limit,
        });
        if (res?.data?.message) messages.push(res.data.message);
      }

      addNotification({
        type: "success",
        message: messages.join(" | ") || "Updated successfully",
      });
      redirectAfterLogin("/dashboard/users");
    } catch (err) {
      console.error(err);
      addNotification({
        type: "warning",
        message: err?.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoadingSubmit(false);
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
        {loadingContent && (
          <div className="loading-content">
            <span
              className="loader"
              style={{ opacity: loadingContent ? "1" : "0" }}
            ></span>
          </div>
        )}
        <div className="form-section ">
          <h2 className="section-title">{t.auth.profileDetails}</h2>
          <div className="box forInput">
            <label>{t.auth.email}</label>
            <div className="inputHolder">
              <div className="holder">
                <Mail />
                <input
                  disabled={true}
                  type="email"
                  {...register("email", {
                    required: t.auth.errors.requiredEmail,
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
          <div
            className="row-holder two"
          >
            <div className="box forInput">
              <label>{t.auth.fullName}</label>
              <div className="inputHolder">
                <div className="holder">
                  <UserRound />
                  <input
                    type="text"
                    disabled={!isMyProfile}
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
              <label>{t.auth.phone}</label>
              <div className="inputHolder">
                <div className="holder">
                  <Phone />
                  <input
                    disabled={!isMyProfile}
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
          className="row-holder two"
        >
          <SelectOptions
            disabled={!isMyProfile}
            label={t.location.yourGovernorate}
            placeholder={t.location.selectGovernorate}
            options={governorates}
            value={additionalData?.gov || null}
            type="govs"
            onChange={(item) => {
              handleAdditionalData("gov", item);
              handleAdditionalData("city", null);
            }}
            required={true}
          />
          <SelectOptions
            disabled={!isMyProfile || !additionalData?.gov}
            label={t.location.yourCity}
            placeholder={t.location.selectCity}
            options={cities}
            value={additionalData?.city || null}
            type="citys"
            onChange={(item) => {
              handleAdditionalData("city", item);
            }}
            required={true}
          />
        </div>

        {selectedType?.id == "SUBUSER" && (
          <div className="form-section ">
            <h2 className="section-title">{t.auth.SubscriptionDetails}</h2>
            <div
              className="row-holder two"
            >
              {/* Facebook */}
              <div className="box forInput">
                <label>{t.auth.facebook}</label>
                <div className="inputHolder">
                  <div className="holder">
                    <FiFacebook />
                    <input
                      disabled={!isMyProfile}
                      type="text"
                      {...register("facebook_link", {
                        pattern: {
                          value: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
                          message: t.auth.errors.invalidFacebook,
                        },
                      })}
                      placeholder={t.auth.placeholders.facebook}
                    />
                  </div>
                  {errors.facebook_link && (
                    <span className="error">
                      <CircleAlert />
                      {errors.facebook_link.message}
                    </span>
                  )}
                </div>
              </div>

              {/* TikTok */}
              <div className="box forInput">
                <label>{t.auth.ticktok}</label>
                <div className="inputHolder">
                  <div className="holder">
                    <PiTiktokLogo />
                    <input
                      disabled={!isMyProfile}
                      type="text"
                      {...register("tiktok_link", {
                        pattern: {
                          value: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/,
                          message: t.auth.errors.invalidticktok,
                        },
                      })}
                      placeholder={t.auth.placeholders.ticktok}
                    />
                  </div>
                  {errors.tiktok_link && (
                    <span className="error">
                      <CircleAlert />
                      {errors.tiktok_link.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="form-section ">
          <h2 className="section-title">{t.auth.rolesAndPermitions}</h2>
          <div
            className="row-holder two"
          >
            <SelectOptions
              label={t.auth.role}
              placeholder={t.auth.placeholders.role}
              options={[...UserTypes, superAdminOption]}
              value={selectedType}
              onChange={(selected) => {
                setSelectedType((prev) =>
                  prev?.id === selected.id ? null : selected,
                );
              }}
            />
            {/* TikTok */}
            {selectedType?.id == "SUBUSER" ? (
              <div className="box forInput">
                <label>{t.auth.AdsLimit}</label>

                <div className="inputHolder">
                  <div className="holder">
                    <AiOutlineProduct />
                    <input
                      type="number"
                      {...register("subscription_ads_limit", {
                        required: t.auth.errors.requiredSubscriptionLimit,
                        min: {
                          value: 0,
                          message: t.auth.errors.invalidSubscriptionLimit,
                        },
                        valueAsNumber: true,
                      })}
                      placeholder={t.auth.placeholders.subscriptionAdsLimit}
                    />
                  </div>

                  {errors.subscription_ads_limit && (
                    <span className="error">
                      <CircleAlert />
                      {errors.subscription_ads_limit.message}
                    </span>
                  )}
                </div>
              </div>
            ) : selectedType?.id == "ADMIN" ? (
              <SelectOptions
                label={t.auth.Permissions}
                placeholder={t.auth.placeholders.Permissions}
                options={Permissions}
                value={selectedPermissions.length ? selectedPermissions : null} // مصفوفة العناصر المختارة
                multi={true}
                onChange={(selected) => {
                  setSelectedPermissions((prev) => {
                    const exists = prev.some((item) => item.id === selected.id);

                    if (exists) {
                      return prev.filter((item) => item.id !== selected.id);
                    }

                    return [...prev, selected];
                  });
                }}
              />
            ) : null}
          </div>
        </div>

        <button
          type={"submit"}
          className="main-button"
          disabled={loadingSubmit}
          style={{ marginTop: "-2px" }}
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
