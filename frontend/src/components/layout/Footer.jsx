import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";
import Logo from "@/components/Logo";

const COLS = [
  {
    title: "Tools",
    links: [
      { to: "/tools?category=developer", label: "Developer" },
      { to: "/tools?category=text", label: "Text" },
      { to: "/tools?category=creative", label: "Creative" },
      { to: "/tools?category=marketing", label: "Marketing" },
      { to: "/tools?category=business", label: "Business" },
    ],
  },
  {
    title: "Services",
    links: [
      { to: "/services/website-development", label: "Website Development" },
      { to: "/services/landing-page-development", label: "Landing Pages" },
      { to: "/services/email-template-development", label: "Email Templates" },
      { to: "/services/logo-creation", label: "Logo Creation" },
      { to: "/services/photo-restoration", label: "Photo Restoration" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
      { to: "/disclaimer", label: "Disclaimer" },
      { to: "/cookies", label: "Cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative mt-24 border-t border-border/60 bg-muted/30">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Free online tools for developers, writers, marketers and small businesses.
              We also build websites, logos and emails when you need a hand.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a data-testid="footer-twitter" href="https://twitter.com" target="_blank" rel="noreferrer" className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-border/60 bg-card hover:bg-secondary"><Twitter className="h-4 w-4" /></a>
              <a data-testid="footer-github" href="https://github.com" target="_blank" rel="noreferrer" className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-border/60 bg-card hover:bg-secondary"><Github className="h-4 w-4" /></a>
              <a data-testid="footer-linkedin" href="https://linkedin.com" target="_blank" rel="noreferrer" className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-border/60 bg-card hover:bg-secondary"><Linkedin className="h-4 w-4" /></a>
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">{c.title}</h4>
              <ul className="mt-4 space-y-2">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-foreground/85 hover:text-foreground transition-colors" data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ToolForge. Made with care.</p>
          <p className="text-xs text-muted-foreground">Tools that run in your browser keep your data on your device.</p>
        </div>
      </div>
    </footer>
  );
}
