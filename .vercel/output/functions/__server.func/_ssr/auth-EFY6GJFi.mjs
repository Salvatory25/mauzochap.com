import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { n as Label, t as Input } from "./label-Cdxd-27C.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-EFY6GJFi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const t = useT();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [businessName, setBusinessName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [inviteBusinessName, setInviteBusinessName] = (0, import_react.useState)(null);
	const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
	const inviteId = params.get("invite");
	const inviteRole = params.get("role") || "cashier";
	(0, import_react.useEffect)(() => {
		if (inviteId) {
			setMode("signup");
			supabase.rpc("get_business_name", { _business_id: inviteId }).then(({ data, error }) => {
				if (!error && data) setInviteBusinessName(data);
			});
		}
	}, [inviteId]);
	if (user) navigate({ to: "/dashboard" });
	const handleEmail = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (mode === "reset") {
				const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/update-password" });
				if (error) throw error;
				toast.success("Password reset email sent! Check your inbox.");
				setMode("signin");
				return;
			} else if (mode === "signup") {
				const signUpData = { full_name: fullName };
				if (inviteId) {
					signUpData.business_id = inviteId;
					signUpData.role = inviteRole;
				} else signUpData.business_name = businessName;
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: signUpData
					}
				});
				if (error) throw error;
				toast.success("Account created");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error(err.message ?? "Auth failed");
		} finally {
			setLoading(false);
		}
	};
	const handleGoogle = async () => {
		setLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin }
		});
		if (error) {
			toast.error(error.message ?? "Google sign-in failed");
			setLoading(false);
			return;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		style: { background: "var(--gradient-subtle)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden lg:flex flex-col justify-between p-12 text-sidebar-foreground",
			style: { background: "var(--sidebar)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold",
						children: "M"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-semibold",
						children: "MauzoChap"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-3xl font-bold leading-tight",
					children: [
						"Sell faster.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Grow smarter."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-sm text-sidebar-foreground/70",
					children: "POS, inventory, customers, expenses and reports — designed for the way Tanzanian businesses work."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-sidebar-foreground/50",
					children: "© MauzoChap"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "lg:hidden flex items-center gap-2 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold",
							children: "M"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-semibold",
							children: "MauzoChap"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: mode === "signin" ? t("signIn") : mode === "signup" ? inviteId && inviteBusinessName ? "Join Store" : t("signUp") : "Reset Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: mode === "signin" ? "Welcome back, please sign in." : mode === "signup" ? inviteId && inviteBusinessName ? `You've been invited to join ${inviteBusinessName} as a ${inviteRole}.` : "Start running your business in minutes." : "Enter your email to receive a password reset link."
					}),
					mode !== "reset" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleGoogle,
						disabled: loading,
						className: "mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "h-4 w-4",
							viewBox: "0 0 24 24",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#4285F4",
									d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#34A853",
									d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#FBBC05",
									d: "M5.84 14.1A6.96 6.96 0 0 1 5.47 12c0-.73.13-1.44.37-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.83z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#EA4335",
									d: "M12 5.38c1.62 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.1 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
								})
							]
						}), t("continueWithGoogle")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
							" OR ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleEmail,
						className: "space-y-3",
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "full",
								children: t("fullName")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "full",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								required: true
							})] }), !inviteId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "biz",
								children: t("businessName")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "biz",
								value: businessName,
								onChange: (e) => setBusinessName(e.target.value),
								required: true
							})] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: t("email")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								autoComplete: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true
							})] }),
							mode !== "reset" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: t("password")
								}), mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMode("reset"),
									className: "text-xs font-medium text-primary hover:underline",
									children: "Forgot password?"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								autoComplete: mode === "signup" ? "new-password" : "current-password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 8
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: loading,
								children: loading ? "..." : mode === "signin" ? t("signIn") : mode === "signup" ? t("signUp") : "Send Reset Link"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							mode === "signin" ? "No account?" : mode === "signup" ? "Have an account?" : "Remember your password?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
								className: "font-medium text-primary hover:underline",
								children: mode === "signup" ? t("signIn") : mode === "reset" ? "Back to Sign In" : t("signUp")
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };
