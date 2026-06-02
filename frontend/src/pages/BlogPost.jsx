import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import Reveal from "@/components/Reveal";
import AdSlot from "@/components/AdSlot";

function renderMarkdown(md) {
  // Very small markdown renderer: ##/headers, **bold**, lists, paragraphs, links.
  if (!md) return null;
  const blocks = md.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-10 tracking-tight">{block.replace(/^## /, "")}</h2>;
    if (block.startsWith("# ")) return <h1 key={i} className="text-3xl font-extrabold mt-10 tracking-tight">{block.replace(/^# /, "")}</h1>;
    if (/^- /.test(block)) {
      return (
        <ul key={i} className="mt-4 list-disc pl-5 space-y-1.5 text-muted-foreground">
          {block.split("\n").map((line, j) => (
            <li key={j}>{inline(line.replace(/^- /, ""))}</li>
          ))}
        </ul>
      );
    }
    return <p key={i} className="mt-4 text-muted-foreground leading-relaxed">{inline(block)}</p>;
  });
}
function inline(text) {
  // Bold **x**, inline code `x`
  const parts = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    const b = rest.match(/\*\*(.+?)\*\*/);
    const c = rest.match(/`([^`]+)`/);
    const candidates = [b, c].filter(Boolean).sort((x, y) => x.index - y.index);
    if (!candidates.length) { parts.push(rest); break; }
    const m = candidates[0];
    if (m.index > 0) parts.push(rest.slice(0, m.index));
    if (m[0].startsWith("`")) parts.push(<code key={++key} className="font-mono text-xs px-1 py-0.5 bg-muted rounded">{m[1]}</code>);
    else parts.push(<strong key={++key} className="text-foreground">{m[1]}</strong>);
    rest = rest.slice(m.index + m[0].length);
  }
  return parts;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [more, setMore] = useState([]);

  useEffect(() => {
    api.get(`/blog/posts/${slug}`).then((r) => {
      setPost(r.data);
      document.title = (r.data.seo_title || r.data.title) + " — ToolForge";
    });
    api.get("/blog/posts").then((r) => setMore(r.data.filter((p) => p.slug !== slug).slice(0, 3)));
  }, [slug]);

  if (!post) return <div className="container py-24"><div className="h-8 w-48 rounded bg-muted animate-pulse" /></div>;

  return (
    <article data-testid={`blog-post-${slug}`} className="container py-12 md:py-16">
      <nav className="text-xs text-muted-foreground flex items-center gap-2">
        <Link to="/blog" className="hover:text-foreground">Blog</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate">{post.title}</span>
      </nav>

      <Reveal>
        <header className="mt-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">{post.category}</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}
            <span>•</span> <span>{post.author}</span>
          </div>
        </header>
      </Reveal>

      {post.cover_image && (
        <Reveal delay={1}>
          <img src={post.cover_image} alt={post.title} className="mt-10 w-full max-h-[480px] object-cover rounded-3xl border border-border/60" />
        </Reveal>
      )}

      <div className="mt-10 grid lg:grid-cols-[1fr_280px] gap-12">
        <div className="prose-tf">
          {renderMarkdown(post.content)}
        </div>
        <aside className="space-y-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Keep reading</p>
            <ul className="mt-3 space-y-2">
              {more.map((m) => (
                <li key={m.slug}><Link to={`/blog/${m.slug}`} className="text-sm font-medium hover:text-brand-blue" data-testid={`related-post-${m.slug}`}>{m.title}</Link></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
