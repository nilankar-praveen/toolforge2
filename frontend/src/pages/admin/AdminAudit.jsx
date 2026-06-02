import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminAudit() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/admin/audit").then((r) => setItems(r.data)); }, []);
  return (
    <div className="space-y-6" data-testid="admin-audit">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Audit log</h1>
        <p className="text-sm text-muted-foreground">Latest 200 admin actions.</p>
      </header>
      <div className="rounded-2xl border border-border/60 bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left p-3">Time</th><th className="text-left p-3">User</th><th className="text-left p-3">Action</th><th className="text-left p-3">Target</th></tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((a) => (
              <tr key={a.id}>
                <td className="p-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</td>
                <td className="p-3">{a.user_email}</td>
                <td className="p-3"><span className="chip !text-[10px]">{a.action}</span></td>
                <td className="p-3 font-mono text-xs">{a.target}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="p-6 text-sm text-muted-foreground text-center">No actions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
