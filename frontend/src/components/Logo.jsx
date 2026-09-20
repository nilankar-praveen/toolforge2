import { Link } from "react-router-dom";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_forge-next-3/artifacts/bugix8ks_ToolForge.png";

export const FAVICON_URL =
  "https://customer-assets.emergentagent.com/job_forge-next-3/artifacts/4bebn3po_fav.png";

export default function Logo({ height = 40, className = "" }) {
  return (
    <Link
      to="/"
      data-testid="logo-link"
      className={`relative inline-flex items-center justify-center group ${className}`}
    >
      <img
        src={LOGO_URL}
        alt="ToolForge"
        style={{ height }}
        className="w-auto object-contain"
        draggable={false}
      />
    </Link>
  );
}

export { LOGO_URL };
