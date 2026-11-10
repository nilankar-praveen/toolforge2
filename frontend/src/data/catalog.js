// Built-in copy of the catalog, shown instantly and used when the API is unreachable.
export const FALLBACK_TOOLS = [
  {
    "slug": "case-converter",
    "category": "text",
    "description": "UPPER, lower, Title, camelCase, snake_case and more.",
    "enabled": true,
    "featured": true,
    "icon": "CaseSensitive",
    "name": "Case Converter",
    "order": 1,
    "trending": false
  },
  {
    "slug": "gst-calculator",
    "category": "business",
    "description": "Calculate GST inclusive and exclusive amounts.",
    "enabled": true,
    "featured": true,
    "icon": "Percent",
    "name": "GST Calculator",
    "order": 1,
    "trending": false
  },
  {
    "slug": "json-formatter",
    "category": "developer",
    "description": "Beautify, minify and validate JSON instantly in your browser.",
    "enabled": true,
    "featured": true,
    "icon": "Braces",
    "name": "JSON Formatter & Validator",
    "order": 1,
    "seo_description": "Format, validate, and minify JSON instantly. Fast, free, secure — processed in your browser.",
    "seo_title": "JSON Formatter & Validator — ToolForge",
    "trending": true
  },
  {
    "slug": "meta-tag-generator",
    "category": "marketing",
    "description": "Compose SEO and Open Graph meta tags in seconds.",
    "enabled": true,
    "featured": true,
    "icon": "Tags",
    "name": "Meta Tag Generator",
    "order": 1,
    "trending": false
  },
  {
    "slug": "qr-code-generator",
    "category": "creative",
    "description": "Generate beautiful QR codes for links, text and more.",
    "enabled": true,
    "featured": true,
    "icon": "QrCode",
    "name": "QR Code Generator",
    "order": 1,
    "trending": true
  },
  {
    "slug": "emi-calculator",
    "category": "business",
    "description": "Plan your loan EMIs with principal, rate and tenure.",
    "enabled": true,
    "featured": false,
    "icon": "Calculator",
    "name": "EMI Calculator",
    "order": 2,
    "trending": true
  },
  {
    "slug": "html-beautifier",
    "category": "developer",
    "description": "Beautify and tidy your HTML markup with one click.",
    "enabled": true,
    "featured": false,
    "icon": "FileCode2",
    "name": "HTML Beautifier",
    "order": 2,
    "trending": true
  },
  {
    "slug": "utm-builder",
    "category": "marketing",
    "description": "Build trackable campaign URLs with UTM parameters.",
    "enabled": true,
    "featured": false,
    "icon": "BarChart3",
    "name": "UTM Builder",
    "order": 2,
    "trending": false
  },
  {
    "slug": "text-counter",
    "category": "text",
    "description": "Count words, characters, sentences and reading time.",
    "enabled": true,
    "featured": false,
    "icon": "Hash",
    "name": "Word & Character Counter",
    "order": 2,
    "trending": true
  },
  {
    "slug": "css-beautifier",
    "category": "developer",
    "description": "Format, indent and clean up CSS.",
    "enabled": true,
    "featured": false,
    "icon": "Palette",
    "name": "CSS Beautifier",
    "order": 3,
    "trending": false
  },
  {
    "slug": "duplicate-line-remover",
    "category": "text",
    "description": "Strip duplicate lines, sort and deduplicate.",
    "enabled": true,
    "featured": false,
    "icon": "Filter",
    "name": "Duplicate Line Remover",
    "order": 3,
    "trending": false
  },
  {
    "slug": "percentage-calculator",
    "category": "business",
    "description": "Run percentage, increase and decrease calculations.",
    "enabled": true,
    "featured": false,
    "icon": "Divide",
    "name": "Percentage Calculator",
    "order": 3,
    "trending": false
  },
  {
    "slug": "robots-txt-generator",
    "category": "marketing",
    "description": "Create a robots.txt file with sensible defaults.",
    "enabled": true,
    "featured": false,
    "icon": "Bot",
    "name": "Robots.txt Generator",
    "order": 3,
    "trending": false
  },
  {
    "slug": "js-beautifier",
    "category": "developer",
    "description": "Format JavaScript code with consistent indentation.",
    "enabled": true,
    "featured": true,
    "icon": "Code",
    "name": "JavaScript Beautifier",
    "order": 4,
    "trending": false
  },
  {
    "slug": "profit-calculator",
    "category": "business",
    "description": "Compute profit, margin and markup easily.",
    "enabled": true,
    "featured": false,
    "icon": "TrendingUp",
    "name": "Profit Margin Calculator",
    "order": 4,
    "trending": false
  },
  {
    "slug": "text-compare",
    "category": "text",
    "description": "Compare two blocks of text and see the diff.",
    "enabled": true,
    "featured": false,
    "icon": "GitCompare",
    "name": "Text Compare (Diff)",
    "order": 4,
    "trending": false
  },
  {
    "slug": "sql-formatter",
    "category": "developer",
    "description": "Pretty-print SQL queries across PostgreSQL, MySQL and more.",
    "enabled": true,
    "featured": false,
    "icon": "Database",
    "name": "SQL Formatter",
    "order": 5,
    "trending": false
  },
  {
    "slug": "slug-generator",
    "category": "text",
    "description": "Generate SEO-friendly slugs from any title.",
    "enabled": true,
    "featured": false,
    "icon": "Link",
    "name": "Slug Generator",
    "order": 5,
    "trending": false
  },
  {
    "slug": "base64",
    "category": "developer",
    "description": "Convert text to Base64 and back, instantly.",
    "enabled": true,
    "featured": true,
    "icon": "Binary",
    "name": "Base64 Encode / Decode",
    "order": 6,
    "trending": true
  },
  {
    "slug": "password-generator",
    "category": "text",
    "description": "Generate strong, customizable passwords offline.",
    "enabled": true,
    "featured": true,
    "icon": "Lock",
    "name": "Password Generator",
    "order": 6,
    "trending": true
  },
  {
    "slug": "url-encode",
    "category": "developer",
    "description": "Percent-encode and decode URLs safely.",
    "enabled": true,
    "featured": false,
    "icon": "Link2",
    "name": "URL Encode / Decode",
    "order": 7,
    "trending": false
  },
  {
    "slug": "uuid-generator",
    "category": "text",
    "description": "Generate RFC4122 UUID v4 identifiers in bulk.",
    "enabled": true,
    "featured": false,
    "icon": "Fingerprint",
    "name": "UUID Generator",
    "order": 7,
    "trending": false
  },
  {
    "slug": "jwt-decoder",
    "category": "developer",
    "description": "Inspect JWT header and payload without sharing your token.",
    "enabled": true,
    "featured": true,
    "icon": "KeyRound",
    "name": "JWT Decoder",
    "order": 8,
    "trending": false
  },
  {
    "slug": "regex-tester",
    "category": "developer",
    "description": "Test regular expressions live with highlighted matches.",
    "enabled": true,
    "featured": false,
    "icon": "Search",
    "name": "Regex Tester",
    "order": 9,
    "trending": false
  },
  {
    "slug": "json-to-typescript",
    "category": "developer",
    "description": "Generate TypeScript interfaces from any JSON payload.",
    "enabled": true,
    "featured": false,
    "icon": "Brackets",
    "name": "JSON to TypeScript",
    "order": 10,
    "trending": false
  }
];

