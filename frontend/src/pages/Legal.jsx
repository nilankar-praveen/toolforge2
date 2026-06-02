import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function renderMarkdown(md) {
  if (!md) return null;
  const blocks = md.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-10 tracking-tight">{block.replace(/^## /, "")}</h2>;
    if (block.startsWith("# ")) return <h1 key={i} className="text-3xl font-extrabold mt-10 tracking-tight">{block.replace(/^# /, "")}</h1>;
    if (/^- /.test(block)) {
      return (
        <ul key={i} className="mt-4 list-disc pl-5 space-y-1.5 text-muted-foreground">
          {block.split("\n").map((line, j) => <li key={j} dangerouslySetInnerHTML={{ __html: line.replace(/^- /, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />)}
        </ul>
      );
    }
    const html = block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="mt-4 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default function Legal({ slug }) {
  const [page, setPage] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setPage(null); setErr(false);
    api.get(`/pages/${slug}`)
      .then((r) => { setPage(r.data); document.title = r.data.title + " — ToolForge"; })
      .catch(() => setErr(true));
  }, [slug]);

  if (err) return <div className="container py-24 text-center text-muted-foreground">Page not found.</div>;
  if (!page) return <div className="container py-24"><div className="h-8 w-48 rounded bg-muted animate-pulse" /></div>;

  return (
    <article data-testid={`legal-${slug}`} className="container py-16 md:py-20 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Legal</p>
      <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">{page.title}</h1>
      <p className="mt-3 text-xs text-muted-foreground">Last updated {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : "—"}</p>
      <div className="mt-8">{renderMarkdown(page.content)}</div>
    </article>
  );
}
