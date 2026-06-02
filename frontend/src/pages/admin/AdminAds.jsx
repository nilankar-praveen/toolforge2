import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const empty = { name: "", placement: "in-content", html: "", image_url: "", link_url: "", enabled: true };
const PLACEMENTS = ["header", "sidebar", "in-content", "footer"];

export default function AdminAds() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const load = () => api.get("/admin/ads").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing) await api.put(`/admin/ads/${editing}`, form);
      else await api.post("/admin/ads", form);
      toast.success("Saved"); setEditing(null); setForm(empty); load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const edit = (a) => { setEditing(a.id); setForm({ ...empty, ...a }); };
  const del = async (id) => { if (!window.confirm("Delete ad?")) return; await api.delete(`/admin/ads/${id}`); load(); toast.success("Deleted"); };

  return (
    <div className="space-y-6" data-testid="admin-ads">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-3xl font-extrabold tracking-tight">Advertisements</h1><p className="text-sm text-muted-foreground">Configure placements across the site.</p></div>
        <button onClick={() => { setEditing(null); setForm(empty); }} className="btn-brand" data-testid="ad-new"><Plus className="h-4 w-4" /> New ad</button>
      </header>
      <div className="grid lg:grid-cols-[1fr_420px] gap-6">
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Placement</th><th className="text-left p-3">Enabled</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((a) => (
                <tr key={a.id}>
                  <td className="p-3 font-medium">{a.name}</td>
                  <td className="p-3">{a.placement}</td>
                  <td className="p-3">{a.enabled ? "Yes" : "No"}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => edit(a)} className="btn-ghost !py-1 !px-2 !text-xs"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(a.id)} className="btn-ghost !py-1 !px-2 !text-xs ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} className="p-6 text-sm text-muted-foreground text-center">No ads yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <aside className="rounded-2xl border border-border/60 bg-card p-5 sticky top-20 h-fit">
          <h2 className="font-semibold">{editing ? "Edit ad" : "New ad"}</h2>
          <div className="mt-4 space-y-3">
            <F label="Name" v={form.name} on={(v) => setForm({ ...form, name: v })} t="ad-name" />
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Placement</span>
              <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })} className="mt-1 w-full h-9 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="ad-placement">
                {PLACEMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <F label="HTML (overrides image)" v={form.html} on={(v) => setForm({ ...form, html: v })} ta t="ad-html" />
            <F label="Image URL" v={form.image_url} on={(v) => setForm({ ...form, image_url: v })} t="ad-img" />
            <F label="Link URL" v={form.link_url} on={(v) => setForm({ ...form, link_url: v })} t="ad-link" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} data-testid="ad-enabled" /> Enabled</label>
            <button onClick={save} className="btn-brand w-full" data-testid="ad-save">{editing ? "Save" : "Create"}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
function F({ label, v, on, t, ta }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {ta
        ? <textarea value={v || ""} onChange={(e) => on(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-2 text-sm" data-testid={t} />
        : <input value={v || ""} onChange={(e) => on(e.target.value)} className="mt-1 w-full h-9 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid={t} />}
    </label>
  );
}
