# ToolForge — Product Requirements Document

## Original problem statement
Build a production-ready web app called **ToolForge** — a modern tools platform
with premium UX, strong backend CMS, editable pages, blog, services, admin
dashboard, deployment-ready code. No "AI" word in public-facing UI. Brand uses
the uploaded logo (deep navy + blue → violet gradient). Light + dark mode.

## Architecture
- **Backend**: FastAPI + Motor (MongoDB async). All routes under `/api`.
- **Auth**: bcrypt + PyJWT (httpOnly cookies + Authorization Bearer fallback).
  Brute-force protected, 12h access tokens, 7d refresh tokens.
- **Frontend**: React 19 (CRA + craco), TailwindCSS, shadcn/ui, framer-motion,
  lucide-react, sonner toasts. Path alias `@/` → `src/`.
- **Storage**: MongoDB collections — users, tools, tool_categories, blog_posts,
  blog_categories, services, pages, contact_requests, ads, settings,
  audit_logs, login_attempts.

## User personas
- **Visitor** — uses tools, reads blog, hires services
- **Lead** — fills service/contact forms
- **Editor / Admin / Super Admin** — manages catalog via /admin

## Implemented (2026-02 — Feb 2026)
### Public site
- Home (parallax hero, command palette, popular tools, services, testimonials, latest blog, FAQ, CTA)
- Tools listing (search + category chips + sort + ad slot)
- 25 tool pages — 22 fully functional in-browser:
  - **Developer (10)**: JSON Formatter, HTML/CSS/JS Beautifiers, SQL Formatter, Base64, URL Encode, JWT Decoder, Regex Tester, JSON→TypeScript
  - **Text (7)**: Case Converter, Word/Char Counter, Duplicate Line Remover, Text Compare (diff), Slug Generator, Password Generator, UUID Generator
  - **Marketing (3)**: Meta Tag Generator, UTM Builder, Robots.txt Generator
  - **Business (4)**: GST, EMI, Percentage, Profit Margin
  - **Creative (1)**: QR Code Generator (PNG + data-URL)
- Services listing + 7 detail pages with hero, benefits, process, FAQ, lead form
- Blog listing + detail with markdown rendering
- About, Contact (form + spam honeypot), Legal pages (Privacy, Terms, Disclaimer, Cookies)
- Theme toggle (light / dark) persisted; sticky header w/ shrink-on-scroll
- Command palette (⌘K / Ctrl+K) routes to tools and sections
- Footer w/ socials, columns, legal links, last-updated note

### Admin (`/admin`)
- Login page (premium split layout with logo)
- Protected admin shell w/ sidebar
- Overview dashboard (stats, top tools, recent contacts, audit log)
- CRUD: Tools, Blog posts, Services, Pages, Ads
- Contacts inbox with status workflow (new/in_progress/won/lost/spam)
- Site settings (site name, tagline, contact, SEO defaults, footer text)
- Audit log

### Seeded
- Super admin user (see `/app/memory/test_credentials.md`)
- 25 tools across 5 categories
- 7 services
- 3 blog posts + 3 blog categories
- 5 CMS pages (about + 4 legal)
- Default site settings

## Backlog
### P1
- Image-based tools (Photo Restoration, Sticker/Logo Creator, Background Remover, Image Upscaler) — pending integration choice (Gemini Nano Banana via Emergent Universal Key, fal.ai, or third party)
- Email/Signature templates: Email Signature Generator, Invoice Generator (PDF export)
- Affiliate manager UI + click tracking
- Sitemap.xml + robots.txt auto-served from backend
- Article / SoftwareApplication / Organization JSON-LD on tool & blog pages
- Live OG image generation
- Newsletter capture component
- Rate limiting per IP on `/api/contact`

### P2
- Stripe integration (premium plans + service deposits)
- Multilingual content (EN + i18n scaffolding)
- Comments on blog posts
- Search across all content (tools + blog + services) on a single page
- Per-tool view analytics charts (recharts) in admin dashboard
- Page builder block editor (drag & drop) for arbitrary CMS pages

## Notes
- Service start prices and content are seeded but fully editable from `/admin/services`.
- Image-based "creative" tools beyond QR Code are marked Coming Soon in the catalog and currently render a friendly placeholder if visited.
- Frontend axios is configured with `withCredentials: true` and a Bearer token fallback to localStorage (cross-origin friendly).
