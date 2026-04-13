import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-xl rounded-[2rem] border border-black/10 bg-white/90 p-10 text-center shadow-card">
        <p className="text-xs uppercase tracking-[0.32em] text-black/45">404</p>
        <h1 className="mt-3 font-display text-7xl uppercase leading-none tracking-[0.04em]">Route Missing</h1>
        <p className="mt-4 text-sm leading-6 text-black/60">
          The page you requested is outside the configured route tree. Head back to the workspace and continue from a clean path.
        </p>
        <Link to="/" className="mt-8 inline-flex">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
