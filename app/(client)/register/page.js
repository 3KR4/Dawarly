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
import { FaCircleInfo } from "react-icons/fa6";
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
  };
  const [step, setStep] = useState(STEPS.ACCOUNT);
  const [userAddress, setUserAddress] = useState({
    gov: null,
    city: null,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

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

    console.log("FINAL REQUEST", {
      userData: data,
      address: userAddress,
      categories: selectedCategories,
    });
  };

  const titles = {
    [STEPS.ACCOUNT]: auth.createAccount,
    [STEPS.PHONE_VERIFY]: auth.verifyPhone,
    [STEPS.EMAIL_VERIFY]: auth.verifyEmail,
    [STEPS.ADDRESS]: auth.chooseAddress,
    [STEPS.INTERESTS]: auth.chooseInterests,
  };

  const descriptions = {
    [STEPS.ACCOUNT]: auth.accountDescription,
    [STEPS.PHONE_VERIFY]: auth.phoneDescription,
    [STEPS.EMAIL_VERIFY]: auth.emailDescription,
    [STEPS.ADDRESS]: auth.addressDescription,
    [STEPS.INTERESTS]: auth.interestsDescription,
  };

  const buttonLabels = {
    [STEPS.ACCOUNT]: auth.createAccountBtn,
    [STEPS.PHONE_VERIFY]: auth.verifyPhoneBtn,
    [STEPS.EMAIL_VERIFY]: auth.verifyEmailBtn,
    [STEPS.INTERESTS]: auth.finishAccount,
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="top">
          <h1>{titles[step]}</h1>
          <p>{descriptions[step]}</p>
        </div>

        {/* ================= LOGIN ================= */}
        {isLoginPage && (
          <>
            <div className="box forInput">
              <label>{auth.email}</label>
              <div className="inputHolder">
                <div className="holder">
                  <Mail />
                  <input
                    type="email"
                    {...register("email", {
                      required: auth.errors.requiredEmail,
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
              <label>{auth.password}</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    {...register("password", {
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
              </div>
            </div>

            <div className="otherWay">
              <hr />
              <span>{auth.orContinueWith}</span>
              <hr />
            </div>
            <div className="social-btns">
              <div className="btn">
                <Image
                  src={`/google-icon.png`}
                  width={24}
                  height={24}
                  alt="google icon"
                />
                {auth.google}
              </div>
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

        {!isLoginPage && step === STEPS.PHONE_VERIFY && (
          <OtpInputs length={OTP_LENGTH} value={otp} onChange={setOtp} />
        )}
        {!isLoginPage && step === STEPS.EMAIL_VERIFY && (
          <OtpInputs length={OTP_LENGTH} value={otp} onChange={setOtp} />
        )}

        {/* ================= REGISTER STEP 2 ================= */}
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

        {/* ================= REGISTER STEP 3 ================= */}
        {!isLoginPage && step === STEPS.INTERESTS && (
          <div className="categories-grid">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategories.includes(cat.id);

              return (
                <div
                  key={cat.id}
                  className={`cat-box ${active ? "active" : ""}`}
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

        {!isLoginPage && step === STEPS.ACCOUNT && (
          <>
            <div className="otherWay">
              <hr />
              <span>{auth.orContinueWith}</span>
              <hr />
            </div>
            <div className="social-btns">
              <div className="btn">
                <Image
                  src={`/google-icon.png`}
                  width={24}
                  height={24}
                  alt="google icon"
                />
                {auth.google}
              </div>
            </div>
          </>
        )}

        <div className="didntHasAccount">
          {isLoginPage ? auth.noAccount : auth.haveAccount}{" "}
          <span
            className="mineLink"
            onClick={() => {
              setIsLoginPage((p) => !p);
              setStep(1);
              reset();
            }}
          >
            {isLoginPage ? auth.createAccountBtn : auth.login}
          </span>
        </div>
      </form>
    </div>
  );
}
