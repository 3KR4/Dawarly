export const formatCurrency = (amount, currency = "EGP", locale = "en") => {
  if (!amount) return "";

  return new Intl.NumberFormat(
    locale === "ar" ? "ar-EG" : "en-US",
    {
      style: "currency",
      currency,
    }
  ).format(Number(amount));
};