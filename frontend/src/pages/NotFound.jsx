import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function NotFound() {
  return (
    <div className="container py-32 text-center" data-testid="not-found">
      <Seo
        title="Page Not Found — ToolForge"
        description="This page doesn't exist. Head back to the ToolForge homepage or browse all tools."
        path="/404"
      />
      <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Error 404</p>
      <h1 className="mt-2 text-5xl md:text-7xl font-bold tracking-tight font-heading">
        <span className="text-gradient italic">Page</span> not found.
      </h1>
      <p className="mt-3 text-muted-foreground">This page doesn't exist or may have moved.</p>
      <Link to="/" className="btn-brand mt-6 inline-flex" data-testid="not-found-home">Go home</Link>
    </div>
  );
}
