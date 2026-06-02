import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import { api } from "@/lib/api";
import Reveal from "@/components/Reveal";
import { getServiceVisual } from "@/data/serviceVisuals";

export default function Services() {
  const [services, setServices] = useState([]);
  useEffect(() => { api.get("/services").then((r) => setServices(r.data)); }, []);

  return (
    <div data-testid="services-page" className="container py-12 md:py-16">
      <Reveal>
        <div className="inline-flex items-center gap-2 chip">
          <Sparkles className="h-3.5 w-3.5 text-brand-violet" />
          <span className="font-semibold">Done-for-you services</span>
        </div>
        <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
          Hand-crafted, <span className="text-gradient">production-grade</span> work.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">From websites to logos and restored photos — done by senior craftspeople, shipped fast, polished to a premium standard.</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => {
          const v = getServiceVisual(s.slug);
          const Icon = Icons[v.icon] || Icons[s.icon] || Icons.Briefcase;
          return (
            <Reveal key={s.slug} delay={(i % 3) + 1}>
              <Link
                to={`/services/${s.slug}`}
                data-testid={`service-card-${s.slug}`}
                className="group relative block h-full rounded-3xl border border-border/60 bg-card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-hover hover:border-brand-blue/40"
              >
                {/* Decorative visual area */}
                <div className={`relative h-40 bg-gradient-to-br ${v.gradient} overflow-hidden`}>
                  {/* abstract decorations */}
                  <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/20 blur-3xl" />
                  <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-black/20 blur-3xl" />
                  <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <pattern id={`p-${s.slug}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.4" />
                      </pattern>
                    </defs>
                    <rect width="200" height="100" fill={`url(#p-${s.slug})`} />
                  </svg>
                  {/* big icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-ink">
                      <Icon className="h-9 w-9 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
                  {s.benefits?.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {s.benefits.slice(0, 3).map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: v.accent }} /> <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: v.accent }}>
                    Explore service <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
