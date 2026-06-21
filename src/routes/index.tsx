import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/use-auth";
import { Store, BarChart3, Boxes, Users, Receipt, ShieldCheck } from "lucide-react";

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
  if (!loading && user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">
              M
            </div>
            <span className="text-lg font-semibold tracking-tight">MauzoChap</span>
          </div>
          <Link
            to="/auth"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{ background: "var(--gradient-subtle)" }}
          />
          <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Built for Tanzania
                </span>
                <h1 className="mt-5 text-5xl font-bold tracking-tight lg:text-6xl">
                  Run your shop with{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "var(--gradient-primary)" }}
                  >
                    confidence
                  </span>
                  .
                </h1>
                <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                  MauzoChap is the modern point of sale and business management platform for
                  retail, pharmacies, restaurants, and wholesalers — sales, inventory, customers
                  and reports in one place.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/auth"
                    className="rounded-lg px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elevated)]"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Get started — free
                  </Link>
                  <a
                    href="#features"
                    className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-accent"
                  >
                    See features
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
                  <div className="mt-1 text-sm text-sidebar-foreground/60">
                    +18% vs yesterday
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                    {[
                      { l: "Orders", v: "47" },
                      { l: "Avg ticket", v: "27,330" },
                      { l: "Low stock", v: "3" },
                    ].map((x) => (
                      <div
                        key={x.l}
                        className="rounded-lg bg-sidebar-accent/60 p-3"
                      >
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

        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold">Everything your business needs</h2>
          <p className="mt-2 text-muted-foreground">
            Replace notebooks and spreadsheets with one fast, simple system.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Store, title: "Lightning POS", desc: "Sell in seconds with barcode and search." },
              { icon: Boxes, title: "Smart inventory", desc: "Stock levels, low-stock alerts, movements." },
              { icon: Users, title: "Customer profiles", desc: "Purchase history, credit, loyalty points." },
              { icon: Receipt, title: "Receipts your way", desc: "80mm thermal or A4 PDF receipts." },
              { icon: BarChart3, title: "Real-time reports", desc: "Daily, weekly, monthly performance." },
              { icon: ShieldCheck, title: "Role-based access", desc: "Admin, Manager, Cashier — secure." },
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
        <div className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} MauzoChap. Made for African businesses.
        </div>
      </footer>
    </div>
  );
}
