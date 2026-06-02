import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import Reveal from "@/components/Reveal";

const SERVICE_OPTIONS = [
  "General enquiry",
  "Website Development",
  "Landing Page Development",
  "Email Template Development",
  "Email Signature Design",
  "Logo Creation",
  "Sticker Creation",
  "Photo Restoration",
  "Other",
];

export default function Contact() {
  const [params] = useSearchParams();
  const presetService = params.get("service") || "General enquiry";
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service: presetService, message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    setForm((f) => ({ ...f, service: presetService }));
  }, [presetService]);

  const submit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    const digits = (form.phone || "").replace(/\D/g, "");
    if (digits.length < 7) {
      toast.error("Please enter a valid phone number with country code.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contact", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.service,
        service: form.service,
        message: form.message,
        source: "contact",
      });
      toast.success("Thanks! We'll reply within one business day.");
      setForm({ name: "", email: "", phone: "", service: "General enquiry", message: "" });
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page" className="container py-16 md:py-20">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Contact</p>
        <h1 className="mt-2 text-4xl md:text-6xl font-bold tracking-tight font-heading">
          Say <span className="text-gradient italic">hello.</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Have a question or want a quote? Send us a note and we'll get back within one business day.</p>
      </Reveal>

      <div className="mt-12 grid lg:grid-cols-[1fr_380px] gap-10">
        <Reveal delay={1}>
          <form onSubmit={submit} className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-soft space-y-4" data-testid="contact-form">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold">Your name <span className="text-red-500">*</span></span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="contact-name" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold">Email <span className="text-red-500">*</span></span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="contact-email" />
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
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
                  data-testid="contact-phone"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold">What's this about?</span>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm"
                  data-testid="contact-service"
                >
                  {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold">Your message <span className="text-red-500">*</span></span>
              <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-3 text-sm" placeholder="Tell us a bit about what you need…" data-testid="contact-message" />
            </label>
            <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden="true" />

            <button disabled={submitting} className="btn-brand w-full" data-testid="contact-submit">
              {submitting ? "Sending…" : "Send message"}
            </button>
            <p className="text-xs text-muted-foreground">We only use your details to reply to this enquiry.</p>
          </form>
        </Reveal>

        <Reveal delay={2}>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">How to reach us</p>
              <div className="mt-3 flex items-center gap-3"><Mail className="h-4 w-4 text-brand-blue" /><span className="text-sm">We reply by email within one business day.</span></div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Response time</p>
              <div className="mt-3 flex items-center gap-3"><Clock className="h-4 w-4 text-brand-blue" /><span className="text-sm">Usually within a few hours during the work week.</span></div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Privacy</p>
              <div className="mt-3 flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-brand-blue" /><span className="text-sm">We never share your details with anyone.</span></div>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
