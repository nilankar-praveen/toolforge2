import { useState } from "react";
import { Copy, Check, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function copyText(text) {
  navigator.clipboard.writeText(text).then(
    () => toast.success("Copied to clipboard"),
    () => toast.error("Copy failed")
  );
}

export function downloadText(filename, content, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ToolShell({ children, side }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 md:p-7 shadow-soft">
      <div className={side ? "grid lg:grid-cols-[1fr_280px] gap-6" : ""}>
        <div>{children}</div>
        {side && <div>{side}</div>}
      </div>
    </div>
  );
}

export function IOArea({
  label, value, onChange, placeholder, readOnly, rows = 10, testId, mono = true,
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <textarea
        data-testid={testId}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
        className={`mt-2 w-full rounded-xl border border-border/70 bg-background p-3 text-sm leading-relaxed outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}

export function ActionBar({ children }) {
  return <div className="mt-4 flex flex-wrap gap-2">{children}</div>;
}

export function CopyBtn({ value, testId = "copy-btn", label = "Copy" }) {
  const [done, setDone] = useState(false);
  const onClick = () => {
    copyText(value);
    setDone(true); setTimeout(() => setDone(false), 1200);
  };
  return (
    <button onClick={onClick} className="btn-ghost" data-testid={testId}>
      {done ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />} {label}
    </button>
  );
}

export function DownloadBtn({ filename, value, mime, testId = "download-btn" }) {
  return (
    <button onClick={() => downloadText(filename, value, mime)} className="btn-ghost" data-testid={testId}>
      <Download className="h-4 w-4" /> Download
    </button>
  );
}

export function ResetBtn({ onClick, testId = "reset-btn" }) {
  return (
    <button onClick={onClick} className="btn-ghost" data-testid={testId}>
      <RotateCcw className="h-4 w-4" /> Reset
    </button>
  );
}
