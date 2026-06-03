import { LOGO_URL } from "@/components/Logo";

/**
 * Forge-themed loading screen.
 * - Glowing anvil silhouette with ember sparks shooting up
 * - Animated SVG hammer striking on rhythm
 * - Brand color palette + grain + radial heat glow
 */
export default function LoadingScreen() {
  // 18 sparks with deterministic random offsets
  const sparks = Array.from({ length: 18 }, (_, i) => ({
    left: 30 + ((i * 37) % 60),
    delay: (i * 0.13) % 1.8,
    duration: 1.4 + ((i * 0.21) % 1.2),
    size: 1 + (i % 3) * 0.6,
  }));

  return (
    <div
      data-testid="loading-screen"
      className="min-h-screen w-full grid place-items-center bg-background relative overflow-hidden"
    >
      {/* Heat glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 h-[55vmin] w-[55vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,138,76,0.22),transparent_60%)] blur-3xl tf-glow" />
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 h-[40vmin] w-[40vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(30,91,255,0.16),transparent_60%)] blur-2xl" />
      </div>

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative flex flex-col items-center gap-7">
        {/* Forge composition */}
        <div className="relative h-44 w-56">
          {/* Sparks */}
          <div className="absolute inset-x-0 bottom-14 top-0">
            {sparks.map((s, i) => (
              <span
                key={i}
                className="absolute bottom-0 rounded-full bg-accent shadow-[0_0_8px_rgba(255,138,76,0.9)] tf-spark"
                style={{
                  left: `${s.left}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                }}
              />
            ))}
          </div>

          {/* Anvil silhouette (SVG) */}
          <svg
            viewBox="0 0 240 110"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 text-foreground/85 drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            fill="currentColor"
            aria-hidden
          >
            {/* glowing top edge */}
            <rect x="20" y="14" width="200" height="14" rx="3" className="text-primary" fill="currentColor" />
            {/* horn */}
            <path d="M0,28 Q 10,18 36,22 L 36,40 L 0,40 Z" />
            {/* body */}
            <rect x="36" y="28" width="168" height="22" />
            {/* tapered neck */}
            <path d="M70,50 L 170,50 L 158,70 L 82,70 Z" />
            {/* base */}
            <rect x="60" y="70" width="120" height="14" rx="2" />
            <rect x="44" y="84" width="152" height="14" rx="3" />
          </svg>

          {/* Hammer */}
          <svg
            viewBox="0 0 60 80"
            className="absolute left-1/2 -translate-x-[60%] bottom-[42%] w-10 text-foreground/90 origin-bottom-right tf-hammer"
            aria-hidden
          >
            {/* handle */}
            <rect x="22" y="14" width="6" height="62" rx="2" fill="#7a5538" />
            {/* head */}
            <rect x="6" y="2" width="38" height="18" rx="2" fill="currentColor" />
            <rect x="6" y="2" width="38" height="4" rx="2" fill="#3b3b3b" />
          </svg>

          {/* Impact flash */}
          <span className="absolute left-1/2 -translate-x-1/2 bottom-[36%] h-6 w-24 rounded-full bg-primary/60 blur-md tf-flash" />
        </div>

        {/* Wordmark */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={LOGO_URL}
            alt="ToolForge"
            className="h-9 w-auto object-contain drop-shadow-[0_2px_10px_rgba(30,91,255,0.35)]"
            draggable={false}
          />
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-muted-foreground/80">
            <span className="inline-block h-px w-6 bg-foreground/20" />
            Forging your toolkit
            <span className="inline-block h-px w-6 bg-foreground/20" />
          </span>
        </div>
      </div>

      <style>{`
        @keyframes tf-hammer-strike {
          0%   { transform: rotate(-58deg) translateY(-2px); }
          45%  { transform: rotate(-58deg); }
          55%  { transform: rotate(12deg); }
          70%  { transform: rotate(-2deg); }
          100% { transform: rotate(-58deg); }
        }
        @keyframes tf-spark-fly {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateY(-130px) scale(0.4); opacity: 0; }
        }
        @keyframes tf-flash-anim {
          0%, 45%, 100% { opacity: 0; transform: translateX(-50%) scaleX(0.6); }
          55%, 70%      { opacity: 1; transform: translateX(-50%) scaleX(1); }
        }
        @keyframes tf-glow-anim {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 1; }
        }
        .tf-hammer { animation: tf-hammer-strike 1.4s cubic-bezier(.5,.05,.3,1) infinite; }
        .tf-spark  { animation: tf-spark-fly 1.6s ease-out infinite; }
        .tf-flash  { animation: tf-flash-anim 1.4s linear infinite; }
        .tf-glow   { animation: tf-glow-anim 1.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
