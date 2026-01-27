export const formatRelativeDate = (
  dateString,
  locale = "ar",
  type = "simple", // simple | detailed
) => {
  if (!dateString) return "";

  const now = new Date();
  const date = new Date(dateString);

  const isArabic = locale === "ar";
  const isSameYear = now.getFullYear() === date.getFullYear();

  // =========================
  // DETAILED MODE
  // =========================
  if (type === "detailed") {
    const options = {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit",
    };

    // لو سنة مختلفة نضيف السنة
    if (!isSameYear) {
      options.year = "numeric";
    }

    return new Intl.DateTimeFormat(
      isArabic ? "ar-EG" : "en-US",
      options,
    ).format(date);
  }

  // =========================
  // SIMPLE MODE (الحالي)
  // =========================
  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  const years = now.getFullYear() - date.getFullYear();
  const months = years * 12 + (now.getMonth() - date.getMonth());

  if (seconds < 10) {
    return isArabic ? "الآن" : "now";
  }

  if (seconds < 60) {
    return isArabic
      ? `منذ ${seconds} ثانية`
      : `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  if (minutes < 60) {
    return isArabic
      ? `منذ ${minutes} دقيقة`
      : `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  if (hours < 24) {
    return isArabic
      ? `منذ ${hours} ساعة`
      : `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (days < 7) {
    return isArabic
      ? `منذ ${days} يوم`
      : `${days} day${days > 1 ? "s" : ""} ago`;
  }

  if (weeks < 4) {
    return isArabic
      ? `منذ ${weeks} أسبوع`
      : `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  if (months < 12) {
    return isArabic
      ? `منذ ${months} شهر`
      : `${months} month${months > 1 ? "s" : ""} ago`;
  }

  return isArabic
    ? `منذ ${years} سنة`
    : `${years} year${years > 1 ? "s" : ""} ago`;
};
