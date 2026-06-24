import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/use-auth";
import { Store, BarChart3, Boxes, Users, Receipt, ShieldCheck, Sun, Moon, Languages, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLang, useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MauzoChap — Modern POS for Tanzanian Businesses" },
      {
        name: "description",
        content:
          "Manage sales, inventory, customers, expenses and reports — built for shops, pharmacies and restaurants.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  const [lang, setLang] = useLang();
  const t = useT();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  if (!loading && user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-background relative">
      <header className="border-b border-border/60 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex w-full items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">
              M
            </div>
            <span className="text-lg font-semibold tracking-tight">MauzoChap</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === "en" ? "sw" : "en")}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              title="Change Language"
            >
              <Languages className="h-4 w-4" />
              <span className="uppercase">{lang}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/auth"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{ background: "var(--gradient-subtle)" }}
          />
          <div className="mx-auto w-full px-6 py-20 lg:py-28 md:px-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-success" /> {t("builtForTanzania")}
                </span>
                <h1 className="mt-6 text-6xl font-bold tracking-tight lg:text-7xl">
                  {t("runShopConfidence")}{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "var(--gradient-primary)" }}
                  >
                    {t("confidence")}
                  </span>
                  .
                </h1>
                <p className="mt-6 max-w-2xl text-xl text-muted-foreground leading-relaxed">
                  {t("landingDescription")}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/auth"
                    className="rounded-lg px-6 py-4 text-base font-medium text-primary-foreground shadow-[var(--shadow-elevated)]"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {t("getStartedFree")}
                  </Link>
                  <a
                    href="#features"
                    className="rounded-lg border border-border bg-card px-6 py-4 text-base font-medium hover:bg-accent"
                  >
                    {t("seeFeatures")}
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-elevated)]">
                <div className="rounded-xl bg-sidebar p-6 text-sidebar-foreground">
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest text-sidebar-foreground/60">
                    <span>Today</span>
                    <span>Live</span>
                  </div>
                  <div className="mt-2 text-4xl font-bold">TZS 1,284,500</div>
                  <div className="mt-1 text-sm text-sidebar-foreground/60">+18% vs yesterday</div>
                  <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                    {[
                      { l: "Orders", v: "47" },
                      { l: "Avg ticket", v: "27,330" },
                      { l: "Low stock", v: "3" },
                    ].map((x) => (
                      <div key={x.l} className="rounded-lg bg-sidebar-accent/60 p-3">
                        <div className="text-xs text-sidebar-foreground/60">{x.l}</div>
                        <div className="mt-1 font-semibold">{x.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full px-6 py-20 md:px-12">
          <h2 className="text-3xl font-bold">Everything your business needs</h2>
          <p className="mt-2 text-muted-foreground">
            Replace notebooks and spreadsheets with one fast, simple system.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Store,
                title: "Lightning POS",
                desc: "Sell in seconds with barcode and search.",
              },
              {
                icon: Boxes,
                title: "Smart inventory",
                desc: "Stock levels, low-stock alerts, movements.",
              },
              {
                icon: Users,
                title: "Customer profiles",
                desc: "Purchase history, credit, loyalty points.",
              },
              {
                icon: Receipt,
                title: "Receipts your way",
                desc: "80mm thermal or A4 PDF receipts.",
              },
              {
                icon: BarChart3,
                title: "Real-time reports",
                desc: "Daily, weekly, monthly performance.",
              },
              {
                icon: ShieldCheck,
                title: "Role-based access",
                desc: "Admin, Manager, Cashier — secure.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <div
                  className="grid h-10 w-10 place-items-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto w-full px-6 text-sm text-muted-foreground md:px-12 flex flex-col md:flex-row items-center justify-between">
          <span>© {new Date().getFullYear()} MauzoChap. Made for African businesses.</span>
        </div>
      </footer>

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/255627274168"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
