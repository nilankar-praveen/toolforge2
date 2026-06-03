import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/**
 * AdSlot renders ads from the admin CMS by placement.
 * It also falls back to Google AdSense (auto ads) when no custom ads exist
 * and an AdSense publisher id is configured in Settings.
 *
 * Priority:
 *   1. Custom HTML ad (raw HTML — for AdSense responsive units, etc.)
 *   2. Image + link ad
 *   3. AdSense responsive unit (publisher_id from settings)
 *   4. Hidden (nothing renders)
 */
export default function AdSlot({ placement = "in-content", className = "" }) {
  const [ad, setAd] = useState(null);
  const [adsense, setAdsense] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get(`/ads?placement=${encodeURIComponent(placement)}`)
      .then((r) => mounted && setAd((r.data || []).find((a) => a.enabled) || null))
      .catch(() => {});
    api
      .get("/settings")
      .then((r) => {
        if (!mounted) return;
        if (r.data?.adsense_enabled && r.data?.adsense_publisher_id) {
          setAdsense(r.data.adsense_publisher_id);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [placement]);

  // Inject AdSense script once on first render where adsense_publisher_id exists
  useEffect(() => {
    if (!adsense) return;
    if (document.querySelector("script[data-tf-adsense]")) return;
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense}`;
    s.dataset.tfAdsense = "1";
    document.head.appendChild(s);
  }, [adsense]);

  // Push ad once the AdSense script & <ins> are mounted
  useEffect(() => {
    if (!adsense || ad) return;
    try {
      // eslint-disable-next-line no-undef
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) {
      /* noop */
    }
  }, [adsense, ad, placement]);

  if (!ad && !adsense) return null;

  // 1. Custom HTML
  if (ad?.html) {
    return (
      <div
        data-testid={`ad-slot-${placement}`}
        className={`ad-slot ${className}`}
        aria-label={`Advertisement (${placement})`}
        dangerouslySetInnerHTML={{ __html: ad.html }}
      />
    );
  }

  // 2. Image + link
  if (ad?.image_url) {
    const content = (
      <img
        src={ad.image_url}
        alt={ad.name || "Sponsored"}
        loading="lazy"
        className="w-full h-auto rounded-xl"
      />
    );
    return (
      <div
        data-testid={`ad-slot-${placement}`}
        className={`ad-slot ${className}`}
        aria-label={`Advertisement (${placement})`}
      >
        {ad.link_url ? (
          <a href={ad.link_url} target="_blank" rel="noopener sponsored nofollow">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    );
  }

  // 3. AdSense responsive auto unit
  if (adsense) {
    return (
      <div
        data-testid={`ad-slot-${placement}`}
        className={`ad-slot ${className}`}
        aria-label={`Advertisement (${placement})`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsense}
          data-ad-slot="0000000000"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return null;
}
