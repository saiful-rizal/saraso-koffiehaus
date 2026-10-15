import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../lib/store";

export default function Register() {
  const { register } = useShop();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }
    const res = register(name, email, password);
    if (res.error) {
      setError(res.error);
      return;
    }
    navigate("/");
  };

  const inputCls =
    "bg-[#141211]/70 border border-[#d4a56a]/10 rounded-xl px-4 py-2.5 text-xs text-[#f5e6d0] placeholder:text-[#f5e6d0]/30 focus:border-[#d4a56a]/35 focus:outline-none";

  return (
    <div className="pt-14 min-h-screen flex items-center justify-center px-5 relative overflow-hidden">
      <img
        src="/assets/auth-bg.jpg"
        alt=""
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09]/60 to-[#0c0a09]" />
      <form
        onSubmit={submit}
        className="relative glass-card rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 my-10"
      >
        <div className="text-center">
          <p className="font-serif text-xl font-semibold text-[#f5e6d0]">Buat akun</p>
          <p className="text-[11px] text-[#f5e6d0]/45 mt-1">Gabung dengan Saraso Koffiehaus</p>
        </div>
        {error && (
          <p className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] text-[#f5e6d0]/60">Nama</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kamu"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] text-[#f5e6d0]/60">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kamu@email.com"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] text-[#f5e6d0]/60">Password (min. 6)</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] text-[#f5e6d0]/60">Konfirmasi password</span>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className={inputCls}
          />
        </label>
        <button
          type="submit"
          className="grad-warm text-[#050403] font-semibold text-xs py-2.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Register
        </button>
        <p className="text-center text-[11px] text-[#f5e6d0]/45">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-[#d4a56a] font-medium underline underline-offset-4">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
