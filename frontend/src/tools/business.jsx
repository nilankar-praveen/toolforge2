import { useState } from "react";
import { ToolShell } from "@/tools/shared";

const fmt = (n) => Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";

// GST Calculator
export function GstCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState("exclusive");
  let net, tax, gross;
  if (mode === "exclusive") {
    net = Number(amount); tax = net * (rate / 100); gross = net + tax;
  } else {
    gross = Number(amount); net = gross / (1 + rate / 100); tax = gross - net;
  }
  return (
    <ToolShell>
      <div className="grid md:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</span>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="gst-amount" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rate %</span>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="gst-rate" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mode</span>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm" data-testid="gst-mode">
            <option value="exclusive">Exclusive (add tax)</option>
            <option value="inclusive">Inclusive (extract tax)</option>
          </select>
        </label>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <ResultStat label="Net" value={fmt(net)} testId="gst-net" />
        <ResultStat label="GST" value={fmt(tax)} testId="gst-tax" />
        <ResultStat label="Gross" value={fmt(gross)} testId="gst-gross" />
      </div>
    </ToolShell>
  );
}

function ResultStat({ label, value, testId }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-4 text-center">
      <div className="text-2xl font-extrabold text-gradient" data-testid={testId}>{value}</div>
      <div className="text-[10px] mt-1 uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

// EMI Calculator
export function EmiCalculator() {
  const [P, setP] = useState(1000000);
  const [R, setR] = useState(8.5);
  const [N, setN] = useState(20);
  const r = R / 12 / 100;
  const n = N * 12;
  const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - P;
  return (
    <ToolShell>
      <div className="grid md:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Principal</span>
          <input type="number" value={P} onChange={(e) => setP(Number(e.target.value))} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="emi-principal" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Annual Rate %</span>
          <input type="number" step="0.1" value={R} onChange={(e) => setR(Number(e.target.value))} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="emi-rate" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tenure (years)</span>
          <input type="number" value={N} onChange={(e) => setN(Number(e.target.value))} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="emi-tenure" />
        </label>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <ResultStat label="Monthly EMI" value={fmt(emi)} testId="emi-monthly" />
        <ResultStat label="Total Interest" value={fmt(interest)} testId="emi-interest" />
        <ResultStat label="Total Payment" value={fmt(total)} testId="emi-total" />
      </div>
    </ToolShell>
  );
}

// Percentage Calculator
export function PercentageCalculator() {
  const [a, setA] = useState(50);
  const [b, setB] = useState(200);
  const pctOf = (a / 100) * b; // a% of b
  const whatPct = (a / b) * 100; // a is what% of b
  const change = ((b - a) / a) * 100; // change from a to b
  return (
    <ToolShell>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Value A</span>
          <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="pct-a" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Value B</span>
          <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="pct-b" />
        </label>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <ResultStat label="A% of B" value={fmt(pctOf)} testId="pct-of" />
        <ResultStat label="A is X% of B" value={`${fmt(whatPct)}%`} testId="pct-what" />
        <ResultStat label="Change A → B" value={`${fmt(change)}%`} testId="pct-change" />
      </div>
    </ToolShell>
  );
}

// Profit Calculator
export function ProfitCalculator() {
  const [cost, setCost] = useState(80);
  const [price, setPrice] = useState(120);
  const profit = price - cost;
  const margin = (profit / price) * 100;
  const markup = (profit / cost) * 100;
  return (
    <ToolShell>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost</span>
          <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="profit-cost" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selling Price</span>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full h-10 rounded-lg border border-border/70 bg-background px-3 text-sm font-mono" data-testid="profit-price" />
        </label>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <ResultStat label="Profit" value={fmt(profit)} testId="profit-amount" />
        <ResultStat label="Margin" value={`${fmt(margin)}%`} testId="profit-margin" />
        <ResultStat label="Markup" value={`${fmt(markup)}%`} testId="profit-markup" />
      </div>
    </ToolShell>
  );
}

const REG = { GstCalculator, EmiCalculator, PercentageCalculator, ProfitCalculator };
export default function BusinessDispatcher({ __toolKey }) {
  const C = REG[__toolKey];
  return C ? <C /> : <div className="rounded-2xl border border-dashed border-border/70 p-10 text-center text-muted-foreground">Coming soon.</div>;
}
