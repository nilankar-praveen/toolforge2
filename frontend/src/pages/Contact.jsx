import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
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
        <p className="mt-3 max-w-xl text-muted-foreground">For projects, partnerships, feedback, or press — drop us a note.</p>
      </Reveal>

      <div className="mt-12 grid lg:grid-cols-[1fr_380px] gap-10">
        <Reveal delay={1}>
          <form onSubmit={submit} className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-soft space-y-4" data-testid="contact-form">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold">Name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="contact-name" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold">Email</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="contact-email" />
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold">Phone (optional)</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="contact-phone" />
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
              <span className="text-xs font-semibold">Message</span>
              <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-3 text-sm" data-testid="contact-message" />
            </label>
            {/* Honeypot */}
            <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden="true" />

            <button disabled={submitting} className="btn-brand w-full" data-testid="contact-submit">
              {submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        </Reveal>

        <Reveal delay={2}>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-brand-blue" /><span className="text-sm">hello@toolforge.io</span></div>
              <div className="mt-3 flex items-center gap-3"><Phone className="h-4 w-4 text-brand-blue" /><span className="text-sm">+1 (555) 010-0420</span></div>
              <div className="mt-3 flex items-center gap-3"><MapPin className="h-4 w-4 text-brand-blue" /><span className="text-sm">Remote · Worldwide</span></div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Response time</p>
              <p className="mt-3 text-sm">Within one business day for general queries. Project enquiries get a same-day acknowledgment.</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Privacy</p>
              <p className="mt-3 text-sm text-muted-foreground">We never share your details. See our <a href="/privacy" className="text-brand-blue font-semibold">Privacy Policy</a>.</p>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
