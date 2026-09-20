import { useMemo, useState } from "react";
import { html as beautifyHtml, css as beautifyCss, js as beautifyJs } from "js-beautify";
import { format as formatSql } from "sql-formatter";
import { ToolShell, IOArea, ActionBar, CopyBtn, DownloadBtn, ResetBtn } from "@/tools/shared";

// ---------- JSON Formatter ----------
export function JsonFormatter() {
  const [input, setInput] = useState('{"name":"ToolForge","tools":25,"premium":true}');
  const [error, setError] = useState("");
  const formatted = useMemo(() => {
    try {
      const parsed = JSON.parse(input || "null");
      setError("");
      return JSON.stringify(parsed, null, 2);
    } catch (e) { setError(e.message); return ""; }
  }, [input]);
  return (
    <ToolShell>
      <IOArea label="Input JSON" value={input} onChange={setInput} testId="json-input" />
      {error && <p className="mt-2 text-xs text-red-500 font-mono" data-testid="json-error">{error}</p>}
      <IOArea label="Formatted" value={formatted} readOnly testId="json-output" />
      <ActionBar>
        <CopyBtn value={formatted} testId="json-copy" />
        <DownloadBtn filename="formatted.json" value={formatted} mime="application/json" testId="json-download" />
        <button onClick={() => setInput(JSON.stringify(JSON.parse(input || "null")))} className="btn-ghost" data-testid="json-minify">Minify</button>
        <ResetBtn onClick={() => setInput("")} />
      </ActionBar>
    </ToolShell>
  );
}

// ---------- HTML Beautifier ----------
export function HtmlBeautifier() {
  const [input, setInput] = useState('<section><h1>Hello</h1><p>World</p></section>');
  const output = useMemo(() => {
    try { return beautifyHtml(input, { indent_size: 2, wrap_line_length: 0, end_with_newline: true }); }
    catch (e) { return ""; }
  }, [input]);
  return (
    <ToolShell>
      <IOArea label="HTML" value={input} onChange={setInput} testId="html-input" />
      <IOArea label="Beautified" value={output} readOnly testId="html-output" />
      <ActionBar><CopyBtn value={output} /><DownloadBtn filename="output.html" value={output} mime="text/html" /><ResetBtn onClick={() => setInput("")} /></ActionBar>
    </ToolShell>
  );
}

// ---------- CSS Beautifier ----------
export function CssBeautifier() {
  const [input, setInput] = useState('.btn{background:#1E5BFF;color:white;padding:8px 14px;border-radius:12px}');
  const output = useMemo(() => { try { return beautifyCss(input, { indent_size: 2 }); } catch { return ""; } }, [input]);
  return (
    <ToolShell>
      <IOArea label="CSS" value={input} onChange={setInput} testId="css-input" />
      <IOArea label="Beautified" value={output} readOnly testId="css-output" />
      <ActionBar><CopyBtn value={output} /><DownloadBtn filename="styles.css" value={output} mime="text/css" /><ResetBtn onClick={() => setInput("")} /></ActionBar>
    </ToolShell>
  );
}

// ---------- JS Beautifier ----------
export function JsBeautifier() {
  const [input, setInput] = useState('const sum=(a,b)=>{return a+b};console.log(sum(1,2))');
  const output = useMemo(() => { try { return beautifyJs(input, { indent_size: 2, space_in_empty_paren: true }); } catch { return ""; } }, [input]);
  return (
    <ToolShell>
      <IOArea label="JavaScript" value={input} onChange={setInput} testId="js-input" />
      <IOArea label="Beautified" value={output} readOnly testId="js-output" />
      <ActionBar><CopyBtn value={output} /><DownloadBtn filename="script.js" value={output} mime="text/javascript" /><ResetBtn onClick={() => setInput("")} /></ActionBar>
    </ToolShell>
  );
}

