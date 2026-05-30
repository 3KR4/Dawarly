import AdDetailsClient from "./AdDetailsClient";

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

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const adId = resolvedParams?.slug;
  const tableId = resolvedSearchParams?.dep;
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

export default function AdDetailsPage() {
  return <AdDetailsClient />;
}
