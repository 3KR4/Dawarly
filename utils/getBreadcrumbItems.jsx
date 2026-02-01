import { dashboardRoutes } from "@/data";

export function getDashboardBreadcrumb(pathname, searchParams, locale = "en") {
  if (!pathname.startsWith("/dashboard")) return [];

  const segments = pathname
    .replace("/dashboard", "")
    .split("/")
    .filter(Boolean);

  const items = [];

  // أول عنصر بعد dashboard
  const mainKey = segments[0];
  const mainConfig = dashboardRoutes[mainKey];

  if (mainConfig) {
    items.push({
      name: mainConfig.label[locale],
      href: mainConfig.defaultPath
        ? `/dashboard/${mainKey}/${mainConfig.defaultPath}`
        : `/dashboard/${mainKey}`,
      key: mainKey,
    });
  }

  // الحالة (active / pending / form)
  const sub = segments[1];

  if (sub) {
    let name = sub;

    if (sub === "form") {
      name = searchParams?.has("id")
        ? locale === "ar"
          ? "تعديل"
          : "Edit"
        : locale === "ar"
          ? "إضافة"
          : "Create";
    } else {
      if (locale === "ar") {
        name = sub === "active" ? "نشط" : sub === "all" ? "الكل" : "معلق";
      } else {
        name = sub === "active" ? "Active" : sub === "all" ? "All" : "Pending";
      }
    }

    items.push({
      name,
      href: pathname,
    });
  }

  return items;
}
