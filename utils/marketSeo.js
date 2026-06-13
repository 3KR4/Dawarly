const ROUTE_FILTER_KEYS = [
  "country_id",
  "governorate_id",
  "city_id",
  "area_id",
  "compound_id",
  "dep",
  "cat",
  "subcat",
];

const LOCATION_LEVELS = [
  { key: "country_id", collection: "countries" },
  { key: "governorate_id", collection: "governorates", parentKey: "country_id" },
  { key: "city_id", collection: "cities", parentKey: "governorate_id" },
  { key: "area_id", collection: "areas", parentKey: "city_id" },
  { key: "compound_id", collection: "compounds", parentKey: "area_id" },
];

const CATEGORY_LEVELS = [
  { key: "dep", collection: "tables" },
  { key: "cat", collection: "categories", parentKey: "table_id" },
  { key: "subcat", collection: "subCategories", parentKey: "category_id" },
];

const getItemName = (item) => item?.name_en || item?.name_ar || item?.name || "";

export const slugifyValue = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const findById = (items = [], id) =>
  items.find((item) => String(item?.id) === String(id));

const findBySlug = (items = [], slug) =>
  items.find((item) => slugifyValue(getItemName(item)) === slug);

const matchRouteBranch = (levels, segments, data, startIndex) => {
  const filters = {};
  const labels = {};
  let parentItem = null;

  for (let index = 0; index < segments.length; index += 1) {
    const level = levels[startIndex + index];
    if (!level) return null;

    const items = (data[level.collection] || []).filter((item) => {
      if (!parentItem || !level.parentKey) return true;
      return String(item?.[level.parentKey]) === String(parentItem.id);
    });

    const item = findBySlug(items, segments[index]);
    if (!item?.id) return null;

    filters[level.key] = String(item.id);
    labels[level.key] = getItemName(item);
    parentItem = item;
  }

  return { filters, labels, depth: segments.length };
};

const resolveHierarchicalSegments = (levels, segments, data) => {
  let bestMatch = null;

  for (let startIndex = 0; startIndex < levels.length; startIndex += 1) {
    const candidate = matchRouteBranch(levels, segments, data, startIndex);
    if (!candidate) continue;

    if (!bestMatch || candidate.depth > bestMatch.depth) {
      bestMatch = candidate;
    }
  }

  return bestMatch || { filters: {}, labels: {} };
};

export const getRouteFilterKeys = () => [...ROUTE_FILTER_KEYS];

export const buildMarketRoutePath = (filters = {}, data = {}) => {
  const categorySegments = [];
  const locationSegments = [];

  CATEGORY_LEVELS.forEach((level) => {
    const item = findById(data[level.collection], filters[level.key]);
    if (item) categorySegments.push(slugifyValue(getItemName(item)));
  });

  LOCATION_LEVELS.forEach((level) => {
    const item = findById(data[level.collection], filters[level.key]);
    if (item) locationSegments.push(slugifyValue(getItemName(item)));
  });

  const segments = [...categorySegments, ...locationSegments];

  return segments.length ? `/market/${segments.join("/")}` : "/market";
};

export const buildMarketUrl = (filters = {}, data = {}, queryInput) => {
  const resolvedRouteKeys = new Set();
  const query =
    queryInput instanceof URLSearchParams
      ? new URLSearchParams(queryInput.toString())
      : new URLSearchParams(queryInput || "");

  LOCATION_LEVELS.forEach((level) => {
    const item = findById(data[level.collection], filters[level.key]);
    if (item) resolvedRouteKeys.add(level.key);
  });

  CATEGORY_LEVELS.forEach((level) => {
    const item = findById(data[level.collection], filters[level.key]);
    if (item) resolvedRouteKeys.add(level.key);
  });

  ROUTE_FILTER_KEYS.forEach((key) => {
    if (resolvedRouteKeys.has(key)) {
      query.delete(key);
      return;
    }

    const value = filters[key];
    if (value !== null && value !== undefined && value !== "") {
      query.set(key, String(value));
    } else {
      query.delete(key);
    }
  });

  const path = buildMarketRoutePath(filters, data);
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
};

