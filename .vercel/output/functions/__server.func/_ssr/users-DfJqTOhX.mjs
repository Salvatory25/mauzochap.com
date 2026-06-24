import { o as __toESM } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { n as Label, t as Input } from "./label-Cdxd-27C.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Eye, N as Link2, V as EyeOff, W as Copy, Z as Check, _ as ShieldAlert, a as UserPlus, b as Search, o as UserCog } from "../_libs/lucide-react.mjs";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CBFrTUY_.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-DfJqTOhX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inviteSchema = objectType({
	fullName: stringType().min(1, "Full Name is required"),
	phone: stringType().optional().nullable(),
	email: stringType().email("Invalid email address"),
	password: stringType().min(8, "Password must be at least 8 characters"),
	role: stringType()
});
function UsersPage() {
	const t = useT();
	const qc = useQueryClient();
	const { roles, user, isAdmin } = useAuth();
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [dialogType, setDialogType] = (0, import_react.useState)(null);
	const [selectedUser, setSelectedUser] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const openDialog = (type, user = null) => {
		setDialogType(type);
		setSelectedUser(user);
		setOpen(true);
	};
	const ITEMS_PER_PAGE = 50;
	const { data: usersList = [], isLoading } = useQuery({
		queryKey: ["users-list"],
		enabled: isAdmin,
		queryFn: async () => {
			const { data: profiles, error: pErr } = await supabase.from("profiles").select("*");
			if (pErr) throw pErr;
			let combined = profiles;
			if (isAdmin) {
				const { data: userRoles, error: rErr } = await supabase.from("user_roles").select("*");
				if (!rErr && userRoles) combined = profiles.map((p) => {
					const roleObj = userRoles.find((r) => r.user_id === p.id);
					return {
						...p,
						role: roleObj?.role || "cashier",
						role_id: roleObj?.id
					};
				});
			}
			return combined;
		}
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-center space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6 text-destructive" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold",
				children: "Unauthorized Access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground max-w-sm",
				children: "You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error."
			})
		]
	});
	const filtered = usersList.filter((u) => (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || (u.phone || "").includes(search));
	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const handleRemoveUser = async (id) => {
		if (!confirm("Remove this user from your business? They will lose all access.")) return;
		const { error } = await supabase.from("user_roles").delete().eq("user_id", id);
		if (error) return toast.error(error.message);
		toast.success("User removed successfully");
		qc.invalidateQueries({ queryKey: ["users-list"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: t("users")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [usersList.length, " users registered"]
				})] }), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: (o) => {
						setOpen(o);
						if (!o) {
							setDialogType(null);
							setSelectedUser(null);
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => openDialog("invite"),
								className: "shadow-[var(--shadow-soft)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), " Invite / Add User"]
							})
						}),
						dialogType === "invite" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteUserDialog, { onClose: () => setOpen(false) }),
						dialogType === "edit-role" && selectedUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleDialog, {
							editing: selectedUser,
							onClose: () => setOpen(false)
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (e) => {
						setSearch(e.target.value);
						setPage(1);
					},
					placeholder: "Search users...",
					className: "pl-10"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "User"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Business Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Role"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("loading")
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: t("noData")
						}) }) : paginated.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-medium flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4 text-muted-foreground" }),
											u.full_name || "Unknown",
											user?.id === u.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2",
												children: "You"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: u.phone
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: u.business_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center rounded-full bg-sidebar-accent px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider",
										children: u.role || "—"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right space-x-1",
									children: isAdmin && user?.id !== u.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => {
											openDialog("edit-role", u);
										},
										children: "Change Role"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										className: "text-destructive hover:text-destructive hover:bg-destructive/10",
										onClick: () => handleRemoveUser(u.id),
										children: "Remove"
									})] })
								})
							]
						}, u.id))
					})]
				})
			}),
			totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border border-border bg-card p-3 rounded-lg mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page === 1,
						onClick: () => setPage((p) => p - 1),
						children: "Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							"Page ",
							page,
							" of ",
							totalPages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page === totalPages,
						onClick: () => setPage((p) => p + 1),
						children: "Next"
					})
				]
			})
		]
	});
}
function RoleDialog({ editing, onClose }) {
	const qc = useQueryClient();
	const [role, setRole] = (0, import_react.useState)(editing.role || "cashier");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			if (editing.role_id) {
				const { error } = await supabase.from("user_roles").update({ role }).eq("id", editing.role_id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("user_roles").insert({
					user_id: editing.id,
					role
				});
				if (error) throw error;
			}
			toast.success("Role updated");
			qc.invalidateQueries({ queryKey: ["users-list"] });
			onClose();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Change User Role" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "User" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-sm",
				children: editing.full_name
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: role,
				onChange: (e) => setRole(e.target.value),
				className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "cashier",
						children: "Cashier"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "manager",
						children: "Manager"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "admin",
						children: "Administrator"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving,
					children: saving ? "..." : "Save Role"
				})]
			})
		]
	})] });
}
function InviteUserDialog({ onClose }) {
	useT();
	const qc = useQueryClient();
	const { business } = useAuth();
	const [tab, setTab] = (0, import_react.useState)("direct");
	const [role, setRole] = (0, import_react.useState)("cashier");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const inviteUrl = business?.id ? `${window.location.origin}/auth?invite=${business.id}&role=${role}` : "";
	const handleCopy = () => {
		if (!inviteUrl) return;
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
		toast.success("Invite link copied to clipboard!");
	};
	const handleDirectRegister = async (e) => {
		e.preventDefault();
		if (!business?.id) {
			toast.error("Business information is loading or missing. Please try again.");
			return;
		}
		const parsed = inviteSchema.safeParse({
			fullName,
			phone,
			email,
			password,
			role
		});
		if (!parsed.success) {
			parsed.error.errors.forEach((err) => toast.error(err.message));
			return;
		}
		setSaving(true);
		try {
			const { error } = await createClient("https://tnyzhkecgxfmkteatnrx.supabase.co", "sb_publishable_kGufayU8nJMyUnDW0RHKBQ_njtXQwpj", { auth: {
				persistSession: false,
				autoRefreshToken: false
			} }).auth.signUp({
				email,
				password,
				options: { data: {
					full_name: fullName,
					phone,
					business_id: business.id,
					role
				} }
			});
			if (error) throw error;
			toast.success(`Account for ${fullName} created successfully!`);
			qc.invalidateQueries({ queryKey: ["users-list"] });
			onClose();
		} catch (err) {
			toast.error(err.message || "Failed to create user account");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "sm:max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-xl font-bold",
				children: "Invite / Add User"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 p-1 bg-muted/60 rounded-xl mt-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTab("direct"),
					className: `py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${tab === "direct" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4" }), " Direct Add"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTab("link"),
					className: `py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${tab === "link" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4" }), " Share Link"]
				})]
			}),
			tab === "direct" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleDirectRegister,
				className: "space-y-4 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "full_name",
								children: "Full Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "full_name",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								placeholder: "e.g. John Doe",
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "phone",
								children: "Phone Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "phone",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								placeholder: "e.g. 0712345678",
								required: true
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Email Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "e.g. john@example.com",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "password",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: showPassword ? "text" : "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "At least 8 characters",
								className: "pr-10",
								required: true,
								minLength: 8
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "role",
							children: "Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "role",
							value: role,
							onChange: (e) => setRole(e.target.value),
							className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "cashier",
									children: "Cashier"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "manager",
									children: "Manager"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "admin",
									children: "Administrator"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg",
						children: "ℹ️ The user will be created under your business immediately. If email confirmation is enabled in Supabase, they must confirm their email before logging in."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-2 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: onClose,
							disabled: saving,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: saving,
							className: "bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 active:scale-95 transition-all",
							children: saving ? "Creating..." : "Create Account"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "link_role",
							children: "Role for Invite Link"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "link_role",
							value: role,
							onChange: (e) => setRole(e.target.value),
							className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "cashier",
									children: "Cashier"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "manager",
									children: "Manager"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "admin",
									children: "Administrator"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Invite Link" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								readOnly: true,
								value: inviteUrl,
								className: "bg-muted/50 text-muted-foreground select-all text-xs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleCopy,
								size: "icon",
								className: "shrink-0 active:scale-90 transition-transform",
								children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground bg-primary/5 border border-primary/10 p-3 rounded-lg leading-relaxed",
						children: [
							"💡 Send this link to your employee. They will be prompted to sign up and will be automatically added to your store (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: business?.business_name }),
							") as a ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: role }),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end pt-2 border-t border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: onClose,
							children: "Close"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { UsersPage as component };
