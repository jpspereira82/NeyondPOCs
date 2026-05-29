import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import {
  Home,
  Activity,
  BarChart3,
  Gift,
  User,
  LogOut,
  Bell,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import Avatar from "./ui/Avatar";
import clsx from "clsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { to: "/feed", label: "Good Vibes", icon: Home },
    { to: "/pulse", label: "Pulse Check-in", icon: Activity },
    { to: "/analytics", label: "Analytics", icon: BarChart3, adminOnly: true },
    { to: "/rewards", label: "Recompensas", icon: Gift },
    { to: "/profile", label: "Perfil", icon: User }
  ].filter((i) => !i.adminOnly || user.role === "ADMIN");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Vybe</span>
          </div>
          <button
            className="lg:hidden p-1 hover:bg-slate-100 rounded"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={user.name} color={user.avatarColor} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role === "ADMIN" ? "Administrador" : "Membro"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Terminar sessão
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <button
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs text-slate-500">Neyond · Workspace</p>
            <p className="text-sm font-semibold text-slate-700">{user.department}</p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "MEMBER" && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                {user.points} pts
              </div>
            )}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-all">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <Avatar name={user.name} color={user.avatarColor} size="sm" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}