export const FALLBACK_CATEGORIES = [
  {
    "slug": "developer",
    "description": "Format, decode and inspect data fast.",
    "icon": "Code2",
    "name": "Developer",
    "order": 1
  },
  {
    "slug": "text",
    "description": "Manipulate, count, compare and generate text.",
    "icon": "Type",
    "name": "Text",
    "order": 2
  },
  {
    "slug": "creative",
    "description": "Visual and creative utilities.",
    "icon": "Sparkles",
    "name": "Creative",
    "order": 3
  },
  {
    "slug": "marketing",
    "description": "Tags, UTMs, SEO essentials.",
    "icon": "Megaphone",
    "name": "Marketing",
    "order": 4
  },
  {
    "slug": "business",
    "description": "Calculators and finance helpers.",
    "icon": "Briefcase",
    "name": "Business",
    "order": 5
  }
];

export const FALLBACK_SERVICES = [
  {
    "slug": "website-development",
    "name": "Website Development",
    "tagline": "Production-grade websites engineered for performance and conversion.",
    "description": "We design and ship modern marketing sites, web apps and dashboards. Pixel-perfect, fast, and built to grow with you.",
    "starting_price": "$1,499",
    "icon": "Globe",
    "benefits": [
      "Modern, mobile-first design",
      "Built-in SEO and analytics",
      "Performance budget under 200KB JS",
      "CMS for editing without code"
    ],
    "process": [
      {
        "step": "01",
        "title": "Discovery",
        "description": "We map your goals, audience and conversion paths."
      },
      {
        "step": "02",
        "title": "Design",
        "description": "Premium, brand-aligned interface in light & dark."
      },
      {
        "step": "03",
        "title": "Build",
        "description": "Clean, typed, tested code with CI/CD."
      },
      {
        "step": "04",
        "title": "Launch",
        "description": "Deploy with monitoring, analytics & docs."
      }
    ],
    "faqs": [
      {
        "q": "How long does a typical project take?",
        "a": "Most marketing sites ship in 3–5 weeks."
      },
      {
        "q": "Do you handle hosting?",
        "a": "Yes — we provide deployment and ongoing support plans."
      }
    ],
    "featured": true,
    "order": 1,
    "enabled": true
  },
  {
    "slug": "landing-page-development",
    "name": "Landing Page Development",
    "tagline": "High-converting landing pages tuned for paid traffic.",
    "description": "Need a launch or campaign page that converts? We craft fast, accessible landers with built-in A/B test scaffolding.",
    "starting_price": "$599",
    "icon": "LayoutTemplate",
    "benefits": [
      "Conversion-focused copy framework",
      "Above-the-fold under 1s LCP",
      "Form & lead capture integration"
    ],
    "process": [
      {
        "step": "01",
        "title": "Goal & offer",
        "description": "Define the conversion goal and the offer."
      },
      {
        "step": "02",
        "title": "Hero & CTA",
        "description": "Sharpen the headline, hero and CTA."
      },
      {
        "step": "03",
        "title": "Ship",
        "description": "Launch with tracking and A/B variants."
      }
    ],
    "faqs": [
      {
        "q": "Will you write the copy?",
        "a": "Yes, included in the package or we can refine yours."
      }
    ],
    "featured": true,
    "order": 2,
    "enabled": true
  },
  {
    "slug": "email-template-development",
    "name": "Email Template Development",
    "tagline": "Responsive, deliverable HTML email templates.",
    "description": "Email tested across major clients with proper fallback, accessibility and dark-mode support.",
    "starting_price": "$249",
    "icon": "Mail",
    "benefits": [
      "Tested on Gmail, Outlook, Apple Mail",
      "Dark-mode variants",
      "Editable in your ESP"
    ],
    "process": [
      {
        "step": "01",
        "title": "Design",
        "description": "Mockup in your brand."
      },
      {
        "step": "02",
        "title": "Build",
        "description": "Hand-coded MJML / HTML."
      },
      {
        "step": "03",
        "title": "Test",
        "description": "Render across 30+ clients."
      }
    ],
    "faqs": [
      {
        "q": "Which ESPs do you support?",
        "a": "Mailchimp, Brevo, HubSpot, Klaviyo, Customer.io, Mailgun and more."
      }
    ],
    "order": 3,
    "enabled": true
  },
  {
    "slug": "logo-creation",
    "name": "Logo Creation",
    "tagline": "Distinctive marks crafted for modern brands.",
    "description": "Original, hand-crafted logos delivered in every format you need.",
    "starting_price": "$349",
    "icon": "PenTool",
    "benefits": [
      "3 concepts",
      "Unlimited tweaks",
      "Full file pack (SVG, PNG, PDF)"
    ],
    "process": [
      {
        "step": "01",
        "title": "Brief",
        "description": "Understand brand and audience."
      },
      {
        "step": "02",
        "title": "Concepts",
        "description": "Explore 3 directions."
      },
      {
        "step": "03",
        "title": "Refine",
        "description": "Iterate to a final mark."
      }
    ],
    "faqs": [
      {
        "q": "Do you provide brand guidelines?",
        "a": "Yes, a short PDF guide is included."
      }
    ],
    "order": 4,
    "enabled": true
  },
  {
    "slug": "sticker-creation",
    "name": "Sticker Creation",
    "tagline": "Eye-catching stickers and pack design.",
    "description": "Vector stickers for Telegram, WhatsApp, merchandise and product packs.",
    "starting_price": "$149",
    "icon": "Sticker",
    "benefits": [
      "Vector + raster delivery",
      "Telegram / WhatsApp ready",
      "Print-ready CMYK files"
    ],
    "process": [
      {
        "step": "01",
        "title": "Theme",
        "description": "Define style and theme."
      },
      {
        "step": "02",
        "title": "Sketch",
        "description": "Initial drafts."
      },
      {
        "step": "03",
        "title": "Final",
        "description": "Polish and export."
      }
    ],
    "faqs": [
      {
        "q": "Can I get rush delivery?",
        "a": "Yes — 48-hour rush is available for a 30% surcharge."
      }
    ],
    "order": 5,
    "enabled": true
  },
  {
    "slug": "photo-restoration",
    "name": "Photo Restoration",
    "tagline": "Bring damaged or faded photos back to life.",
    "description": "Hand-restored memories — tears, scratches and color shifts repaired carefully.",
    "starting_price": "$59 per photo",
    "icon": "ImageIcon",
    "benefits": [
      "High-resolution scan input",
      "Hand-corrected color",
      "Print-ready output"
    ],
    "process": [
      {
        "step": "01",
        "title": "Upload",
        "description": "Send us a scan."
      },
      {
        "step": "02",
        "title": "Restore",
        "description": "Repair scratches, fading and color."
      },
      {
        "step": "03",
        "title": "Deliver",
        "description": "Final hi-res image."
      }
    ],
    "faqs": [
      {
        "q": "Is there a quality limit?",
        "a": "We work with anything from low-res scans to studio film negatives."
      }
    ],
    "order": 6,
    "enabled": true
  },
  {
    "slug": "email-signature-design",
    "name": "Email Signature Design",
    "tagline": "Polished signatures for your whole team.",
    "description": "Beautiful, brand-aligned HTML email signatures that render perfectly everywhere.",
    "starting_price": "$99",
    "icon": "Signature",
    "benefits": [
      "Mobile + dark mode tested",
      "Team rollout files",
      "Editable per user"
    ],
    "process": [
      {
        "step": "01",
        "title": "Design",
        "description": "Brand-aligned signature."
      },
      {
        "step": "02",
        "title": "Build",
        "description": "Hand-coded HTML."
      },
      {
        "step": "03",
        "title": "Roll out",
        "description": "Per-user files & docs."
      }
    ],
    "faqs": [
      {
        "q": "Do you support Outlook?",
        "a": "Yes — Outlook 2016+ on Windows and Mac."
      }
    ],
    "order": 7,
    "enabled": true
  }
];
