import { useMemo, useState } from "react";
import { ToolShell, IOArea, ActionBar, CopyBtn, DownloadBtn, ResetBtn } from "@/tools/shared";

// Case Converter
export function CaseConverter() {
  const [input, setInput] = useState("ToolForge is the modern toolkit.");
  const variants = useMemo(() => ({
    upper: input.toUpperCase(),
    lower: input.toLowerCase(),
    title: input.replace(/\w\S*/g, (s) => s[0].toUpperCase() + s.slice(1).toLowerCase()),
    sentence: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
    camel: input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    snake: input.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, ""),
    kebab: input.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, ""),
    constant: input.trim().toUpperCase().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, ""),
  }), [input]);
  const LABELS = [
    ["UPPERCASE", "upper"], ["lowercase", "lower"], ["Title Case", "title"], ["Sentence case", "sentence"],
    ["camelCase", "camel"], ["snake_case", "snake"], ["kebab-case", "kebab"], ["CONSTANT_CASE", "constant"],
  ];
  return (
    <ToolShell>
      <IOArea label="Input" value={input} onChange={setInput} testId="case-input" mono={false} rows={4} />
      <div className="mt-4 grid md:grid-cols-2 gap-3">
        {LABELS.map(([label, k]) => (
          <div key={k} className="rounded-xl border border-border/60 bg-background p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
              <CopyBtn value={variants[k]} testId={`case-copy-${k}`} label="Copy" />
            </div>
            <p className="mt-1 text-sm font-mono break-words" data-testid={`case-out-${k}`}>{variants[k]}</p>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}

// Word & Character Counter
export function TextCounter() {
  const [text, setText] = useState("");
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || 1 : 0;
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter(Boolean).length : 0;
  const lines = text.trim() ? text.split("\n").length : 0;
  const reading = Math.max(1, Math.ceil(words / 220));
  const stats = [
    ["Characters", chars], ["Characters (no spaces)", charsNoSpace],
    ["Words", words], ["Sentences", sentences],
    ["Paragraphs", paragraphs], ["Lines", lines],
    ["Reading time", `${reading} min`],
  ];
  return (
    <ToolShell>
      <IOArea label="Paste your text" value={text} onChange={setText} testId="counter-input" rows={10} mono={false} />
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(([label, val]) => (
          <div key={label} className="rounded-xl border border-border/60 bg-background p-3 text-center">
            <div className="text-2xl font-extrabold text-gradient" data-testid={`counter-${label.replace(/\s/g, '-').toLowerCase()}`}>{val}</div>
            <div className="text-[10px] mt-1 uppercase tracking-wider text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}

// Duplicate Line Remover
export function DuplicateLineRemover() {
  const [text, setText] = useState("apple\nbanana\napple\ncherry\nbanana");
  const [mode, setMode] = useState("preserve");
  const out = useMemo(() => {
    const lines = text.split("\n");
    if (mode === "preserve") return Array.from(new Set(lines)).join("\n");
    if (mode === "sort") return Array.from(new Set(lines)).sort().join("\n");
    return lines.filter((l, i) => lines.indexOf(l) !== i).join("\n");
  }, [text, mode]);
  return (
    <ToolShell>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setMode("preserve")} className={`chip ${mode === "preserve" ? "chip-active" : ""}`} data-testid="dup-preserve">Dedupe (preserve order)</button>
        <button onClick={() => setMode("sort")} className={`chip ${mode === "sort" ? "chip-active" : ""}`} data-testid="dup-sort">Dedupe & sort</button>
        <button onClick={() => setMode("only")} className={`chip ${mode === "only" ? "chip-active" : ""}`} data-testid="dup-only">Show duplicates only</button>
      </div>
      <IOArea label="Input lines" value={text} onChange={setText} testId="dup-input" />
      <IOArea label="Result" value={out} readOnly testId="dup-output" />
      <ActionBar><CopyBtn value={out} /><ResetBtn onClick={() => setText("")} /></ActionBar>
    </ToolShell>
  );
}

// Text Compare
function diffLines(a, b) {
  const A = a.split("\n"); const B = b.split("\n");
  const max = Math.max(A.length, B.length);
  const rows = [];
  for (let i = 0; i < max; i++) {
    const aL = A[i] ?? ""; const bL = B[i] ?? "";
    rows.push({ a: aL, b: bL, same: aL === bL });
  }
  return rows;
}
export function TextCompare() {
  const [a, setA] = useState("The quick brown fox\njumps over\nthe lazy dog");
  const [b, setB] = useState("The quick brown fox\nleaps over\nthe lazy dog");
  const rows = diffLines(a, b);
  const diffCount = rows.filter((r) => !r.same).length;
  return (
    <ToolShell>
      <div className="grid md:grid-cols-2 gap-3">
        <IOArea label="Text A" value={a} onChange={setA} testId="diff-a" rows={8} />
        <IOArea label="Text B" value={b} onChange={setB} testId="diff-b" rows={8} />
      </div>
      <div className="mt-4 rounded-xl border border-border/60 overflow-hidden font-mono text-xs">
        <div className="grid grid-cols-2 bg-muted/40 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          <div>A · {a.split("\n").length} lines</div>
          <div>B · {b.split("\n").length} lines</div>
        </div>
        <div className="max-h-72 overflow-auto">
          {rows.map((r, i) => (
            <div key={i} className={`grid grid-cols-2 px-3 py-1 border-t border-border/40 ${r.same ? "" : "bg-amber-500/10"}`} data-testid={`diff-row-${i}`}>
              <div className="truncate">{r.a || <span className="opacity-30">—</span>}</div>
              <div className="truncate">{r.b || <span className="opacity-30">—</span>}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{diffCount === 0 ? "Identical." : `${diffCount} differing line(s).`}</p>
    </ToolShell>
  );
}

// Slug Generator
export function SlugGenerator() {
  const [text, setText] = useState("Building a Premium Tools Platform with ToolForge!");
  const slug = text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <ToolShell>
      <IOArea label="Title" value={text} onChange={setText} testId="slug-input" rows={3} mono={false} />
      <div className="mt-3 rounded-xl border border-border/60 bg-background p-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Slug</span>
        <p className="mt-1 text-lg font-mono break-all" data-testid="slug-output">{slug}</p>
      </div>
      <ActionBar><CopyBtn value={slug} /></ActionBar>
    </ToolShell>
  );
}

// Password Generator
export function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [pwd, setPwd] = useState("");
  const generate = () => {
    let chars = "";
    if (upper) chars += "ABCDEFGHJKLMNPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijkmnpqrstuvwxyz";
    if (nums)  chars += "23456789";
    if (syms)  chars += "!@#$%^&*-_=+";
    if (!chars) { setPwd(""); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPwd([...arr].map((n) => chars[n % chars.length]).join(""));
  };
  // initial
  if (!pwd) setTimeout(generate, 0);
  const strength = (() => {
    let s = 0;
    if (length >= 12) s++; if (length >= 16) s++; if (length >= 20) s++;
    if (upper && lower) s++; if (nums) s++; if (syms) s++;
    return Math.min(6, s);
  })();
  return (
    <ToolShell>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Length</span>
              <span className="text-sm font-mono">{length}</span>
            </div>
            <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="mt-2 w-full accent-brand-violet" data-testid="pwd-length" />
          </label>
          {[
            ["Uppercase A–Z", upper, setUpper, "pwd-upper"],
            ["Lowercase a–z", lower, setLower, "pwd-lower"],
            ["Numbers 0–9", nums, setNums, "pwd-nums"],
            ["Symbols !@#$", syms, setSyms, "pwd-syms"],
          ].map(([label, v, set, id]) => (
            <label key={id} className="flex items-center justify-between text-sm">
              <span>{label}</span>
              <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} className="h-4 w-4" data-testid={id} />
            </label>
          ))}
        </div>
        <div className="rounded-xl border border-border/60 bg-background p-5 flex flex-col">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Generated</p>
          <p className="mt-2 text-lg font-mono break-all" data-testid="pwd-output">{pwd}</p>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded ${i < strength ? "bg-gradient-to-r from-brand-blue to-brand-violet" : "bg-muted"}`} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Strength: {["Weak", "Weak", "Fair", "Good", "Strong", "Strong", "Excellent"][strength]}</p>
          <div className="mt-auto pt-4 flex gap-2">
            <button onClick={generate} className="btn-brand flex-1" data-testid="pwd-generate">Generate</button>
            <CopyBtn value={pwd} testId="pwd-copy" />
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

// UUID Generator
function uuidv4() {
  // RFC4122 v4
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState(() => Array.from({ length: 5 }, uuidv4));
  const generate = () => setList(Array.from({ length: Math.min(200, Math.max(1, count)) }, uuidv4));
  const joined = list.join("\n");
  return (
    <ToolShell>
      <div className="flex items-end gap-3 mb-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Count</span>
          <input type="number" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1 w-32 h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="uuid-count" />
        </label>
        <button onClick={generate} className="btn-brand" data-testid="uuid-generate">Generate</button>
      </div>
      <IOArea label="UUIDs" value={joined} readOnly testId="uuid-output" rows={8} />
      <ActionBar><CopyBtn value={joined} /></ActionBar>
    </ToolShell>
  );
}

const REG = { CaseConverter, TextCounter, DuplicateLineRemover, TextCompare, SlugGenerator, PasswordGenerator, UuidGenerator };
export default function TextDispatcher({ __toolKey }) {
  const C = REG[__toolKey];
  return C ? <C /> : <div>Coming soon.</div>;
}
