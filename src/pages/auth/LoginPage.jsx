// src/pages/auth/LoginPage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "context/auth/AuthContext";
import getLandingPath from "utils/getLandingPath";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // nếu vừa đăng ký xong (chuyển từ Register về)
  const justRegistered = Boolean(location.state?.justRegistered);

  // state form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // useState và useEffect?
  useEffect(() => {
    if (justRegistered) {
      setInfo("Đăng ký thành công! Vui lòng đăng nhập.");
      // xóa state để F5 không lặp lại
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [justRegistered, navigate, location.pathname]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!username.trim() || !password.trim()) {
      setErr("Vui lòng nhập đủ Username và Mật khẩu");
      return;
    }
    setLoading(true);
    try {
      const u = await login({ username, password }); // login trả về user (nếu chưa, bạn có thể lấy từ context sau)
      const to = getLandingPath(
        u ?? JSON.parse(localStorage.getItem("auth_profile"))
      );
      navigate(to, { replace: true });
    } catch (ex) {
      setErr(ex?.displayMessage || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }
  // Là jsx.
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-extrabold text-center tracking-tight mb-2">
        Đăng Nhập
      </h1>

      {info && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
          {info}
        </div>
      )}

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="block text-slate-600 dark:text-slate-300 font-medium">
            Username
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Nhập username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-slate-600 dark:text-slate-300 font-medium">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Nhập mật khẩu"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 icon-btn"
              onClick={() => setShowPw((v) => !v)}
              aria-label="toggle password"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-slate-700"
            />
            Ghi nhớ đăng nhập
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-sm text-slate-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 text-white py-3 font-semibold hover:opacity-90 active:opacity-80 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          Đăng nhập
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Chưa có tài khoản?{" "}
        <Link className="underline" to="/auth/register">
          Đăng ký
        </Link>
      </p>
    </motion.div>
  );
}
