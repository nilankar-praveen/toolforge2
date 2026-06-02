import { Link } from "react-router-dom";
import { ShieldCheck, Cpu, Sparkles, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <div data-testid="about-page" className="container py-16 md:py-20">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">About</p>
        <h1 className="mt-2 text-4xl md:text-6xl font-bold tracking-tight font-heading">
          We make small online <span className="text-gradient italic">tools</span> that solve real problems.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground text-lg leading-relaxed">
          ToolForge started as a small set of utilities we needed every day — format JSON, count words,
          build links, do quick math. Now it's free for everyone. We also help people build websites,
          logos and email designs when they need an extra pair of hands.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { Icon: ShieldCheck, title: "Your data stays with you", body: "Most tools run in your browser. We don't store what you paste in." },
          { Icon: Cpu, title: "Fast and lightweight", body: "Pages load quickly and tools just work. No long waits, no big downloads." },
          { Icon: Sparkles, title: "Simple, not noisy", body: "No pop-ups asking you to subscribe. No misleading buttons. Just the tool." },
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">Have a project? Let's talk.</h2>
            <p className="mt-3 text-white/85 max-w-lg">Tell us what you need and we'll get back within a day.</p>
            <Link to="/contact" data-testid="about-cta" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-brand-navy px-5 py-3 text-sm font-semibold">
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
