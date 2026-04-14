import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { NAV_ITEMS } from "../../utils/constants";
import { Button } from "../ui/Button";

export function AppShell() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const navItems = isAdmin
    ? [...NAV_ITEMS, { to: "/users", label: "Users" }]
    : NAV_ITEMS;

  function isCurrentRoute(pathname) {
    return pathname === "/" ? location.pathname === "/" : location.pathname.startsWith(pathname);
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="grid min-h-screen bg-white/75 backdrop-blur-xl lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="relative overflow-hidden border-b border-black/10 bg-black px-6 py-8 text-white lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="noise absolute inset-0 opacity-60" />
          <div className="relative z-10 flex h-full flex-col">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/55">Flow Desk</p>
              <h1 className="mt-4 max-w-[10ch] font-display text-6xl uppercase leading-[0.9] tracking-[0.06em]">
                Task Control
              </h1>
              <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
                Minimal task management surface for the FSD assignment, tuned for fast scanning and clean routing.
              </p>
            </div>

            <nav className="mt-10 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-full px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-white text-black"
                        : "text-white/72 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.32em]">
                    {isCurrentRoute(item.to) ? "Open" : "Go"}
                  </span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Signed in</p>
              <p className="mt-3 text-lg font-medium">{user?.username}</p>
              <p className="text-sm text-white/55">{user?.email}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70">
                  {user?.role}
                </span>
                <Button variant="secondary" className="px-4 py-2 text-xs" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 bg-paper/70">
          <div className="page-shell min-h-full px-5 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
