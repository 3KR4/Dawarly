"use client";
import "@/styles/client/forms.css";
import Image from "next/image";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";

import { categoriesEn, categoriesAr } from "@/data";
import { FaCommentSms, FaRegCircleUser } from "react-icons/fa6";
import useRedirectAfterLogin from "@/Contexts/useRedirectAfterLogin";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { MdMarkEmailUnread } from "react-icons/md";
import { useNotification } from "@/Contexts/NotificationContext";
import {
  LockKeyhole,
  Mail,
  Phone,
  Eye,
  UserRound,
  EyeOff,
  CircleAlert,
} from "lucide-react";
import OtpInputs from "@/components/Tools/Otp";
import { settings } from "@/Contexts/settings";
import {
  registerUser,
  loginUser,
  verifyUserOtp,
  resendEmailOtp,
  forgetPassword,
  resetPassword,
} from "@/services/auth/auth.service";
import { useAuth } from "@/Contexts/AuthContext";
import { useAppData } from "@/Contexts/DataContext";

export default function Register() {
  const { governorates, subCategories, cities, fetchCities } = useAppData();

  const { addNotification } = useNotification();
  const { login } = useAuth();
  const t = useTranslate();
  const { locale, theme } = useContext(settings);
  const auth = t.auth;
  const redirectAfterLogin = useRedirectAfterLogin();

  const [loadings, setLoadings] = useState({
    submit: false,
    resend: false,
    otp: false,
  });

  const STEPS = {
    ACCOUNT: 1,
    ADDRESS: 2,
    INTERESTS: 3,
    EMAIL_VERIFY: 4,
    LOGIN: 5,

    FORGET_PASS_REQUEST: 6, // ارسال الايميل
    FORGET_PASS_OTP: 7, // ادخال OTP
    FORGET_PASS_RESET: 8, // ادخال باسورد جديد
    PASS_CHANGED: 9, // نجاح تغيير الباسورد
  };
  const [additionalData, setAdditionalData] = useState({
    gov: null,
    city: null,
    gender: null,
    birthYear: null,
    birthMonth: null,
    birthDay: null,
  });

  const GENDER = [
    {
      id: "MALE",
      name_en: "male",
      name_ar: "ذكر",
    },
    {
      id: "FEMALE",
      name_en: "female",
      name_ar: "انثي",
    },
  ];

  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { id: year, name: year };
  });

  const months = [
    { id: 1, name_en: "Jan", name_ar: "يناير" },
    { id: 2, name_en: "Feb", name_ar: "فبراير" },
    { id: 3, name_en: "Mar", name_ar: "مارس" },
    { id: 4, name_en: "Apr", name_ar: "أبريل" },
    { id: 5, name_en: "May", name_ar: "مايو" },
    { id: 6, name_en: "Jun", name_ar: "يونيو" },
    { id: 7, name_en: "Jul", name_ar: "يوليو" },
    { id: 8, name_en: "Aug", name_ar: "أغسطس" },
    { id: 9, name_en: "Sep", name_ar: "سبتمبر" },
    { id: 10, name_en: "Oct", name_ar: "أكتوبر" },
    { id: 11, name_en: "Nov", name_ar: "نوفمبر" },
    { id: 12, name_en: "Dec", name_ar: "ديسمبر" },
  ];

  const days = useMemo(() => {
    if (!additionalData.birthYear || !additionalData.birthMonth) return [];

    const year = additionalData.birthYear.id;
    const month = additionalData.birthMonth.id;

    const daysInMonth = new Date(year, month, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => ({
      id: i + 1,
      name: i + 1,
    }));
  }, [additionalData.birthYear, additionalData.birthMonth]);

  useEffect(() => {
    if (!additionalData.birthDay || !days.length) return;

    if (additionalData.birthDay.id > days.length) {
      handleAdditionalData("birthDay", null);
    }
  }, [days]);

  useEffect(() => {
    if (additionalData.gov?.id) {
      fetchCities(additionalData.gov.id);
    }
  }, [additionalData.gov]);

  const [step, setStep] = useState(STEPS.ACCOUNT);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [verifyMethod, setVerifyMethod] = useState("");
  const [availableMethod, setAvailableMethod] = useState("both");

  // const canUseEmail = availableMethod === "email" || availableMethod === "both";
  // const canUsePhone = availableMethod === "phone" || availableMethod === "both";
  const [cooldown, setCooldown] = useState(60);
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    trigger,
    getValues,
    formState: { errors },
  } = useForm();

  const [errorTracker, setErrorTracker] = useState({
    gov: null,
    city: null,
    gender: null,
    birthDate: null,
  });

  const password = watch("password", "");
  const newPassValue = watch("newPass");
  const emailPhoneLogininputvalue = watch("emailPhoneLogin");
  useEffect(() => {
    if (emailPhoneLogininputvalue) {
      // لو فيه قيمة، نمسح الخطأ
      clearErrors("emailPhoneLogin");
    }
  }, [emailPhoneLogininputvalue, clearErrors]);
  const [passEye, setPassEye] = useState({ password: false, confirm: false });
  /* ================= HELPERS ================= */
  const handleAdditionalData = (type, value) => {
    setAdditionalData((prev) => ({ ...prev, [type]: value }));
  };
  const handleErrors = (type, value) => {
    setErrorTracker((prev) => ({ ...prev, [type]: value }));
  };

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  useEffect(() => {
    if (step === STEPS.PHONE_VERIFY || step === STEPS.EMAIL_VERIFY) {
      setOtp(Array(OTP_LENGTH).fill(""));
    }
  }, [step]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    setLoadings((prev) => ({ ...prev, submit: true }));
    try {
      // -------- LOGIN --------
      if (step === STEPS.LOGIN) {
        const payload = {
          email: data.emailPhoneLogin,
          password: data.loginPassword,
        };

        const res = await loginUser(payload);

        login({
          user: res.data.user,
          accessToken: res.data.accessToken,
        });
        redirectAfterLogin();
        addNotification({
          type: "success",
          message: "You have successfully logged into your account.",
        });
        return;
      }

      // -------- ACCOUNT --------
      if (step === STEPS.ACCOUNT) {
        setStep(STEPS.ADDRESS);
        return;
      }

      // -------- ADDRESS --------
      if (step === STEPS.ADDRESS) {
        let hasError = false;

        if (
          !additionalData.birthYear ||
          !additionalData.birthMonth ||
          !additionalData.birthDay
        ) {
          handleErrors("birthDate", "Your birth date is required");
          hasError = true;
        }
        if (!additionalData.gender) {
          handleErrors("gender", "Your gender is required");
          hasError = true;
        }
        if (!additionalData.gov) {
          handleErrors("gov", "Your governorate is required");
          hasError = true;
        }
        if (!additionalData.city) {
          handleErrors("city", "Your city is required");
          hasError = true;
        }

        if (hasError) return;

        setStep(STEPS.INTERESTS);
        return;
      }

      // -------- INTERESTS --------
      if (step === STEPS.INTERESTS) {
        // Build birth_date safely
        const birth_date =
          additionalData.birthYear &&
          additionalData.birthMonth &&
          additionalData.birthDay
            ? `${additionalData.birthYear.id}-${String(additionalData.birthMonth.id).padStart(2, "0")}-${String(additionalData.birthDay.id).padStart(2, "0")}`
            : null;

        const payload = {
          full_name: data.fullname,
          email: data.email,
          password: data.password,
          phone: data.phone,
          birth_date,
          gender: additionalData.gender?.id,
          country_id: 1,
          governorate_id: additionalData.gov?.id,
          city_id: additionalData.city?.id,
          language: locale,
          theme: theme,
          interests: selectedCategories,
        };

        try {
          const res = await registerUser(payload);
          addNotification({
            type: "success",
            message: res.data.message,
          });
          setStep(STEPS.EMAIL_VERIFY);
        } catch (err) {
          const msg = err.response?.data?.message || "Something went wrong";
          addNotification({
            type: "warning",
            message: msg,
          });
          if (msg === "Email already exists") {
            await handleResend();

            setStep(STEPS.EMAIL_VERIFY);
          } else {
            setStep(STEPS.ACCOUNT);
          }
        }
        return;
      }

      // -------- EMAIL VERIFY --------
      if (step === STEPS.EMAIL_VERIFY) {
        try {
          const res = await handleOtpSubmit(otp.join(""));
          login({
            user: res.data.user,
            accessToken: res.data.accessToken,
          });
          redirectAfterLogin();
          addNotification({
            type: "success",
            message: "Your account has been created successfully.",
          });
        } catch (err) {
          addNotification({
            type: "warning",
            message: err.response?.data?.message || "Something went wrong",
          });
        }
        return;
      }

      // if (step === STEPS.FORGET_PASS) {
      //   const email = getValues("emailPhoneLogin") || getValues("email");
      //   if (!email) {
      //     setError("emailPhoneLogin", {
      //       type: "manual",
      //       message: auth.errors.requiredEmail,
      //     });
      //     return;
      //   }

      //   const isValid = await trigger("emailPhoneLogin");
      //   if (!isValid) return;

      //   try {
      //     await forgetPassword(email); // API call
      //     alert("OTP sent to your email");
      //     setStep(STEPS.FORGET_PASS_VERIFY); // نروح step الـ OTP
      //   } catch (err) {
      //     alert(err.response?.data?.message || "Something went wrong");
      //   }
      //   return;
      // }

      if (step === STEPS.FORGET_PASS_RESET) {
        const email = getValues("emailPhoneLogin") || getValues("email");
        const new_password = getValues("newPass");
        const otpCode = otp.join("");

        if (!new_password) {
          setError("newPass", {
            type: "manual",
            message: "Please enter a new password",
          });
          return;
        }

        try {
          await resetPassword({
            email,
            otp: otpCode,
            new_password,
          });
          addNotification({
            type: "success",
            message: "Password reset successfully",
          });
          setStep(STEPS.PASS_CHANGED);
        } catch (err) {
          addNotification({
            type: "warning",
            message: err.response?.data?.message || "Something went wrong",
          });
          setOtp(Array(OTP_LENGTH).fill(""));
        }

        return;
      }
      if (step === STEPS.PASS_CHANGED) {
        setStep(STEPS.LOGIN);
        return;
      }
    } catch (err) {
      console.log(err.response.data.message);
      addNotification({
        type: "warning",
        message: err.response.data.message,
      });
    } finally {
      setLoadings((prev) => ({ ...prev, submit: false }));
    }
  };

  // ---------------- HANDLE OTP SUBMIT ----------------
  const handleOtpSubmit = async (code) => {
    try {
      const res = await verifyUserOtp({
        email: getValues("email"),
        code,
      });

      login({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });

      redirectAfterLogin();
      return res;
    } catch (err) {
      addNotification({
        type: "warning",
        message: err.response?.data?.message || "Invalid code",
      });
      setOtp(Array(OTP_LENGTH).fill(""));
      throw err;
    }
  };

  // ---------------- HANDLE RESEND ----------------
  const handleResend = async () => {
    try {
      await resendEmailOtp({
        email: getValues("email"), // خلي نفس القيمة المستخدمة
      });

      addNotification({
        type: "success",
        message: "OTP sent again",
      });
      setCooldown(60);
      return true; // رجع نجاح
    } catch (err) {
      if (err.response?.data?.message == "Email already verified") {
        addNotification({
          type: "warning",
          message:
            "This account is already registered. You can log in directly.",
        });
        // setStep(STEPS.LOGIN);
      } else {
        addNotification({
          type: "warning",
          message: err.response?.data?.message || "Something went wrong",
        });
      }

      throw err; // لازم ترميه لبرا عشان الكود اللي بعد await ما يكملش
    }
  };
  const handleForgetPass = async () => {
    try {
      await forgetPassword(getValues("emailPhoneLogin"));

      setCooldown(60);
      return true;
    } catch (err) {
      console.log(err);

      addNotification({
        type: "warning",
        message: err.response?.data?.message || "Something went wrong",
      });
      throw err;
    }
  };

  const titles = {
    [STEPS.ACCOUNT]: auth.createAccount,
    [STEPS.LOGIN]: auth.loginToAccount,
    [STEPS.EMAIL_VERIFY]: auth.verifyEmail,
    [STEPS.FORGET_PASS_REQUEST]: "Enter Verification Code",
    [STEPS.FORGET_PASS_OTP]: "Enter Verification Code",
    [STEPS.FORGET_PASS_RESET]: "Create New Password",
    [STEPS.PASS_CHANGED]: "Password Changed Successfully",
    [STEPS.ADDRESS]: auth.chooseAddress,
    [STEPS.INTERESTS]: auth.chooseInterests,
  };

  const descriptions = {
    [STEPS.ACCOUNT]: auth.accountDescription,
    [STEPS.LOGIN]: auth.accountDescription || "",
    [STEPS.PHONE_VERIFY]: auth.phoneDescription,
    [STEPS.EMAIL_VERIFY]: auth.emailDescription,
    [STEPS.PASS_CHANGED]: "Password Changed Successfully",

    [STEPS.FORGET_PASS_REQUEST]: "Enter Verification Code",
    [STEPS.FORGET_PASS_OTP]: "Enter Verification Code",
    [STEPS.FORGET_PASS_RESET]: "Create New Password",
    [STEPS.VIEW_OR_UPDATE_PASS]: auth.userVerifiedDescription,
    [STEPS.ADDRESS]: auth.addressDescription,
    [STEPS.INTERESTS]: auth.interestsDescription,
  };

  const buttonLabels = {
    [STEPS.ACCOUNT]: auth.createAccountBtn,
    [STEPS.LOGIN]: auth.login,
    [STEPS.PHONE_VERIFY]: auth.verifyPhoneBtn,
    [STEPS.EMAIL_VERIFY]: auth.verifyEmailBtn,
    [STEPS.PASS_CHANGED]: "Password Changed Successfully",

    [STEPS.FORGET_PASS_REQUEST]: "Enter Verification Code",
    [STEPS.FORGET_PASS_OTP]: "Enter Verification Code",
    [STEPS.FORGET_PASS_RESET]: "Create New Password",
    [STEPS.VIEW_OR_UPDATE_PASS]: newPassValue
      ? auth.update_pass_and_continue
      : auth.login,
    [STEPS.ADDRESS]: auth.next,

    [STEPS.INTERESTS]: auth.finishAccount,
  };

  return (
    <div className="form-holder register">
      <form onSubmit={handleSubmit(onSubmit)}>
        {[STEPS.EMAIL_VERIFY].includes(step) ? (
          step === STEPS.FORGET_PASS_OTP ? (
            verifyMethod === "phone" ? (
              <FaCommentSms className="big-ico" />
            ) : (
              <MdMarkEmailUnread className="big-ico" />
            )
          ) : step === STEPS.PHONE_VERIFY ? (
            <FaCommentSms className="big-ico" />
          ) : (
            <MdMarkEmailUnread className="big-ico" />
          )
        ) : null}
        <div className="top">
          <h1
            onClick={() => {
              addNotification({
                type: "warning",
                message: "Something went wrong",
              });
            }}
          >
            {titles[step]}
          </h1>
          <p>{descriptions[step]}</p>
        </div>

        {/* ================= LOGIN ================= */}
        {step === STEPS.LOGIN && (
          <>
            <div className="box forInput">
              <label>{auth.emailPhoneLogin}</label>
              <div className="inputHolder">
                <div className="holder">
                  <FaRegCircleUser />
                  <input
                    type="text"
                    {...register("emailPhoneLogin", {
                      required: auth.errors.emailPhoneLoginRequired,
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$|^\+?[0-9\s\-()]{7,15}$/,
                        message: auth.errors.emailPhoneLoginInvalid,
                      },
                    })}
                    placeholder={auth.placeholders.emailPhoneLogin}
                  />
                </div>

                {errors.emailPhoneLogin && (
                  <span className="error">
                    <CircleAlert />
                    {errors.emailPhoneLogin.message}
                  </span>
                )}
              </div>
            </div>

            <div className="box forInput">
              <label>{auth.password}</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    {...register("loginPassword", {
                      required: auth.errors.requiredPassword,
                    })}
                    placeholder={auth.placeholders.password}
                  />
                  {passEye.password ? (
                    <Eye
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: false }))
                      }
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: true }))
                      }
                    />
                  )}
                </div>
                {errors.loginPassword && (
                  <span className="error">
                    <CircleAlert />
                    {errors.loginPassword.message}
                  </span>
                )}
              </div>
            </div>
            <div
              className="have-problem"
              onClick={async () => {
                const value = getValues("emailPhoneLogin");
                if (!value) {
                  setError("emailPhoneLogin", {
                    type: "manual",
                    message: auth.errors.emailPhoneLoginRequired,
                  });
                  return;
                }

                const isValid = await trigger("emailPhoneLogin");
                if (!isValid) return;

                try {
                  await handleForgetPass();
                  setStep(STEPS.FORGET_PASS_OTP);
                } catch (err) {
                  addNotification({
                    type: "warning",
                    message: "Resend failed, stay in current step",
                  });
                }
              }}
            >
              {auth.forgetPassword}{" "}
              <span className="mineLink">{auth.password}</span>
            </div>
          </>
        )}

        {/* ================= REGISTER STEP 1 ================= */}
        {step === STEPS.ACCOUNT && (
          <>
            <div className="box forInput">
              <label>{auth.fullName}</label>
              <div className="inputHolder">
                <div className="holder">
                  <UserRound />
                  <input
                    type="text"
                    {...register("fullname", {
                      required: auth.errors.requiredFullName,
                      validate: (value) => {
                        const words = value.trim().split(/\s+/);
                        if (words.length < 2)
                          return auth.errors.fullNameTwoWords;
                        for (let i = 0; i < words.length; i++) {
                          if (words[i].length < 3) {
                            if (i === 0) return auth.errors.firstNameShort;
                            if (i === 1) return auth.errors.lastNameShort;
                            return `Word ${
                              i + 1
                            } must be at least 3 characters`;
                          }
                        }
                        return true;
                      },
                    })}
                    placeholder={auth.placeholders.fullName}
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
              <label>{auth.email}</label>
              <div className="inputHolder">
                <div className="holder">
                  <Mail />
                  <input
                    type="email"
                    {...register("email", {
                      required: auth.errors.requiredEmail,
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: auth.errors.invalidEmail,
                      },
                    })}
                    placeholder={auth.placeholders.email}
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
              <label>{auth.phone}</label>
              <div className="inputHolder">
                <div className="holder">
                  <Phone />
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone", {
                      required: auth.errors.requiredPhone,
                      pattern: {
                        value: /^[0-9]{7,15}$/,
                        message: auth.errors.invalidPhone,
                      },
                    })}
                    placeholder={auth.placeholders.phone}
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

            <div className="box forInput">
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
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: false }))
                      }
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: true }))
                      }
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
                        value === password
                          ? true
                          : t.auth.errors.passwordMismatch,
                    })}
                    placeholder={t.auth.placeholders.confirmPassword}
                  />
                  {passEye.confirm ? (
                    <Eye
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, confirm: false }))
                      }
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, confirm: true }))
                      }
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
            </div>
          </>
        )}

        {/* ================= FORGET PASSWORD METHOD SELECTION ================= */}
        {/* {step === STEPS.FORGET_PASS && (
          <div className="options-grid verfiyMethod">
            <div
              className={`option-box ${
                canUseEmail
                  ? verifyMethod === "email"
                    ? "active"
                    : ""
                  : "disable"
              }`}
              onClick={() => {
                if (canUseEmail) {
                  setVerifyMethod("email");
                }
              }}
            >
              <Mail className="cat-icon" />
              <span>{t.auth.verify_by_email}</span>
            </div>

            <div
              className={`option-box ${
                canUsePhone
                  ? verifyMethod === "phone"
                    ? "active"
                    : ""
                  : "disable"
              }`}
              onClick={() => {
                if (canUsePhone) {
                  setVerifyMethod("phone");
                }
              }}
            >
              <Phone className="cat-icon" />
              <span>{t.auth.verify_by_phone}</span>
            </div>
          </div>
        )} */}

        {/* ================= VIEW/UPDATE PASSWORD ================= */}
        {step === STEPS.FORGET_PASS_RESET && (
          <>
            <div className="box forInput">
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    {...register("newPass", {
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?~\-]).{8,}$/,
                        message: t.auth.errors.passwordWeak,
                      },
                    })}
                    placeholder={auth.placeholders.newPassword}
                  />
                  {passEye.password ? (
                    <Eye
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: false }))
                      }
                    />
                  ) : (
                    <EyeOff
                      className="eye"
                      onClick={() =>
                        setPassEye((p) => ({ ...p, password: true }))
                      }
                    />
                  )}
                </div>
              </div>
              {errors.newPass && (
                <span className="error">
                  <CircleAlert />
                  {errors.newPass.message}
                </span>
              )}
            </div>
          </>
        )}

        {/* ================= OTP VERIFICATION ================= */}
        {(step === STEPS.EMAIL_VERIFY || step === STEPS.FORGET_PASS_OTP) && (
          <>
            <OtpInputs
              length={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              onComplete={() => {}}
            />
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={handleResend}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
            </button>
          </>
        )}

        {/* ================= ADDRESS SELECTION ================= */}
        {step === STEPS.ADDRESS && (
          <>
            <div className="birth-date-selects">
              <SelectOptions
                label="your birthdate"
                placeholder="Day"
                options={days}
                value={additionalData?.birthDay}
                onChange={(item) => {
                  handleAdditionalData("birthDay", item);
                  handleErrors("birthDate", null);
                }}
              />
              <SelectOptions
                placeholder="Month"
                options={months}
                value={additionalData?.birthMonth}
                onChange={(item) => {
                  handleAdditionalData("birthMonth", item);
                  handleErrors("birthDate", null);
                }}
              />

              <SelectOptions
                placeholder="Year"
                options={years}
                value={additionalData?.birthYear}
                onChange={(item) => {
                  handleAdditionalData("birthYear", item);
                  handleErrors("birthDate", null);
                }}
              />

              {errorTracker.birthDate && (
                <span className="error">
                  <CircleAlert />
                  {errorTracker.birthDate}
                </span>
              )}
            </div>
            <SelectOptions
              label={t.location.yourGender}
              placeholder={t.location.selectGender}
              options={GENDER}
              value={additionalData?.gender || null}
              type="genders"
              onChange={(item) => {
                handleAdditionalData("gender", item);
                handleErrors("gender", null);
              }}
              error={errorTracker.gender}
              required={true}
            />
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
              error={errorTracker.gov}
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
              error={errorTracker.city}
              required={true}
            />
          </>
        )}

        {/* ================= INTERESTS SELECTION ================= */}
        {step === STEPS.INTERESTS && (
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
                  {/* <Icon className="cat-icon" /> */}
                  <span>{cat[`name_${locale}`]}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= SUBMIT BUTTON ================= */}
        <button
          type={step === STEPS.FORGET_PASS_OTP ? "button" : "submit"}
          className="main-button"
          disabled={loadings.submit}
          onClick={() => {
            if (step === STEPS.FORGET_PASS_OTP) {
              const otpCode = otp.join("");

              if (!otpCode || otpCode.length < OTP_LENGTH) {
                addNotification({
                  type: "warning",
                  message: "Please enter the complete OTP",
                });
                return;
              }

              setStep(STEPS.FORGET_PASS_RESET);
            }
          }}
        >
          {loadings.submit ? (
            <span className="loader"></span>
          ) : (
            buttonLabels[step]
          )}
        </button>

        {/* ================= SOCIAL LOGIN ================= */}
        {(step === STEPS.ACCOUNT || step === STEPS.LOGIN) && (
          <>
            <div className="otherWay">
              <hr />
              <span>
                {step === STEPS.LOGIN ? auth.orLoginWith : auth.orContinueWith}
              </span>
              <hr />
            </div>
            <div className="social-btns">
              <div className="btn">
                <Image
                  src={`/google-icon.png`}
                  width={22}
                  height={22}
                  alt="google icon"
                />
                {auth.google}
              </div>
            </div>
          </>
        )}

        {/* ================= SWITCH BETWEEN LOGIN/REGISTER ================= */}
        {(step === STEPS.ACCOUNT || step === STEPS.LOGIN) && (
          <div
            className="have-problem"
            onClick={() => {
              setStep(step === STEPS.ACCOUNT ? STEPS.LOGIN : STEPS.ACCOUNT);
            }}
          >
            {step === STEPS.LOGIN ? auth.noAccount : auth.haveAccount}{" "}
            <span className="mineLink">
              {step === STEPS.LOGIN ? auth.createAccountBtn : auth.login}
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
