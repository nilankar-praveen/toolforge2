import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Search, ShieldCheck, Cpu, FileBadge, EyeOff, Star } from "lucide-react";
import { api } from "@/lib/api";
import ToolCard from "@/components/ToolCard";
import AdSlot from "@/components/AdSlot";
import Reveal from "@/components/Reveal";
import { useCommandPalette } from "@/components/CommandPalette";
import { TESTIMONIALS, HERO_STATS, HOME_FAQ, TRUST_BADGES } from "@/data/staticContent";
import { getServiceVisual } from "@/data/serviceVisuals";
import * as Icons from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function AnimatedNumber({ value, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const target = Number(value);
    let raf, start;
    const dur = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setN(target * (0.5 - Math.cos(Math.PI * p) / 2));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const display = Number.isInteger(value) ? Math.round(n) : n.toFixed(1);
  return <span>{display}{suffix}</span>;
}

export default function Home() {
  const [tools, setTools] = useState([]);
  const [posts, setPosts] = useState([]);
  const [services, setServices] = useState([]);
  const { setOpen } = useCommandPalette();
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 600], [0, 80]);
  const blobY2 = useTransform(scrollY, [0, 600], [0, -60]);

  useEffect(() => {
    api.get("/tools", { params: { featured: true } }).then((r) => setTools(r.data.slice(0, 8))).catch(() => {});
    api.get("/blog/posts").then((r) => setPosts(r.data.slice(0, 3))).catch(() => {});
    api.get("/services").then((r) => setServices(r.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page" className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 grid-bg" />
        <motion.div style={{ y: blobY }} className="blob bg-brand-blue/30 dark:bg-brand-blue/20 h-[420px] w-[420px] -top-32 -left-20 animate-blob" />
        <motion.div style={{ y: blobY2 }} className="blob bg-brand-violet/30 dark:bg-brand-violet/20 h-[420px] w-[420px] -top-32 right-0 animate-blob" />

        <div className="container relative">
          <Reveal>
            <div className="inline-flex items-center gap-2 chip">
              <Sparkles className="h-3.5 w-3.5 text-brand-violet" />
              <span className="font-semibold">New: 25+ premium tools, zero ads in tool flow</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl">
              The modern toolkit for{" "}
              <span className="text-gradient">builders, teams</span>
              <br className="hidden sm:block" /> and creators.
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              25+ fast, private, beautifully crafted utilities — developer formatters, text tools,
              marketing essentials, business calculators and creative helpers. All in one place.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                data-testid="hero-search-cta"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 h-11 rounded-xl border border-border/70 bg-card px-4 text-sm text-muted-foreground hover:bg-secondary transition w-full sm:w-[420px] justify-between"
              >
                <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Try “JSON formatter”…</span>
                <span className="kbd">⌘K</span>
              </button>
              <Link to="/tools" className="btn-brand" data-testid="hero-cta-browse">
                Browse all tools <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="btn-ghost" data-testid="hero-cta-services">
                See services
              </Link>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="mt-14 grid grid-cols-3 max-w-2xl gap-6 md:gap-10">
              {HERO_STATS.map((s, i) => (
                <div key={i} className="border-l border-border/70 pl-4 first:border-l-0 first:pl-0">
                  <div className="text-2xl md:text-3xl font-extrabold text-gradient">
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs md:text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map((b) => {
            const Icon = Icons[b.icon] || ShieldCheck;
            return (
              <div key={b.label} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="h-9 w-9 rounded-xl bg-card border border-border/60 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-brand-blue" strokeWidth={1.75} />
                </span>
                <span className="font-medium text-foreground">{b.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured tools */}
      <section className="container py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Popular tools</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Made to keep you in flow</h2>
              <p className="mt-2 text-muted-foreground max-w-xl">The most loved tools, tuned for speed and clarity.</p>
            </div>
            <Link to="/tools" className="text-sm font-semibold inline-flex items-center gap-1 text-brand-blue" data-testid="featured-see-all">
              See all tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((t, i) => (
            <Reveal key={t.slug} delay={(i % 4) + 1}>
              <ToolCard tool={t} index={i} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10"><AdSlot placement="in-content" /></div>
      </section>

      {/* Services */}
      <section className="bg-muted/20 border-y border-border/60">
        <div className="container py-20 md:py-28">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Services</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Need it built? We ship.</h2>
              <p className="mt-2 text-muted-foreground">Production-quality websites, landing pages, emails and brand creative — delivered by senior craftspeople.</p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, i) => {
              const v = getServiceVisual(s.slug);
              const Icon = Icons[v.icon] || Icons[s.icon] || Icons.Briefcase;
              return (
                <Reveal key={s.slug} delay={(i % 4) + 1}>
                  <Link
                    to={`/services/${s.slug}`}
                    data-testid={`home-service-${s.slug}`}
                    className="group block h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-hover hover:border-brand-blue/40"
                  >
                    <div className={`relative h-24 bg-gradient-to-br ${v.gradient} overflow-hidden`}>
                      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" strokeWidth={1.6} />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-base font-semibold leading-snug">{s.name}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{s.tagline}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-20 md:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Loved by builders</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Don’t take our word for it.</h2>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) + 1}>
              <figure className="rounded-2xl border border-border/60 bg-card p-6 h-full">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Latest blog */}
      <section className="bg-muted/20 border-y border-border/60">
        <div className="container py-20 md:py-28">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">From the blog</p>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Articles & guides</h2>
              </div>
              <Link to="/blog" className="text-sm font-semibold inline-flex items-center gap-1 text-brand-blue" data-testid="blog-see-all">
                All posts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) + 1}>
                <Link
                  to={`/blog/${p.slug}`}
                  data-testid={`home-blog-${p.slug}`}
                  className="group block rounded-2xl border border-border/60 bg-card overflow-hidden hover:-translate-y-1 transition-all hover:shadow-hover"
                >
                  {p.cover_image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-violet font-bold">{p.category}</p>
                    <h3 className="mt-2 font-heading text-lg font-semibold leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-20 md:py-28">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <Reveal>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">FAQ</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Questions, answered.</h2>
              <p className="mt-3 text-muted-foreground">Can’t find what you need? <Link to="/contact" className="text-brand-blue font-semibold">Reach us →</Link></p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <Accordion type="single" collapsible className="rounded-2xl border border-border/60 bg-card divide-y divide-border/60">
              {HOME_FAQ.map((f, i) => (
                <AccordionItem key={i} value={`q-${i}`} className="px-5 border-0">
                  <AccordionTrigger className="text-left font-semibold" data-testid={`home-faq-${i}`}>{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-brand-gradient text-white p-10 md:p-16 shadow-hover">
            <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-black/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to ship faster?</h2>
              <p className="mt-4 text-white/85 max-w-lg">Use the tools, hire the team, or both. ToolForge is built to keep you in flow.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/tools" className="inline-flex items-center gap-2 rounded-xl bg-white text-brand-navy px-5 py-3 text-sm font-semibold hover:bg-white/95" data-testid="footer-cta-tools">Browse tools</Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10" data-testid="footer-cta-contact">Talk to us</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
