import { createContext, useContext, useEffect, useMemo, useState } from "react";
import seed from "../../db.json";

// ---------------------------------------------------------------------------
// Database JSON.
// Table: users, menus, orders. Dipersist ke localStorage agar tetap ada
// setelah refresh (menggantikan MySQL di versi Laravel).
// Hapus key "saraso-db-v1" di localStorage / klik "Reset demo" untuk
// mengembalikan ke isi db.json awal.
// ---------------------------------------------------------------------------

const DB_KEY = "saraso-db-v1";
const SESSION_KEY = "saraso-session";

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.menus) && Array.isArray(parsed.users)) return parsed;
    }
  } catch {
    /* abaikan, pakai seed */
  }
  return deepClone(seed);
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

const ShopCtx = createContext(null);

export function useShop() {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error("useShop harus dipakai di dalam <ShopProvider>");
  return ctx;
}

export const rupiah = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

export const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "basic", label: "Kopi Basic" },
  { id: "signature", label: "Signature" },
  { id: "refreshment", label: "Refreshment" },
  { id: "non-coffee", label: "Non-Coffee" },
  { id: "sumatra", label: "Khas Sumatra" },
  { id: "dessert", label: "Dessert" },
  { id: "food", label: "Food" },
];

export function badgeLabel(badge) {
  if (badge === "rec") return "Rekomendasi";
  if (badge === "best") return "Best Seller";
  return null;
}

export function ShopProvider({ children }) {
  const [db, setDb] = useState(loadDb);
  const [sessionId, setSessionId] = useState(loadSession);

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      /* storage penuh / nonaktif */
    }
  }, [db]);

  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionId));
    } catch {
      /* abaikan */
    }
  }, [sessionId]);

  const user = useMemo(
    () => db.users.find((u) => u.id === sessionId) || null,
    [db.users, sessionId]
  );

  const api = useMemo(
    () => ({
      db,
      user,

      register(name, email, password) {
        const cleanEmail = String(email || "").trim().toLowerCase();
        if (!name.trim()) return { error: "Nama wajib diisi." };
        if (!cleanEmail) return { error: "Email wajib diisi." };
        if (String(password || "").length < 6) return { error: "Password minimal 6 karakter." };
        if (db.users.some((u) => u.email.toLowerCase() === cleanEmail))
          return { error: "Email sudah terdaftar. Silakan login." };
        const nu = { id: Date.now(), name: name.trim(), email: cleanEmail, password };
        setDb((d) => ({ ...d, users: [...d.users, nu] }));
        setSessionId(nu.id);
        return { ok: true };
      },

      login(email, password) {
        const cleanEmail = String(email || "").trim().toLowerCase();
        const found = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
        if (!found || found.password !== password)
          return { error: "Email atau password salah." };
        setSessionId(found.id);
        return { ok: true };
      },

      logout() {
        setSessionId(null);
      },

      menuById(id) {
        return db.menus.find((m) => m.id === id);
      },

      pendingOrder() {
        if (!user) return null;
        return db.orders.find((o) => o.userId === user.id && o.status === "pending") || null;
      },

      pendingCount() {
        if (!user) return 0;
        const o = db.orders.find((x) => x.userId === user.id && x.status === "pending");
        return o ? o.items.reduce((s, i) => s + i.quantity, 0) : 0;
      },

      myOrders() {
        if (!user) return [];
        return db.orders
          .filter((o) => o.userId === user.id)
          .slice()
          .sort((a, b) => b.id - a.id);
      },

      addToCart(menuId, qty = 1) {
        if (!user) return;
        const menu = db.menus.find((m) => m.id === menuId);
        if (!menu) return;
        setDb((d) => {
          const orders = d.orders.map((o) => ({
            ...o,
            items: o.items.map((i) => ({ ...i })),
          }));
          let order = orders.find((x) => x.userId === user.id && x.status === "pending");
          if (!order) {
            order = {
              id: Date.now(),
              userId: user.id,
              total_price: 0,
              status: "pending",
              created_at: new Date().toISOString(),
              items: [],
            };
            orders.push(order);
          }
          const item = order.items.find((i) => i.menuId === menu.id);
          if (item) item.quantity += qty;
          else order.items.push({ menuId: menu.id, quantity: qty, price: menu.price });
          order.total_price = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
          return { ...d, orders };
        });
      },

      checkout(orderId) {
        if (!user) return;
        setDb((d) => ({
          ...d,
          orders: d.orders.map((o) =>
            o.id === orderId && o.userId === user.id ? { ...o, status: "completed" } : o
          ),
        }));
      },

      removeOrder(orderId) {
        if (!user) return;
        setDb((d) => ({
          ...d,
          orders: d.orders.filter((o) => !(o.id === orderId && o.userId === user.id)),
        }));
      },

      resetDemo() {
        setDb(deepClone(seed));
      },
    }),
    [db, user]
  );

  return <ShopCtx.Provider value={api}>{children}</ShopCtx.Provider>;
}