// ---------- SQL Formatter ----------
export function SqlFormatter() {
  const [input, setInput] = useState("select id, name, created_at from users where status='active' order by created_at desc limit 10");
  const [dialect, setDialect] = useState("sql");
  const output = useMemo(() => {
    try { return formatSql(input, { language: dialect, tabWidth: 2 }); } catch { return ""; }
  }, [input, dialect]);
  return (
    <ToolShell>
      <div className="flex flex-wrap items-end gap-3 mb-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dialect</span>
          <select value={dialect} onChange={(e) => setDialect(e.target.value)} className="mt-1 h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="sql-dialect">
            {["sql", "postgresql", "mysql", "sqlite", "bigquery", "mariadb"].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
      </div>
      <IOArea label="SQL" value={input} onChange={setInput} testId="sql-input" />
      <IOArea label="Formatted" value={output} readOnly testId="sql-output" />
      <ActionBar><CopyBtn value={output} /><DownloadBtn filename="query.sql" value={output} mime="text/sql" /><ResetBtn onClick={() => setInput("")} /></ActionBar>
    </ToolShell>
  );
}

// ---------- Base64 ----------
export function Base64() {
  const [text, setText] = useState("ToolForge");
  const [mode, setMode] = useState("encode");
  let result = "";
  try {
    result = mode === "encode" ? btoa(unescape(encodeURIComponent(text))) : decodeURIComponent(escape(atob(text || "")));
  } catch (e) { result = "Invalid input"; }
  return (
    <ToolShell>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setMode("encode")} className={`chip ${mode === "encode" ? "chip-active" : ""}`} data-testid="b64-encode">Encode</button>
        <button onClick={() => setMode("decode")} className={`chip ${mode === "decode" ? "chip-active" : ""}`} data-testid="b64-decode">Decode</button>
      </div>
      <IOArea label={mode === "encode" ? "Text" : "Base64"} value={text} onChange={setText} testId="b64-input" />
      <IOArea label={mode === "encode" ? "Base64" : "Text"} value={result} readOnly testId="b64-output" />
      <ActionBar><CopyBtn value={result} /><ResetBtn onClick={() => setText("")} /></ActionBar>
    </ToolShell>
  );
}

// ---------- URL Encode/Decode ----------
export function UrlEncode() {
  const [text, setText] = useState("https://toolforge.io/?q=hello world&lang=fr");
  const [mode, setMode] = useState("encode");
  let result = "";
  try { result = mode === "encode" ? encodeURIComponent(text) : decodeURIComponent(text); } catch { result = "Invalid input"; }
  return (
    <ToolShell>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setMode("encode")} className={`chip ${mode === "encode" ? "chip-active" : ""}`} data-testid="url-encode">Encode</button>
        <button onClick={() => setMode("decode")} className={`chip ${mode === "decode" ? "chip-active" : ""}`} data-testid="url-decode">Decode</button>
      </div>
      <IOArea label="Input" value={text} onChange={setText} testId="url-input" />
      <IOArea label="Output" value={result} readOnly testId="url-output" />
      <ActionBar><CopyBtn value={result} /><ResetBtn onClick={() => setText("")} /></ActionBar>
    </ToolShell>
  );
}

// ---------- JWT Decoder ----------
function decodePart(seg) {
  if (!seg) return "";
  try {
    const b64 = seg.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    return JSON.stringify(JSON.parse(decodeURIComponent(escape(atob(padded)))), null, 2);
  } catch { return "Invalid segment"; }
}
export function JwtDecoder() {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImVtYWlsIjoiZGVtb0B0b29sZm9yZ2UuaW8iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMzYwMH0.demo-signature");
  const parts = token.split(".");
  const header = decodePart(parts[0]);
  const payload = decodePart(parts[1]);
  return (
    <ToolShell>
      <IOArea label="JWT Token" value={token} onChange={setToken} testId="jwt-input" rows={4} />
      <div className="grid md:grid-cols-2 gap-4 mt-2">
        <IOArea label="Header" value={header} readOnly testId="jwt-header" rows={8} />
        <IOArea label="Payload" value={payload} readOnly testId="jwt-payload" rows={8} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Signature is not verified — this tool decodes only. Never paste production tokens.</p>
      <ActionBar><CopyBtn value={payload} label="Copy payload" /></ActionBar>
    </ToolShell>
  );
}

