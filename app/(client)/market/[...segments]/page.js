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

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const segments = resolvedParams?.segments || [];
  const marketData = await getMarketData();
  const { filters, labels } = resolveMarketRoute(segments, marketData);
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

export default async function MarketSeoPage({ params }) {
  const resolvedParams = await params;
  const marketData = await getMarketData();
  const { filters } = resolveMarketRoute(resolvedParams?.segments || [], marketData);

  return <MarketplacePageClient routeFilters={filters} />;
}
