import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES, badgeLabel, rupiah, useShop } from "../lib/store";

function MenuCard({ menu, onAdd }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:border-[#d4a56a]/20 hover:shadow-[0_24px_70px_rgba(212,165,106,0.08)] transition-all duration-300 flex flex-col">
      <div className="relative h-40 overflow-hidden bg-[#1c1917]">
        <img
          src={menu.image}
          alt={menu.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/images/icon.jpg";
          }}
          className="w-full h-full object-cover"
        />
        {menu.badge && (
          <span className="absolute top-2 left-2 text-[9px] font-semibold px-2 py-1 rounded-full grad-warm text-[#050403]">
            {badgeLabel(menu.badge)}
          </span>
        )}
        <span className="absolute bottom-2 right-2 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#050403]/70 text-[#e8cba4] backdrop-blur">
          {rupiah(menu.price)}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 grow">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-semibold text-[#f5e6d0]">{menu.name}</h3>
        </div>
        <p className="text-[11px] leading-relaxed text-[#f5e6d0]/45 grow">{menu.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {(menu.tags || []).map((t) => (
            <span
              key={t}
              className="text-[9px] px-2 py-0.5 rounded-full bg-[#d4a56a]/5 text-[#d4a56a]/60"
            >
              {t}
            </span>
          ))}
        </div>
        <button
          onClick={() => onAdd(menu.id)}
          className="mt-1 w-full text-[11px] font-semibold grad-warm text-[#050403] py-2 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          + Tambah ke Pesanan
        </button>
      </div>
    </div>
  );
}

export default function Landing() {
  const { db, user, addToCart } = useShop();
  const navigate = useNavigate();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");

  const menus = useMemo(() => {
    return db.menus.filter((m) => {
      const okCat = cat === "all" || m.category === cat;
      const okQ =
        !q ||
        m.name.toLowerCase().includes(q.toLowerCase()) ||
        (m.description || "").toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [db.menus, cat, q]);

  const handleAdd = (id) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(id, 1);
    const m = db.menus.find((x) => x.id === id);
    setToast(`${m ? m.name : "Menu"} ditambahkan ke pesanan!`);
    setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className="pt-14">
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/icon.jpg"
            alt="Saraso Koffiehaus"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09]/15 via-[#0c0a09]/45 to-[#0c0a09]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2.5 grad-warm-soft border border-[#d4a56a]/10 rounded-full px-5 py-2">
              <span className="w-1.5 h-1.5 bg-[#d4a56a] rounded-full animate-pulse" />
              <span className="text-[10px] font-medium text-[#d4a56a] tracking-[0.25em] uppercase">
                Open Daily until 00:00 WIB
              </span>
            </div>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.15] tracking-[0.02em] text-[#f5e6d0]">
            Saraso
          </h1>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.15] tracking-[0.02em] text-grad mb-8">
            Koffiehaus
          </h1>
          <div className="w-20 h-[2px] grad-warm rounded-full mb-8 mx-auto" />
          <p className="text-[#f5e6d0]/60 text-sm md:text-base font-light leading-[2] max-w-xl mb-8 mx-auto">
            Specialty coffee dari biji pilihan Sumatera, disajikan dalam ruang minimalis yang
            nyaman untuk bekerja, bersantai, dan menikmati momen berharga.
          </p>
          <div className="flex items-center gap-3 justify-center mb-10">
            <span className="text-[#d4a56a] text-sm tracking-widest">★★★★★</span>
            <span className="text-xs tracking-[0.05em] text-[#f5e6d0]/60">
              4.9/5 — 169 ulasan Google
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#menu"
              className="inline-flex items-center justify-center gap-2 grad-warm text-[#050403] font-semibold text-xs px-7 py-3 rounded-full hover:scale-[1.04] active:scale-[0.97] transition-all"
            >
              Explore Menu →
            </a>
            {user ? (
              <Link
                to="/pesan"
                className="inline-flex items-center justify-center gap-2 border border-[#d4a56a]/20 text-[#f5e6d0] font-medium text-xs px-7 py-3 rounded-full hover:bg-[#d4a56a]/10 transition-all"
              >
                Pesan Sekarang
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 border border-[#d4a56a]/20 text-[#f5e6d0] font-medium text-xs px-7 py-3 rounded-full hover:bg-[#d4a56a]/10 transition-all"
              >
                Daftar & Pesan
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="max-w-7xl mx-auto px-5 py-16 scroll-mt-16">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#d4a56a] mb-2">Menu Kami</p>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#f5e6d0] mb-6">
          Pilih favoritmu
        </h2>

        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 grow">
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
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari menu..."
            className="bg-[#141211]/70 border border-[#d4a56a]/10 rounded-full px-4 py-2 text-xs text-[#f5e6d0] placeholder:text-[#f5e6d0]/30 focus:border-[#d4a56a]/35 focus:outline-none w-full md:w-56"
          />
        </div>

        <p className="text-[11px] text-[#f5e6d0]/40 mb-4">
          {menus.length} menu • {db.menus.length} total di database JSON
        </p>

        {menus.length === 0 ? (
          <p className="text-sm text-[#f5e6d0]/50 py-10 text-center">
            Tidak ada menu yang cocok. Coba kata kunci lain.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {menus.map((m) => (
              <MenuCard key={m.id} menu={m} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </section>

      {/* ABOUT + FOOTER */}
      <section className="border-t border-[#d4a56a]/10 mt-4">
        <div className="max-w-7xl mx-auto px-5 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <p className="font-serif text-sm font-semibold text-[#f5e6d0] mb-2">
              Saraso <span className="text-[#d4a56a]">Koffiehaus</span>
            </p>
            <p className="text-[11px] text-[#f5e6d0]/45 leading-relaxed">
              Specialty coffee & comfort space di Padang, Sumatera Barat. Biji pilihan Sumatera,
              diseduh dengan teliti.
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#d4a56a] mb-2">
              Jam Operasional
            </p>
            <p className="text-[11px] text-[#f5e6d0]/45">Setiap hari • 09.00 – 00.00 WIB</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#d4a56a] mb-2">Kontak</p>
            <p className="text-[11px] text-[#f5e6d0]/45">Padang, Sumatera Barat</p>
          </div>
        </div>
        <footer className="border-t border-[#d4a56a]/10 py-6 px-6">
          <p className="text-center text-[10px] text-[#f5e6d0]/30">
            © 2025 Saraso Koffiehaus. Crafted in Padang, Sumatera Barat.
          </p>
        </footer>
      </section>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 text-[12px] bg-[#1c1917] border border-[#d4a56a]/25 text-[#e8cba4] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <span>{toast}</span>
          <Link to="/pesanan" className="font-semibold text-[#d4a56a] underline underline-offset-4">
            Lihat
          </Link>
        </div>
      )}
    </div>
  );
}
