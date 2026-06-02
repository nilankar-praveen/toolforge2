import { Link } from "react-router-dom";
import { ShieldCheck, Cpu, Sparkles, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <div data-testid="about-page" className="container py-16 md:py-20">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">About ToolForge</p>
        <h1 className="mt-2 text-4xl md:text-6xl font-extrabold tracking-tight">
          A premium <span className="text-gradient">tools platform</span> for builders.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground text-lg leading-relaxed">
          ToolForge is the modern home for the small utilities you use every day — and the studio for the things you’d rather hire experts to build. We obsess over speed, polish, and trust.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { Icon: ShieldCheck, title: "Privacy-first by default", body: "Most tools run in your browser. Your inputs never leave your device unless a tool is explicitly server-backed." },
          { Icon: Cpu, title: "Fast and lightweight", body: "Lazy-loaded routes, code splitting and a tiny shared shell. Your time is the resource we protect." },
          { Icon: Sparkles, title: "Polished, never bloated", body: "Premium UX without intrusive popups, dark patterns or misleading output. We label everything clearly." },
        ].map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={(i % 3) + 1}>
            <div className="rounded-2xl border border-border/60 bg-card p-6 h-full">
              <div className="tool-card-icon"><Icon className="h-5 w-5" strokeWidth={1.75} /></div>
              <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-16 rounded-3xl border border-border/60 bg-brand-gradient text-white p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Built with intent.</h2>
            <p className="mt-3 text-white/85 max-w-lg">Every tool, every section, every animation here is intentional. We ship what we’d use ourselves.</p>
            <Link to="/contact" data-testid="about-cta" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-brand-navy px-5 py-3 text-sm font-semibold">
              Talk to the team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
