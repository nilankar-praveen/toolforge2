import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export default function ToolCard({ tool, index = 0 }) {
  const Icon = (tool.icon && Icons[tool.icon]) || Icons.Wrench;
  return (
    <Link
      to={`/tools/${tool.slug}`}
      data-testid={`tool-card-${tool.slug}`}
      className="group relative block rounded-2xl border border-border/60 bg-card p-5
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover hover:border-brand-blue/40"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="tool-card-icon">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
      </div>
      <h3 className="mt-4 font-heading text-base font-semibold leading-snug">{tool.name}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
      <div className="mt-4 flex items-center gap-2">
        {tool.featured && <span className="chip text-[10px] !py-0.5 bg-brand-blue/10 text-brand-blue border-brand-blue/20">Featured</span>}
        {tool.trending && <span className="chip text-[10px] !py-0.5 bg-brand-violet/10 text-brand-violet border-brand-violet/20">Trending</span>}
        <span className="ml-auto text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{tool.category}</span>
      </div>
    </Link>
  );
}
