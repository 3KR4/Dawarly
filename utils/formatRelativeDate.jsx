export const formatRelativeDate = (dateString, locale = "ar") => {
  if (!dateString) return "";

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const isArabic = locale === "ar";

  if (seconds < 10) {
    return isArabic ? "الآن" : "now";
  }

  if (seconds < 60) {
    return isArabic
      ? `منذ ${seconds} ثانية`
      : `${seconds} seconds ago`;
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
