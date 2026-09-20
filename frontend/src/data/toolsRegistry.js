// Static tools registry — maps slugs to React components.
// Backend seeds names/descriptions/categories; this file maps each slug → tool implementation.
import { lazy } from "react";

const Dev = lazy(() => import("@/tools/dev"));
const Text = lazy(() => import("@/tools/text"));
const Creative = lazy(() => import("@/tools/creative"));
const Marketing = lazy(() => import("@/tools/marketing"));
const Business = lazy(() => import("@/tools/business"));

// Slug → { module loader, exportName }
export const TOOL_COMPONENTS = {
  "json-formatter": { Loader: Dev, key: "JsonFormatter" },
  "html-beautifier": { Loader: Dev, key: "HtmlBeautifier" },
  "css-beautifier": { Loader: Dev, key: "CssBeautifier" },
  "js-beautifier": { Loader: Dev, key: "JsBeautifier" },
  "sql-formatter": { Loader: Dev, key: "SqlFormatter" },
  "base64": { Loader: Dev, key: "Base64" },
  "url-encode": { Loader: Dev, key: "UrlEncode" },
  "jwt-decoder": { Loader: Dev, key: "JwtDecoder" },
  "regex-tester": { Loader: Dev, key: "RegexTester" },
  "json-to-typescript": { Loader: Dev, key: "JsonToTypeScript" },

  "case-converter": { Loader: Text, key: "CaseConverter" },
  "text-counter": { Loader: Text, key: "TextCounter" },
  "duplicate-line-remover": { Loader: Text, key: "DuplicateLineRemover" },
  "text-compare": { Loader: Text, key: "TextCompare" },
  "slug-generator": { Loader: Text, key: "SlugGenerator" },
  "password-generator": { Loader: Text, key: "PasswordGenerator" },
  "uuid-generator": { Loader: Text, key: "UuidGenerator" },

  "qr-code-generator": { Loader: Creative, key: "QrCodeGenerator" },

  "meta-tag-generator": { Loader: Marketing, key: "MetaTagGenerator" },
  "utm-builder": { Loader: Marketing, key: "UtmBuilder" },
  "robots-txt-generator": { Loader: Marketing, key: "RobotsTxtGenerator" },

  "gst-calculator": { Loader: Business, key: "GstCalculator" },
  "emi-calculator": { Loader: Business, key: "EmiCalculator" },
  "percentage-calculator": { Loader: Business, key: "PercentageCalculator" },
  "profit-calculator": { Loader: Business, key: "ProfitCalculator" },
};

// Light static metadata for quick searches (command palette).
// Real data is loaded from backend in pages.
export const TOOLS_REGISTRY = [
  { slug: "json-formatter", name: "JSON Formatter & Validator", category: "developer" },
  { slug: "html-beautifier", name: "HTML Beautifier", category: "developer" },
  { slug: "css-beautifier", name: "CSS Beautifier", category: "developer" },
  { slug: "js-beautifier", name: "JavaScript Beautifier", category: "developer" },
  { slug: "sql-formatter", name: "SQL Formatter", category: "developer" },
  { slug: "base64", name: "Base64 Encode / Decode", category: "developer" },
  { slug: "url-encode", name: "URL Encode / Decode", category: "developer" },
  { slug: "jwt-decoder", name: "JWT Decoder", category: "developer" },
  { slug: "regex-tester", name: "Regex Tester", category: "developer" },
  { slug: "json-to-typescript", name: "JSON to TypeScript", category: "developer" },
  { slug: "case-converter", name: "Case Converter", category: "text" },
  { slug: "text-counter", name: "Word & Character Counter", category: "text" },
  { slug: "duplicate-line-remover", name: "Duplicate Line Remover", category: "text" },
  { slug: "text-compare", name: "Text Compare (Diff)", category: "text" },
  { slug: "slug-generator", name: "Slug Generator", category: "text" },
  { slug: "password-generator", name: "Password Generator", category: "text" },
  { slug: "uuid-generator", name: "UUID Generator", category: "text" },
  { slug: "qr-code-generator", name: "QR Code Generator", category: "creative" },
  { slug: "meta-tag-generator", name: "Meta Tag Generator", category: "marketing" },
  { slug: "utm-builder", name: "UTM Builder", category: "marketing" },
  { slug: "robots-txt-generator", name: "Robots.txt Generator", category: "marketing" },
  { slug: "gst-calculator", name: "GST Calculator", category: "business" },
  { slug: "emi-calculator", name: "EMI Calculator", category: "business" },
  { slug: "percentage-calculator", name: "Percentage Calculator", category: "business" },
  { slug: "profit-calculator", name: "Profit Margin Calculator", category: "business" },
];
