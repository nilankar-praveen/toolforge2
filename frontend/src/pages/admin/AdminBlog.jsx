import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

const empty = { title: "", slug: "", excerpt: "", content: "", category: "guides", tags: [], cover_image: "", status: "draft", seo_title: "", seo_description: "" };

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const load = () => api.get("/admin/blog/posts").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const payload = { ...form, tags: typeof form.tags === "string" ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : form.tags };
      if (editing) await api.put(`/admin/blog/posts/${editing}`, payload);
      else await api.post("/admin/blog/posts", payload);
      toast.success("Saved"); setEditing(null); setForm(empty); load();
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const edit = (p) => { setEditing(p.id); setForm({ ...empty, ...p, tags: (p.tags || []).join(", ") }); };
  const del = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try { await api.delete(`/admin/blog/posts/${id}`); load(); toast.success("Deleted"); } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  return (
    <div className="space-y-6" data-testid="admin-blog">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Blog</h1>
          <p className="text-sm text-muted-foreground">Create and manage articles.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(empty); }} className="btn-brand" data-testid="admin-blog-new"><Plus className="h-4 w-4" /> New post</button>
      </header>
      <div className="grid lg:grid-cols-[1fr_460px] gap-6">
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left p-3">Title</th><th className="text-left p-3">Category</th><th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((p) => (
                <tr key={p.id} data-testid={`admin-blog-row-${p.slug}`}>
                  <td className="p-3 font-medium truncate max-w-xs">{p.title}</td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3"><span className={`chip !text-[10px] ${p.status === "published" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}`}>{p.status}</span></td>
                  <td className="p-3 text-right">
                    <button onClick={() => edit(p)} className="btn-ghost !py-1 !px-2 !text-xs" data-testid={`admin-blog-edit-${p.slug}`}><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(p.id)} className="btn-ghost !py-1 !px-2 !text-xs ml-1" data-testid={`admin-blog-delete-${p.slug}`}><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="rounded-2xl border border-border/60 bg-card p-5 sticky top-20 h-fit max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between"><h2 className="font-semibold">{editing ? "Edit post" : "New post"}</h2>{editing && <button onClick={() => { setEditing(null); setForm(empty); }} className="text-xs"><X className="h-3.5 w-3.5" /></button>}</div>
          <div className="mt-4 space-y-3">
            <F label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} testId="blog-title" />
            <F label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} testId="blog-slug" />
            <F label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} textarea testId="blog-excerpt" />
            <F label="Content (markdown)" value={form.content} onChange={(v) => setForm({ ...form, content: v })} textarea rows={10} testId="blog-content" />
            <F label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} testId="blog-category" />
            <F label="Tags (comma-separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} testId="blog-tags" />
            <F label="Cover image URL" value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} testId="blog-cover" />
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full h-9 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="blog-status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </label>
            <button onClick={save} className="btn-brand w-full" data-testid="blog-save">{editing ? "Save" : "Create"}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function F({ label, value, onChange, testId, textarea, rows = 3 }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-2 text-sm" data-testid={testId} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full h-9 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid={testId} />}
    </label>
  );
}
