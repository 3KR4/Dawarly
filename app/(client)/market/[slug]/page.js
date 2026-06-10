import AdDetailsClient from "./AdDetailsClient";
import { MarketplacePageClient } from "../page";
import {
  buildMarketRoutePath,
  getMarketMetadataText,
  resolveMarketRoute,
} from "@/utils/marketSeo";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dawaarly.com";
const CONFIGURED_API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_URL =
  process.env.NODE_ENV === "production" &&
  (!CONFIGURED_API_URL || CONFIGURED_API_URL.includes("localhost"))
    ? `${SITE_URL}/api-proxy`
    : CONFIGURED_API_URL || "http://localhost:5000";
const FALLBACK_IMAGE = `${SITE_URL}/og-image.png`;
const FALLBACK_DESCRIPTION =
  "Find your next getaway with Dawaarly, the platform that connects renters with property owners across Egypt.";

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (value, maxLength = 160) => {
  const text = stripHtml(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
};

const getAbsoluteUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, SITE_URL).toString();
};

const getAdPreview = async (adId, tableId) => {
  if (!adId || !tableId) return null;

  try {
    const res = await fetch(`${API_URL}/ads/${tableId}/${adId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

const fetchJson = async (path) => {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
};

const getMarketData = async () => {
  const [
    countries,
    governorates,
    cities,
    areas,
    compounds,
    tables,
    categories,
    subCategories,
  ] = await Promise.all([
    fetchJson("/data/countries"),
    fetchJson("/data/governorates"),
    fetchJson("/data/cities"),
    fetchJson("/data/areas"),
    fetchJson("/data/compounds"),
    fetchJson("/data/tables"),
    fetchJson("/data/categories"),
    fetchJson("/data/subcategories"),
  ]);

  return {
    countries,
    governorates,
    cities,
    areas,
    compounds,
    tables,
    categories,
    subCategories,
  };
};

const getAdsTotal = async (filters) => {
  const params = new URLSearchParams({
    page: "1",
    limit: "1",
    sort: "date",
    order: "desc",
  });

  if (filters.country_id) params.set("country_id", filters.country_id);
  if (filters.governorate_id) params.set("governorate_id", filters.governorate_id);
  if (filters.city_id) params.set("city_id", filters.city_id);
  if (filters.area_id) params.set("area_id", filters.area_id);
  if (filters.compound_id) params.set("compound_id", filters.compound_id);
  if (filters.dep) params.set("table_id", filters.dep);
  if (filters.cat) params.set("category", filters.cat);
  if (filters.subcat) params.set("subCategory", filters.subcat);

  try {
    const res = await fetch(`${API_URL}/ads/all?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const payload = await res.json();
    return Number(payload?.pagination?.total || 0);
  } catch {
    return 0;
  }
};

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const adId = resolvedParams?.slug;
  const tableId = resolvedSearchParams?.dep;

  if (!tableId) {
    const marketData = await getMarketData();
    const { filters, labels } = resolveMarketRoute([adId].filter(Boolean), marketData);
    const total = await getAdsTotal(filters);
    const { title, description } = getMarketMetadataText({ labels, total });
    const path = buildMarketRoutePath(filters, marketData);
    const url = `${SITE_URL}${path}`;

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        siteName: "Dawaarly",
        type: "website",
        images: [
          {
            url: FALLBACK_IMAGE,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [FALLBACK_IMAGE],
      },
    };
  }

  const ad = await getAdPreview(adId, tableId);

  const title = ad?.title ? stripHtml(ad.title) : "Dawaarly";
  const description = truncate(ad?.description || FALLBACK_DESCRIPTION);
  const coverImage =
    ad?.images?.find((image) => image?.is_cover)?.secure_url ||
    ad?.images?.[0]?.secure_url ||
    FALLBACK_IMAGE;
  const url = `${SITE_URL}/market/${adId}${tableId ? `?dep=${tableId}` : ""}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Dawaarly",
      type: "article",
      images: [
        { 
          url: getAbsoluteUrl(coverImage),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getAbsoluteUrl(coverImage)],
    },
  };
}

export default async function AdDetailsPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const tableId = resolvedSearchParams?.dep;

  if (!tableId) {
    const marketData = await getMarketData();
    const { filters } = resolveMarketRoute(
      [resolvedParams?.slug].filter(Boolean),
      marketData,
    );

    return <MarketplacePageClient routeFilters={filters} />;
  }

  return <AdDetailsClient />;
}
