import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { n as Label, t as Input } from "./label-Cdxd-27C.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as Package, U as CreditCard, Y as CircleCheck, at as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/setup-billing-bGte7APU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PACKAGES = [
	{
		id: "kilimanjaro",
		name: "Kilimanjaro",
		price: 25e4,
		duration: "1 Year",
		features: [
			"1 Location",
			"2 Users",
			"200 Products",
			"Basic Reports",
			"Receipt Printing"
		]
	},
	{
		id: "serengeti",
		name: "Serengeti",
		price: 45e4,
		duration: "1 Year",
		features: [
			"1 Location",
			"5 Users",
			"500 Products",
			"Credit Sales",
			"Advanced Reports"
		]
	},
	{
		id: "zanzibar",
		name: "Zanzibar",
		price: 75e4,
		duration: "1 Year",
		features: [
			"3 Locations",
			"10 Users",
			"2,000 Products",
			"Multi-Branch",
			"Profit Reports"
		]
	},
	{
		id: "uhuru",
		name: "Uhuru",
		price: 1e6,
		duration: "1 Year",
		features: [
			"Unlimited Locations",
			"Unlimited Users",
			"Unlimited Products",
			"Accounting",
			"Priority Support"
		]
	}
];
function SetupBilling() {
	const { business } = useAuth();
	const navigate = useNavigate();
	const [selectedPackage, setSelectedPackage] = (0, import_react.useState)("kilimanjaro");
	const [paymentRef, setPaymentRef] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	if (!business) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Loading business info..."
	});
	if (business.account_status === "approved" && (!business.expiry_date || new Date(business.expiry_date) > /* @__PURE__ */ new Date())) {
		navigate({
			to: "/dashboard",
			replace: true
		});
		return null;
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!paymentRef.trim()) return toast.error("Payment reference is required");
		setSubmitting(true);
		try {
			const selectedInfo = PACKAGES.find((p) => p.id === selectedPackage);
			if (!selectedInfo) throw new Error("Invalid package");
			const { error: bErr } = await supabase.from("businesses").update({ package: selectedPackage }).eq("id", business.id);
			if (bErr) throw bErr;
			const { error: pErr } = await supabase.from("payments").insert({
				business_id: business.id,
				amount: selectedInfo.price,
				payment_reference: paymentRef,
				verification_status: "waiting_verification"
			});
			if (pErr) throw pErr;
			toast.success("Payment submitted successfully! Awaiting admin verification.");
			setPaymentRef("");
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-6xl mx-auto space-y-8 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-2xl mx-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Select a Subscription Package"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground mt-2",
					children: [
						"Choose the right plan to activate your business account for ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: business.business_name }),
						"."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6",
				children: PACKAGES.map((pkg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => setSelectedPackage(pkg.id),
					className: `cursor-pointer rounded-2xl border p-6 transition-all flex flex-col ${selectedPackage === pkg.id ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary scale-[1.02]" : "border-border bg-card hover:border-primary/50 hover:shadow-md"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-2.5 rounded-xl ${selectedPackage === pkg.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-lg tracking-tight uppercase",
								children: pkg.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-3xl font-extrabold mb-1 tracking-tight",
							children: [
								pkg.price.toLocaleString(),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base font-medium text-muted-foreground",
									children: "TZS"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-muted-foreground mb-6 bg-muted/50 w-fit px-2 py-0.5 rounded-full",
							children: "Billed Annually"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3 mb-8 flex-1",
							children: pkg.features.map((feature, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground leading-tight",
									children: feature
								})]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-full py-2.5 rounded-lg text-center font-semibold text-sm transition-colors ${selectedPackage === pkg.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`,
							children: selectedPackage === pkg.id ? "Selected Plan" : "Choose Plan"
						})
					]
				}, pkg.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 border-b border-border bg-muted/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-semibold flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5 mr-2" }), "Payment Details"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Please transfer the amount to our business number and enter the transaction reference below."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "p-6 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-primary/10 text-primary p-4 rounded-lg text-sm mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Payment Instructions:" }),
								" Send exactly ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [PACKAGES.find((p) => p.id === selectedPackage)?.price.toLocaleString(), " TZS"] }),
								" to Bank Account ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "40310127484 - NMB" }),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile Money Reference Number" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "e.g. 5K92J1LX",
									value: paymentRef,
									onChange: (e) => setPaymentRef(e.target.value),
									className: "max-w-md uppercase"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Enter the exact transaction ID you received from M-Pesa / Tigo Pesa / Airtel Money."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							size: "lg",
							disabled: submitting || !paymentRef.trim(),
							children: [submitting ? "Submitting..." : "Submit Payment for Verification", !submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 ml-2" })]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { SetupBilling as component };
