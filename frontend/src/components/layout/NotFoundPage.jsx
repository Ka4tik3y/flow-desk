import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-paper">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-600">Route Missing</h2>
      <p className="mt-2 text-gray-500 max-w-md">
        The page you requested is outside the configured route tree. Head back to the workspace and continue from a clean path.
      </p>
      <Link to="/" className="mt-6 px-6 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition">
        Go Home
      </Link>
    </div>
  );
}