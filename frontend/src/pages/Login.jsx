import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import Logo, { LOGO_URL } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) nav(loc.state?.from || "/admin");
  }, [user, nav, loc.state]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const r = await login(email, password);
    setSubmitting(false);
    if (r.ok) {
      toast.success("Welcome back");
      nav(loc.state?.from || "/admin");
    } else {
      toast.error(r.error || "Login failed");
    }
  };

  return (
    <div data-testid="login-page" className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex items-center justify-center bg-brand-gradient text-white overflow-hidden p-12">
        <div className="absolute -top-24 -right-20 h-96 w-96 rounded-full bg-white/15 blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-black/30 blur-3xl animate-blob" />
        <div className="relative max-w-md">
          <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-ink mb-8 bg-white/10">
            <img src={LOGO_URL} alt="ToolForge" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome to the ToolForge admin.</h2>
          <p className="mt-3 text-white/85">Manage tools, services, blog posts, contacts and ads from one premium dashboard.</p>
          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-center gap-2"><Lock className="h-4 w-4" /> Role-based access, audit log enabled.</li>
            <li className="flex items-center gap-2"><Lock className="h-4 w-4" /> Brute-force protected sign-in.</li>
            <li className="flex items-center gap-2"><Lock className="h-4 w-4" /> 12-hour JWT sessions.</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 relative">
        <div className="absolute top-6 right-6"><ThemeToggle /></div>
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Authorized personnel only.</p>

          <form onSubmit={submit} className="mt-8 space-y-4" data-testid="login-form">
            <label className="block">
              <span className="text-xs font-semibold">Email</span>
              <input
                data-testid="login-email"
                autoComplete="username"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl border border-border/70 bg-background px-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold">Password</span>
              <input
                data-testid="login-password"
                autoComplete="current-password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl border border-border/70 bg-background px-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none"
              />
            </label>
            <button disabled={submitting} className="btn-brand w-full h-11" data-testid="login-submit">
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-xs text-muted-foreground">
            Need access? <Link to="/contact" className="text-brand-blue font-semibold">Contact your admin →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