export const resolveMarketRoute = (segments = [], data = {}) => {
  const cleanSegments = segments.filter(Boolean);

  // Backward-compatible support for old marker-based URLs.
  const legacyLocationIndex = cleanSegments.indexOf("location");
  const legacyCategoryIndex = cleanSegments.indexOf("category");

  if (legacyLocationIndex !== -1 || legacyCategoryIndex !== -1) {
    const filters = {};
    const labels = {};

    if (legacyCategoryIndex !== -1) {
      const categoryEnd =
        legacyLocationIndex !== -1 && legacyLocationIndex > legacyCategoryIndex
          ? legacyLocationIndex
          : cleanSegments.length;
      const categoryMatch = resolveHierarchicalSegments(
        CATEGORY_LEVELS,
        cleanSegments.slice(legacyCategoryIndex + 1, categoryEnd),
        data,
      );
      Object.assign(filters, categoryMatch.filters);
      Object.assign(labels, categoryMatch.labels);
    }

    if (legacyLocationIndex !== -1) {
      const locationEnd =
        legacyCategoryIndex !== -1 && legacyCategoryIndex > legacyLocationIndex
          ? legacyCategoryIndex
          : cleanSegments.length;
      const locationMatch = resolveHierarchicalSegments(
        LOCATION_LEVELS,
        cleanSegments.slice(legacyLocationIndex + 1, locationEnd),
        data,
      );
      Object.assign(filters, locationMatch.filters);
      Object.assign(labels, locationMatch.labels);
    }

    return { filters, labels };
  }

  let bestMatch = { filters: {}, labels: {}, score: -1 };

  for (let splitIndex = 0; splitIndex <= cleanSegments.length; splitIndex += 1) {
    const categorySegments = cleanSegments.slice(0, splitIndex);
    const locationSegments = cleanSegments.slice(splitIndex);

    const categoryMatch = categorySegments.length
      ? resolveHierarchicalSegments(CATEGORY_LEVELS, categorySegments, data)
      : { filters: {}, labels: {} };
    const locationMatch = locationSegments.length
      ? resolveHierarchicalSegments(LOCATION_LEVELS, locationSegments, data)
      : { filters: {}, labels: {} };

    const matchedCategoryCount = Object.keys(categoryMatch.filters).length;
    const matchedLocationCount = Object.keys(locationMatch.filters).length;
    const matchedCount = matchedCategoryCount + matchedLocationCount;

    const categoryComplete =
      categorySegments.length === 0 || matchedCategoryCount === categorySegments.length;
    const locationComplete =
      locationSegments.length === 0 || matchedLocationCount === locationSegments.length;

    if (!categoryComplete || !locationComplete) continue;

    const score = matchedCount * 10 + matchedCategoryCount;
    if (score <= bestMatch.score) continue;

    bestMatch = {
      score,
      filters: {
        ...categoryMatch.filters,
        ...locationMatch.filters,
      },
      labels: {
        ...categoryMatch.labels,
        ...locationMatch.labels,
      },
    };
  }

  return {
    filters: bestMatch.filters,
    labels: bestMatch.labels,
  };
};

export const getMarketMetadataText = ({ labels = {}, total = 0 } = {}) => {
  const locationParts = LOCATION_LEVELS.map((level) => labels[level.key]).filter(Boolean);
  const categoryParts = CATEGORY_LEVELS.map((level) => labels[level.key]).filter(Boolean);

  const listingLabel = categoryParts[categoryParts.length - 1] || "Properties";
  const locationLabel = locationParts.length ? locationParts.join(", ") : "Egypt";
  const countText = Number(total || 0).toLocaleString("en-US");
  const normalizedListing = listingLabel.toLowerCase();
  const intent =
    normalizedListing.includes("for rent") || normalizedListing.includes("for sale")
      ? ""
      : normalizedListing.includes("rent")
        ? "for Rent"
        : normalizedListing.includes("sale")
          ? "for Sale"
          : "";
  const listingWithIntent = intent ? `${listingLabel} ${intent}` : listingLabel;

  return {
    title: `${listingWithIntent} in ${locationLabel} | Dawaarly`,
    description: total
      ? `Browse ${countText} ${listingWithIntent.toLowerCase()} in ${locationLabel} on Dawaarly - your go-to real estate platform for smart investments.`
      : `Browse ${listingWithIntent.toLowerCase()} in ${locationLabel} on Dawaarly - your go-to real estate platform for smart investments.`,
  };
};
