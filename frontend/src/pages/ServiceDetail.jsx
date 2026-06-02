import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import Reveal from "@/components/Reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getServiceVisual } from "@/data/serviceVisuals";

export default function ServiceDetail() {
  const { slug } = useParams();
  const [s, setS] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    api.get(`/services/${slug}`).then((r) => {
      setS(r.data);
      document.title = r.data.name + " — ToolForge";
    });
  }, [slug]);

  const submit = async (e) => {
    e.preventDefault();
    // Phone is required and must look real
    const digits = (form.phone || "").replace(/\D/g, "");
    if (digits.length < 7) {
      toast.error("Please enter a valid phone number with country code.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contact", {
        ...form,
        subject: `service:${slug}`,
        service: s?.name,
        source: "service-detail",
      });
      toast.success("Thanks! We’ll get back within one business day.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  if (!s) return <div className="container py-24"><div className="h-8 w-48 rounded bg-muted animate-pulse" /></div>;
  const v = getServiceVisual(slug);
  const Icon = Icons[v.icon] || Icons[s.icon] || Icons.Briefcase;

  return (
    <div data-testid={`service-page-${slug}`}>
      {/* Decorative hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${v.gradient} text-white`}>
        <div className="absolute -top-32 -right-32 h-[26rem] w-[26rem] rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[26rem] w-[26rem] rounded-full bg-black/20 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full opacity-15" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="hero-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="800" height="200" fill="url(#hero-grid)" />
        </svg>
        <div className="container relative py-14 md:py-20">
          <nav className="text-xs text-white/80 flex items-center gap-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/services" className="hover:text-white">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">{s.name}</span>
          </nav>

          <div className="mt-6 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">{s.name}</h1>
              <p className="mt-4 text-lg text-white/90 max-w-2xl">{s.tagline}</p>
              <div className="mt-6">
                <a href="#lead" className="inline-flex items-center gap-2 rounded-xl bg-white text-brand-navy px-5 py-3 text-sm font-semibold hover:bg-white/95" data-testid="service-cta-talk">Start a project</a>
              </div>
            </div>
            <div className="hidden lg:flex h-44 w-44 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 items-center justify-center shadow-ink shrink-0">
              <Icon className="h-20 w-20 text-white" strokeWidth={1.3} />
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: v.accent }}>What you get</p>
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">{s.description}</p>
            </div>
            {s.benefits?.length > 0 && (
              <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
                <p className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: v.accent }}>Benefits</p>
                <ul className="mt-4 space-y-3">
                  {s.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`h-6 w-6 rounded-full bg-gradient-to-br ${v.gradient} text-white inline-flex items-center justify-center shrink-0`}><Check className="h-3.5 w-3.5" /></span>
                      <span className="text-sm">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>

        {s.process?.length > 0 && (
          <section className="mt-20">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How we deliver</h2>
              <p className="mt-2 text-muted-foreground">A clear, low-friction process.</p>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {s.process.map((p, i) => (
                <Reveal key={i} delay={(i % 4) + 1}>
                  <div className="rounded-2xl border border-border/60 bg-card p-6 h-full">
                    <div className="text-xs font-mono font-bold" style={{ color: v.accent }}>{p.step}</div>
                    <h3 className="mt-2 font-heading text-lg font-semibold">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {s.faqs?.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">FAQ</h2>
            <Accordion type="single" collapsible className="mt-6 rounded-2xl border border-border/60 bg-card divide-y divide-border/60">
              {s.faqs.map((f, i) => (
                <AccordionItem key={i} value={`q-${i}`} className="px-5 border-0">
                  <AccordionTrigger className="text-left font-semibold" data-testid={`service-faq-${i}`}>{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Lead form */}
        <section id="lead" className="mt-24 grid lg:grid-cols-2 gap-10">
          <Reveal>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: v.accent }}>Talk to us</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Tell us about your project.</h2>
              <p className="mt-3 text-muted-foreground max-w-md">Share a few details and we’ll reach out within one business day with next steps.</p>
              <p className="mt-3 text-xs text-muted-foreground">All fields are required so we can respond on the right channel.</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <form onSubmit={submit} className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-soft space-y-4" data-testid="service-lead-form">
              <div className="rounded-xl border border-border/70 bg-muted/50 px-4 py-3 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Service</span>
                <span className="text-sm font-semibold text-foreground" data-testid="lead-service-label">{s.name}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold">Your name <span className="text-red-500">*</span></span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="lead-name" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold">Email <span className="text-red-500">*</span></span>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="lead-email" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-semibold">Phone (with country code) <span className="text-red-500">*</span></span>
                <input
                  required
                  type="tel"
                  pattern="[+0-9\s\-()]{7,20}"
                  placeholder="e.g. +91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm"
                  data-testid="lead-phone"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold">Tell us about your project <span className="text-red-500">*</span></span>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-3 text-sm" placeholder="Goals, deadline, references…" data-testid="lead-message" />
              </label>
              <button disabled={submitting} className="btn-brand w-full" data-testid="lead-submit">
                {submitting ? "Sending…" : "Request a callback"}
              </button>
              <p className="text-xs text-muted-foreground">We'll only use these details to reply about your project.</p>
            </form>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
