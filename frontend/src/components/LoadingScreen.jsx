import { LOGO_URL } from "@/components/Logo";

/**
 * Premium loading screen with multi-ring orbit animation,
 * subtle grain texture and brand-tinted backdrop.
 */
export default function LoadingScreen() {
  return (
    <div
      data-testid="loading-screen"
      className="min-h-screen w-full grid place-items-center bg-background relative overflow-hidden"
    >
      {/* Ambient gradient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(30,91,255,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 h-[40vmin] w-[40vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,138,76,0.12),transparent_60%)] blur-2xl" />
      </div>

      {/* Grain texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Orbit rings */}
        <div className="relative h-40 w-40 grid place-items-center">
          {/* Outer slow ring */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-primary/15"
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border-t-2 border-primary/70 tf-spin-slow"
          />

          {/* Middle reverse ring */}
          <span
            aria-hidden
            className="absolute inset-4 rounded-full border border-foreground/10"
          />
          <span
            aria-hidden
            className="absolute inset-4 rounded-full border-r-2 border-accent/80 tf-spin-reverse"
          />

          {/* Inner fast dot orbit */}
          <span
            aria-hidden
            className="absolute inset-8 rounded-full border border-foreground/5"
          />
          <span aria-hidden className="absolute inset-8 tf-orbit">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_18px_rgba(30,91,255,0.85)]" />
          </span>

          {/* Center logo with pulse */}
          <div className="relative h-16 w-16 grid place-items-center">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-primary/10 tf-pulse"
            />
            <img
              src={LOGO_URL}
              alt="ToolForge"
              className="relative h-14 w-14 object-contain drop-shadow-[0_4px_20px_rgba(30,91,255,0.35)]"
              draggable={false}
            />
          </div>
        </div>

        {/* Wordmark + dots */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground/80">
            ToolForge
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-foreground/70">
            <span>Forging your toolkit</span>
            <span className="inline-flex gap-1">
              <span className="h-1 w-1 rounded-full bg-foreground/50 tf-dot tf-dot-1" />
              <span className="h-1 w-1 rounded-full bg-foreground/50 tf-dot tf-dot-2" />
              <span className="h-1 w-1 rounded-full bg-foreground/50 tf-dot tf-dot-3" />
            </span>
          </span>
        </div>
      </div>

      {/* Scoped animations */}
      <style>{`
        @keyframes tf-spin-slow { to { transform: rotate(360deg); } }
        @keyframes tf-spin-reverse { to { transform: rotate(-360deg); } }
        @keyframes tf-orbit-spin { to { transform: rotate(360deg); } }
        @keyframes tf-pulse-anim {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.15); }
        }
        @keyframes tf-dot-blink {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
        .tf-spin-slow { animation: tf-spin-slow 3.2s linear infinite; }
        .tf-spin-reverse { animation: tf-spin-reverse 2.2s linear infinite; }
        .tf-orbit { animation: tf-orbit-spin 1.6s linear infinite; }
        .tf-pulse { animation: tf-pulse-anim 1.8s ease-in-out infinite; }
        .tf-dot { animation: tf-dot-blink 1.4s ease-in-out infinite; }
        .tf-dot-1 { animation-delay: 0s; }
        .tf-dot-2 { animation-delay: 0.18s; }
        .tf-dot-3 { animation-delay: 0.36s; }
      `}</style>
    </div>
  );
}
