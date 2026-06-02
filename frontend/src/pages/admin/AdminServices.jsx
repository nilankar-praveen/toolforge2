import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const empty = { name: "", slug: "", tagline: "", description: "", starting_price: "", benefits: [], process: [], faqs: [], icon: "Briefcase", featured: false, enabled: true };

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const load = () => api.get("/services").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const payload = {
        ...form,
        benefits: typeof form.benefits === "string" ? form.benefits.split("\n").filter(Boolean) : form.benefits,
      };
      if (editing) await api.put(`/admin/services/${editing}`, payload);
      else await api.post("/admin/services", payload);
      toast.success("Saved"); setEditing(null); setForm(empty); load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const edit = (s) => setForm({ ...empty, ...s, benefits: (s.benefits || []).join("\n") }) || setEditing(s.id);
  const del = async (id) => { if (!window.confirm("Delete service?")) return; await api.delete(`/admin/services/${id}`); load(); toast.success("Deleted"); };

  return (
    <div className="space-y-6" data-testid="admin-services">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div><h1 className="text-3xl font-extrabold tracking-tight">Services</h1><p className="text-sm text-muted-foreground">Service offerings and lead pages.</p></div>
        <button onClick={() => { setEditing(null); setForm(empty); }} className="btn-brand" data-testid="admin-service-new"><Plus className="h-4 w-4" /> New service</button>
      </header>
      <div className="grid lg:grid-cols-[1fr_420px] gap-6">
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Starting price</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((s) => (
                <tr key={s.id}>
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 text-muted-foreground">{s.starting_price}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => edit(s)} className="btn-ghost !py-1 !px-2 !text-xs"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(s.id)} className="btn-ghost !py-1 !px-2 !text-xs ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="rounded-2xl border border-border/60 bg-card p-5 sticky top-20 h-fit max-h-[80vh] overflow-y-auto">
          <h2 className="font-semibold">{editing ? "Edit service" : "New service"}</h2>
          <div className="mt-4 space-y-3">
            <F label="Name" v={form.name} on={(v) => setForm({ ...form, name: v })} t="svc-name" />
            <F label="Slug" v={form.slug} on={(v) => setForm({ ...form, slug: v })} t="svc-slug" />
            <F label="Tagline" v={form.tagline} on={(v) => setForm({ ...form, tagline: v })} t="svc-tagline" />
            <F label="Description" v={form.description} on={(v) => setForm({ ...form, description: v })} ta t="svc-desc" />
            <F label="Starting price" v={form.starting_price} on={(v) => setForm({ ...form, starting_price: v })} t="svc-price" />
            <F label="Icon" v={form.icon} on={(v) => setForm({ ...form, icon: v })} t="svc-icon" />
            <F label="Benefits (one per line)" v={form.benefits} on={(v) => setForm({ ...form, benefits: v })} ta t="svc-benefits" />
            <button onClick={save} className="btn-brand w-full" data-testid="svc-save">{editing ? "Save" : "Create"}</button>
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
        ? <textarea value={v} onChange={(e) => on(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-2 text-sm" data-testid={t} />
        : <input value={v} onChange={(e) => on(e.target.value)} className="mt-1 w-full h-9 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid={t} />}
    </label>
  );
}
