export const formatEGP = (value, locale = "ar") => {
  if (value === null || value === undefined) return "";

  const lang = locale === "en" ? "en-EG" : "ar-EG";

  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
};