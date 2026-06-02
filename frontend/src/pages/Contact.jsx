import { useState } from "react";
import { Mail, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import Reveal from "@/components/Reveal";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "general", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (honeypot) return; // spam bot filled hidden field
    const digits = (form.phone || "").replace(/\D/g, "");
    if (digits.length < 7) {
      toast.error("Please enter a valid phone number with country code.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contact", { ...form, source: "contact" });
      toast.success("Thanks! We’ll reply within one business day.");
      setForm({ name: "", email: "", phone: "", subject: "general", message: "" });
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
        <h1 className="mt-2 text-4xl md:text-6xl font-extrabold tracking-tight">
          Let’s <span className="text-gradient">talk.</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">For projects, partnerships, feedback, or press — drop us a note and we’ll reach out by email and phone.</p>
      </Reveal>

      <div className="mt-12 grid lg:grid-cols-[1fr_380px] gap-10">
        <Reveal delay={1}>
          <form onSubmit={submit} className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-soft space-y-4" data-testid="contact-form">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold">Name <span className="text-red-500">*</span></span>
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
                <span className="text-xs font-semibold">Subject</span>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="contact-subject">
                  <option value="general">General</option>
                  <option value="project">Project enquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="bug">Bug report</option>
                  <option value="press">Press</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold">Message <span className="text-red-500">*</span></span>
              <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-3 text-sm" data-testid="contact-message" />
            </label>
            {/* Honeypot */}
            <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden="true" />

            <button disabled={submitting} className="btn-brand w-full" data-testid="contact-submit">
              {submitting ? "Sending…" : "Send message"}
            </button>
            <p className="text-xs text-muted-foreground">We respect your privacy. We will only use your contact details to reply to this enquiry.</p>
          </form>
        </Reveal>

        <Reveal delay={2}>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Reach us</p>
              <div className="mt-3 flex items-center gap-3"><Mail className="h-4 w-4 text-brand-blue" /><span className="text-sm">We reply by email within 1 business day.</span></div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Response time</p>
              <div className="mt-3 flex items-center gap-3"><Clock className="h-4 w-4 text-brand-blue" /><span className="text-sm">Within 1 business day for general enquiries.</span></div>
              <p className="mt-2 text-sm text-muted-foreground">Project enquiries get a same-day acknowledgment.</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Privacy</p>
              <div className="mt-3 flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-brand-blue" /><span className="text-sm">We never share your details with third parties.</span></div>
              <p className="mt-2 text-sm text-muted-foreground">See our <a href="/privacy" className="text-brand-blue font-semibold">Privacy Policy</a>.</p>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
