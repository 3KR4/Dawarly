import React from "react";
import useTranslate from "@/Contexts/useTranslation";

const FormLangSwitch = ({
  curentCreateLocale,
  setCurentCreateLocale,
}) => {
  const t = useTranslate();

  return (
      <div className="lang-switch">
        {["en", "ar"].map((lng) => (
          <button
            key={lng}
            type="button"
            className={curentCreateLocale === lng ? "active" : ""}
            onClick={() => setCurentCreateLocale(lng)}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>

  );
};

export default FormLangSwitch;
