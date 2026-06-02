import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { ToolShell, ActionBar, CopyBtn } from "@/tools/shared";
import { toast } from "sonner";

export function QrCodeGenerator() {
  const [text, setText] = useState("https://toolforge.io");
  const [size, setSize] = useState(280);
  const [margin, setMargin] = useState(2);
  const [fg, setFg] = useState("#0B1437");
  const [bg, setBg] = useState("#FFFFFF");
  const [dataUrl, setDataUrl] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!text) { setDataUrl(""); return; }
    QRCode.toDataURL(text, { width: size, margin, color: { dark: fg, light: bg } })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, text, { width: size, margin, color: { dark: fg, light: bg } });
    }
  }, [text, size, margin, fg, bg]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl; a.download = "qr-code.png"; a.click();
    toast.success("Downloaded");
  };

  return (
    <ToolShell>
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Text or URL</span>
            <textarea data-testid="qr-input" value={text} onChange={(e) => setText(e.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-border/70 bg-background p-3 text-sm font-mono outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Size (px)</span>
              <input type="number" value={size} min={64} max={1024} onChange={(e) => setSize(Number(e.target.value))} className="mt-2 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="qr-size" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Margin</span>
              <input type="number" value={margin} min={0} max={10} onChange={(e) => setMargin(Number(e.target.value))} className="mt-2 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="qr-margin" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Foreground</span>
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="mt-2 h-10 w-full rounded-lg border border-border/70 bg-background" data-testid="qr-fg" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Background</span>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="mt-2 h-10 w-full rounded-lg border border-border/70 bg-background" data-testid="qr-bg" />
            </label>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background p-6 flex flex-col items-center">
          <canvas ref={canvasRef} className="rounded-xl" />
          <ActionBar>
            <button onClick={download} className="btn-brand" data-testid="qr-download">Download PNG</button>
            {dataUrl && <CopyBtn value={dataUrl} label="Copy data URL" testId="qr-copy" />}
          </ActionBar>
        </div>
      </div>
    </ToolShell>
  );
}

const REG = { QrCodeGenerator };
export default function CreativeDispatcher({ __toolKey }) {
  const C = REG[__toolKey];
  return C ? <C /> : <div className="rounded-2xl border border-dashed border-border/70 p-10 text-center text-muted-foreground">Coming soon.</div>;
}
