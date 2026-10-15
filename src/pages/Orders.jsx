import { Link } from "react-router-dom";
import { rupiah, useShop } from "../lib/store";

function StatusPill({ status }) {
  const cls =
    status === "pending"
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      : "bg-green-500/10 text-green-400 border-green-500/20";
  return (
    <span className={"text-[9px] font-semibold px-2.5 py-1 rounded-full border " + cls}>
      {status === "pending" ? "Pending" : "Completed"}
    </span>
  );
}

export default function Orders() {
  const { myOrders, menuById, checkout, removeOrder, resetDemo } = useShop();
  const orders = myOrders();

  return (
    <div className="pt-24 md:pt-20 max-w-4xl mx-auto px-5 pb-16 min-h-screen">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#d4a56a] mb-2">
            Riwayat
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#f5e6d0]">
            Pesanan Saya
          </h1>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Kembalikan database ke isi awal db.json?")) resetDemo();
          }}
          className="text-[10px] text-[#f5e6d0]/40 border border-[#d4a56a]/10 px-3 py-1.5 rounded-full hover:border-[#d4a56a]/30 transition-all"
          title="Reset isi database ke db.json awal"
        >
          Reset demo
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">🧾</p>
          <p className="text-sm text-[#f5e6d0]/60 mb-1">Belum ada pesanan</p>
          <p className="text-[11px] text-[#f5e6d0]/40 mb-5">
            Yuk pesan menu favoritmu dari Saraso Koffiehaus.
          </p>
          <Link
            to="/pesan"
            className="inline-block text-[11px] font-semibold grad-warm text-[#050403] px-6 py-2.5 rounded-full"
          >
            Pesan Menu
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#f5e6d0]/50">
                    #{String(o.id).slice(-6)} •{" "}
                    {new Date(o.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <StatusPill status={o.status} />
                </div>
                <span className="font-serif text-base font-semibold text-grad">
                  {rupiah(o.total_price)}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                {o.items.map((i) => {
                  const m = menuById(i.menuId);
                  return (
                    <div
                      key={i.menuId}
                      className="flex items-center justify-between text-[11px]"
                    >
                      <span className="text-[#f5e6d0]/70">
                        {m ? m.name : "Menu"} × {i.quantity}
                      </span>
                      <span className="text-[#f5e6d0]/45">
                        {rupiah(i.price * i.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {o.status === "pending" && (
                  <button
                    onClick={() => checkout(o.id)}
                    className="text-[11px] font-semibold grad-warm text-[#050403] px-4 py-2 rounded-full hover:scale-[1.03] active:scale-[0.97] transition-all"
                  >
                    Checkout
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm("Hapus pesanan ini?")) removeOrder(o.id);
                  }}
                  className="text-[11px] font-medium text-red-400 border border-red-500/20 px-4 py-2 rounded-full hover:bg-red-500/10 transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
