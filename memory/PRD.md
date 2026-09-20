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

## Implemented (2026-02 — Feb 2026 · 2026-06 → 2026-07 deploy & polish)
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
- Live OG image generation
- Newsletter capture component

### Done in deploy & SEO phase (Jun-Jul 2026)
- Deployed backend to Render (`toolforge-api-5zga.onrender.com`) with conditional `certifi` TLS for MongoDB Atlas SRV, background `seed()`, `/health` + root `/` + HEAD endpoints for platform probes.
- Deployed frontend to Vercel (`toolforge-lime.vercel.app`) via `frontend/vercel.json` rewrites (SPA fallback + `/sitemap.xml` proxy to backend).
- Removed Emergent badge + PostHog tracking from index.html.
- CORS: `withCredentials=false` on axios, bearer-token in Authorization header.
- Contact form: SMTP moved to `BackgroundTasks + asyncio.to_thread` so endpoint responds in <200ms (was 502 timeout).
- Contact admin: delete/purge, phone column, per-status filter.
- Ads: `AdSlot` fetches real ads from API by placement, falls back to AdSense auto ads when publisher ID is set in Settings. AdSense publisher-ID field added to Settings model + admin UI.
- Loader: forge-themed with anvil + hammer strike + ember sparks.
- Container padding raised: 1.25rem mobile → 5rem on 2xl.
- Home cold-start resilience: `apiGetWithRetry` (3 attempts, 3s apart), 45s axios timeout, ToolSkeleton + ServiceSkeleton loaders, amber error banners with Retry buttons.
- Route alias: `/admin/login` → same login page as `/login`.
- Backend `/api/diag/notifications` diagnostic endpoint (safe, no secrets).
- **SEO (Option A) — `react-helmet-async` + per-page `<Seo>` component**:
  - Unique `<title>`, meta description, canonical URL, Open Graph, Twitter card, JSON-LD structured data on every route (Home, Tools list, ToolPage, Blog, BlogPost, Services list, ServiceDetail, About, Contact, Legal, NotFound).
  - Structured data: WebSite + Organization at root (index.html), SoftwareApplication per tool, BlogPosting per blog post, Service per service.
  - `<noscript>` fallback content in index.html for non-JS crawlers (AdSense review bot, Bing, Twitter/WhatsApp/LinkedIn preview scrapers).
  - Dynamic `GET /sitemap.xml` (backend) listing all tools + services + blog posts, with static routes.
  - `robots.txt` served by backend + Vercel proxies `/sitemap.xml` → backend.

### Not yet done (still pending)
- Set env vars on Render for SMTP: `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL` (user needs to fill these on Render dashboard for lead emails to actually deliver — verify via `GET /api/diag/notifications`).
- Push all local commits (5f4310b → 4fb89fc) to GitHub — the previous PAT was auto-revoked; use Emergent's "Save to GitHub" button.
- Live OG image generation per blog post / tool.

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
