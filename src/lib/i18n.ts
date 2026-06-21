import { useEffect, useState, useSyncExternalStore } from "react";

export type Lang = "en" | "sw";

const STORAGE_KEY = "mauzochap_lang";

const listeners = new Set<() => void>();
let currentLang: Lang =
  (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as Lang)) || "en";

export function setLang(lang: Lang) {
  currentLang = lang;
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, lang);
  listeners.forEach((l) => l());
}

export function useLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => currentLang,
    () => "en" as Lang,
  );
  return [lang, setLang];
}

export const dict = {
  // Common
  appName: { en: "MauzoChap", sw: "MauzoChap" },
  dashboard: { en: "Dashboard", sw: "Dashibodi" },
  products: { en: "Products", sw: "Bidhaa" },
  pos: { en: "New Sale", sw: "Mauzo Mapya" },
  sales: { en: "Sales", sw: "Mauzo" },
  customers: { en: "Customers", sw: "Wateja" },
  reports: { en: "Reports", sw: "Ripoti" },
  expenses: { en: "Expenses", sw: "Matumizi" },
  signIn: { en: "Sign in", sw: "Ingia" },
  signUp: { en: "Sign up", sw: "Jisajili" },
  signOut: { en: "Sign out", sw: "Toka" },
  email: { en: "Email", sw: "Barua pepe" },
  password: { en: "Password", sw: "Nenosiri" },
  fullName: { en: "Full name", sw: "Jina kamili" },
  businessName: { en: "Business name", sw: "Jina la biashara" },
  continueWithGoogle: { en: "Continue with Google", sw: "Endelea na Google" },
  // POS
  search: { en: "Search products...", sw: "Tafuta bidhaa..." },
  cart: { en: "Cart", sw: "Kikapu" },
  emptyCart: { en: "Cart is empty", sw: "Kikapu ni tupu" },
  subtotal: { en: "Subtotal", sw: "Jumla ndogo" },
  discount: { en: "Discount", sw: "Punguzo" },
  total: { en: "Total", sw: "Jumla" },
  paymentMethod: { en: "Payment method", sw: "Njia ya malipo" },
  cash: { en: "Cash", sw: "Pesa Taslimu" },
  mobileMoney: { en: "Mobile Money", sw: "Pesa za Simu" },
  card: { en: "Card", sw: "Kadi" },
  credit: { en: "Credit", sw: "Mkopo" },
  bank: { en: "Bank", sw: "Benki" },
  amountPaid: { en: "Amount paid", sw: "Kiasi kilicholipwa" },
  customer: { en: "Customer", sw: "Mteja" },
  walkIn: { en: "Walk-in", sw: "Mteja wa kawaida" },
  completeSale: { en: "Complete Sale", sw: "Kamilisha Mauzo" },
  receipt: { en: "Receipt", sw: "Risiti" },
  thermal: { en: "Thermal (80mm)", sw: "Thermal (80mm)" },
  a4: { en: "A4 PDF", sw: "A4 PDF" },
  print: { en: "Print", sw: "Chapisha" },
  // Products
  addProduct: { en: "Add Product", sw: "Ongeza Bidhaa" },
  productName: { en: "Product name", sw: "Jina la bidhaa" },
  sku: { en: "SKU", sw: "SKU" },
  barcode: { en: "Barcode", sw: "Barcode" },
  price: { en: "Price", sw: "Bei" },
  cost: { en: "Cost", sw: "Gharama" },
  stock: { en: "Stock", sw: "Akiba" },
  lowStockAlert: { en: "Low stock", sw: "Akiba ndogo" },
  category: { en: "Category", sw: "Kategoria" },
  // Customers
  addCustomer: { en: "Add Customer", sw: "Ongeza Mteja" },
  phone: { en: "Phone", sw: "Simu" },
  // Reports
  todaySales: { en: "Today's sales", sw: "Mauzo ya leo" },
  weekSales: { en: "This week", sw: "Wiki hii" },
  monthSales: { en: "This month", sw: "Mwezi huu" },
  totalProducts: { en: "Total products", sw: "Jumla ya bidhaa" },
  lowStock: { en: "Low stock items", sw: "Bidhaa zilizo na akiba ndogo" },
  recentSales: { en: "Recent sales", sw: "Mauzo ya hivi karibuni" },
  noData: { en: "No data yet", sw: "Hakuna data bado" },
  save: { en: "Save", sw: "Hifadhi" },
  cancel: { en: "Cancel", sw: "Ghairi" },
  delete: { en: "Delete", sw: "Futa" },
  edit: { en: "Edit", sw: "Hariri" },
  add: { en: "Add", sw: "Ongeza" },
  qty: { en: "Qty", sw: "Idadi" },
  loading: { en: "Loading...", sw: "Inapakia..." },
} as const;

export type DictKey = keyof typeof dict;

export function t(key: DictKey, lang: Lang = currentLang): string {
  return dict[key]?.[lang] ?? dict[key]?.en ?? String(key);
}

export function useT() {
  const [lang] = useLang();
  return (key: DictKey) => t(key, lang);
}

export function formatTZS(n: number): string {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// suppress unused warning when only setLang is used
export { useEffect, useState };
