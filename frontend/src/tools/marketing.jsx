import { useState } from "react";
import { ToolShell, IOArea, ActionBar, CopyBtn, DownloadBtn } from "@/tools/shared";

// Meta Tag Generator
export function MetaTagGenerator() {
  const [v, setV] = useState({
    title: "ToolForge — Modern Tools for Builders",
    description: "Fast, private, premium utility and developer tools.",
    keywords: "tools, developer, json, regex, qr code",
    author: "ToolForge",
    url: "https://toolforge.io",
    image: "https://toolforge.io/og.png",
    twitter: "@toolforge",
  });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const out = `<!-- Primary Meta Tags -->
<title>${v.title}</title>
<meta name="title" content="${v.title}" />
<meta name="description" content="${v.description}" />
<meta name="keywords" content="${v.keywords}" />
<meta name="author" content="${v.author}" />
<link rel="canonical" href="${v.url}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${v.url}" />
<meta property="og:title" content="${v.title}" />
<meta property="og:description" content="${v.description}" />
<meta property="og:image" content="${v.image}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${v.url}" />
<meta property="twitter:title" content="${v.title}" />
<meta property="twitter:description" content="${v.description}" />
<meta property="twitter:image" content="${v.image}" />
<meta property="twitter:site" content="${v.twitter}" />`;
  return (
    <ToolShell>
      <div className="grid md:grid-cols-2 gap-3">
        {[
          ["title", "Title"], ["description", "Description"], ["keywords", "Keywords"], ["author", "Author"],
          ["url", "URL"], ["image", "OG Image URL"], ["twitter", "Twitter handle"],
        ].map(([k, l]) => (
          <label key={k} className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{l}</span>
            <input value={v[k]} onChange={set(k)} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid={`meta-${k}`} />
          </label>
        ))}
      </div>
      <IOArea label="Generated tags" value={out} readOnly testId="meta-output" rows={14} />
      <ActionBar><CopyBtn value={out} /><DownloadBtn filename="meta.html" value={out} /></ActionBar>
    </ToolShell>
  );
}

// UTM Builder
export function UtmBuilder() {
  const [v, setV] = useState({ url: "https://example.com/landing", source: "newsletter", medium: "email", campaign: "feb-launch", term: "", content: "" });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const params = new URLSearchParams();
  for (const [k, label] of [["source", "utm_source"], ["medium", "utm_medium"], ["campaign", "utm_campaign"], ["term", "utm_term"], ["content", "utm_content"]]) {
    if (v[k]) params.set(label, v[k]);
  }
  const final = v.url ? `${v.url}${v.url.includes("?") ? "&" : "?"}${params.toString()}` : "";
  return (
    <ToolShell>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Destination URL</span>
        <input value={v.url} onChange={set("url")} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="utm-url" />
      </label>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        {[["source", "utm_source (required)"], ["medium", "utm_medium (required)"], ["campaign", "utm_campaign (required)"], ["term", "utm_term"], ["content", "utm_content"]].map(([k, l]) => (
          <label key={k} className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{l}</span>
            <input value={v[k]} onChange={set(k)} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid={`utm-${k}`} />
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-border/60 bg-background p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Tracking URL</p>
        <p className="mt-1 text-sm font-mono break-all" data-testid="utm-output">{final}</p>
      </div>
      <ActionBar><CopyBtn value={final} /></ActionBar>
    </ToolShell>
  );
}

// Robots.txt Generator
export function RobotsTxtGenerator() {
  const [v, setV] = useState({ ua: "*", allow: "/", disallow: "/admin/\n/login", sitemap: "https://example.com/sitemap.xml", crawlDelay: "" });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const out = `User-agent: ${v.ua || "*"}
${v.allow ? "Allow: " + v.allow + "\n" : ""}${(v.disallow || "").split("\n").filter(Boolean).map((p) => `Disallow: ${p}`).join("\n")}
${v.crawlDelay ? `Crawl-delay: ${v.crawlDelay}\n` : ""}${v.sitemap ? `Sitemap: ${v.sitemap}` : ""}`.trim();
  return (
    <ToolShell>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User-agent</span>
          <input value={v.ua} onChange={set("ua")} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="robots-ua" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Allow</span>
          <input value={v.allow} onChange={set("allow")} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="robots-allow" />
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disallow (one per line)</span>
          <textarea value={v.disallow} onChange={set("disallow")} rows={3} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-3 text-sm font-mono" data-testid="robots-disallow" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sitemap</span>
          <input value={v.sitemap} onChange={set("sitemap")} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="robots-sitemap" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Crawl-delay</span>
          <input value={v.crawlDelay} onChange={set("crawlDelay")} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="robots-delay" />
        </label>
      </div>
      <IOArea label="Generated robots.txt" value={out} readOnly testId="robots-output" rows={8} />
      <ActionBar><CopyBtn value={out} /><DownloadBtn filename="robots.txt" value={out} /></ActionBar>
    </ToolShell>
  );
}

const REG = { MetaTagGenerator, UtmBuilder, RobotsTxtGenerator };
export default function MarketingDispatcher({ __toolKey }) {
  const C = REG[__toolKey];
  return C ? <C /> : <div className="rounded-2xl border border-dashed border-border/70 p-10 text-center text-muted-foreground">Coming soon.</div>;
}
