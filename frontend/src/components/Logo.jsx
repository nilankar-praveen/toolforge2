import { Link } from "react-router-dom";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_87f717b2-6172-4fd1-b99d-f8ddd2327003/artifacts/rdgevvlw_ToolForge.png";

export default function Logo({ size = 36, withText = true, className = "" }) {
  return (
    <Link
      to="/"
      data-testid="logo-link"
      className={`inline-flex items-center gap-2 group ${className}`}
    >
      <span
        className="relative inline-flex items-center justify-center rounded-xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img
          src={LOGO_URL}
          alt="ToolForge"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </span>
      {withText && (
        <span className="font-heading text-lg font-extrabold tracking-tight">
          <span className="text-foreground">Tool</span>
          <span className="text-gradient">Forge</span>
        </span>
      )}
    </Link>
  );
}

export { LOGO_URL };
