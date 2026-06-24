import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-C3cIRk-V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useAuth } from "./use-auth-eGZW1w9W.mjs";
import { i as useT, n as formatTZS, t as formatDate } from "./i18n-C8ZZqtNN.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DSKqFpbT.mjs";
import { n as Label, t as Input } from "./label-Cdxd-27C.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Camera, A as Minus, C as Printer, D as Pause, S as Receipt, T as Play, b as Search, it as Ban, m as SquareSplitHorizontal, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CBFrTUY_.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Html5Qrcode } from "../_libs/html5-qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pos-M2Qne-wP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Receipt$1({ sale, onClose }) {
	const t = useT();
	const [format, setFormat] = (0, import_react.useState)("thermal");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between flex-wrap gap-4 no-print",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-bold",
				children: [
					t("receipt"),
					" ",
					sale.receipt_number
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Sale completed successfully."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border p-1 bg-card flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFormat("thermal"),
							className: `px-3 py-1.5 text-xs rounded-md ${format === "thermal" ? "bg-primary text-primary-foreground" : ""}`,
							children: t("thermal")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFormat("a4"),
							className: `px-3 py-1.5 text-xs rounded-md ${format === "a4" ? "bg-primary text-primary-foreground" : ""}`,
							children: t("a4")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => window.print(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4 mr-2" }),
							" ",
							t("print")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: onClose,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 mr-2" }), " Close"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center",
			children: format === "thermal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThermalReceipt, { sale }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(A4Receipt, { sale })
		})]
	});
}
function ThermalReceipt({ sale }) {
	const isSplit = sale.notes?.startsWith("Split Payment:");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print-area bg-white text-black font-mono text-xs p-4 shadow-[var(--shadow-elevated)] rounded",
		style: { width: "302px" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold text-base",
						children: "MauzoChap"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px]",
						children: "Tanzania"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] mt-1",
						children: "--------------------------------"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-2 text-[11px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Receipt: ", sale.receipt_number] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatDate(sale.created_at) }),
					!isSplit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Payment: ", sale.payment_method] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px]",
				children: "--------------------------------"
			}),
			sale.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between text-[11px] my-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 truncate",
					children: [i.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] text-gray-600",
						children: [
							" ",
							i.qty,
							" x ",
							formatTZS(i.price)
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: formatTZS(i.qty * i.price)
				})]
			}, i.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px]",
				children: "--------------------------------"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(sale.subtotal) })]
			}),
			sale.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", formatTZS(sale.discount)] })]
			}),
			sale.tax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tax" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(sale.tax) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between font-bold text-sm mt-1 border-t border-dashed border-gray-400 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(sale.total) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Paid" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(sale.amount_paid) })]
			}),
			isSplit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-[10px] bg-gray-100 p-1.5 rounded",
				children: sale.notes
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mt-4 text-[10px]",
				children: [
					"Thank you! Asante!",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Powered by MauzoChap"
				]
			})
		]
	});
}
function A4Receipt({ sale }) {
	const isSplit = sale.notes?.startsWith("Split Payment:");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print-area bg-white text-black p-12 shadow-[var(--shadow-elevated)] rounded",
		style: {
			width: "210mm",
			minHeight: "297mm"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-start border-b-2 border-black pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-bold tracking-tight",
					children: "MauzoChap"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gray-600 mt-1",
					children: "Business Receipt · Tanzania"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-gray-500 uppercase tracking-widest",
							children: "Invoice"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: sale.receipt_number
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-gray-600 mt-1",
							children: formatDate(sale.created_at)
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full mt-8 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-300 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2",
							children: "Item"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 text-right",
							children: "Qty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 text-right",
							children: "Price"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 text-right",
							children: "Total"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: sale.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3",
							children: i.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right",
							children: i.qty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right",
							children: formatTZS(i.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-right font-medium",
							children: formatTZS(i.qty * i.price)
						})
					]
				}, i.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 ml-auto w-72 text-sm space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-600",
							children: "Subtotal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(sale.subtotal) })]
					}),
					sale.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-600",
							children: "Discount"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", formatTZS(sale.discount)] })]
					}),
					sale.tax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-600",
							children: "Tax"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(sale.tax) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-lg font-bold pt-2 border-t border-black",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(sale.total) })]
					}),
					isSplit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-gray-500 uppercase mb-1",
								children: "Payment Details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100",
								children: sale.notes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between mt-2 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Paid" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(sale.amount_paid) })]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-gray-600 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Paid via ", sale.payment_method] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(sale.amount_paid) })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 pt-6 border-t border-gray-200 text-center text-xs text-gray-500",
				children: "Thank you for your business · Asante kwa ununuzi wako"
			})
		]
	});
}
function CameraScanner({ open, onClose, onScan }) {
	const [error, setError] = (0, import_react.useState)("");
	const scannerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setError("");
		const scanner = new Html5Qrcode("reader");
		scannerRef.current = scanner;
		const startScanner = async () => {
			try {
				await scanner.start({ facingMode: "environment" }, { fps: 10 }, (decodedText) => {
					if (scannerRef.current && scannerRef.current.isScanning) scannerRef.current.stop().then(() => {
						scannerRef.current?.clear();
						onScan(decodedText);
					}).catch(() => {
						onScan(decodedText);
					});
				}, (errorMessage) => {});
			} catch (err) {
				console.error("Camera error:", err);
				setError("Failed to start camera. Please ensure permissions are granted.");
			}
		};
		const timer = setTimeout(() => {
			startScanner();
		}, 100);
		return () => {
			clearTimeout(timer);
			if (scannerRef.current && scannerRef.current.isScanning) scannerRef.current.stop().then(() => {
				scannerRef.current?.clear();
			}).catch(console.error);
		};
	}, [open, onScan]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-white text-lg font-bold",
					children: "Scan Barcode"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onClose,
					className: "text-white hover:bg-white/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full h-full max-h-[80vh] flex items-center justify-center overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "reader",
						className: "w-full h-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 border-2 border-white/60 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] z-10 pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-0 w-full h-[2px] bg-red-500 z-20 shadow-[0_0_12px_rgba(239,68,68,1)] pointer-events-none" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 to-transparent z-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-white/80 text-center mb-4",
						children: "Hold the phone steady. Ensure the barcode is bright and clear."
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-red-400 font-bold mb-4",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: onClose,
						className: "w-full max-w-sm rounded-full py-6 text-lg",
						children: "Cancel Scanner"
					})
				]
			})
		]
	});
}
function POSPage() {
	const t = useT();
	const qc = useQueryClient();
	const { user, branchId } = useAuth();
	const [search, setSearch] = (0, import_react.useState)("");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [cart, setCart] = (0, import_react.useState)([]);
	const [discount, setDiscount] = (0, import_react.useState)("");
	const [taxRate, setTaxRate] = (0, import_react.useState)("");
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)("cash");
	const [amountPaid, setAmountPaid] = (0, import_react.useState)("");
	const [isSplit, setIsSplit] = (0, import_react.useState)(false);
	const [splitMethod1, setSplitMethod1] = (0, import_react.useState)("cash");
	const [splitAmount1, setSplitAmount1] = (0, import_react.useState)("");
	const [splitMethod2, setSplitMethod2] = (0, import_react.useState)("card");
	const [splitAmount2, setSplitAmount2] = (0, import_react.useState)("");
	const [customerId, setCustomerId] = (0, import_react.useState)("");
	const [completedSale, setCompletedSale] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [hasHeldSale, setHasHeldSale] = (0, import_react.useState)(false);
	const [scannerOpen, setScannerOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setHasHeldSale(!!localStorage.getItem("held_sale"));
	}, []);
	const { data: products = [] } = useQuery({
		queryKey: ["products", branchId],
		enabled: !!branchId,
		queryFn: async () => {
			const { data } = await supabase.from("products").select(`
          id,name,price,sku,barcode,category_id,
          branch_inventory!inner(stock_quantity)
        `).eq("is_active", true).eq("branch_inventory.branch_id", branchId);
			return (data ?? []).map((p) => ({
				...p,
				stock_quantity: p.branch_inventory?.[0]?.stock_quantity || 0
			}));
		}
	});
	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data } = await supabase.from("categories").select("id,name").order("name");
			return data ?? [];
		}
	});
	const { data: customers = [] } = useQuery({
		queryKey: ["customers-list"],
		queryFn: async () => {
			const { data } = await supabase.from("customers").select("id,name").order("name");
			return data ?? [];
		}
	});
	const displayProducts = products.filter((p) => {
		const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase()) || (p.sku || "").toLowerCase().includes(search.toLowerCase()) || (p.barcode || "").includes(search);
		const matchCategory = selectedCategory === "all" || p.category_id === selectedCategory;
		return matchSearch && matchCategory;
	}).slice(0, 50);
	const subtotal = (0, import_react.useMemo)(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
	const taxableAmount = Math.max(0, subtotal - Number(discount || 0));
	const taxAmount = taxableAmount * Number(taxRate || 0) / 100;
	const total = taxableAmount + taxAmount;
	const addToCart = (p) => {
		setCart((c) => {
			if (c.find((i) => i.id === p.id)) return c.map((i) => i.id === p.id ? {
				...i,
				qty: i.qty + 1
			} : i);
			return [...c, {
				...p,
				qty: 1
			}];
		});
	};
	const updateQty = (id, delta) => {
		setCart((c) => c.map((i) => i.id === id ? {
			...i,
			qty: Math.max(0, i.qty + delta)
		} : i).filter((i) => i.qty > 0));
	};
	const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));
	const cancelSale = () => {
		setCart([]);
		setDiscount("");
		setTaxRate("");
		setAmountPaid("");
		setIsSplit(false);
		setSplitAmount1("");
		setSplitAmount2("");
		setCustomerId("");
	};
	const holdSale = () => {
		if (cart.length === 0) return toast.error("Cart is empty");
		const held = {
			cart,
			discount,
			taxRate,
			customerId
		};
		localStorage.setItem("held_sale", JSON.stringify(held));
		setHasHeldSale(true);
		cancelSale();
		toast.success("Sale held successfully");
	};
	const resumeSale = () => {
		const data = localStorage.getItem("held_sale");
		if (!data) return;
		try {
			const parsed = JSON.parse(data);
			setCart(parsed.cart || []);
			setDiscount(parsed.discount || "");
			setTaxRate(parsed.taxRate || "");
			setCustomerId(parsed.customerId || "");
			localStorage.removeItem("held_sale");
			setHasHeldSale(false);
			toast.success("Sale resumed");
		} catch {
			toast.error("Failed to resume sale");
		}
	};
	const completeSale = async () => {
		if (cart.length === 0) return toast.error("Cart is empty");
		if (!user) return;
		setSubmitting(true);
		try {
			const receiptNumber = `R${Date.now().toString().slice(-8)}`;
			let finalAmountPaid = 0;
			let finalMethod = paymentMethod;
			let notes = null;
			if (isSplit) {
				const a1 = Number(splitAmount1 || 0);
				const a2 = Number(splitAmount2 || 0);
				finalAmountPaid = a1 + a2;
				finalMethod = a1 >= a2 ? splitMethod1 : splitMethod2;
				notes = `Split Payment: ${splitMethod1} (${formatTZS(a1)}), ${splitMethod2} (${formatTZS(a2)})`;
			} else finalAmountPaid = amountPaid === "" ? total : Number(amountPaid);
			const { data: sale, error } = await supabase.from("sales").insert({
				receipt_number: receiptNumber,
				cashier_id: user.id,
				branch_id: branchId,
				customer_id: customerId || null,
				subtotal,
				discount: Number(discount || 0),
				tax: taxAmount,
				total,
				amount_paid: finalAmountPaid,
				payment_method: finalMethod,
				status: "completed",
				notes
			}).select().single();
			if (error) throw error;
			const items = cart.map((i) => ({
				sale_id: sale.id,
				product_id: i.id,
				product_name: i.name,
				quantity: i.qty,
				unit_price: i.price,
				line_total: i.price * i.qty
			}));
			const { error: itemErr } = await supabase.from("sale_items").insert(items);
			if (itemErr) throw itemErr;
			toast.success("Sale completed");
			setCompletedSale({
				...sale,
				items: cart
			});
			cancelSale();
			qc.invalidateQueries();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSubmitting(false);
		}
	};
	if (completedSale) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt$1, {
		sale: completedSale,
		onClose: () => setCompletedSale(null)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-3 gap-6 -mx-2 lg:mx-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold",
							children: t("pos")
						}), hasHeldSale && cart.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: resumeSale,
							className: "border-warning text-warning hover:bg-warning/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 mr-2" }), "Resume Held Sale"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter" && search.trim()) {
											const exactMatch = products.find((p) => p.barcode === search.trim() || p.sku === search.trim());
											if (exactMatch) if (exactMatch.stock_quantity > 0) {
												addToCart(exactMatch);
												setSearch("");
												toast.success(`Added ${exactMatch.name}`);
											} else toast.error("Item out of stock!");
										}
									},
									placeholder: t("search"),
									className: "pl-10",
									autoFocus: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: () => setScannerOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4 text-muted-foreground" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: selectedCategory,
								onChange: (e) => setSelectedCategory(e.target.value),
								className: "rounded-md border border-input bg-background px-3 py-2 text-sm h-10 w-48",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All Categories"
								}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[65vh] overflow-y-auto pr-1",
						children: [displayProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => addToCart(p),
							disabled: p.stock_quantity <= 0,
							className: "text-left rounded-xl border border-border bg-card p-4 hover:border-primary hover:shadow-[var(--shadow-soft)] disabled:opacity-40 transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium line-clamp-2 min-h-[2.5rem]",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-base font-bold",
									children: formatTZS(Number(p.price))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [p.stock_quantity, " in stock"]
								})
							]
						}, p.id)), displayProducts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-full text-center text-sm text-muted-foreground py-10",
							children: t("noData")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card flex flex-col h-[calc(100vh-8rem)] sticky top-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-3 border-b border-border flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									children: t("cart")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										"(",
										cart.length,
										")"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: cancelSale,
							disabled: cart.length === 0,
							className: "text-destructive h-8 px-2 hover:bg-destructive/10 hover:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-4 w-4 mr-1" }), " Cancel"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto divide-y divide-border",
						children: cart.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-10 text-center text-sm text-muted-foreground",
							children: t("emptyCart")
						}) : cart.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-3 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium truncate",
										children: i.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: formatTZS(i.price)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 bg-muted rounded-md p-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => updateQty(i.id, -1),
											className: "h-6 w-6 rounded-sm hover:bg-background",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-6 text-center text-sm font-medium",
											children: i.qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => updateQty(i.id, 1),
											className: "h-6 w-6 rounded-sm hover:bg-background",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => removeItem(i.id),
									className: "h-8 w-8 ml-1 text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							]
						}, i.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border p-4 space-y-3 bg-muted/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t("subtotal")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTZS(subtotal) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [t("discount"), " (-)"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											placeholder: "0",
											value: discount,
											onChange: (e) => setDiscount(e.target.value === "" ? "" : Number(e.target.value)),
											className: "w-24 h-7 text-right bg-background"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Tax (%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											placeholder: "0%",
											value: taxRate,
											onChange: (e) => setTaxRate(e.target.value === "" ? "" : Number(e.target.value)),
											className: "w-24 h-7 text-right bg-background"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-lg font-bold pt-2 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("total") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: formatTZS(total)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: t("paymentMethod")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setIsSplit(!isSplit),
										className: `text-[10px] flex items-center gap-1 px-2 py-0.5 rounded ${isSplit ? "bg-primary/20 text-primary font-medium" : "bg-muted text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareSplitHorizontal, { className: "h-3 w-3" }), " Split"]
									})]
								}), isSplit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: splitMethod1,
											onChange: (e) => setSplitMethod1(e.target.value),
											className: "rounded-md border border-input bg-background px-2 text-xs w-2/5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "cash",
													children: "Cash"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "mobile_money",
													children: "Mobile"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "card",
													children: "Card"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "bank",
													children: "Bank"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "credit",
													children: "Credit"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											placeholder: "Amt 1",
											value: splitAmount1,
											onChange: (e) => setSplitAmount1(e.target.value === "" ? "" : Number(e.target.value)),
											className: "h-8 flex-1 text-right text-sm"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: splitMethod2,
											onChange: (e) => setSplitMethod2(e.target.value),
											className: "rounded-md border border-input bg-background px-2 text-xs w-2/5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "cash",
													children: "Cash"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "mobile_money",
													children: "Mobile"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "card",
													children: "Card"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "bank",
													children: "Bank"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "credit",
													children: "Credit"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											placeholder: "Amt 2",
											value: splitAmount2,
											onChange: (e) => setSplitAmount2(e.target.value === "" ? "" : Number(e.target.value)),
											className: "h-8 flex-1 text-right text-sm"
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-5 gap-1",
										children: [
											"cash",
											"mobile_money",
											"card",
											"credit",
											"bank"
										].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setPaymentMethod(m),
											className: `rounded-md border py-1.5 text-[10px] font-medium leading-tight transition-colors ${paymentMethod === m ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-muted"}`,
											title: m,
											children: m === "mobile_money" ? "Mobile" : m === "credit" ? "Credit" : m
										}, m))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: customerId,
											onChange: (e) => setCustomerId(e.target.value),
											className: "flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: "",
												children: [t("walkIn"), " Customer"]
											}), customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c.id,
												children: c.name
											}, c.id))]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											placeholder: `Paid: ${total}`,
											value: amountPaid,
											onChange: (e) => setAmountPaid(e.target.value === "" ? "" : Number(e.target.value)),
											className: "w-1/2 h-8 text-right text-sm"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: holdSale,
									disabled: submitting || cart.length === 0,
									variant: "outline",
									className: "w-1/3 h-11",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4 mr-2" }), "Hold"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: completeSale,
									disabled: submitting || cart.length === 0,
									className: "w-2/3 h-11 text-base shadow-md",
									style: { background: "var(--gradient-primary)" },
									children: submitting ? "..." : `${t("completeSale")}`
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!completedSale,
				onOpenChange: () => setCompletedSale(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-md max-h-[90vh] overflow-y-auto",
					children: completedSale && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-success/15 p-3 rounded-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-8 w-8 text-success" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold",
								children: "Sale Completed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: ["Receipt #", completedSale.receipt_number]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full mt-4 bg-muted p-4 rounded-md",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt$1, {
									sale: completedSale,
									onClose: () => setCompletedSale(null)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 w-full mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full",
									variant: "outline",
									onClick: () => window.print(),
									children: "Print Receipt"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full",
									onClick: () => setCompletedSale(null),
									children: "New Sale"
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraScanner, {
				open: scannerOpen,
				onClose: () => setScannerOpen(false),
				onScan: (code) => {
					const exactMatch = products.find((p) => p.barcode === code || p.sku === code);
					if (exactMatch) if (exactMatch.stock_quantity > 0) {
						addToCart(exactMatch);
						toast.success(`Added ${exactMatch.name}`);
					} else toast.error("Item out of stock!");
					else toast.error(`No product found for barcode: ${code}`);
					setScannerOpen(false);
				}
			})
		]
	});
}
//#endregion
export { POSPage as component };
