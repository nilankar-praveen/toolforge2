import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const empty = { name: "", slug: "", category: "developer", description: "", icon: "Wrench", featured: false, trending: false, enabled: true, order: 0, seo_title: "", seo_description: "" };

export default function AdminTools() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const load = () => api.get("/tools").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing) await api.put(`/admin/tools/${editing}`, form);
      else await api.post("/admin/tools", form);
      toast.success(editing ? "Tool updated" : "Tool created");
      setEditing(null); setForm(empty); load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  const edit = (t) => { setEditing(t.id); setForm({ ...empty, ...t }); };
  const del = async (id) => {
    if (!window.confirm("Delete this tool?")) return;
    try { await api.delete(`/admin/tools/${id}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  return (
    <div className="space-y-6" data-testid="admin-tools">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Tools</h1>
          <p className="text-sm text-muted-foreground">Manage your tool catalog.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(empty); }} className="btn-brand" data-testid="admin-tool-new"><Plus className="h-4 w-4" /> New tool</button>
      </header>

      <div className="grid lg:grid-cols-[1fr_420px] gap-6">
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Category</th><th className="text-left p-3">Views</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((t) => (
                <tr key={t.id} data-testid={`admin-tool-row-${t.slug}`}>
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3 text-muted-foreground">{t.category}</td>
                  <td className="p-3 font-mono text-xs">{t.views || 0}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => edit(t)} className="btn-ghost !py-1 !px-2 !text-xs" data-testid={`admin-tool-edit-${t.slug}`}><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(t.id)} className="btn-ghost !py-1 !px-2 !text-xs ml-1" data-testid={`admin-tool-delete-${t.slug}`}><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="rounded-2xl border border-border/60 bg-card p-5 sticky top-20 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? "Edit tool" : "New tool"}</h2>
            {editing && <button onClick={() => { setEditing(null); setForm(empty); }} className="text-xs text-muted-foreground"><X className="h-3.5 w-3.5" /></button>}
          </div>
          <div className="mt-4 space-y-3">
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} testId="form-name" />
            <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} testId="form-slug" />
            <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} testId="form-category" />
            <Input label="Icon (lucide)" value={form.icon || ""} onChange={(v) => setForm({ ...form, icon: v })} testId="form-icon" />
            <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea testId="form-desc" />
            <Input label="SEO title" value={form.seo_title || ""} onChange={(v) => setForm({ ...form, seo_title: v })} testId="form-seo-title" />
            <Input label="SEO description" value={form.seo_description || ""} onChange={(v) => setForm({ ...form, seo_description: v })} testId="form-seo-desc" textarea />
            <div className="grid grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-1"><input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-1"><input type="checkbox" checked={!!form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} /> Trending</label>
              <label className="flex items-center gap-1"><input type="checkbox" checked={!!form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} /> Enabled</label>
            </div>
            <button onClick={save} className="btn-brand w-full" data-testid="form-save">{editing ? "Save" : "Create"}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, testId, textarea }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-2 text-sm" data-testid={testId} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full h-9 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid={testId} />
      )}
    </label>
  );
}
