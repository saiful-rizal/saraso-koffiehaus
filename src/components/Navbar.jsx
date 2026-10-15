import { Link, NavLink, useNavigate } from "react-router-dom";
import { useShop } from "../lib/store";

export default function Navbar() {
  const { user, logout, pendingCount } = useShop();
  const navigate = useNavigate();
  const count = pendingCount();

  const linkCls = ({ isActive }) =>
    "text-[12px] transition-colors " +
    (isActive ? "text-[#d4a56a]" : "text-[#f5e6d0]/55 hover:text-[#d4a56a]");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-14 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg grad-warm flex items-center justify-center text-[#050403] text-base">
            ☕
          </div>
          <div className="leading-none">
            <span className="font-serif text-base font-semibold text-[#f5e6d0] tracking-[0.15em]">
              SARASO
            </span>
            <span className="block text-[7px] text-[#d4a56a] tracking-[0.25em] uppercase mt-0.5">
              Koffiehaus
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkCls}>
            Home
          </NavLink>
          <NavLink to="/pesan" className={linkCls}>
            Pesan Menu
          </NavLink>
          <NavLink to="/pesanan" className={linkCls}>
            Pesanan Saya
          </NavLink>
          {user ? (
            <div className="flex items-center gap-2 ml-1">
              <Link
                to="/pesanan"
                className="relative text-[10px] font-medium grad-warm-soft text-[#d4a56a] border border-[#d4a56a]/10 px-3 py-1.5 rounded-full hover:border-[#d4a56a]/25 transition-all"
              >
                🛒 Pesanan
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
              <span className="text-[11px] text-[#f5e6d0]/50 hidden lg:inline">
                {user.name}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-[10px] font-medium text-red-400 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/10 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link
                to="/login"
                className="text-[10px] font-medium text-[#f5e6d0]/70 border border-[#d4a56a]/10 px-3 py-1.5 rounded-full hover:border-[#d4a56a]/30 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-[10px] font-semibold grad-warm text-[#050403] px-3 py-1.5 rounded-full"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link to="/pesanan" className="relative text-[#d4a56a] text-lg px-2">
            🛒
            {count > 0 && (
              <span className="absolute top-0 right-0 min-w-[14px] h-3.5 px-1 rounded-full bg-red-500 text-white text-[7px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-[10px] font-medium text-red-400 border border-red-500/20 px-3 py-1.5 rounded-full"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-semibold grad-warm text-[#050403] px-3 py-1.5 rounded-full"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="absolute top-14 left-0 right-0 glass-nav border-t border-[#d4a56a]/10 md:hidden">
        <div className="flex px-5 py-2 gap-4 overflow-x-auto">
          <NavLink to="/" className={linkCls}>
            Home
          </NavLink>
          <NavLink to="/pesan" className={linkCls}>
            Pesan
          </NavLink>
          <NavLink to="/pesanan" className={linkCls}>
            Pesanan Saya
          </NavLink>
          {!user && (
            <NavLink to="/register" className={linkCls}>
              Register
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
