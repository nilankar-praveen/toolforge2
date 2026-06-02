import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const empty = { title: "", slug: "", content: "", sections: [], status: "draft", seo_title: "", seo_description: "" };

export default function AdminPages() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const load = () => api.get("/admin/pages").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing) await api.put(`/admin/pages/${editing}`, form);
      else await api.post("/admin/pages", form);
      toast.success("Saved"); setEditing(null); setForm(empty); load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const edit = (p) => { setEditing(p.id); setForm({ ...empty, ...p }); };
  const del = async (id) => { if (!window.confirm("Delete page?")) return; await api.delete(`/admin/pages/${id}`); load(); toast.success("Deleted"); };

  return (
    <div className="space-y-6" data-testid="admin-pages">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-3xl font-extrabold tracking-tight">Pages</h1><p className="text-sm text-muted-foreground">CMS pages (legal, about, custom).</p></div>
        <button onClick={() => { setEditing(null); setForm(empty); }} className="btn-brand" data-testid="page-new"><Plus className="h-4 w-4" /> New page</button>
      </header>
      <div className="grid lg:grid-cols-[1fr_440px] gap-6">
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left p-3">Title</th><th className="text-left p-3">Slug</th><th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3 text-muted-foreground font-mono text-xs">/{p.slug}</td>
                  <td className="p-3"><span className="chip !text-[10px]">{p.status}</span></td>
                  <td className="p-3 text-right">
                    <button onClick={() => edit(p)} className="btn-ghost !py-1 !px-2 !text-xs"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(p.id)} className="btn-ghost !py-1 !px-2 !text-xs ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="rounded-2xl border border-border/60 bg-card p-5 sticky top-20 h-fit max-h-[80vh] overflow-y-auto">
          <h2 className="font-semibold">{editing ? "Edit page" : "New page"}</h2>
          <div className="mt-4 space-y-3">
            <F label="Title" v={form.title} on={(v) => setForm({ ...form, title: v })} t="page-title" />
            <F label="Slug" v={form.slug} on={(v) => setForm({ ...form, slug: v })} t="page-slug" />
            <F label="Content (markdown)" v={form.content} on={(v) => setForm({ ...form, content: v })} ta rows={10} t="page-content" />
            <F label="SEO title" v={form.seo_title} on={(v) => setForm({ ...form, seo_title: v })} t="page-seo-title" />
            <F label="SEO description" v={form.seo_description} on={(v) => setForm({ ...form, seo_description: v })} ta t="page-seo-desc" />
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full h-9 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="page-status">
                <option value="draft">Draft</option><option value="published">Published</option><option value="unpublished">Unpublished</option>
              </select>
            </label>
            <button onClick={save} className="btn-brand w-full" data-testid="page-save">{editing ? "Save" : "Create"}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function F({ label, v, on, t, ta, rows = 3 }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {ta ? <textarea value={v} onChange={(e) => on(e.target.value)} rows={rows} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-2 text-sm" data-testid={t} />
        : <input value={v} onChange={(e) => on(e.target.value)} className="mt-1 w-full h-9 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid={t} />}
    </label>
  );
}
