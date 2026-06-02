import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, BookOpen, Briefcase, Mail, FileText, Megaphone, Activity } from "lucide-react";
import { api } from "@/lib/api";

const ICONS = {
  tools: Wrench, posts: BookOpen, services: Briefcase, contacts: Mail,
  new_contacts: Activity, pages: FileText, ads: Megaphone,
};
const LABELS = {
  tools: "Tools", posts: "Blog posts", services: "Services", contacts: "Contacts",
  new_contacts: "New leads", pages: "Pages", ads: "Active ads",
};
const LINKS = {
  tools: "/admin/tools", posts: "/admin/blog", services: "/admin/services",
  contacts: "/admin/contacts", new_contacts: "/admin/contacts", pages: "/admin/pages",
  ads: "/admin/ads",
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/admin/overview").then((r) => setData(r.data)); }, []);
  if (!data) return <div data-testid="admin-dashboard" className="h-64 rounded-3xl bg-muted/30 animate-pulse" />;

  return (
    <div data-testid="admin-dashboard" className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Dashboard</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Snapshot of your site and recent activity.</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(data.stats).map(([k, v]) => {
          const Icon = ICONS[k] || Activity;
          return (
            <Link key={k} to={LINKS[k] || "#"} className="group rounded-2xl border border-border/60 bg-card p-4 hover:-translate-y-0.5 transition" data-testid={`stat-${k}`}>
              <div className="flex items-center justify-between">
                <Icon className="h-4 w-4 text-brand-blue" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{LABELS[k] || k}</span>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-gradient">{v}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Top tools by views</h2>
          <ul className="mt-4 divide-y divide-border/60">
            {data.top_tools.map((t) => (
              <li key={t.slug} className="flex items-center justify-between py-2.5">
                <Link to={`/tools/${t.slug}`} className="text-sm font-medium hover:text-brand-blue">{t.name}</Link>
                <span className="text-xs text-muted-foreground font-mono">{t.views || 0} views</span>
              </li>
            ))}
            {data.top_tools.length === 0 && <li className="text-sm text-muted-foreground">No data yet.</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent contact requests</h2>
          <ul className="mt-4 divide-y divide-border/60">
            {data.recent_contacts.map((c) => (
              <li key={c.id} className="py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold truncate">{c.name}</p>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.subject}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.email}</p>
              </li>
            ))}
            {data.recent_contacts.length === 0 && <li className="text-sm text-muted-foreground">No requests yet.</li>}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Audit log</h2>
        <ul className="mt-4 divide-y divide-border/60 text-sm">
          {data.audit.map((a) => (
            <li key={a.id} className="py-2 flex items-center gap-3">
              <span className="chip !text-[10px]">{a.action}</span>
              <span className="text-muted-foreground">{a.user_email}</span>
              <span className="ml-auto text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
            </li>
          ))}
          {data.audit.length === 0 && <li className="text-sm text-muted-foreground">No activity yet.</li>}
        </ul>
      </section>
    </div>
  );
}
