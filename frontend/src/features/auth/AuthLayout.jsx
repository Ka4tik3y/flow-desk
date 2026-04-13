import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-paper px-4 py-4 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-card lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden bg-black px-8 py-10 text-white md:px-12 md:py-14">
          <div className="noise absolute inset-0 opacity-70" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <Link to="/" className="text-xs uppercase tracking-[0.4em] text-white/55">
                Flow Desk
              </Link>
              <h1 className="mt-8 max-w-[8ch] font-display text-7xl uppercase leading-[0.88] tracking-[0.06em] md:text-8xl">
                Your own task management workspace.
              </h1>
            </div>

            {/* <div className="max-w-md border-t border-white/12 pt-6 text-sm leading-7 text-white/68">
              The frontend is built around clean route boundaries, quiet typography, and a workspace that mirrors the
              task-management API instead of fighting it.
            </div> */}
          </div>
        </section>

        <section className="flex items-center px-6 py-10 md:px-12">
          <div className="w-full">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
