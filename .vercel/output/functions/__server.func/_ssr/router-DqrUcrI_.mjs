import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as AuthProvider } from "./use-auth-eGZW1w9W.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DqrUcrI_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CviN47KX.css";
function reportAppError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__appEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportAppError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-input bg-background px-4 py-2 text-sm",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "MauzoChap — POS & Business Management" },
			{
				name: "description",
				content: "Modern POS and business management for shops, pharmacies and restaurants in Tanzania."
			},
			{
				property: "og:title",
				content: "MauzoChap"
			},
			{
				property: "og:description",
				content: "POS & Business Management for African SMEs."
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$17.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-right",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$16 = () => import("./update-password-DQm7v8nL.mjs");
var Route$16 = createFileRoute("/update-password")({
	head: () => ({ meta: [{ title: "Update Password — MauzoChap" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./auth-EFY6GJFi.mjs");
var Route$15 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — MauzoChap" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./route-Cpy0C8Et.mjs");
var Route$14 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./routes-DF4yTEbe.mjs");
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "MauzoChap — Modern POS for Tanzanian Businesses" }, {
		name: "description",
		content: "Manage sales, inventory, customers, expenses and reports — built for shops, pharmacies and restaurants."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./users-DfJqTOhX.mjs");
var Route$12 = createFileRoute("/_authenticated/users")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./suppliers-CNmE4ry4.mjs");
var Route$11 = createFileRoute("/_authenticated/suppliers")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./super-admin--fxRILRd.mjs");
var Route$10 = createFileRoute("/_authenticated/super-admin")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./setup-billing-bGte7APU.mjs");
var Route$9 = createFileRoute("/_authenticated/setup-billing")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./settings-EuVX0lC7.mjs");
var Route$8 = createFileRoute("/_authenticated/settings")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./sales-Bct640Qk.mjs");
var Route$7 = createFileRoute("/_authenticated/sales")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./reports-B-E51xRk.mjs");
var Route$6 = createFileRoute("/_authenticated/reports")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./products-DdfCrLdK.mjs");
var Route$5 = createFileRoute("/_authenticated/products")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./pos-M2Qne-wP.mjs");
var Route$4 = createFileRoute("/_authenticated/pos")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./inventory-DnRVIrnG.mjs");
var Route$3 = createFileRoute("/_authenticated/inventory")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./expenses-BmjUSCEE.mjs");
var Route$2 = createFileRoute("/_authenticated/expenses")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./dashboard-CpVwmzEA.mjs");
var Route$1 = createFileRoute("/_authenticated/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./customers-BFQqIss2.mjs");
var Route = createFileRoute("/_authenticated/customers")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var UpdatePasswordRoute = Route$16.update({
	id: "/update-password",
	path: "/update-password",
	getParentRoute: () => Route$17
});
var AuthRoute = Route$15.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$17
});
var AuthenticatedRouteRoute = Route$14.update({
	id: "/_authenticated",
	getParentRoute: () => Route$17
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$17
});
var AuthenticatedUsersRoute = Route$12.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSuppliersRoute = Route$11.update({
	id: "/suppliers",
	path: "/suppliers",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSuperAdminRoute = Route$10.update({
	id: "/super-admin",
	path: "/super-admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSetupBillingRoute = Route$9.update({
	id: "/setup-billing",
	path: "/setup-billing",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSalesRoute = Route$7.update({
	id: "/sales",
	path: "/sales",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReportsRoute = Route$6.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProductsRoute = Route$5.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPosRoute = Route$4.update({
	id: "/pos",
	path: "/pos",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInventoryRoute = Route$3.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedExpensesRoute = Route$2.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$1.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedCustomersRoute: Route.update({
		id: "/customers",
		path: "/customers",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedDashboardRoute,
	AuthenticatedExpensesRoute,
	AuthenticatedInventoryRoute,
	AuthenticatedPosRoute,
	AuthenticatedProductsRoute,
	AuthenticatedReportsRoute,
	AuthenticatedSalesRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedSetupBillingRoute,
	AuthenticatedSuperAdminRoute,
	AuthenticatedSuppliersRoute,
	AuthenticatedUsersRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	UpdatePasswordRoute
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
