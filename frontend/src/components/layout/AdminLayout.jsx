import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Wrench, BookOpen, Briefcase, Mail,
  FileText, Megaphone, Settings, ScrollText, LogOut, Menu, X,
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/tools", label: "Tools", icon: Wrench },
  { to: "/admin/blog", label: "Blog", icon: BookOpen },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/contacts", label: "Contacts", icon: Mail },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/ads", label: "Ads", icon: Megaphone },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/audit", label: "Audit log", icon: ScrollText },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="px-4 md:px-6 h-14 flex items-center gap-3">
          <button
            data-testid="admin-sidebar-toggle"
            className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-xl border border-border/70 bg-card"
            onClick={() => setOpen((o) => !o)}
          >{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
          <Logo />
          <span className="hidden md:inline-flex chip ml-2 !text-[10px]">Admin</span>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground" data-testid="admin-view-site">View site →</Link>
            <ThemeToggle />
            <button onClick={handleLogout} data-testid="admin-logout" className="btn-ghost h-9 !py-0 !px-3 !text-xs">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-[256px_1fr]">
        {/* Sidebar */}
        <aside
          className={`fixed md:static z-20 inset-y-14 left-0 w-64 bg-card/60 backdrop-blur-md border-r border-border/60 transform transition-transform md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex flex-col gap-1">
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Manage</div>
            {ITEMS.map((it) => {
              const Icon = it.icon;
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.exact}
                  onClick={() => setOpen(false)}
                  data-testid={`admin-nav-${it.label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-gradient text-white shadow-soft"
                        : "text-foreground/80 hover:bg-secondary/80 hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  {it.label}
                </NavLink>
              );
            })}
            <div className="mt-6 px-3 py-3 rounded-xl border border-border/60 bg-muted/40">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-semibold truncate">{user?.email}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{user?.role}</p>
            </div>
          </div>
        </aside>

        <main className="p-4 md:p-8 min-h-[calc(100vh-56px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
