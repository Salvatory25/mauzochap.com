import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Users,
  Receipt,
  BarChart3,
  LogOut,
  Languages,
  Wallet,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { useLang, useT } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";

export function AppShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  const [lang, setLang] = useLang();
  const { user, roles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const nav = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("dashboard") },
    { to: "/pos", icon: ShoppingCart, label: t("pos") },
    { to: "/products", icon: Boxes, label: t("products") },
    { to: "/sales", icon: Receipt, label: t("sales") },
    { to: "/customers", icon: Users, label: t("customers") },
    { to: "/expenses", icon: Wallet, label: t("expenses") },
    { to: "/reports", icon: BarChart3, label: t("reports") },
  ];

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="px-6 py-5 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">
              M
            </div>
            <span className="text-lg font-semibold">MauzoChap</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4 space-y-3">
          <div className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</div>
          <div className="flex flex-wrap gap-1">
            {roles.map((r) => (
              <span key={r} className="rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] uppercase tracking-wider">
                {r}
              </span>
            ))}
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "sw" : "en")}
            className="flex w-full items-center gap-2 rounded-md border border-sidebar-border px-3 py-2 text-sm hover:bg-sidebar-accent/50"
          >
            <Languages className="h-4 w-4" />
            {lang === "en" ? "English" : "Kiswahili"}
            <span className="ml-auto text-xs text-sidebar-foreground/50">↔</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between bg-sidebar text-sidebar-foreground px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground font-bold text-sm">M</div>
          <span className="font-semibold">MauzoChap</span>
        </Link>
        <button onClick={() => setLang(lang === "en" ? "sw" : "en")} className="text-xs uppercase tracking-wider">
          {lang}
        </button>
      </div>

      <main className="flex-1 lg:ml-0 pt-14 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 grid grid-cols-5 gap-1 border-t border-border bg-card p-2 z-40">
          {nav.slice(0, 5).map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-0.5 py-1 text-[10px] rounded-md ${active ? "text-primary" : "text-muted-foreground"}`}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="lg:hidden h-16" />
      </main>
    </div>
  );
}
