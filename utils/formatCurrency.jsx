export const formatCurrency = (amount, currency = "EGP", locale = "en") => {
  if (amount === null || amount === undefined) {
    return `0 ${currency}`;
  }

  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};