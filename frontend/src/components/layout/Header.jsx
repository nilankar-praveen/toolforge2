import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Command, Menu, X, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useCommandPalette } from "@/components/CommandPalette";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "Tools" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { setOpen } = useCommandPalette();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobile(false); }, [location.pathname]);

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60 py-2"
          : "bg-transparent border-b border-transparent py-4"
      }`}
    >
      <div className="container flex items-center gap-4">
        <Logo />

        <nav className="ml-6 hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              data-testid={`nav-link-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  {isActive && (
                    <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-brand-gradient" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            data-testid="open-command-palette"
            onClick={() => setOpen(true)}
            className="hidden md:inline-flex items-center gap-2 h-9 rounded-xl border border-border/70 bg-card px-3 text-sm text-muted-foreground hover:bg-secondary transition w-56 justify-between"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search tools…
            </span>
            <span className="kbd">⌘K</span>
          </button>

          <ThemeToggle />

          <Link
            to="/contact"
            data-testid="header-cta"
            className="hidden md:inline-flex btn-brand h-9 !px-4 !py-0 !text-xs"
          >
            Get a quote
          </Link>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setMobile((m) => !m)}
            aria-label="Toggle menu"
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-xl border border-border/70 bg-card"
          >
            {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          mobile ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container py-4 flex flex-col gap-1">
          <button
            data-testid="open-command-palette-mobile"
            onClick={() => setOpen(true)}
            className="mb-2 inline-flex items-center gap-2 h-10 rounded-xl border border-border/70 bg-card px-3 text-sm text-muted-foreground"
          >
            <Search className="h-4 w-4" /> Search tools…
          </button>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2.5 text-sm rounded-lg ${
                  isActive ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground"
                }`
              }
              data-testid={`mobile-nav-${n.label.toLowerCase()}`}
            >
              {n.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-brand mt-3" data-testid="mobile-cta">Get a quote</Link>
        </div>
      </div>
    </header>
  );
}
