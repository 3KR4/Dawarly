export function buildNavigation(tables, categories = [], subCategories = []) {
  // =========================
  // HELPERS
  // =========================

  const isVacation = (table) =>
    table.name_en.toLowerCase().includes("vacation");

  const isSaleTable = (table) =>
    table.name_en.toLowerCase().includes("for sale");

  const isRentTable = (table) =>
    table.name_en.toLowerCase().includes("for rent");

  const isPropertyTable = (table) =>
    isVacation(table) || isSaleTable(table) || isRentTable(table);

  const cleanTableName = (name = "") => {
    return name
      .replace(/for sale/i, "")
      .replace(/for rent/i, "")
      .trim();
  };

  const getSubCats = (categoryId) => {
    return subCategories.filter((s) => s.category_id === categoryId);
  };

  // =========================
  // ROOTS
  // =========================

  const vacationRoot = {
    id: "vacation_homes",
    name_en: "Vacation Homes",
    name_ar: "بيوت مصيفية",
    children: [],
  };

  const saleRoot = {
    id: "properties_sale",
    name_en: "Properties for Sale",
    name_ar: "عقارات للبيع",
    children: [],
  };

  const rentRoot = {
    id: "properties_rent",
    name_en: "Properties for Rent",
    name_ar: "عقارات للإيجار",
    children: [],
  };

  // =========================
  // VACATION
  // =========================

  const vacationTables = tables.filter(isVacation);

  const vacationMap = {};

  vacationTables.forEach((table) => {
    const mode = isSaleTable(table) ? "sale" : "rent";

    categories
      .filter((cat) => cat.table_id === table.id)
      .forEach((cat) => {
        const key = cat.name_en.toLowerCase();

        if (!vacationMap[key]) {
          vacationMap[key] = {
            id: key,
            base_name_en: cat.name_en,
            base_name_ar: cat.name_ar,
            items: [],
          };
        }

        vacationMap[key].items.push({
          id: `${cat.id}_${mode}`,
          mode,

          name_en:
            mode === "sale"
              ? `${cat.name_en} For Sale`
              : `${cat.name_en} For Rent`,

          name_ar:
            mode === "sale" ? `${cat.name_ar} للبيع` : `${cat.name_ar} للإيجار`,

          table_id: table.id,
          category_id: cat.id,
          children: getSubCats(cat.id),
        });
      });
  });

  vacationRoot.children = Object.values(vacationMap).map((item) => {
    const hasSale = item.items.some((x) => x.mode === "sale");
    const hasRent = item.items.some((x) => x.mode === "rent");

    // =========================
    // HAS BOTH => GROUP
    // =========================

    if (hasSale && hasRent) {
      return {
        id: item.id,
        name_en: item.base_name_en,
        name_ar: item.base_name_ar,
        children: item.items,
      };
    }

    // =========================
    // SINGLE MODE => DIRECT
    // =========================

    return {
      ...item.items[0],
      direct: true,
    };
  });

  // =========================
  // NORMAL PROPERTY TABLES
  // =========================

  const normalPropertyTables = tables.filter(
    (t) => isPropertyTable(t) && !isVacation(t),
  );

  normalPropertyTables.forEach((table) => {
    const root = isSaleTable(table) ? saleRoot : rentRoot;

    const tableItem = {
      id: table.id,
      slug: table.slug,
      table_id: table.id,
      name_en: cleanTableName(table.name_en),
      name_ar: cleanTableName(table.name_ar),
      children: [],
    };

    categories
      .filter((cat) => cat.table_id === table.id)
      .forEach((cat) => {
        tableItem.children.push({
          ...cat,
          children: getSubCats(cat.id),
        });
      });

    root.children.push(tableItem);
  });

  // =========================
  // OTHER NON PROPERTY TABLES
  // =========================

  const otherTables = tables.filter((t) => !isPropertyTable(t));

  const otherNavigation = otherTables.map((table) => {
    return {
      id: table.id,
      slug: table.slug,
      name_en: table.name_en,
      name_ar: table.name_ar,
      children: categories
        .filter((cat) => cat.table_id === table.id)
        .map((cat) => ({
          ...cat,
          children: getSubCats(cat.id),
        })),
    };
  });

  // =========================
  // FINAL
  // =========================

  return [vacationRoot, saleRoot, rentRoot, ...otherNavigation];
}
