import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-eGZW1w9W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var AuthContext = (0, import_react.createContext)(void 0);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [branchId, setBranchId] = (0, import_react.useState)(null);
	const [business, setBusiness] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		const loadData = async (sessionUser) => {
			if (!sessionUser) {
				if (mounted) {
					setUser(null);
					setRoles([]);
					setBranchId(null);
					setBusiness(null);
					setLoading(false);
				}
				return;
			}
			if (mounted) setUser(sessionUser);
			try {
				const [rolesRes, profileRes] = await Promise.all([supabase.from("user_roles").select("role").eq("user_id", sessionUser.id), supabase.from("profiles").select("branch_id, business_id").eq("id", sessionUser.id).single()]);
				if (!mounted) return;
				setRoles(rolesRes.data?.map((r) => r.role) ?? []);
				if (profileRes.data) {
					setBranchId(profileRes.data.branch_id);
					if (profileRes.data.business_id) {
						const { data: bData } = await supabase.from("businesses").select("*").eq("id", profileRes.data.business_id).single();
						if (mounted && bData) setBusiness(bData);
					}
				}
			} catch (err) {
				console.error("Error loading user roles/profile:", err);
			} finally {
				if (mounted) setLoading(false);
			}
		};
		supabase.auth.getSession().then(({ data }) => {
			loadData(data.session?.user ?? null);
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
			loadData(session?.user ?? null);
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	const isSuperAdmin = roles.includes("super_admin");
	const value = {
		user,
		roles,
		branchId,
		business,
		loading,
		isAdmin: roles.includes("admin") || roles.includes("owner") || isSuperAdmin,
		isManager: roles.includes("manager") || roles.includes("admin") || roles.includes("owner") || isSuperAdmin,
		isSuperAdmin
	};
	return import_react.createElement(AuthContext.Provider, { value }, children);
}
function useAuth() {
	const context = (0, import_react.useContext)(AuthContext);
	if (context === void 0) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
export { useAuth as n, AuthProvider as t };
