import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/lib/use-auth";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Sign in — MauzoChap" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  const [inviteBusinessName, setInviteBusinessName] = useState<string | null>(null);

  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const inviteId = params.get("invite");
  const inviteRole = params.get("role") || "cashier";
  const inviteBranch = params.get("branch") || "";

  useEffect(() => {
    if (inviteId) {
      setMode("signup");
      supabase.rpc("get_business_name", { _business_id: inviteId })
        .then(({ data, error }) => {
          if (!error && data) {
            setInviteBusinessName(data as string);
          }
        });
    }
  }, [inviteId]);

  if (user) {
    navigate({ to: "/dashboard" });
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/update-password",
        });
        if (error) throw error;
        toast.success("Password reset email sent! Check your inbox.");
        setMode("signin");
        return;
      } else if (mode === "signup") {
        const signUpData: Record<string, string> = {
          full_name: fullName,
        };
        if (inviteId) {
          signUpData.business_id = inviteId;
          signUpData.role = inviteRole;
          if (inviteBranch) {
            signUpData.branch_id = inviteBranch;
          }
        } else {
          signUpData.business_name = businessName;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: signUpData,
          },
        });
        if (error) throw error;
        toast.success("Account created");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(error.message ?? "Google sign-in failed");
      setLoading(false);
      return;
    }
    // Supabase redirects the browser, so we don't necessarily need to navigate here
  };

  return (
    <div
      className="grid min-h-screen lg:grid-cols-2"
      style={{ background: "var(--gradient-subtle)" }}
    >
      <div
        className="hidden lg:flex flex-col justify-between p-12 text-sidebar-foreground"
        style={{ background: "var(--sidebar)" }}
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src={logo} alt="MauzoChap" className="h-12 w-auto" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Sell faster.
            <br />
            Grow smarter.
          </h2>
          <p className="mt-3 max-w-sm text-sidebar-foreground/70">
            POS, inventory, customers, expenses and reports — designed for the way Tanzanian
            businesses work.
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/50">© MauzoChap</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
            <img src={logo} alt="MauzoChap" className="h-10 w-auto" />
          </Link>
          <h1 className="text-2xl font-bold">
            {mode === "signin" ? t("signIn") : mode === "signup" ? (inviteId && inviteBusinessName ? "Join Store" : t("signUp")) : "Reset Password"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Welcome back, please sign in."
              : mode === "signup"
                ? (inviteId && inviteBusinessName 
                    ? `You've been invited to join ${inviteBusinessName} as a ${inviteRole}.` 
                    : "Start running your business in minutes.")
                : "Enter your email to receive a password reset link."}
          </p>


          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <>
                <div>
                  <Label htmlFor="full">{t("fullName")}</Label>
                  <Input
                    id="full"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                {!inviteId && (
                  <div>
                    <Label htmlFor="biz">{t("businessName")}</Label>
                    <Input
                      id="biz"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {mode !== "reset" && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : mode === "signin" ? t("signIn") : mode === "signup" ? t("signUp") : "Send Reset Link"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "No account?" : mode === "signup" ? "Have an account?" : "Remember your password?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "signup" ? t("signIn") : mode === "reset" ? "Back to Sign In" : t("signUp")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
