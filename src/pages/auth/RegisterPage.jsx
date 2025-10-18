import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "services/auth/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const disabled =
    loading ||
    !form.email.trim() ||
    !form.username.trim() ||
    form.password.length < 6 ||
    form.password !== form.confirmPassword;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (err) setErr("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setErr("Mật khẩu nhập lại không khớp");
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
      });
      navigate("/login", { replace: true, state: { justRegistered: true } });
    } catch (ex) {
      const msg =
        ex?.response?.data?.message ||
        ex?.response?.data?.error ||
        ex?.message ||
        "Đăng ký thất bại";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-padding">
      <div className="container" style={{ maxWidth: 520 }}>
        <h2 className="mb-3">Đăng ký</h2>

        {err && <div className="alert alert-danger py-2">{err}</div>}

        <form onSubmit={onSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Username *</label>
            <input
              name="username"
              className="form-control"
              value={form.username}
              onChange={onChange}
              autoComplete="username"
              placeholder="ví dụ: admin01"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu *</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={onChange}
              autoComplete="new-password"
              placeholder="Tối thiểu 6 ký tự"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Nhập lại mật khẩu *</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={form.confirmPassword}
              onChange={onChange}
              autoComplete="new-password"
              required
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <div className="form-text text-danger">
                Mật khẩu nhập lại không khớp
              </div>
            )}
          </div>

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={disabled}
          >
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>

          <div className="text-center mt-3">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
