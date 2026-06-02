import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container py-32 text-center" data-testid="not-found">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-violet font-bold">Error 404</p>
      <h1 className="mt-2 text-5xl md:text-7xl font-extrabold tracking-tight"><span className="text-gradient">Lost</span> in the forge.</h1>
      <p className="mt-3 text-muted-foreground">The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/" className="btn-brand mt-6 inline-flex" data-testid="not-found-home">Go home</Link>
    </div>
  );
}
