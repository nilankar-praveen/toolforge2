import { Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { TOOL_COMPONENTS } from "@/data/toolsRegistry";
import AdSlot from "@/components/AdSlot";
import Reveal from "@/components/Reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const COMMON_FAQ = [
  { q: "Is my data sent to any server?", a: "Most ToolForge tools run entirely in your browser. Inputs never leave your device unless a tool is explicitly marked server-backed." },
  { q: "Are the outputs free to use commercially?", a: "Yes. Anything you generate is yours to use, including in commercial projects." },
  { q: "How do I report a bug or request a feature?", a: "Send us a note via the Contact page — we triage requests weekly." },
];

export default function ToolPage() {
  const { slug } = useParams();
  const [tool, setTool] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setTool(null);
    setNotFound(false);
    api.get(`/tools/${slug}`)
      .then((r) => {
        setTool(r.data);
        document.title = (r.data.seo_title || r.data.name) + " — ToolForge";
        api.get(`/tools`, { params: { category: r.data.category } })
          .then((rr) => setRelated(rr.data.filter((t) => t.slug !== r.data.slug).slice(0, 4)));
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="container py-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">404</p>
        <h1 className="mt-2 text-3xl font-bold">Tool not found</h1>
        <Link to="/tools" className="btn-brand mt-6 inline-flex" data-testid="tool-back-to-tools">Back to tools</Link>
      </div>
    );
  }

  if (!tool) {
    return <div className="container py-24"><div className="h-8 w-48 rounded bg-muted animate-pulse" /></div>;
  }

  const Entry = TOOL_COMPONENTS[slug];

  return (
    <div data-testid={`tool-page-${slug}`} className="container py-10 md:py-14">
      {/* Breadcrumbs */}
      <nav className="text-xs text-muted-foreground flex items-center gap-2" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/tools" className="hover:text-foreground">Tools</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{tool.name}</span>
      </nav>

      <Reveal>
        <header className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">{tool.category}</p>
            <h1 className="mt-1 text-3xl md:text-5xl font-extrabold tracking-tight">{tool.name}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{tool.description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-brand-blue" />
            Processed in your browser
          </div>
        </header>
      </Reveal>

      <div className="mt-10 grid lg:grid-cols-[1fr_300px] gap-10">
        <div>
          <Suspense fallback={<div className="rounded-2xl border border-border/60 p-8 text-sm text-muted-foreground">Loading tool…</div>}>
            {Entry ? <ToolMount entry={Entry} /> : (
              <div className="rounded-2xl border border-dashed border-border/70 p-10 text-center text-muted-foreground">
                Coming soon.
              </div>
            )}
          </Suspense>

          <AdSlot placement="in-content" className="mt-8" />

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">Frequently asked</h2>
            <Accordion type="single" collapsible className="mt-4 rounded-2xl border border-border/60 bg-card divide-y divide-border/60">
              {COMMON_FAQ.map((f, i) => (
                <AccordionItem key={i} value={`q-${i}`} className="px-5 border-0">
                  <AccordionTrigger className="text-left font-semibold" data-testid={`tool-faq-${i}`}>{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>

        <aside className="space-y-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Related tools</p>
            <ul className="mt-3 space-y-1">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/tools/${r.slug}`}
                    data-testid={`related-tool-${r.slug}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm hover:bg-secondary/80 transition-colors"
                  >
                    <span className="truncate">{r.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                  </Link>
                </li>
              ))}
              {related.length === 0 && <li className="text-sm text-muted-foreground">No related tools yet.</li>}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Trust note</p>
            <p className="mt-3 text-sm text-muted-foreground">All client-side tools keep your data on your device. We never log inputs.</p>
          </div>
        </aside>
      </div>

      <div className="mt-12">
        <Link to="/tools" className="btn-ghost inline-flex" data-testid="tool-back-link">
          <ArrowLeft className="h-4 w-4" /> Back to all tools
        </Link>
      </div>
    </div>
  );
}

function ToolMount({ entry }) {
  const { Loader, key } = entry;
  // Loader is a lazy() component that exports many named tools.
  // Render the bundle and pick from it.
  return <ToolDynamic Loader={Loader} keyName={key} />;
}

function ToolDynamic({ Loader, keyName }) {
  // Loader is the lazy module; we render it and inside the bundle, choose component by name.
  return (
    <Loader __toolKey={keyName} />
  );
}
