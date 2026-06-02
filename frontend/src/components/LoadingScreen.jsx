import { LOGO_URL } from "@/components/Logo";

export default function LoadingScreen() {
  return (
    <div
      data-testid="loading-screen"
      className="min-h-screen w-full grid place-items-center bg-background"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-20 w-20">
          <img src={LOGO_URL} alt="ToolForge" className="h-full w-full object-contain animate-pulse" />
        </div>
        <span className="text-sm text-muted-foreground tracking-wide">Loading ToolForge…</span>
      </div>
    </div>
  );
}
