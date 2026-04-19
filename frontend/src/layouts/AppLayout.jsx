import { NavLink, Outlet } from "react-router-dom";
import { CarFront, Clock3, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/history", label: "Alert History", icon: Clock3 },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const online = useNetworkStatus();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-white/10 bg-slate-950/70 p-6 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-flare/15 p-3 text-flare">
            <CarFront />
          </div>
          <div>
            <p className="font-display text-xl">CrashGuard</p>
            <p className="text-sm text-slate-400">Vehicle accident alert ops</p>
          </div>
        </div>
        <div className="mt-6">
          <StatusBadge label={online ? "System online" : "Offline mode"} tone={online ? "online" : "offline"} />
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${
                    isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-10 panel p-4">
          <p className="text-sm text-slate-400">Signed in as</p>
          <p className="mt-1 font-medium text-slate-100">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <button className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm" onClick={logout} type="button">
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
