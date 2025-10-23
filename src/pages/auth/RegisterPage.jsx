import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "services/auth/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "", // FE lưu để hiển thị, KHÔNG gửi BE
    role: "student", // student | parent (đều map -> "user")
    password: "",
    confirmPassword: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ❗ Submit chỉ check các field BE cần
  const disabled =
    loading ||
    !form.username.trim() ||
    !form.email.trim() ||
    form.password.length < 6 ||
    form.password !== form.confirmPassword;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (err) setErr("");
  }

  // Map role UI -> role gửi BE
  function mapRoleForBE(uiRole) {
    // "student" | "parent" => "user"
    if (uiRole === "student" || uiRole === "parent") return "user";
    // có thể mở rộng: "teacher" | "admin"
    return "user";
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setErr("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: [mapRoleForBE(form.role)], // ✅ BE cần Set<String>
      };

      await authService.signup(payload);

      // (tuỳ chọn) Auto-login sau khi đăng ký:
      // await authService.login({ username: form.username.trim(), password: form.password });

      // Điều hướng tới Login (hoặc home nếu auto-login)
      navigate("/auth/login", {
        replace: true,
        state: { justRegistered: true, username: form.username.trim() },
      });
    } catch (ex) {
      const msg =
        ex?.response?.data?.message ||
        ex?.response?.data?.error ||
        ex?.displayMessage ||
        ex?.message ||
        "Đăng ký thất bại";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-extrabold text-center tracking-tight mb-2">
        Đăng Ký
      </h1>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="block text-slate-600 dark:text-slate-300 font-medium">
            Username *
          </label>
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            placeholder="vd: ngocanh123"
            autoComplete="username"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-slate-600 dark:text-slate-300 font-medium">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Phone (tuỳ chọn, không gửi BE) */}
        <div className="space-y-1.5">
          <label className="block text-slate-600 dark:text-slate-300 font-medium">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="vd: 0987654321"
            autoComplete="tel"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <label className="block text-slate-600 dark:text-slate-300 font-medium">
            Vai trò *
          </label>
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="student">Học viên</option>
            <option value="parent">Phụ huynh</option>
            {/* Có thể mở rộng sau:
            <option value="teacher">Giáo viên</option>
            <option value="admin">Quản trị</option> */}
          </select>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-slate-600 dark:text-slate-300 font-medium">
            Mật khẩu *
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-slate-300"
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

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="block text-slate-600 dark:text-slate-300 font-medium">
            Nhập lại mật khẩu *
          </label>
          <div className="relative">
            <input
              type={showPw2 ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 icon-btn"
              onClick={() => setShowPw2((v) => !v)}
              aria-label="toggle confirm password"
            >
              {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <div className="text-xs text-red-600 mt-1">
              Mật khẩu nhập lại không khớp
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-xl bg-slate-900 text-white py-3 font-semibold hover:opacity-90 active:opacity-80 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          Tạo tài khoản
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Đã có tài khoản?{" "}
        <Link className="underline" to="/auth/login">
          Đăng nhập
        </Link>
      </p>
    </motion.div>
  );
}