// ---------- Regex Tester ----------
export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Reach us at hello@toolforge.io or sales@toolforge.io");
  let matches = [];
  let error = "";
  try {
    const re = new RegExp(pattern, flags);
    matches = Array.from(text.matchAll(flags.includes("g") ? re : new RegExp(pattern, flags + "g")));
  } catch (e) { error = e.message; }
  return (
    <ToolShell>
      <div className="grid md:grid-cols-[1fr_120px] gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pattern</span>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="regex-pattern" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flags</span>
          <input value={flags} onChange={(e) => setFlags(e.target.value)} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="regex-flags" />
        </label>
      </div>
      <IOArea label="Test string" value={text} onChange={setText} testId="regex-text" />
      {error && <p className="mt-2 text-xs text-red-500 font-mono" data-testid="regex-error">{error}</p>}
      <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-3 text-sm">
        <p className="font-semibold">{matches.length} match{matches.length === 1 ? "" : "es"}</p>
        <ul className="mt-2 space-y-1 font-mono text-xs">
          {matches.slice(0, 50).map((m, i) => <li key={i} data-testid={`regex-match-${i}`}>[{i}] "{m[0]}" @ {m.index}</li>)}
        </ul>
      </div>
    </ToolShell>
  );
}

// ---------- JSON to TypeScript ----------
function jsonToTs(json, rootName = "Root") {
  let counter = 0;
  const interfaces = {};
  const seen = new Map();

  function key(name) {
    const base = name[0].toUpperCase() + name.slice(1).replace(/[^a-zA-Z0-9_]/g, "");
    let candidate = base || `Type${++counter}`;
    while (interfaces[candidate]) {
      candidate = `${base}${++counter}`;
    }
    interfaces[candidate] = true;
    return candidate;
  }

  function typeOf(val, propName) {
    if (val === null) return "null";
    if (Array.isArray(val)) {
      if (val.length === 0) return "any[]";
      const types = new Set(val.map((v) => typeOf(v, propName)));
      return [...types].join(" | ") + "[]";
    }
    if (typeof val === "object") {
      const name = key(propName || "Type");
      buildInterface(name, val);
      return name;
    }
    return typeof val;
  }

  function buildInterface(name, obj) {
    const lines = [`export interface ${name} {`];
    for (const [k, v] of Object.entries(obj)) {
      lines.push(`  ${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`}: ${typeOf(v, k)};`);
    }
    lines.push("}");
    interfaces[name] = lines.join("\n");
  }

  buildInterface(rootName, json);
  return Object.values(interfaces).filter((v) => typeof v === "string").join("\n\n");
}

export function JsonToTypeScript() {
  const [input, setInput] = useState('{"id":1,"name":"ToolForge","tools":[{"slug":"json-formatter","views":420}]}');
  const [name, setName] = useState("Root");
  let output = "";
  try { output = jsonToTs(JSON.parse(input || "null") || {}, name || "Root"); }
  catch (e) { output = `// ${e.message}`; }
  return (
    <ToolShell>
      <label className="block mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Root interface name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full md:w-72 h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="json-ts-name" />
      </label>
      <IOArea label="JSON" value={input} onChange={setInput} testId="json-ts-input" />
      <IOArea label="TypeScript" value={output} readOnly testId="json-ts-output" />
      <ActionBar><CopyBtn value={output} /><DownloadBtn filename="types.ts" value={output} mime="text/typescript" /></ActionBar>
    </ToolShell>
  );
}

// Dispatcher
const REG = {
  JsonFormatter, HtmlBeautifier, CssBeautifier, JsBeautifier, SqlFormatter,
  Base64, UrlEncode, JwtDecoder, RegexTester, JsonToTypeScript,
};

export default function DevDispatcher({ __toolKey }) {
  const C = REG[__toolKey];
  return C ? <C /> : <div>Coming soon.</div>;
}
