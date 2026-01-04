"use client";
import "@/styles/client/forms.css";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useTranslate from "@/Contexts/useTranslation";

import governorates from "@/data/governorates.json";
import cities from "@/data/cities.json";
import { categories } from "@/data";

import SelectOptions from "@/components/Tools/data-collector/SelectOptions";

import {
  LockKeyhole,
  Mail,
  Phone,
  Eye,
  UserRound,
  EyeOff,
  CircleAlert,
} from "lucide-react";
import { FaRegCircleUser } from "react-icons/fa6";
import OtpInputs from "@/components/Tools/Otp";

export default function Register() {
  const t = useTranslate();
  const auth = t.auth; // استدعاء الترجمات

  const [isLoginPage, setIsLoginPage] = useState(false);
  const STEPS = {
    ACCOUNT: 1,
    PHONE_VERIFY: 2,
    EMAIL_VERIFY: 3,
    ADDRESS: 4,
    INTERESTS: 5,
    LOGIN: 6,
    FORGET_PASS: 7,
    FORGET_PASS_VERIFY: 8,
    VIEW_OR_UPDATE_PASS: 9,
  };
  const [step, setStep] = useState(STEPS.ACCOUNT);
  const [userAddress, setUserAddress] = useState({
    gov: null,
    city: null,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [verifyMethod, setVerifyMethod] = useState("");
  const [availableMethod, setAvailableMethod] = useState("both");

  const canUseEmail = availableMethod === "email" || availableMethod === "both";
  const canUsePhone = availableMethod === "phone" || availableMethod === "both";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password", "");
  const [passEye, setPassEye] = useState({ password: false, confirm: false });

  /* ================= HELPERS ================= */
  const handleAddress = (type, value) => {
    setUserAddress((prev) => ({ ...prev, [type]: value }));
  };

  const filteredCities = cities.filter(
    (c) => c.governorate_id === userAddress.gov?.id
  );

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const OTP_LENGTH = 5;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  useEffect(() => {
    if (step === STEPS.PHONE_VERIFY || step === STEPS.EMAIL_VERIFY) {
      setOtp(Array(OTP_LENGTH).fill(""));
    }
  }, [step]);

  /* ================= SUBMIT ================= */
  const onSubmit = (data) => {
    if (isLoginPage) {
      console.log("LOGIN DATA", data);
      return;
    }

    if (step === STEPS.ACCOUNT) {
      setStep(STEPS.PHONE_VERIFY);
      return;
    }

    if (step === STEPS.PHONE_VERIFY) {
      if (data.email) {
        setStep(STEPS.EMAIL_VERIFY);
      } else {
        setStep(STEPS.ADDRESS);
      }
      return;
    }

    if (step === STEPS.EMAIL_VERIFY) {
      setStep(STEPS.ADDRESS);
      return;
    }

    if (step === STEPS.ADDRESS) {
      setStep(STEPS.INTERESTS);
      return;
    }
    if (step === STEPS.LOGIN) {
      setStep(STEPS.FORGET_PASS);
      return;
    }
    if (step === STEPS.FORGET_PASS) {
      setStep(STEPS.FORGET_PASS_VERIFY);
      return;
    }
    if (step === STEPS.FORGET_PASS_VERIFY) {
      setStep(STEPS.VIEW_OR_UPDATE_PASS);
      return;
    }

    console.log("FINAL REQUEST", {
      userData: data,
      address: userAddress,
      categories: selectedCategories,
    });
  };

  const titles = {
    [STEPS.ACCOUNT]: auth.createAccount,
    [STEPS.LOGIN]: auth.createAccount,
    [STEPS.PHONE_VERIFY]: auth.verifyPhone,
    [STEPS.EMAIL_VERIFY]: auth.verifyEmail,
    [STEPS.FORGET_PASS_VERIFY]: auth.forgetPass,
    [STEPS.FORGET_PASS]: auth.choose_verify_method,
    [STEPS.VIEW_OR_UPDATE_PASS]: auth.userVerified,
    [STEPS.ADDRESS]: auth.chooseAddress,
    [STEPS.INTERESTS]: auth.chooseInterests,
  };

  const descriptions = {
    [STEPS.ACCOUNT]: auth.accountDescription,
    [STEPS.PHONE_VERIFY]: auth.phoneDescription,
    [STEPS.EMAIL_VERIFY]: auth.emailDescription,
    [STEPS.FORGET_PASS_VERIFY]:
      verifyMethod == "email" ? auth.emailDescription : auth.phoneDescription,
    [STEPS.FORGET_PASS]: auth.choose_verify_method_description,
    [STEPS.VIEW_OR_UPDATE_PASS]: auth.userVerifiedDescription,
    [STEPS.ADDRESS]: auth.addressDescription,
    [STEPS.INTERESTS]: auth.interestsDescription,
  };

  const buttonLabels = {
    [STEPS.ACCOUNT]: auth.createAccountBtn,
    [STEPS.PHONE_VERIFY]: auth.verifyPhoneBtn,
    [STEPS.EMAIL_VERIFY]: auth.verifyEmailBtn,
    [STEPS.FORGET_PASS_VERIFY]: auth.forgetPassBtn,
    [STEPS.FORGET_PASS]: auth.sendCode,
    [STEPS.VIEW_OR_UPDATE_PASS]:
      auth.skip_and_continue || auth.update_pass_and_continue,
    [STEPS.INTERESTS]: auth.finishAccount,
  };

  return (
    <div className="form-holder">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="top">
          <h1>{titles[step]}</h1>
          <p>{descriptions[step]}</p>
        </div>
        {/* ================= LOGIN ================= */}
        {isLoginPage && (
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
              onClick={() => {
                setIsLoginPage((p) => !p);
                setStep(STEPS.FORGET_PASS);
                setIsLoginPage(false);
                reset();
              }}
            >
              {auth.forgetPassword}{" "}
              <span className="mineLink">{auth.password}</span>
            </div>
          </>
        )}
        {/* ================= REGISTER STEP 1 ================= */}
        {!isLoginPage && step === STEPS.ACCOUNT && (
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
                        value:
                          /^\+?[0-9]{1,3}?[-.\s]?(\(?\d{1,4}\)?[-.\s]?){1,4}\d{1,4}$/,
                        message: auth.errors.invalidPhone,
                      },
                      minLength: {
                        value: 7,
                        message: auth.errors.phoneTooShort,
                      },
                      maxLength: {
                        value: 15,
                        message: auth.errors.phoneTooLong,
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
              <label>
                {auth.email} <span>({auth.optional})</span>
              </label>
              <div className="inputHolder">
                <div className="holder">
                  <Mail />
                  <input
                    type="email"
                    {...register("email", {
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
        {/* ================= REGISTER STEP 2 / 3 / 7 ================= */}
        {step === STEPS.FORGET_PASS && (
          <div className="options-grid verfiyMethod">
            {/* ===== Email ===== */}
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

            {/* ===== Phone ===== */}
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
        )}
        {step === STEPS.VIEW_OR_UPDATE_PASS && (
          <>
            <div className="box forInput">
              <label>{auth.viewYourCurrentPassword}</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    value={"Aa123456@"}
                    readOnly
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
            </div>
            <div className="box forInput">
              <label>
                {auth.makeNewPassword} <span>({auth.optional})</span>
              </label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    {...register("newPass", {
                      required: auth.errors.requiredPassword,
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
                {errors.newPass && (
                  <span className="error">
                    <CircleAlert />
                    {errors.newPass.message}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
        {(step === STEPS.PHONE_VERIFY ||
          step === STEPS.EMAIL_VERIFY ||
          step === STEPS.FORGET_PASS_VERIFY) && (
          <OtpInputs length={OTP_LENGTH} value={otp} onChange={setOtp} />
        )}
        {/* ================= REGISTER STEP 4 ================= */}
        {!isLoginPage && step === STEPS.ADDRESS && (
          <>
            <SelectOptions
              label={t.location.yourGovernorate}
              placeholder={t.location.selectGovernorate}
              options={governorates}
              value={
                userAddress.gov ? t.governorates[userAddress.gov.name] : ""
              }
              tPath="governorates"
              onChange={(item) => {
                handleAddress("gov", item);
                handleAddress("city", null);
              }}
            />

            <SelectOptions
              label={t.location.yourCity}
              placeholder={t.location.selectCity}
              options={filteredCities}
              value={userAddress.city ? t.cities[userAddress.city.name] : ""}
              tPath="cities"
              disabled={!userAddress.gov}
              onChange={(item) => handleAddress("city", item)}
            />
          </>
        )}
        {/* ================= REGISTER STEP 5 ================= */}
        {!isLoginPage && step === STEPS.INTERESTS && (
          <div className="options-grid">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategories.includes(cat.id);

              return (
                <div
                  key={cat.id}
                  className={`option-box ${active ? "active" : ""}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <Icon className="cat-icon" />
                  <span>{t.categories[cat.name]}</span>
                </div>
              );
            })}
          </div>
        )}
        {/* ================= BUTTON ================= */}
        <button type="submit" className="main-button">
          {isLoginPage
            ? auth.login
            : step === STEPS.ADDRESS
            ? userAddress.gov || userAddress.city
              ? auth.next
              : auth.skip
            : buttonLabels[step]}
        </button>
        {(isLoginPage || step === STEPS.ACCOUNT) && (
          <>
            <div className="otherWay">
              <hr />
              <span>
                {isLoginPage ? auth.orLoginWith : auth.orContinueWith}
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
        {(step === STEPS.ACCOUNT || step === STEPS.LOGIN) && (
          <div
            className="have-problem"
            onClick={() => {
              setIsLoginPage((p) => !p);
              setStep((prev) => (prev = 6 ? 1 : 6));
              reset();
            }}
          >
            {isLoginPage ? auth.noAccount : auth.haveAccount}{" "}
            <span className="mineLink">
              {isLoginPage ? auth.createAccountBtn : auth.login}
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
