import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const STATUSES = ["new", "in_progress", "won", "lost", "spam"];

export default function AdminContacts() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("all");
  const load = () => api.get("/admin/contacts").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try { await api.put(`/admin/contacts/${id}`, { status }); load(); toast.success("Updated"); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const filtered = items.filter((i) => active === "all" || i.status === active);

  return (
    <div className="space-y-6" data-testid="admin-contacts">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Contacts & Leads</h1>
        <p className="text-sm text-muted-foreground">All form submissions.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActive("all")} className={`chip ${active === "all" ? "chip-active" : ""}`} data-testid="contacts-all">All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setActive(s)} className={`chip ${active === s ? "chip-active" : ""}`} data-testid={`contacts-${s}`}>{s}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Subject</th><th className="text-left p-3">Service</th><th className="text-left p-3">Created</th><th className="text-left p-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((c) => (
              <tr key={c.id} data-testid={`contact-row-${c.id}`}>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.email}</td>
                <td className="p-3">{c.subject}</td>
                <td className="p-3 text-muted-foreground">{c.service || "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</td>
                <td className="p-3">
                  <select value={c.status || "new"} onChange={(e) => setStatus(c.id, e.target.value)} className="h-8 rounded-lg border border-border/70 bg-background px-2 text-xs" data-testid={`contact-status-${c.id}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td className="p-6 text-sm text-muted-foreground text-center" colSpan={6}>No requests.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
