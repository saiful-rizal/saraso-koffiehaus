import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, rupiah, useShop } from "../lib/store";

export default function Pesan() {
  const { db, addToCart, pendingOrder, menuById, checkout } = useShop();
  const [cat, setCat] = useState("all");
  const [toast, setToast] = useState("");
  const order = pendingOrder();

  const menus = useMemo(
    () => db.menus.filter((m) => cat === "all" || m.category === cat),
    [db.menus, cat]
  );

  const handleAdd = (id) => {
    addToCart(id, 1);
    const m = menuById(id);
    setToast(`${m ? m.name : "Menu"} ditambahkan!`);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="pt-24 md:pt-20 max-w-7xl mx-auto px-5 pb-16 min-h-screen">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#d4a56a] mb-2">Pesan Menu</p>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#f5e6d0] mb-6">
        Rakit pesananmu
      </h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={
                  "whitespace-nowrap text-[11px] px-4 py-2 rounded-full border transition-all " +
                  (cat === c.id
                    ? "grad-warm text-[#050403] font-semibold border-transparent"
                    : "border-[#d4a56a]/10 text-[#f5e6d0]/55 hover:border-[#d4a56a]/30")
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {menus.map((m) => (
              <div
                key={m.id}
                className="glass-card rounded-2xl p-3 flex gap-3 items-center hover:border-[#d4a56a]/20 transition-all"
              >
                <img
                  src={m.image}
                  alt={m.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/images/icon.jpg";
                  }}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#1c1917]"
                />
                <div className="grow min-w-0">
                  <p className="font-serif text-sm font-semibold text-[#f5e6d0] truncate">
                    {m.name}
                  </p>
                  <p className="text-[10px] text-[#f5e6d0]/45 truncate">{m.description}</p>
                  <p className="text-[11px] font-semibold text-[#e8cba4] mt-0.5">
                    {rupiah(m.price)}
                  </p>
                </div>
                <button
                  onClick={() => handleAdd(m.id)}
                  className="shrink-0 text-[11px] font-semibold grad-warm text-[#050403] px-4 py-2 rounded-full hover:scale-[1.04] active:scale-[0.97] transition-all"
                >
                  + Tambah
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass-card rounded-2xl p-5 lg:sticky lg:top-20">
          <p className="font-serif text-base font-semibold text-[#f5e6d0] mb-1">Keranjang</p>
          <p className="text-[10px] text-[#f5e6d0]/40 mb-4">Status: pending • tersimpan di db.json</p>
          {!order || order.items.length === 0 ? (
            <p className="text-[11px] text-[#f5e6d0]/45 py-6 text-center">
              Keranjang masih kosong.
              <br />
              Tambahkan menu dari daftar.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto">
                {order.items.map((i) => {
                  const m = menuById(i.menuId);
                  return (
                    <div key={i.menuId} className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-[#f5e6d0]/70 truncate">
                        {m ? m.name : "Menu"} × {i.quantity}
                      </span>
                      <span className="text-[#e8cba4] font-medium shrink-0">
                        {rupiah(i.price * i.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[#d4a56a]/10 pt-3 mb-4 flex items-center justify-between">
                <span className="text-[11px] text-[#f5e6d0]/55">Total</span>
                <span className="font-serif text-lg font-semibold text-grad">
                  {rupiah(order.total_price)}
                </span>
              </div>
              <button
                onClick={() => checkout(order.id)}
                className="w-full text-[11px] font-semibold grad-warm text-[#050403] py-2.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all mb-2"
              >
                Checkout Sekarang
              </button>
              <Link
                to="/pesanan"
                className="block text-center text-[11px] text-[#d4a56a] underline underline-offset-4"
              >
                Lihat riwayat pesanan
              </Link>
            </>
          )}
        </aside>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 text-[12px] bg-[#1c1917] border border-[#d4a56a]/25 text-[#e8cba4] px-4 py-3 rounded-xl shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
