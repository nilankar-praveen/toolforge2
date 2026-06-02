import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import Reveal from "@/components/Reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
  const Icon = Icons[s.icon] || Icons.Briefcase;

  return (
    <div data-testid={`service-page-${slug}`} className="container py-10 md:py-14">
      <nav className="text-xs text-muted-foreground flex items-center gap-2" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/services" className="hover:text-foreground">Services</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{s.name}</span>
      </nav>

      <Reveal>
        <div className="mt-4 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="tool-card-icon"><Icon className="h-5 w-5" strokeWidth={1.75} /></div>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">{s.name}</h1>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl">{s.tagline}</p>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-xl">{s.description}</p>
            <div className="mt-6 flex items-center gap-4">
              <span className="chip"><span className="text-brand-blue font-bold mr-1">{s.starting_price}</span> starting</span>
              <a href="#lead" className="btn-brand" data-testid="service-cta-talk">Start a project</a>
            </div>
          </div>

          {s.benefits?.length > 0 && (
            <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Benefits</p>
              <ul className="mt-4 space-y-3">
                {s.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-brand-gradient text-white inline-flex items-center justify-center shrink-0"><Check className="h-3.5 w-3.5" /></span>
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
                  <div className="text-xs font-mono text-brand-violet">{p.step}</div>
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
            <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Talk to us</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Tell us about your project.</h2>
            <p className="mt-3 text-muted-foreground max-w-md">Share a few details and we’ll reach out within one business day with next steps and a fixed price.</p>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <form onSubmit={submit} className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-soft space-y-4" data-testid="service-lead-form">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold">Name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="lead-name" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold">Email</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="lead-email" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold">Phone (optional)</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="lead-phone" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold">Project details</span>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-3 text-sm" placeholder="Goals, deadlines, references…" data-testid="lead-message" />
            </label>
            <button disabled={submitting} className="btn-brand w-full" data-testid="lead-submit">
              {submitting ? "Sending…" : "Request a quote"}
            </button>
            <p className="text-xs text-muted-foreground">We respect your privacy. We never share your email.</p>
          </form>
        </Reveal>
      </section>
    </div>
  );
}
