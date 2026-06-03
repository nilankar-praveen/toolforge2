import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
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

  const del = async (id) => {
    if (!window.confirm("Delete this contact permanently?")) return;
    try { await api.delete(`/admin/contacts/${id}`); load(); toast.success("Deleted"); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const purgeSpam = async () => {
    if (!window.confirm("Delete ALL spam contacts? This cannot be undone.")) return;
    try {
      const r = await api.post("/admin/contacts/purge", { status: "spam" });
      toast.success(`Deleted ${r.data.deleted} spam entries`);
      load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const purgeAll = async () => {
    if (!window.confirm("This will delete ALL contact requests permanently. Are you sure?")) return;
    if (!window.confirm("Really? This also resets your contact-form rate limit.")) return;
    try {
      const r = await api.post("/admin/contacts/purge", { all: true });
      toast.success(`Deleted ${r.data.deleted} contacts`);
      load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const filtered = items.filter((i) => active === "all" || i.status === active);

  return (
    <div className="space-y-6" data-testid="admin-contacts">
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Contacts & Leads</h1>
          <p className="text-sm text-muted-foreground">All form submissions. Delete spam or reset the rate limit here.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={purgeSpam} className="btn-ghost text-xs" data-testid="purge-spam">Delete spam</button>
          <button onClick={purgeAll} className="btn-ghost text-xs text-destructive" data-testid="purge-all">Reset all</button>
        </div>
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
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Service</th>
              <th className="text-left p-3">Created</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((c) => (
              <tr key={c.id} data-testid={`contact-row-${c.id}`}>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.email}</td>
                <td className="p-3 text-muted-foreground tabular-nums">{c.phone || "—"}</td>
                <td className="p-3">{c.subject}</td>
                <td className="p-3 text-muted-foreground">{c.service || "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</td>
                <td className="p-3">
                  <select
                    value={c.status || "new"}
                    onChange={(e) => setStatus(c.id, e.target.value)}
                    className="h-8 rounded-lg border border-border/70 bg-background px-2 text-xs"
                    data-testid={`contact-status-${c.id}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => del(c.id)}
                    className="btn-ghost !py-1 !px-2 !text-xs"
                    title="Delete"
                    data-testid={`contact-delete-${c.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td className="p-6 text-sm text-muted-foreground text-center" colSpan={8}>No requests.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
