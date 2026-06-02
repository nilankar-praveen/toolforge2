import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import { api } from "@/lib/api";
import ToolCard from "@/components/ToolCard";
import Reveal from "@/components/Reveal";
import AdSlot from "@/components/AdSlot";

export default function Tools() {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [sort, setSort] = useState("featured");

  const active = params.get("category") || "all";

  useEffect(() => {
    api.get("/tools").then((r) => setTools(r.data)).catch(() => {});
    api.get("/tools/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = [...tools];
    if (active !== "all") list = list.filter((t) => t.category === active);
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((t) =>
        t.name.toLowerCase().includes(needle) ||
        (t.description || "").toLowerCase().includes(needle) ||
        t.slug.includes(needle)
      );
    }
    if (sort === "featured") list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    if (sort === "popular") list.sort((a, b) => (b.views || 0) - (a.views || 0));
    if (sort === "newest") list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [tools, active, q, sort]);

  const setCategory = (slug) => {
    const next = new URLSearchParams(params);
    if (slug === "all") next.delete("category"); else next.set("category", slug);
    setParams(next, { replace: true });
  };

  return (
    <div data-testid="tools-page" className="container py-12 md:py-16">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Tools</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">
          Find the right tool. <span className="text-gradient">Fast.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">25+ curated utilities. Filter by category, search by name, sort by popularity.</p>
      </Reveal>

      <div className="mt-8 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="tools-search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools…"
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-border/70 bg-card text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Clear">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            data-testid="tools-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 rounded-xl border border-border/70 bg-card px-3 text-sm outline-none"
          >
            <option value="featured">Featured</option>
            <option value="popular">Most used</option>
            <option value="newest">Newest</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          data-testid="category-all"
          onClick={() => setCategory("all")}
          className={`chip ${active === "all" ? "chip-active" : ""}`}
        >All</button>
        {categories.map((c) => (
          <button
            key={c.slug}
            data-testid={`category-${c.slug}`}
            onClick={() => setCategory(c.slug)}
            className={`chip ${active === c.slug ? "chip-active" : ""}`}
          >{c.name}</button>
        ))}
      </div>

      <AdSlot placement="in-content" className="mt-8" />

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
          No tools match your search.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((t, i) => (
            <ToolCard key={t.slug} tool={t} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
