import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import Reveal from "@/components/Reveal";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  useEffect(() => {
    api.get("/blog/posts").then((r) => setPosts(r.data));
    api.get("/blog/categories").then((r) => setCats(r.data));
  }, []);

  const filtered = posts.filter((p) => {
    if (cat !== "all" && p.category !== cat) return false;
    if (q && !p.title.toLowerCase().includes(q.toLowerCase()) && !(p.excerpt || "").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div data-testid="blog-page" className="container py-12 md:py-16">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Blog</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight font-heading">
          Tips, guides and <span className="text-gradient italic">updates.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Short reads to help you get more done.</p>
      </Reveal>

      <div className="mt-8 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input data-testid="blog-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="w-full h-11 pl-10 pr-3 rounded-xl border border-border/70 bg-card text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button onClick={() => setCat("all")} className={`chip ${cat === "all" ? "chip-active" : ""}`} data-testid="blog-cat-all">All</button>
          {cats.map((c) => (
            <button key={c.slug} onClick={() => setCat(c.slug)} className={`chip ${cat === c.slug ? "chip-active" : ""}`} data-testid={`blog-cat-${c.slug}`}>{c.name}</button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) + 1}>
            <Link to={`/blog/${p.slug}`} data-testid={`blog-card-${p.slug}`} className="group block rounded-2xl border border-border/60 bg-card overflow-hidden hover:-translate-y-1 transition-all hover:shadow-hover">
              {p.cover_image && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-violet font-bold">{p.category}</p>
                <h3 className="mt-2 font-heading text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      {filtered.length === 0 && <div className="mt-12 rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">No posts found.</div>}
    </div>
  );
}
