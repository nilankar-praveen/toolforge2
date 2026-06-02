import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import * as Icons from "lucide-react";
import { api } from "@/lib/api";
import Reveal from "@/components/Reveal";

export default function Services() {
  const [services, setServices] = useState([]);
  useEffect(() => { api.get("/services").then((r) => setServices(r.data)); }, []);

  return (
    <div data-testid="services-page" className="container py-12 md:py-16">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Services</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">
          Hand-crafted, <span className="text-gradient">production-grade</span> work.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">From websites to logos and restored photos — done by senior craftspeople, shipped fast, polished to a premium standard.</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => {
          const Icon = Icons[s.icon] || Icons.Briefcase;
          return (
            <Reveal key={s.slug} delay={(i % 3) + 1}>
              <Link
                to={`/services/${s.slug}`}
                data-testid={`service-card-${s.slug}`}
                className="group relative block h-full rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-hover hover:border-brand-blue/40"
              >
                <div className="tool-card-icon"><Icon className="h-5 w-5" strokeWidth={1.75} /></div>
                <h3 className="mt-4 font-heading text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
                {s.benefits?.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {s.benefits.slice(0, 3).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-brand-blue mt-0.5" /> <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-xs text-muted-foreground">starting at</span>
                  <span className="text-base font-bold text-gradient">{s.starting_price}</span>
                </div>
                <ArrowRight className="absolute top-6 right-6 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
