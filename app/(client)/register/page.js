"use client";
import "@/styles/client/forms.css";
import Image from "next/image";
import React, { useState } from "react";
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

export default function Register() {
  const t = useTranslate();

  const [isLoginPage, setIsLoginPage] = useState(false);
  const [step, setStep] = useState(1);

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

  /* ================= SUBMIT ================= */
  const onSubmit = (data) => {
    if (isLoginPage) {
      console.log("LOGIN DATA", data);
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    console.log("FINAL REQUEST", {
      userData: data,
      address: userAddress,
      categories: selectedCategories,
    });
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>
          {isLoginPage ? "Login into your account" : "Create your account"}
        </h1>

        {/* ================= LOGIN ================= */}
        {isLoginPage && (
          <>
            <div className="box forInput">
              <label>Email Address</label>
              <div className="inputHolder">
                <div className="holder">
                  <Mail />
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email address is required",
                    })}
                    placeholder="Enter your email"
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
              <label>Password</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    placeholder="Enter your password"
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
          </>
        )}

        {/* ================= REGISTER STEP 1 ================= */}
        {!isLoginPage && step === 1 && (
          <>
            <div className="box forInput">
              <label>Full Name</label>
              <div className="inputHolder">
                <div className="holder">
                  <UserRound />
                  <input
                    type="text"
                    {...register("fullname", {
                      required: "Your full name is required",
                      validate: (value) => {
                        const words = value.trim().split(/\s+/);

                        if (words.length < 2) {
                          return "Full name must contain at least two words";
                        }

                        for (let i = 0; i < words.length; i++) {
                          if (words[i].length < 3) {
                            if (i === 0)
                              return "First name must be at least 3 characters";
                            if (i === 1)
                              return "Last name must be at least 3 characters";
                            return `Word ${
                              i + 1
                            } must be at least 3 characters`;
                          }
                        }

                        return true;
                      },
                    })}
                    placeholder="Enter your full name"
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
              <label>Phone Number</label>
              <div className="inputHolder">
                <div className="holder">
                  <Phone />
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value:
                          /^\+?[0-9]{1,3}?[-.\s]?(\(?\d{1,4}\)?[-.\s]?){1,4}\d{1,4}$/,
                        message: "Enter a valid phone number",
                      },
                      minLength: {
                        value: 7,
                        message: "Phone number is too short",
                      },
                      maxLength: {
                        value: 15,
                        message: "Phone number is too long",
                      },
                    })}
                    placeholder="Enter your phone"
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
              <label>Email Address</label>
              <div className="inputHolder">
                <div className="holder">
                  <Mail />
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email address is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message:
                          "Enter a valid email address (e.g. user@example.com)",
                      },
                    })}
                    placeholder="Enter your email"
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
              <label>Password</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.password ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?~\-]).{8,}$/,
                        message:
                          "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character",
                      },
                    })}
                    placeholder="Enter your password"
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
              <label>Confirm Password</label>
              <div className="inputHolder password">
                <div className="holder">
                  <LockKeyhole />
                  <input
                    type={passEye.confirm ? "text" : "password"}
                    {...register("passwordConfirmation", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    placeholder="Confirm password"
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

        {/* ================= REGISTER STEP 2 ================= */}
        {!isLoginPage && step === 2 && (
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
        {!isLoginPage && step === 3 && (
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
            ? "Login"
            : step === 1
            ? "Create account"
            : step === 2
            ? userAddress.gov || userAddress.city
              ? "Next"
              : "Skip"
            : "Finish account"}
        </button>

        <div className="didntHasAccount">
          {isLoginPage ? "Didnt" : "Already"} have an account?{" "}
          <span
            className="mineLink"
            onClick={() => {
              setIsLoginPage((p) => !p);
              setStep(1);
              reset();
            }}
          >
            {isLoginPage ? "Create account" : "Log in"}
          </span>
        </div>
      </form>
    </div>
  );
}
