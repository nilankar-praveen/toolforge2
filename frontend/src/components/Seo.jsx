import { Helmet } from "react-helmet-async";

const SITE_NAME = "ToolForge";
const DEFAULT_DESC =
  "ToolForge is a free suite of privacy-first developer, marketer and creator utilities — JSON formatter, word counter, GST calculator, QR generator, and 20+ more.";
const DEFAULT_IMAGE =
  "https://customer-assets.emergentagent.com/job_forge-next-3/artifacts/bugix8ks_ToolForge.png";

/**
 * Progressive SEO component.
 * - Renders per-route <title>, description, canonical, Open Graph, Twitter card,
 *   and optional JSON-LD structured data.
 * - Also emits a plain-text <noscript> summary so non-JS crawlers see real content.
 *
 * Usage:
 *   <Seo
 *     title="JSON Formatter — ToolForge"
 *     description="Format & validate JSON in your browser..."
 *     path="/tools/json-formatter"
 *     ogType="article"
 *     image="https://.../cover.png"
 *     jsonLd={{ "@context": "https://schema.org", ... }}
 *     noscriptContent="Format any JSON online for free..."
 *   />
 */
export default function Seo({
  title,
  description,
  path = "/",
  image,
  ogType = "website",
  jsonLd,
  noscriptContent,
  keywords,
}) {
  const origin =
    (typeof window !== "undefined" && window.location?.origin) ||
    "https://toolforge-lime.vercel.app";
  const url = `${origin}${path.startsWith("/") ? path : `/${path}`}`;
  const finalTitle = title || `${SITE_NAME} — Modern Tools for Builders`;
  const finalDesc = description || DEFAULT_DESC;
  const finalImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      {/* Structured data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}

      {/* Fallback readable content for non-JS crawlers */}
      {noscriptContent && (
        <noscript>{`${finalTitle} — ${noscriptContent}`}</noscript>
      )}
    </Helmet>
  );
}
