import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

export default function AdminSettings() {
  const [v, setV] = useState({
    site_name: "", tagline: "", contact_email: "", contact_phone: "",
    seo_default_title: "", seo_default_description: "", footer_text: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get("/settings").then((r) => setV((s) => ({ ...s, ...r.data }))); }, []);
  const save = async () => {
    setLoading(true);
    try { await api.put("/admin/settings", v); toast.success("Saved"); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  return (
    <div className="space-y-6" data-testid="admin-settings">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Site settings</h1>
        <p className="text-sm text-muted-foreground">Global site metadata and contact details.</p>
      </header>
      <div className="rounded-2xl border border-border/60 bg-card p-6 max-w-3xl space-y-4">
        <F label="Site name" v={v.site_name} on={set("site_name")} t="set-site-name" />
        <F label="Tagline" v={v.tagline} on={set("tagline")} t="set-tagline" />
        <F label="Contact email" v={v.contact_email} on={set("contact_email")} t="set-contact-email" />
        <F label="Contact phone" v={v.contact_phone} on={set("contact_phone")} t="set-contact-phone" />
        <F label="SEO default title" v={v.seo_default_title} on={set("seo_default_title")} t="set-seo-title" />
        <F label="SEO default description" v={v.seo_default_description} on={set("seo_default_description")} ta t="set-seo-desc" />
        <F label="Footer text" v={v.footer_text} on={set("footer_text")} t="set-footer" />
        <button onClick={save} disabled={loading} className="btn-brand" data-testid="set-save">{loading ? "Saving…" : "Save settings"}</button>
      </div>
    </div>
  );
}
function F({ label, v, on, t, ta }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {ta
        ? <textarea value={v || ""} onChange={on} rows={3} className="mt-1 w-full rounded-lg border border-border/70 bg-background p-2 text-sm" data-testid={t} />
        : <input value={v || ""} onChange={on} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid={t} />}
    </label>
  );
}
